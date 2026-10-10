import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { books, series, bookSeries, readingSessions, goals, tags, bookTags } from "@/lib/db/schema";
import { getRole } from "@/lib/auth/server";

// Downloads the whole library as a spreadsheet (CSV) or a full backup (JSON).
// Owner only: guests can browse, but not take a copy of everything.

const date = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
// "2023", "2023-03" or "2023-03-14", as precisely as you remember finishing
const finishDate = (d: Date | null, precision: string | null) =>
  date(d).slice(0, precision === "year" ? 4 : precision === "month" ? 7 : 10);

// Quote a value for CSV when it holds a comma, quote or line break
function cell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function csv() {
  const [allBooks, allSeries, links, allTags, tagLinks] = await Promise.all([
    db.select().from(books).orderBy(books.title),
    db.select().from(series),
    db.select().from(bookSeries),
    db.select().from(tags),
    db.select().from(bookTags),
  ]);
  const seriesName = new Map(allSeries.map((s) => [s.id, s.name]));
  const tagName = new Map(allTags.map((t) => [t.id, t.name]));

  const header = [
    "Title", "Author", "Shelf", "Rating", "Review", "Pages", "Current page", "Genres", "Tags",
    "Series", "Series position", "ISBN", "Publication year", "Date added", "Date started",
    "Date completed", "DNF page", "DNF reason",
  ];
  const rows = allBooks.map((b) => {
    const link = links.find((l) => l.bookId === b.id);
    const bookTagNames = tagLinks.filter((t) => t.bookId === b.id).map((t) => tagName.get(t.tagId!) ?? "");
    return [
      b.title, b.author, b.shelf, b.rating, b.review, b.pageCount, b.currentPage,
      (b.genres ?? []).join("; "), bookTagNames.join("; "),
      link ? seriesName.get(link.seriesId!) ?? "" : "", link?.positionInSeries ?? "",
      b.isbn, b.publicationYear, date(b.dateAdded), date(b.dateStarted), finishDate(b.dateCompleted, b.dateCompletedPrecision),
      b.dnfPage, b.dnfReason,
    ];
  });
  // The byte order mark makes Excel open accented titles correctly
  return "﻿" + [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
}

async function json() {
  const [allBooks, allSeries, links, sessions, allGoals, allTags, tagLinks] = await Promise.all([
    db.select().from(books),
    db.select().from(series),
    db.select().from(bookSeries),
    db.select().from(readingSessions),
    db.select().from(goals),
    db.select().from(tags),
    db.select().from(bookTags),
  ]);
  return JSON.stringify(
    {
      app: "BookTracker",
      version: 1,
      exportedAt: new Date().toISOString(),
      books: allBooks,
      series: allSeries,
      bookSeries: links,
      readingSessions: sessions,
      goals: allGoals,
      tags: allTags,
      bookTags: tagLinks,
    },
    null,
    2
  );
}

export async function GET(request: NextRequest) {
  if ((await getRole()) !== "owner") {
    return new Response("Only the owner can export the library.", { status: 403 });
  }
  const format = request.nextUrl.searchParams.get("format") === "json" ? "json" : "csv";
  const body = format === "json" ? await json() : await csv();
  const filename = `booktracker-library-${new Date().toISOString().slice(0, 10)}.${format}`;
  return new Response(body, {
    headers: {
      "Content-Type": format === "json" ? "application/json; charset=utf-8" : "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
