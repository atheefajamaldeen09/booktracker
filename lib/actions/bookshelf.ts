"use server";

import { requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

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
