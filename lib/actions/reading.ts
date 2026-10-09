"use server";

import { requireViewer } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { readingSessions } from "@/lib/db/schema";

// Reading speed from sessions timed with the reading timer
export async function getReadingSpeed() {
  await requireViewer();
  try {
    const rows = await db
      .select({ pages: readingSessions.pagesRead, minutes: readingSessions.minutes })
      .from(readingSessions);
    const timed = rows.filter((r) => (r.minutes ?? 0) > 0);
    const minutes = timed.reduce((sum, r) => sum + (r.minutes ?? 0), 0);
    const pages = timed.reduce((sum, r) => sum + r.pages, 0);
    return {
      sessions: timed.length,
      minutes,
      pages,
      pagesPerHour: minutes > 0 ? Math.round((pages / minutes) * 60) : null,
      averageSession: timed.length > 0 ? Math.round(minutes / timed.length) : null,
    };
  } catch (error) {
    console.error("Error fetching reading speed:", error);
    return { sessions: 0, minutes: 0, pages: 0, pagesPerHour: null, averageSession: null };
  }
}
