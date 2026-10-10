"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireOwner, requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { books, appSettings } from "@/lib/db/schema";
import { NOOKS, PIECES_PER_BOOK, STARTER_PIECES, nookById, type NookId, type NookProgress } from "@/lib/nooks";

const NOOKS_KEY = "book-nooks";
const DAY = 24 * 60 * 60 * 1000;

// What's saved: when you opened your first kit, the one you're building and the finished ones
type Saved = { startedAt: string | null; current: NookId | null; placed: number; done: { id: NookId; finishedOn: string }[] };
const EMPTY: Saved = { startedAt: null, current: null, placed: 0, done: [] };

async function readSaved(): Promise<Saved> {
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, NOOKS_KEY)).limit(1);
  if (!row) return EMPTY;
  try {
    const saved = { ...EMPTY, ...JSON.parse(row.value) } as Saved;
    return {
      ...saved,
      current: saved.current && nookById(saved.current) ? saved.current : null,
      done: (saved.done ?? []).filter((d) => nookById(d.id)),
    };
  } catch {
    return EMPTY;
  }
}

async function writeSaved(saved: Saved) {
  const value = JSON.stringify(saved);
  await db.insert(appSettings).values({ key: NOOKS_KEY, value }).onConflictDoUpdate({ target: appSettings.key, set: { value } });
  revalidatePath("/nook");
  revalidatePath("/bookshelf");
}

// Pieces come from books finished since you opened your first kit. Finish
// dates are stored at midday UTC, so we count from the start of that day.
async function progress(saved: Saved): Promise<NookProgress> {
  let booksCounted = 0;
  if (saved.startedAt) {
    const from = Math.floor(new Date(saved.startedAt).getTime() / DAY) * DAY;
    const read = await db.select({ dateCompleted: books.dateCompleted }).from(books).where(eq(books.shelf, "read"));
    booksCounted = read.filter((b) => b.dateCompleted && b.dateCompleted.getTime() >= from).length;
  }
  const used = saved.placed + saved.done.reduce((sum, d) => sum + (nookById(d.id)?.pieces.length ?? 0), 0);
  return {
    current: saved.current,
    placed: saved.placed,
    done: saved.done,
    booksCounted,
    available: Math.max(0, STARTER_PIECES + booksCounted * PIECES_PER_BOOK - used),
  };
}

export async function getNookProgress(): Promise<NookProgress> {
  await requireViewer();
  try {
    return await progress(await readSaved());
  } catch (error) {
    console.error("Error reading book nooks:", error);
    return { current: null, placed: 0, done: [], booksCounted: 0, available: 0 };
  }
}

// The finished nooks, for standing on the visual bookshelf
export async function getFinishedNooks(): Promise<NookId[]> {
  await requireViewer();
  try {
    return (await readSaved()).done.map((d) => d.id);
  } catch (error) {
    console.error("Error reading finished book nooks:", error);
    return [];
  }
}

// Opens a new kit. Only when your workbench is empty, and never one you've already built.
export async function chooseNook(id: NookId) {
  await requireOwner();
  try {
    const saved = await readSaved();
    if (!NOOKS.some((n) => n.id === id)) return { success: false, error: "That kit doesn't exist" };
    if (saved.current) return { success: false, error: "Finish the nook on your workbench first" };
    if (saved.done.some((d) => d.id === id)) return { success: false, error: "You've already built that one" };
    await writeSaved({ ...saved, startedAt: saved.startedAt ?? new Date().toISOString(), current: id, placed: 0 });
    return { success: true };
  } catch (error) {
    console.error("Error opening a book nook kit:", error);
    return { success: false, error: "Couldn't open that kit" };
  }
}

// Adds the next piece to the nook you're building. The last piece finishes it.
export async function placeNookPiece() {
  await requireOwner();
  try {
    const saved = await readSaved();
    const nook = saved.current ? nookById(saved.current) : null;
    if (!nook) return { success: false, error: "Choose a kit to build first" };
    if ((await progress(saved)).available < 1) return { success: false, error: "No pieces left. Finish a book to earn more" };

    const placed = saved.placed + 1;
    const finished = placed >= nook.pieces.length;
    await writeSaved(
      finished
        ? { ...saved, current: null, placed: 0, done: [...saved.done, { id: nook.id, finishedOn: new Date().toISOString() }] }
        : { ...saved, placed }
    );
    return { success: true, finished };
  } catch (error) {
    console.error("Error placing a book nook piece:", error);
    return { success: false, error: "Couldn't place that piece" };
  }
}
