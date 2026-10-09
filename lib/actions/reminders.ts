"use server";

import { requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { books, series, bookSeries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type SeriesReminder = {
  seriesId: number;
  seriesName: string;
  position: number;
  totalBooks: number | null;
  kind: "start" | "wishlist" | "missing";
  bookId: number | null;
  title: string | null;
  cover: string | null;
};

// For every series you've started, what comes next:
// - "start": the next book is on your TBR, waiting to be started
// - "wishlist": the next book is on your wishlist, still to get
// - "missing": the next book isn't in your library at all yet
// A series you're in the middle of reading, or have finished, has no reminder.
export async function getSeriesReminders(): Promise<SeriesReminder[]> {
  await requireViewer();
  try {
    const rows = await db
      .select({
        seriesId: series.id,
        seriesName: series.name,
        totalBooks: series.totalBooks,
        position: bookSeries.positionInSeries,
        bookId: books.id,
        title: books.title,
        cover: books.cover,
        shelf: books.shelf,
      })
      .from(bookSeries)
      .innerJoin(series, eq(bookSeries.seriesId, series.id))
      .innerJoin(books, eq(bookSeries.bookId, books.id));

    const bySeries = new Map<number, typeof rows>();
    rows.forEach((row) => {
      if (!bySeries.has(row.seriesId)) bySeries.set(row.seriesId, []);
      bySeries.get(row.seriesId)!.push(row);
    });

    const reminders: SeriesReminder[] = [];
    bySeries.forEach((list) => {
      const { seriesId, seriesName, totalBooks } = list[0];
      if (!list.some((b) => b.shelf === "read")) return; // not started yet
      if (list.some((b) => b.shelf === "reading")) return; // already on it

      // The first book in the series you haven't finished (DNF counts as done)
      const done = new Set(list.filter((b) => b.shelf === "read" || b.shelf === "dnf").map((b) => b.position));
      let next = 1;
      while (done.has(next)) next++;
      if (totalBooks && next > totalBooks) return; // finished the series

      const book = list.find((b) => b.position === next);
      reminders.push({
        seriesId,
        seriesName,
        position: next,
        totalBooks,
        kind: !book ? "missing" : book.shelf === "wishlist" ? "wishlist" : "start",
        bookId: book?.bookId ?? null,
        title: book?.title ?? null,
        cover: book?.cover ?? null,
      });
    });

    // Books you could start right now come first
    const order = { start: 0, wishlist: 1, missing: 2 };
    return reminders.sort((a, b) => order[a.kind] - order[b.kind] || a.seriesName.localeCompare(b.seriesName));
  } catch (error) {
    console.error("Error fetching series reminders:", error);
    return [];
  }
}
