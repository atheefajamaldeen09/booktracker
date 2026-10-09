"use server";

import { revalidatePath } from "next/cache";
import { requireOwner, requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { books, appSettings } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export type ShelfBook = {
  id: number;
  title: string;
  author: string;
  cover: string | null;
  pageCount: number | null;
  shelf: "read" | "reading" | "tbr";
  rating: number | null;
  review: string | null;
  genres: string[] | null;
  publicationYear: number | null;
  currentPage: number | null;
  dateAdded: string | null;
  dateStarted: string | null;
  dateCompleted: string | null;
  shelfOrder: number | null;
  pinned: boolean;
};

// Everything that belongs on the visual shelf: books you've read, are reading,
// or plan to read. New TBR/Read books show up automatically on the next visit.
export async function getShelfBooks(): Promise<ShelfBook[]> {
  await requireViewer();
  try {
    const rows = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        cover: books.cover,
        pageCount: books.pageCount,
        shelf: books.shelf,
        rating: books.rating,
        review: books.review,
        genres: books.genres,
        publicationYear: books.publicationYear,
        currentPage: books.currentPage,
        dateAdded: books.dateAdded,
        dateStarted: books.dateStarted,
        dateCompleted: books.dateCompleted,
        shelfOrder: books.shelfOrder,
        pinned: books.pinned,
      })
      .from(books)
      .where(inArray(books.shelf, ["read", "reading", "tbr"]));

    return rows.map((b) => ({
      ...b,
      shelf: b.shelf as ShelfBook["shelf"],
      dateAdded: b.dateAdded ? b.dateAdded.toISOString() : null,
      dateStarted: b.dateStarted ? b.dateStarted.toISOString() : null,
      dateCompleted: b.dateCompleted ? b.dateCompleted.toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching shelf books:", error);
    return [];
  }
}

// Pinned favourites sit together on the top shelf
export async function setPinned(bookId: number, pinned: boolean) {
  await requireOwner();
  try {
    await db.update(books).set({ pinned }).where(eq(books.id, bookId));
    revalidatePath("/bookshelf");
    return { success: true };
  } catch (error) {
    console.error("Error pinning book:", error);
    return { success: false, error: "Failed to pin the book" };
  }
}

// Saves the order you arranged the shelf in: each book's place in the list
export async function saveShelfOrder(bookIds: number[]) {
  await requireOwner();
  try {
    await Promise.all(
      bookIds.map((id, index) => db.update(books).set({ shelfOrder: index }).where(eq(books.id, id)))
    );
    return { success: true };
  } catch (error) {
    console.error("Error saving shelf order:", error);
    return { success: false, error: "Failed to save the order" };
  }
}

export type ShelfDecorSettings = { hidden: string[]; lights: boolean; ivy: boolean };
const DECOR_KEY = "shelf-decorations";
const DEFAULT_DECOR: ShelfDecorSettings = { hidden: [], lights: true, ivy: true };

// Which ornaments appear on the shelf; everyone visiting sees the same choice
export async function getShelfDecor(): Promise<ShelfDecorSettings> {
  await requireViewer();
  try {
    const [row] = await db.select().from(appSettings).where(eq(appSettings.key, DECOR_KEY)).limit(1);
    return row ? { ...DEFAULT_DECOR, ...JSON.parse(row.value) } : DEFAULT_DECOR;
  } catch (error) {
    console.error("Error reading shelf decorations:", error);
    return DEFAULT_DECOR;
  }
}

export async function saveShelfDecor(settings: ShelfDecorSettings) {
  await requireOwner();
  const value = JSON.stringify({
    hidden: settings.hidden.filter((h) => typeof h === "string").slice(0, 50),
    lights: Boolean(settings.lights),
    ivy: Boolean(settings.ivy),
  });
  try {
    await db
      .insert(appSettings)
      .values({ key: DECOR_KEY, value })
      .onConflictDoUpdate({ target: appSettings.key, set: { value } });
    return { success: true };
  } catch (error) {
    console.error("Error saving shelf decorations:", error);
    return { success: false, error: "Failed to save" };
  }
}
