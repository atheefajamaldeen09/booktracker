"use server";

import { revalidatePath } from "next/cache";
import { requireOwner, requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { quotes } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getQuotes(bookId: number) {
  await requireViewer();
  try {
    const rows = await db
      .select()
      .from(quotes)
      .where(eq(quotes.bookId, bookId))
      .orderBy(asc(quotes.page), asc(quotes.createdAt));
    return { success: true, quotes: rows };
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return { success: false, quotes: [] };
  }
}

export async function addQuote(bookId: number, input: { text: string; page: number | null; note: string | null }) {
  await requireOwner();
  const text = input.text.trim();
  if (!text) return { success: false, error: "Write the quote first" };
  try {
    await db.insert(quotes).values({
      bookId,
      text,
      page: input.page && input.page > 0 ? input.page : null,
      note: input.note?.trim() || null,
    });
    revalidatePath(`/book/${bookId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding quote:", error);
    return { success: false, error: "Failed to save the quote" };
  }
}

export async function deleteQuote(quoteId: number, bookId: number) {
  await requireOwner();
  try {
    await db.delete(quotes).where(eq(quotes.id, quoteId));
    revalidatePath(`/book/${bookId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting quote:", error);
    return { success: false, error: "Failed to delete the quote" };
  }
}
