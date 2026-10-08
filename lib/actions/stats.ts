"use server";

import { requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { books, readingSessions } from "@/lib/db/schema";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SHELVES = [
  { id: "read", label: "Read" },
  { id: "reading", label: "Reading" },
  { id: "tbr", label: "TBR" },
  { id: "wishlist", label: "Wishlist" },
  { id: "dnf", label: "DNF" },
];

const HEATMAP_DAYS = 7 * 15;

// "2026-10-08" — one key per calendar day
const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;

function emptyStats() {
  return {
    totals: { read: 0, pagesRead: 0, avgRating: null as number | null, ratedCount: 0, readThisYear: 0 },
    years: [] as number[],
    booksPerYear: [] as { year: string; books: number }[],
    booksPerMonth: {} as Record<number, { month: string; books: number }[]>,
    genres: [] as { name: string; books: number }[],
    authors: [] as { name: string; books: number; avgRating: number | null }[],
    streak: { current: 0, longest: 0, activeDays: [] as { date: string; pages: number }[] },
    pagesOverTime: [] as { month: string; pages: number }[],
    shelves: SHELVES.map((s) => ({ shelf: s.id, label: s.label, books: 0 })),
  };
}

export type ReadingStats = ReturnType<typeof emptyStats>;

export async function getReadingStats(): Promise<ReadingStats> {
  await requireViewer();
  try {
    const [allBooks, sessions] = await Promise.all([
      db.select().from(books),
      db.select().from(readingSessions),
    ]);

    const stats = emptyStats();
    const now = new Date();
    const currentYear = now.getFullYear();

    const readBooks = allBooks.filter((b) => b.shelf === "read");
    const finished = readBooks.filter((b) => b.dateCompleted);

    // ── Books per shelf ──
    stats.shelves = SHELVES.map((s) => ({
      shelf: s.id,
      label: s.label,
      books: allBooks.filter((b) => b.shelf === s.id).length,
    }));

    // ── Books per year / month ──
    const perYear = new Map<number, number[]>();
    finished.forEach((b) => {
      const d = new Date(b.dateCompleted!);
      const year = d.getFullYear();
      if (!perYear.has(year)) perYear.set(year, new Array(12).fill(0));
      perYear.get(year)![d.getMonth()]++;
    });
    if (!perYear.has(currentYear)) perYear.set(currentYear, new Array(12).fill(0));

    // Fill gaps so a year with nothing read still shows as an empty bar
    const firstYear = Math.min(...perYear.keys());
    for (let y = firstYear; y <= currentYear; y++) {
      if (!perYear.has(y)) perYear.set(y, new Array(12).fill(0));
    }
    stats.years = Array.from(perYear.keys()).sort((a, b) => b - a);
    stats.booksPerYear = [...stats.years].reverse().map((year) => ({
      year: String(year),
      books: perYear.get(year)!.reduce((sum, n) => sum + n, 0),
    }));
    stats.years.forEach((year) => {
      stats.booksPerMonth[year] = perYear.get(year)!.map((books, i) => ({ month: MONTHS[i], books }));
    });

    // ── Ratings ──
    const rated = readBooks.filter((b) => b.rating !== null && b.rating > 0);
    stats.totals.read = readBooks.length;
    stats.totals.readThisYear = perYear.get(currentYear)!.reduce((sum, n) => sum + n, 0);
    stats.totals.ratedCount = rated.length;
    stats.totals.avgRating = rated.length
      ? Math.round((rated.reduce((sum, b) => sum + b.rating!, 0) / rated.length) * 10) / 10
      : null;

    // ── Favourite genres (books you've read) ──
    const genreCounts = new Map<string, number>();
    readBooks.forEach((b) =>
      new Set(b.genres ?? []).forEach((g) => {
        const name = g.trim();
        if (name) genreCounts.set(name, (genreCounts.get(name) ?? 0) + 1);
      })
    );
    stats.genres = Array.from(genreCounts, ([name, books]) => ({ name, books }))
      .sort((a, b) => b.books - a.books || a.name.localeCompare(b.name))
      .slice(0, 8);

    // ── Most read authors ──
    const authorMap = new Map<string, { books: number; ratings: number[] }>();
    readBooks.forEach((b) => {
      const name = b.author.trim();
      if (!name) return;
      const entry = authorMap.get(name) ?? { books: 0, ratings: [] };
      entry.books++;
      if (b.rating) entry.ratings.push(b.rating);
      authorMap.set(name, entry);
    });
    stats.authors = Array.from(authorMap, ([name, a]) => ({
      name,
      books: a.books,
      avgRating: a.ratings.length
        ? Math.round((a.ratings.reduce((s, r) => s + r, 0) / a.ratings.length) * 10) / 10
        : null,
    }))
      .sort((a, b) => b.books - a.books || (b.avgRating ?? 0) - (a.avgRating ?? 0))
      .slice(0, 6);

    // ── Pages read (sessions, plus whatever was left when a book was finished) ──
    const pagesByDay = new Map<string, number>();
    const pagesByMonth = new Map<string, number>();
    const sessionPagesByBook = new Map<number, number>();
    const addPages = (date: Date, pages: number) => {
      pagesByDay.set(dayKey(date), (pagesByDay.get(dayKey(date)) ?? 0) + pages);
      pagesByMonth.set(monthKey(date), (pagesByMonth.get(monthKey(date)) ?? 0) + pages);
    };

    sessions.forEach((s) => {
      if (!s.date) return;
      addPages(new Date(s.date), s.pagesRead);
      if (s.bookId) sessionPagesByBook.set(s.bookId, (sessionPagesByBook.get(s.bookId) ?? 0) + s.pagesRead);
    });
    finished.forEach((b) => {
      const remaining = Math.max(0, (b.pageCount ?? 0) - (sessionPagesByBook.get(b.id) ?? 0));
      addPages(new Date(b.dateCompleted!), remaining);
    });

    stats.totals.pagesRead = Array.from(pagesByMonth.values()).reduce((sum, n) => sum + n, 0);

    // Last 12 months, oldest first
    stats.pagesOverTime = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const label = d.getMonth() === 0 || i === 0 ? `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}` : MONTHS[d.getMonth()];
      return { month: label, pages: pagesByMonth.get(monthKey(d)) ?? 0 };
    });

    // ── Reading streak: consecutive days with any reading logged ──
    const activeDays = new Set(pagesByDay.keys());
    const DAY = 24 * 60 * 60 * 1000;
    const today = new Date(dayKey(now));

    // A streak is still alive if you haven't read *yet* today
    let cursor = activeDays.has(dayKey(today)) ? today : new Date(today.getTime() - DAY);
    let current = 0;
    while (activeDays.has(dayKey(cursor))) {
      current++;
      cursor = new Date(cursor.getTime() - DAY);
    }

    let longest = 0;
    let run = 0;
    let prev: number | null = null;
    Array.from(activeDays)
      .map((k) => new Date(k).getTime())
      .sort((a, b) => a - b)
      .forEach((t) => {
        run = prev !== null && t - prev === DAY ? run + 1 : 1;
        longest = Math.max(longest, run);
        prev = t;
      });

    stats.streak = {
      current,
      longest,
      activeDays: Array.from({ length: HEATMAP_DAYS }, (_, i) => {
        const key = dayKey(new Date(today.getTime() - (HEATMAP_DAYS - 1 - i) * DAY));
        return { date: key, pages: pagesByDay.get(key) ?? 0 };
      }),
    };

    return stats;
  } catch (error) {
    console.error("Error fetching reading stats:", error);
    return emptyStats();
  }
}
