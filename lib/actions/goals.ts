"use server";

import { requireOwner, requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { books, goals } from "@/lib/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ReadBook = {
  id: number;
  title: string;
  author: string;
  cover: string | null;
  rating: number | null;
  pageCount: number | null;
  dateCompleted: Date | null;
};

// Books on the Read shelf, grouped by the year they were finished.
// Progress is always calculated from here, so it updates automatically
// whenever a book is marked as read (or moved off the Read shelf).
async function getReadBooksByYear() {
  const readBooks: ReadBook[] = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      cover: books.cover,
      rating: books.rating,
      pageCount: books.pageCount,
      dateCompleted: books.dateCompleted,
    })
    .from(books)
    .where(and(eq(books.shelf, "read"), isNotNull(books.dateCompleted)));

  const byYear = new Map<number, ReadBook[]>();
  readBooks.forEach((book) => {
    const year = new Date(book.dateCompleted!).getFullYear();
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(book);
  });
  byYear.forEach((list) =>
    list.sort(
      (a, b) =>
        new Date(b.dateCompleted!).getTime() - new Date(a.dateCompleted!).getTime()
    )
  );
  return byYear;
}

export async function getGoalProgress(year: number = new Date().getFullYear()) {
  await requireViewer();
  try {
    const [goal] = await db
      .select()
      .from(goals)
      .where(eq(goals.year, year))
      .limit(1);
    const byYear = await getReadBooksByYear();
    const booksRead = byYear.get(year)?.length ?? 0;

    return {
      success: true,
      year,
      target: goal?.targetBooks ?? null,
      booksRead,
    };
  } catch (error) {
    console.error("Error fetching goal progress:", error);
    return { success: false, year, target: null, booksRead: 0 };
  }
}

export async function getGoalsOverview() {
  await requireViewer();
  const currentYear = new Date().getFullYear();
  try {
    const allGoals = await db.select().from(goals);
    const byYear = await getReadBooksByYear();

    const goalByYear = new Map(allGoals.map((g) => [g.year, g.targetBooks]));

    // Every year that has either a goal or finished books
    const years = Array.from(
      new Set([currentYear, ...goalByYear.keys(), ...byYear.keys()])
    ).sort((a, b) => b - a);

    const history = years.map((year) => {
      const yearBooks = byYear.get(year) ?? [];
      return {
        year,
        target: goalByYear.get(year) ?? null,
        booksRead: yearBooks.length,
        pagesRead: yearBooks.reduce((sum, b) => sum + (b.pageCount ?? 0), 0),
      };
    });

    return {
      success: true,
      currentYear,
      history,
      currentYearBooks: byYear.get(currentYear) ?? [],
    };
  } catch (error) {
    console.error("Error fetching goals overview:", error);
    return {
      success: false,
      currentYear,
      history: [] as {
        year: number;
        target: number | null;
        booksRead: number;
        pagesRead: number;
      }[],
      currentYearBooks: [] as ReadBook[],
    };
  }
}

export async function setGoal(year: number, targetBooks: number) {
  await requireOwner();
  if (!Number.isInteger(targetBooks) || targetBooks < 1 || targetBooks > 1000) {
    return { success: false, error: "Goal must be between 1 and 1000 books" };
  }
  try {
    const [existing] = await db
      .select()
      .from(goals)
      .where(eq(goals.year, year))
      .limit(1);

    if (existing) {
      await db.update(goals).set({ targetBooks }).where(eq(goals.id, existing.id));
    } else {
      await db.insert(goals).values({ year, targetBooks });
    }

    revalidatePath("/goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error saving goal:", error);
    return { success: false, error: "Failed to save goal" };
  }
}

export async function deleteGoal(year: number) {
  await requireOwner();
  try {
    await db.delete(goals).where(eq(goals.year, year));
    revalidatePath("/goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { success: false, error: "Failed to delete goal" };
  }
}
