"use server";

import { requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { books, bookSeries, series, quotes, goals, readingSessions } from "@/lib/db/schema";
import { getReadingStats } from "@/lib/actions/stats";
import { ACHIEVEMENTS, type AchievementStatus } from "@/lib/achievements";
import { formatFinish } from "@/lib/finishDate";

type Book = typeof books.$inferSelect;

const DAY = 24 * 60 * 60 * 1000;

// Which stickers you've earned, worked out fresh from your library each time
// (so they also update when you change a finish date or delete a book)
export async function getAchievements(): Promise<AchievementStatus[]> {
  await requireViewer();
  try {
    const [allBooks, links, allSeries, quoteRows, allGoals, sessions, stats] = await Promise.all([
      db.select().from(books),
      db.select().from(bookSeries),
      db.select().from(series),
      db.select({ id: quotes.id }).from(quotes),
      db.select().from(goals),
      db.select({ minutes: readingSessions.minutes, pagesRead: readingSessions.pagesRead, date: readingSessions.date }).from(readingSessions),
      getReadingStats(),
    ]);

    const read = allBooks.filter((b) => b.shelf === "read");
    const onShelf = (shelf: string) => allBooks.filter((b) => b.shelf === shelf).length;
    // Finished books in the order you finished them (undated ones last)
    const byFinish = [...read].sort(
      (a, b) =>
        (a.dateCompleted?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.dateCompleted?.getTime() ?? Number.MAX_SAFE_INTEGER)
    );
    const when = (b: Book | undefined) => (b ? formatFinish(b.dateCompleted, b.dateCompletedPrecision) : null);

    // A count-based sticker
    const count = (id: string, current: number, target: number, extra?: Partial<AchievementStatus>): AchievementStatus => ({
      id,
      earned: current >= target,
      current,
      ...(current >= target ? extra : {}),
    });
    // Earned on the day the nth book was finished
    const nthBook = (id: string, n: number) => count(id, read.length, n, { earnedOn: when(byFinish[n - 1]) });
    // Earned by the first finished book that qualifies
    const firstBook = (id: string, match: (b: Book) => boolean): AchievementStatus => {
      const book = byFinish.find(match);
      return { id, earned: !!book, earnedOn: when(book), note: book ? `for ${book.title}` : null };
    };
    const flag = (id: string, earned: boolean, note?: string | null): AchievementStatus => ({ id, earned, note: earned ? note : null });

    // ── Books per month and per year (only dates you remember well enough) ──
    const perMonth = new Map<string, number>();
    const monthsPerYear = new Map<number, Set<number>>();
    const perYear = new Map<number, number>();
    read.forEach((b) => {
      if (!b.dateCompleted) return;
      const year = b.dateCompleted.getUTCFullYear();
      perYear.set(year, (perYear.get(year) ?? 0) + 1);
      if (b.dateCompletedPrecision === "year") return;
      const month = b.dateCompleted.getUTCMonth();
      perMonth.set(`${year}-${month}`, (perMonth.get(`${year}-${month}`) ?? 0) + 1);
      if (!monthsPerYear.has(year)) monthsPerYear.set(year, new Set());
      monthsPerYear.get(year)!.add(month);
    });
    const bestMonth = Math.max(0, ...perMonth.values());
    const bestYear = Math.max(0, ...perYear.values());
    const mostMonths = Math.max(0, ...[...monthsPerYear.values()].map((m) => m.size));

    // ── Yearly goals ──
    const goalsMet = allGoals.filter((g) => g.targetBooks > 0 && (perYear.get(g.year) ?? 0) >= g.targetBooks).sort((a, b) => a.year - b.year);
    const goalBeaten = goalsMet.find((g) => (perYear.get(g.year) ?? 0) > g.targetBooks);

    // ── Series where you've read as many books as it has ──
    const readIds = new Set(read.map((b) => b.id));
    const finishedSeries = allSeries.filter((s) => {
      if (!s.totalBooks) return false;
      const positions = new Set(
        links.filter((l) => l.seriesId === s.id && l.bookId !== null && readIds.has(l.bookId)).map((l) => l.positionInSeries)
      );
      return positions.size >= s.totalBooks;
    });

    // ── Most books by one author ──
    const byAuthor = new Map<string, number>();
    read.forEach((b) => {
      const name = b.author.trim();
      if (name) byAuthor.set(name, (byAuthor.get(name) ?? 0) + 1);
    });
    const [topAuthor, topAuthorCount] = [...byAuthor].reduce<[string, number]>((a, b) => (b[1] > a[1] ? b : a), ["", 0]);

    // ── Biggest reading day (logged sessions) ──
    const pagesByDay = new Map<string, number>();
    sessions.forEach((s) => {
      if (!s.date) return;
      const key = s.date.toISOString().slice(0, 10);
      pagesByDay.set(key, (pagesByDay.get(key) ?? 0) + s.pagesRead);
    });
    const bestDay = Math.max(0, ...pagesByDay.values());

    // ── Most books on the go at once: overlap of start → finish dates ──
    const now = Date.now();
    const events: [number, number][] = [];
    allBooks.forEach((b) => {
      if (!b.dateStarted) return;
      const start = b.dateStarted.getTime();
      let end: number | null = null;
      if (b.shelf === "reading") end = now;
      else if (b.shelf === "read" && b.dateCompleted && b.dateCompletedPrecision !== "year" && b.dateCompletedPrecision !== "month")
        end = b.dateCompleted.getTime();
      if (end === null || end < start) return;
      events.push([start, 1], [end + DAY, -1]);
    });
    events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let open = 0;
    let mostAtOnce = onShelf("reading");
    events.forEach(([, change]) => {
      open += change;
      mostAtOnce = Math.max(mostAtOnce, open);
    });

    const genres = new Set(read.flatMap((b) => (b.genres ?? []).map((g) => g.trim().toLowerCase()).filter(Boolean)));
    const minutes = sessions.reduce((sum, s) => sum + (s.minutes ?? 0), 0);
    const reviews = read.filter((b) => b.review && b.review.trim()).length;
    const favourites = allBooks.filter((b) => b.favorite).length;
    const withMoods = allBooks.filter((b) => (b.moods ?? []).length > 0).length;
    const owned = allBooks.filter((b) => b.shelf !== "wishlist").length;
    const pages = stats.totals.pagesRead;
    const streak = stats.streak.longest;

    const list: AchievementStatus[] = [
      nthBook("shelf-starter", 25),
      nthBook("bookworm", 50),
      nthBook("book-stack", 100),
      nthBook("bibliophile", 200),
      nthBook("library-legend", 300),
      nthBook("book-dragon", 500),
      nthBook("book-wizard", 750),
      nthBook("castle-of-tales", 1000),

      count("cosy-week", streak, 7),
      count("moonlit-month", streak, 30),
      count("hundred-days", streak, 100),
      count("book-binge", bestMonth, 8),
      count("twelve-moons", mostMonths, 12),
      count("book-a-week", bestYear, 52),
      flag("goal-getter", goalsMet.length > 0, goalsMet[0] ? `in ${goalsMet[0].year}` : null),
      flag("goal-crusher", !!goalBeaten, goalBeaten ? `in ${goalBeaten.year}` : null),

      count("page-turner", pages, 10000),
      count("paper-mountain", pages, 50000),
      count("ink-ocean", pages, 100000),
      count("sunrise-sunset", bestDay, 150),
      count("tea-time", minutes, 1500),
      count("lost-in-time", minutes, 6000),
      firstBook("doorstopper", (b) => (b.pageCount ?? 0) >= 600),
      firstBook("bite-sized", (b) => (b.pageCount ?? 0) > 0 && b.pageCount! < 150),

      firstBook("heart-eyes", (b) => (b.rating ?? 0) >= 5),
      firstBook("rainy-review", (b) => (b.rating ?? 0) > 0 && b.rating! <= 2),
      count("little-critic", reviews, 25),
      count("essayist", reviews, 100),
      count("quote-keeper", quoteRows.length, 25),
      count("quote-collector", quoteRows.length, 100),
      count("sweetheart", favourites, 10),
      count("mood-ring", withMoods, 25),

      count("genre-hopper", genres.size, 10),
      count("globetrotter", genres.size, 25),
      flag("series-slayer", finishedSeries.length > 0, finishedSeries[0] ? `for ${finishedSeries[0].name}` : null),
      count("series-collector", finishedSeries.length, 5),
      count("author-fan", topAuthorCount, 10, { note: `for ${topAuthor}` }),
      firstBook("time-traveller", (b) => !!b.publicationYear && b.publicationYear < 1900),
      firstBook(
        "fresh-ink",
        (b) => !!b.publicationYear && !!b.dateCompleted && b.dateCompleted.getUTCFullYear() === b.publicationYear
      ),
      flag("letting-go", onShelf("dnf") > 0),

      count("juggler", mostAtOnce, 3),
      count("wishful-thinking", onShelf("wishlist"), 25),
      count("tbr-mountain", onShelf("tbr"), 100),
      count("curator", owned, 300),
    ];

    const byId = new Map(list.map((s) => [s.id, s]));
    return ACHIEVEMENTS.map((a) => byId.get(a.id) ?? { id: a.id, earned: false });
  } catch (error) {
    console.error("Error working out achievements:", error);
    return ACHIEVEMENTS.map((a) => ({ id: a.id, earned: false }));
  }
}
