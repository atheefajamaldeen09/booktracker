import { connection } from "next/server";
import Link from "next/link";
import { getReadingStats } from "@/lib/actions/stats";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/StatsCard";
import {
  BooksPerMonthChart,
  BooksPerYearChart,
  PagesOverTimeChart,
  BarList,
  AuthorList,
  StreakCard,
} from "@/components/StatsCharts";

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
  gap: "20px",
  marginTop: "20px",
};

export default async function StatsPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const stats = await getReadingStats();
  const totalBooks = stats.shelves.reduce((sum, s) => sum + s.books, 0);

  return (
    <div style={{ maxWidth: "1040px" }}>
      <PageHeader
        eyebrow="Your reading, visualized"
        title="My Stats"
        subtitle="Every page, every month, every favourite — brewed into charts."
      />

      {totalBooks === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "56px 24px",
            backgroundColor: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: "18px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📊</div>
          <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "16px", margin: "0 0 6px 0" }}>
            Nothing to chart yet
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 18px 0" }}>
            Add a few books and your stats will start brewing.
          </p>
          <Link
            href="/add"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "var(--primary)",
              color: "var(--on-primary)",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            + Add Books
          </Link>
        </div>
      ) : (
        <>
          {/* Headline numbers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "16px",
            }}
          >
            <StatsCard
              icon="📚"
              label="Books read"
              value={stats.totals.read}
              subtitle={`${stats.totals.readThisYear} this year`}
            />
            <StatsCard
              icon="📄"
              label="Pages read"
              value={stats.totals.pagesRead.toLocaleString()}
              color="var(--accent)"
              subtitle={
                stats.totals.read > 0
                  ? `~${Math.round(stats.totals.pagesRead / stats.totals.read).toLocaleString()} per book`
                  : undefined
              }
            />
            <StatsCard
              icon="⭐"
              label="Average rating"
              value={stats.totals.avgRating !== null ? stats.totals.avgRating.toFixed(1) : "—"}
              color="var(--star)"
              subtitle={
                stats.totals.ratedCount > 0
                  ? `from ${stats.totals.ratedCount} rated ${stats.totals.ratedCount === 1 ? "book" : "books"}`
                  : "No ratings yet"
              }
            />
            <StatsCard
              icon="🔥"
              label="Reading streak"
              value={`${stats.streak.current}d`}
              color="var(--success)"
              subtitle={`Longest: ${stats.streak.longest} ${stats.streak.longest === 1 ? "day" : "days"}`}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <BooksPerMonthChart years={stats.years} data={stats.booksPerMonth} />
          </div>

          <div style={grid}>
            <PagesOverTimeChart data={stats.pagesOverTime} />
            <BooksPerYearChart data={stats.booksPerYear} />
          </div>

          <div style={grid}>
            <BarList
              title="Favourite genres"
              subtitle="Genres across the books you've read"
              items={stats.genres.map((g) => ({ label: g.name, value: g.books }))}
              empty="Finish some books with genres and your favourites will show here."
            />
            <AuthorList authors={stats.authors} />
          </div>

          <div style={grid}>
            <StreakCard {...stats.streak} />
            <BarList
              title="Books per shelf"
              subtitle={`${totalBooks} books in your library`}
              color="var(--accent)"
              items={stats.shelves.map((s) => ({
                label: s.label,
                value: s.books,
                href: `/library?shelf=${s.shelf}`,
              }))}
              empty="No books yet."
            />
          </div>
        </>
      )}
    </div>
  );
}
