"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireOwner, requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { books, bookSeries, quotes, appSettings } from "@/lib/db/schema";
import { dealSquares, FREE, SQUARES, type BingoBook, type BingoCard } from "@/lib/bingo";

const CARD_KEY = "bingo-card";
const DAY = 24 * 60 * 60 * 1000;

async function readCard(): Promise<BingoCard | null> {
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, CARD_KEY)).limit(1);
  if (!row) return null;
  try {
    const card = JSON.parse(row.value) as BingoCard;
    return Array.isArray(card.squares) && card.squares.length === SQUARES ? { ...card, stamps: card.stamps ?? {} } : null;
  } catch {
    return null;
  }
}

async function writeCard(card: BingoCard) {
  const value = JSON.stringify(card);
  await db.insert(appSettings).values({ key: CARD_KEY, value }).onConflictDoUpdate({ target: appSettings.key, set: { value } });
  revalidatePath("/bingo");
}

// Finish dates are stored at midday UTC, so a book finished on the day the
// card was dealt counts when we compare from the start of that day
const startOfDay = (iso: string) => Math.floor(new Date(iso).getTime() / DAY) * DAY;

// Books finished since the card was dealt, with what the prompts look at
async function booksSince(startedAt: string): Promise<BingoBook[]> {
  const [allBooks, links, quoteRows] = await Promise.all([
    db.select().from(books),
    db.select().from(bookSeries),
    db.select({ bookId: quotes.bookId }).from(quotes),
  ]);
  const from = startOfDay(startedAt);
  const read = allBooks.filter((b) => b.shelf === "read");
  const position = new Map(links.map((l) => [l.bookId, l.positionInSeries]));
  const quoted = new Set(quoteRows.map((q) => q.bookId));
  const days = (a: Date | null, b: Date | null) => (a && b && b >= a ? Math.round((b.getTime() - a.getTime()) / DAY) : null);

  return read
    .filter((b) => b.dateCompleted && b.dateCompleted.getTime() >= from)
    .sort((a, b) => b.dateCompleted!.getTime() - a.dateCompleted!.getTime())
    .map((b) => {
      const author = b.author.trim().toLowerCase();
      return {
        id: b.id,
        title: b.title,
        author: b.author,
        cover: b.cover,
        genres: b.genres ?? [],
        moods: b.moods ?? [],
        pageCount: b.pageCount,
        publicationYear: b.publicationYear,
        rating: b.rating,
        favorite: b.favorite,
        hasReview: !!b.review?.trim(),
        hasQuote: quoted.has(b.id),
        seriesPosition: position.get(b.id) ?? null,
        daysToRead: days(b.dateStarted, b.dateCompleted),
        daysWaited: days(b.dateAdded, b.dateCompleted),
        authorReadBefore: read.some(
          (o) =>
            o.id !== b.id &&
            o.author.trim().toLowerCase() === author &&
            (!o.dateCompleted || o.dateCompleted.getTime() < b.dateCompleted!.getTime())
        ),
        finishedYear: b.dateCompleted!.getUTCFullYear(),
        finishedOn: b.dateCompleted!.toISOString(),
      };
    });
}

// Your current card and the books you can stamp it with
export async function getBingo(): Promise<{ card: BingoCard | null; books: BingoBook[] }> {
  await requireViewer();
  try {
    const card = await readCard();
    if (!card) return { card: null, books: [] };
    const eligible = await booksSince(card.startedAt);
    // Forget stamps whose book has since been deleted or un-finished
    const ids = new Set(eligible.map((b) => b.id));
    const stamps = Object.fromEntries(Object.entries(card.stamps).filter(([, bookId]) => ids.has(bookId)));
    return { card: { ...card, stamps }, books: eligible };
  } catch (error) {
    console.error("Error reading the bingo card:", error);
    return { card: null, books: [] };
  }
}

// Deals a fresh card. A few squares may carry over from the last one, never most of them.
export async function dealBingoCard() {
  await requireOwner();
  try {
    const old = await readCard();
    await writeCard({
      round: (old?.round ?? 0) + 1,
      startedAt: new Date().toISOString(),
      squares: dealSquares(old?.squares),
      stamps: {},
    });
    return { success: true };
  } catch (error) {
    console.error("Error dealing a bingo card:", error);
    return { success: false, error: "Couldn't deal a new card" };
  }
}

// Stamps a square with a book, or clears it when bookId is null
export async function stampBingoSquare(promptId: string, bookId: number | null) {
  await requireOwner();
  try {
    const card = await readCard();
    if (!card || promptId === FREE || !card.squares.includes(promptId)) {
      return { success: false, error: "That square isn't on your card" };
    }
    const stamps = { ...card.stamps };
    if (bookId === null) {
      delete stamps[promptId];
    } else {
      const eligible = await booksSince(card.startedAt);
      if (!eligible.some((b) => b.id === bookId)) {
        return { success: false, error: "That book wasn't finished after this card was dealt" };
      }
      // A book stamps one square: using it here lifts it off any other
      for (const [other, id] of Object.entries(stamps)) if (id === bookId) delete stamps[other];
      stamps[promptId] = bookId;
    }
    await writeCard({ ...card, stamps });
    return { success: true };
  } catch (error) {
    console.error("Error stamping the bingo card:", error);
    return { success: false, error: "Couldn't save that stamp" };
  }
}
