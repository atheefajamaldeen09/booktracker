"use server";

import { db } from "@/lib/db";
import { books, series, bookSeries, tags, bookTags, readingSessions, goals } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

type AddBookInput = {
  title: string;
  author: string;
  cover?: string | null;
  genres?: string[];
  pageCount?: number | null;
  publicationYear?: number | null;
  isbn?: string | null;
  description?: string | null;
  shelf: "tbr" | "wishlist" | "reading" | "read" | "dnf";
  isSeries?: boolean;
  seriesName?: string | null;
  seriesPosition?: number | null;
  seriesTotalBooks?: number | null;
};

export async function addBook(input: AddBookInput) {
  try {
    const [newBook] = await db
      .insert(books)
      .values({
        title: input.title,
        author: input.author,
        cover: input.cover ?? null,
        genres: Array.from(new Set(input.genres ?? [])),
        pageCount: input.pageCount ?? null,
        publicationYear: input.publicationYear ?? null,
        isbn: input.isbn ?? null,
        shelf: input.shelf,
        dateCompleted: input.shelf === "read" ? new Date() : null,
      })
      .returning();

    if (input.seriesName && input.seriesPosition && newBook) {
      const existingSeries = await db
        .select()
        .from(series)
        .where(eq(series.name, input.seriesName))
        .limit(1);

      let seriesId: number;

      if (existingSeries.length > 0) {
        seriesId = existingSeries[0].id;
        
        // Update total books if provided and series doesn't have it yet
        if (input.seriesTotalBooks && !existingSeries[0].totalBooks) {
          await db
            .update(series)
            .set({ totalBooks: input.seriesTotalBooks })
            .where(eq(series.id, seriesId));
        }
      } else {
        const [newSeries] = await db
          .insert(series)
          .values({ 
            name: input.seriesName,
            totalBooks: input.seriesTotalBooks || null
          })
          .returning();
        seriesId = newSeries.id;
      }

      await db.insert(bookSeries).values({
        bookId: newBook.id,
        seriesId,
        positionInSeries: input.seriesPosition,
      });
    }

    return { success: true, book: newBook };
  } catch (error) {
    console.error("Error adding book:", error);
    return { success: false, error: "Failed to add book" };
  }
}

export async function getAllBooks() {
  try {
    const allBooks = await db.select().from(books);
    return { success: true, books: allBooks };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { success: false, books: [] };
  }
}

export async function getBooksByShelf(shelf: string) {
  try {
    const shelfBooks = await db
      .select()
      .from(books)
      .where(eq(books.shelf, shelf));
    return { success: true, books: shelfBooks };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { success: false, books: [] };
  }
}

export async function moveBookToShelf(
  bookId: number,
  newShelf: "tbr" | "reading" | "read" | "wishlist" | "dnf"
) {
  try {
    await db
      .update(books)
      .set({
        shelf: newShelf,
        dateCompleted: newShelf === "read" ? new Date() : undefined,
        dateStarted: newShelf === "reading" ? new Date() : undefined,
        currentPage: newShelf === "reading" ? 0 : undefined,
      })
      .where(eq(books.id, bookId));
    return { success: true };
  } catch (error) {
    console.error("Error moving book:", error);
    return { success: false, error: "Failed to move book" };
  }
}

export async function deleteBook(bookId: number) {
  try {
    await db.delete(books).where(eq(books.id, bookId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { success: false, error: "Failed to delete book" };
  }
}

export async function getBookById(id: number) {
  try {
    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);
    return { success: true, book: book || null };
  } catch (error) {
    console.error("Error fetching book:", error);
    return { success: false, book: null };
  }
}

export async function updateBook(
  bookId: number,
  input: {
    title?: string;
    author?: string;
    cover?: string | null;
    genres?: string[];
    pageCount?: number | null;
    publicationYear?: number | null;
    isbn?: string | null;
  }
) {
  try {
    await db
      .update(books)
      .set({
        title: input.title,
        author: input.author,
        cover: input.cover,
        genres: input.genres && Array.from(new Set(input.genres)),
        pageCount: input.pageCount,
        publicationYear: input.publicationYear,
        isbn: input.isbn,
      })
      .where(eq(books.id, bookId));
    return { success: true };
  } catch (error) {
    console.error("Error updating book:", error);
    return { success: false, error: "Failed to update book" };
  }
}

export async function getSeriesForBook(bookId: number) {
  try {
    const result = await db
      .select({
        seriesName: series.name,
        position: bookSeries.positionInSeries,
        seriesId: series.id,
      })
      .from(bookSeries)
      .innerJoin(series, eq(bookSeries.seriesId, series.id))
      .where(eq(bookSeries.bookId, bookId))
      .limit(1);

    return { success: true, series: result[0] || null };
  } catch (error) {
    console.error("Error fetching series:", error);
    return { success: false, series: null };
  }
}

export async function getAllTags() {
  try {
    const allTags = await db.select().from(tags);
    return { success: true, tags: allTags };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { success: false, tags: [] };
  }
}

export async function createTag(name: string, color: string) {
  try {
    const [newTag] = await db
      .insert(tags)
      .values({ name, color })
      .returning();
    return { success: true, tag: newTag };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

export async function deleteTag(tagId: number) {
  try {
    await db.delete(tags).where(eq(tags.id, tagId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}

export async function getTagsForBook(bookId: number) {
  try {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
      })
      .from(bookTags)
      .innerJoin(tags, eq(bookTags.tagId, tags.id))
      .where(eq(bookTags.bookId, bookId));
    return { success: true, tags: result };
  } catch (error) {
    console.error("Error fetching tags for book:", error);
    return { success: false, tags: [] };
  }
}

export async function addTagToBook(bookId: number, tagId: number) {
  try {
    // Check if already exists to avoid duplicates
    const existing = await db
      .select()
      .from(bookTags)
      .where(and(eq(bookTags.bookId, bookId), eq(bookTags.tagId, tagId)))
      .limit(1);

    if (existing.length > 0) {
      return { success: true }; // Already assigned
    }

    await db.insert(bookTags).values({ bookId, tagId });
    console.log(`Tag ${tagId} added to book ${bookId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding tag to book:", error);
    return { success: false, error: "Failed to add tag" };
  }
}

export async function removeTagFromBook(bookId: number, tagId: number) {
  try {
    await db
      .delete(bookTags)
      .where(and(eq(bookTags.bookId, bookId), eq(bookTags.tagId, tagId)));
    return { success: true };
  } catch (error) {
    console.error("Error removing tag from book:", error);
    return { success: false, error: "Failed to remove tag" };
  }
}

export async function getAllBooksWithTags() {
  try {
    // Get all books first
    const allBooks = await db.select().from(books);

    // Get all book-tag relationships in one query
    const allBookTags = await db
      .select({
        bookId: bookTags.bookId,
        tagId: tags.id,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(bookTags)
      .innerJoin(tags, eq(bookTags.tagId, tags.id));

    // Get all book-series relationships in one query
    const allBookSeries = await db
      .select({
        bookId: bookSeries.bookId,
        seriesId: series.id,
        seriesName: series.name,
        positionInSeries: bookSeries.positionInSeries,
      })
      .from(bookSeries)
      .innerJoin(series, eq(bookSeries.seriesId, series.id));

    // Group tags by bookId
    const tagsByBookId = new Map<number, { id: number; name: string | null; color: string | null }[]>();

    allBookTags.forEach((row) => {
      if (!row.bookId) return;
      if (!tagsByBookId.has(row.bookId)) {
        tagsByBookId.set(row.bookId, []);
      }
      tagsByBookId.get(row.bookId)!.push({
        id: row.tagId,
        name: row.tagName,
        color: row.tagColor,
      });
    });

    // Group series by bookId
    const seriesByBookId = new Map<
      number,
      { id: number; name: string; position: number }
    >();

    allBookSeries.forEach((row) => {
      if (!row.bookId || !row.seriesId) return;
      seriesByBookId.set(row.bookId, {
        id: row.seriesId,
        name: row.seriesName,
        position: row.positionInSeries,
      });
    });

    // Attach tags and series to each book
    const booksWithTagsAndSeries = allBooks.map((book) => ({
      ...book,
      bookTags: tagsByBookId.get(book.id) || [],
      bookSeries: seriesByBookId.get(book.id) || null,
    }));

    return { success: true, books: booksWithTagsAndSeries };
  } catch (error) {
    console.error("Error fetching books with tags:", error);
    return { success: false, books: [] };
  }
}

export async function startReading(bookId: number) {
  try {
    await db
      .update(books)
      .set({
        shelf: "reading",
        dateStarted: new Date(),
        currentPage: 0,
      })
      .where(eq(books.id, bookId));
    return { success: true };
  } catch (error) {
    console.error("Error starting book:", error);
    return { success: false, error: "Failed to start reading" };
  }
}

export async function updateReadingProgress(
  bookId: number,
  currentPage: number,
  previousPage: number
) {
  try {
    const pagesRead = Math.max(0, currentPage - previousPage);

    // Update the book's current page
    await db
      .update(books)
      .set({ currentPage })
      .where(eq(books.id, bookId));

    // Log the reading session
    await db.insert(readingSessions).values({
      bookId,
      pagesRead,
      currentPageAfter: currentPage,
      date: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating progress:", error);
    return { success: false, error: "Failed to update progress" };
  }
}

export async function completeBook(
  bookId: number,
  pageCount: number | null
) {
  try {
    await db
      .update(books)
      .set({
        shelf: "read",
        dateCompleted: new Date(),
        currentPage: pageCount || 0,
      })
      .where(eq(books.id, bookId));

    // Did finishing this book hit this year's reading goal exactly?
    const year = new Date().getFullYear();
    const [goal] = await db.select().from(goals).where(eq(goals.year, year)).limit(1);
    let goalReached = false;
    if (goal) {
      const readBooks = await db
        .select({ dateCompleted: books.dateCompleted })
        .from(books)
        .where(eq(books.shelf, "read"));
      const readThisYear = readBooks.filter(
        (b) => b.dateCompleted && new Date(b.dateCompleted).getFullYear() === year
      ).length;
      goalReached = readThisYear === goal.targetBooks;
    }

    return { success: true, goalReached };
  } catch (error) {
    console.error("Error completing book:", error);
    return { success: false, error: "Failed to complete book" };
  }
}

export async function markDNF(
  bookId: number,
  currentPage: number,
  reason?: string
) {
  try {
    await db
      .update(books)
      .set({
        shelf: "dnf",
        dnfPage: currentPage,
        dnfReason: reason || null,
      })
      .where(eq(books.id, bookId));
    return { success: true };
  } catch (error) {
    console.error("Error marking DNF:", error);
    return { success: false, error: "Failed to mark as DNF" };
  }
}

export async function getReadingSessions(bookId: number) {
  try {
    const sessions = await db
      .select()
      .from(readingSessions)
      .where(eq(readingSessions.bookId, bookId))
      .orderBy(readingSessions.date);
    return { success: true, sessions };
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return { success: false, sessions: [] };
  }
}

export async function getCurrentlyReading() {
  try {
    const currentBooks = await db
      .select()
      .from(books)
      .where(eq(books.shelf, "reading"));
    return { success: true, books: currentBooks };
  } catch (error) {
    console.error("Error fetching currently reading:", error);
    return { success: false, books: [] };
  }
}

export async function getAllSeries() {
  try {
    const allSeries = await db.select().from(series);
    return { success: true, series: allSeries };
  } catch (error) {
    console.error("Error fetching series:", error);
    return { success: false, series: [] };
  }
}

export async function updateRating(bookId: number, rating: number) {
  try {
    await db
      .update(books)
      .set({ rating: rating > 0 ? rating : null })
      .where(eq(books.id, bookId));
    return { success: true };
  } catch (error) {
    console.error("Error updating rating:", error);
    return { success: false, error: "Failed to update rating" };
  }
}

export async function updateReview(bookId: number, review: string) {
  try {
    await db
      .update(books)
      .set({ review: review.trim() || null })
      .where(eq(books.id, bookId));
    return { success: true };
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false, error: "Failed to update review" };
  }
}

export async function updateSeriesTotalBooks(seriesId: number, totalBooks: number) {
  try {
    await db
      .update(series)
      .set({ totalBooks })
      .where(eq(series.id, seriesId));
    return { success: true };
  } catch (error) {
    console.error("Error updating series total books:", error);
    return { success: false, error: "Failed to update series" };
  }
}

export async function getSeriesById(seriesId: number) {
  try {
    const [seriesData] = await db
      .select()
      .from(series)
      .where(eq(series.id, seriesId))
      .limit(1);

    if (!seriesData) {
      return { success: false, series: null, books: [] };
    }

    // Get all books in this series
    const booksInSeries = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        cover: books.cover,
        shelf: books.shelf,
        rating: books.rating,
        position: bookSeries.positionInSeries,
      })
      .from(bookSeries)
      .innerJoin(books, eq(bookSeries.bookId, books.id))
      .where(eq(bookSeries.seriesId, seriesId))
      .orderBy(bookSeries.positionInSeries);

    return { success: true, series: seriesData, books: booksInSeries };
  } catch (error) {
    console.error("Error fetching series:", error);
    return { success: false, series: null, books: [] };
  }
}

export async function getAllSeriesWithStats() {
  try {
    const allSeries = await db.select().from(series);

    const seriesWithStats = await Promise.all(
      allSeries.map(async (s) => {
        const booksInSeries = await db
          .select({
            id: books.id,
            shelf: books.shelf,
          })
          .from(bookSeries)
          .innerJoin(books, eq(bookSeries.bookId, books.id))
          .where(eq(bookSeries.seriesId, s.id));

        // Only count books you actually own (not wishlist)
        const ownedBooks = booksInSeries.filter((b) => b.shelf !== "wishlist");
        const totalOwned = ownedBooks.length;
        const totalRead = ownedBooks.filter((b) => b.shelf === "read").length;

        return {
          ...s,
          totalOwned,
          totalRead,
        };
      })
    );

    return { success: true, series: seriesWithStats };
  } catch (error) {
    console.error("Error fetching series with stats:", error);
    return { success: false, series: [] };
  }
}

export async function getDashboardStats() {
  try {
    const allBooks = await db.select().from(books);

    const currentYear = new Date().getFullYear();

    const stats = {
      totalRead: allBooks.filter((b) => b.shelf === "read").length,
      readThisYear: allBooks.filter(
        (b) =>
          b.shelf === "read" &&
          b.dateCompleted &&
          new Date(b.dateCompleted).getFullYear() === currentYear
      ).length,
      currentlyReading: allBooks.filter((b) => b.shelf === "reading").length,
      tbr: allBooks.filter((b) => b.shelf === "tbr").length,
      wishlist: allBooks.filter((b) => b.shelf === "wishlist").length,
      dnf: allBooks.filter((b) => b.shelf === "dnf").length,
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      stats: {
        totalRead: 0,
        readThisYear: 0,
        currentlyReading: 0,
        tbr: 0,
        wishlist: 0,
        dnf: 0,
      },
    };
  }
}

export async function getRecentlyAdded(limit: number = 5) {
  try {
    const recentBooks = await db
      .select()
      .from(books)
      .orderBy(desc(books.dateAdded))
      .limit(limit);

    return { success: true, books: recentBooks };
  } catch (error) {
    console.error("Error fetching recently added:", error);
    return { success: false, books: [] };
  }
}

export async function getRecentlyCompleted(limit: number = 5) {
  try {
    const recentCompleted = await db
      .select()
      .from(books)
      .where(eq(books.shelf, "read"))
      .orderBy(desc(books.dateCompleted))
      .limit(limit);

    return { success: true, books: recentCompleted };
  } catch (error) {
    console.error("Error fetching recently completed:", error);
    return { success: false, books: [] };
  }
}

export async function getEligibleTBRBooks(filters?: {
  genres?: string[];
  seriesId?: number;
  minPages?: number;
  maxPages?: number;
  onlyStandalone?: boolean;
}) {
  try {
    const tbrBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        cover: books.cover,
        genres: books.genres,
        pageCount: books.pageCount,
        shelf: books.shelf,
      })
      .from(books)
      .where(eq(books.shelf, "tbr"));

    // Every book that belongs to a series, with its shelf — one query
    const seriesRows = await db
      .select({
        bookId: bookSeries.bookId,
        seriesId: series.id,
        seriesName: series.name,
        position: bookSeries.positionInSeries,
        shelf: books.shelf,
      })
      .from(bookSeries)
      .innerJoin(series, eq(bookSeries.seriesId, series.id))
      .innerJoin(books, eq(bookSeries.bookId, books.id));

    // For each series, the next book in line is the lowest-numbered one you
    // haven't finished (read or DNF). It's only pickable if it's on your TBR —
    // if it's being read already or still on the wishlist, the rest wait.
    const nextInLine = new Map<number, number>(); // seriesId -> bookId
    const bySeries = new Map<number, typeof seriesRows>();
    seriesRows.forEach((row) => {
      if (!bySeries.has(row.seriesId)) bySeries.set(row.seriesId, []);
      bySeries.get(row.seriesId)!.push(row);
    });
    bySeries.forEach((rows, seriesId) => {
      const next = rows
        .filter((r) => r.shelf !== "read" && r.shelf !== "dnf")
        .sort((a, b) => a.position - b.position)[0];
      if (next?.bookId && next.shelf === "tbr") nextInLine.set(seriesId, next.bookId);
    });

    const seriesByBook = new Map(
      seriesRows
        .filter((r) => r.bookId)
        .map((r) => [
          r.bookId!,
          { seriesId: r.seriesId, seriesName: r.seriesName, position: r.position },
        ])
    );

    let filtered = tbrBooks
      .map((book) => ({ ...book, series: seriesByBook.get(book.id) || null }))
      .filter((book) => !book.series || nextInLine.get(book.series.seriesId) === book.id);

    if (filters?.genres && filters.genres.length > 0) {
      filtered = filtered.filter((book) =>
        book.genres?.some((g) => filters.genres?.includes(g))
      );
    }

    if (filters?.seriesId) {
      filtered = filtered.filter(
        (book) => book.series?.seriesId === filters.seriesId
      );
    }

    if (filters?.minPages) {
      filtered = filtered.filter(
        (book) => book.pageCount && book.pageCount >= filters.minPages!
      );
    }

    if (filters?.maxPages) {
      filtered = filtered.filter(
        (book) => book.pageCount && book.pageCount <= filters.maxPages!
      );
    }

    if (filters?.onlyStandalone) {
      filtered = filtered.filter((book) => !book.series);
    }

    return { success: true, books: filtered };
  } catch (error) {
    console.error("Error fetching eligible TBR books:", error);
    return { success: false, books: [] };
  }
}

export async function getAllSeriesInTBR() {
  try {
    const tbrBooks = await db
      .select({ id: books.id })
      .from(books)
      .where(eq(books.shelf, "tbr"));

    if (tbrBooks.length === 0) {
      return { success: true, series: [] };
    }

    // Get all series that have books in TBR
    const seriesInTBR = await db
      .select({
        seriesId: series.id,
        seriesName: series.name,
      })
      .from(bookSeries)
      .innerJoin(series, eq(bookSeries.seriesId, series.id))
      .innerJoin(books, eq(bookSeries.bookId, books.id))
      .where(eq(books.shelf, "tbr"));

    // Get unique series
    const uniqueSeries = Array.from(
      new Map(seriesInTBR.map((s) => [s.seriesId, s])).values()
    );

    return { success: true, series: uniqueSeries };
  } catch (error) {
    console.error("Error fetching series in TBR:", error);
    return { success: false, series: [] };
  }
}