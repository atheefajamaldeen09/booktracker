"use server";

import { db } from "@/lib/db";
import { books, series, bookSeries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type AddBookInput = {
  title: string;
  author: string;
  cover?: string | null;
  genres?: string[];
  pageCount?: number | null;
  publicationYear?: number | null;
  isbn?: string | null;
  shelf: "tbr" | "wishlist" | "read";
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