"use server";

import { db } from "@/lib/db";
import { books, series, bookSeries, tags, bookTags, readingSessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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
};

export async function addBook(input: AddBookInput) {
  try {
    const [newBook] = await db
      .insert(books)
      .values({
        title: input.title,
        author: input.author,
        cover: input.cover ?? null,
        genres: input.genres ?? [],
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
      } else {
        const [newSeries] = await db
          .insert(series)
          .values({ name: input.seriesName })
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
        genres: input.genres,
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
    return { success: true };
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