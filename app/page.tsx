import { connection } from "next/server";
import {
  getDashboardStats,
  getCurrentlyReading,
  getRecentlyAdded,
  getRecentlyCompleted,
} from "@/lib/actions/books";
import { getGoalProgress } from "@/lib/actions/goals";
import { getReadingStats } from "@/lib/actions/stats";
import { getSeriesReminders } from "@/lib/actions/reminders";
import SeriesReminders from "@/components/SeriesReminders";
import StatsCard from "@/components/StatsCard";
import CurrentlyReadingWidget from "@/components/CurrentlyReadingWidget";
import RecentBooksCarousel from "@/components/RecentBooksCarousel";
import PickerCard from "@/components/PickerCard";
import DashboardGoal from "@/components/DashboardGoal";
import Link from "next/link";

export default async function HomePage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const [
    { stats },
    { books: currentlyReading },
    { books: recentlyAdded },
    { books: recentlyCompleted },
    goal,
    readingStats,
    reminders,
  ] = await Promise.all([
    getDashboardStats(),
    getCurrentlyReading(),
    getRecentlyAdded(8),
    getRecentlyCompleted(8),
    getGoalProgress(),
    getReadingStats(),
    getSeriesReminders(),
  ]);
  const { streak } = readingStats;

  const isNewUser = recentlyAdded.length === 0;

  return (
    <div style={{ maxWidth: "1040px" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          padding: "clamp(24px, 5vw, 40px)",
          marginBottom: "32px",
          border: "1px solid var(--border)",
          background:
            "radial-gradient(ellipse at 85% 20%, rgb(var(--accent-rgb) / 0.18), transparent 55%), linear-gradient(135deg, var(--hero-from) 0%, var(--hero-to) 100%)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Theme motif — a steaming cup, a candle, the moon… */}
        <div
          aria-hidden
          className="hero-cup"
          style={{
            position: "absolute",
            right: "clamp(16px, 6vw, 56px)",
            bottom: "clamp(12px, 3vw, 28px)",
            fontSize: "clamp(56px, 10vw, 96px)",
            opacity: 0.9,
            lineHeight: 1,
          }}
        >
          <div className="hero-steam" style={{ position: "absolute", left: "30%", top: "-18px", display: "flex", gap: "10px" }}>
            {[0, 0.6, 1.2].map((d) => (
              <span
                key={d}
                style={{
                  display: "block",
                  width: "6px",
                  height: "22px",
                  borderRadius: "999px",
                  background: "linear-gradient(transparent, var(--text-faint))",
                  animation: `steam 2.4s ease-in-out ${d}s infinite`,
                }}
              />
            ))}
          </div>
          <span className="hero-emoji" />
        </div>

        <p
          style={{
            color: "var(--primary)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            margin: "0 0 10px 0",
          }}
        >
          Your reading café
        </p>
        <h1
          style={{
            color: "var(--text)",
            fontSize: "clamp(28px, 5vw, 42px)",
            lineHeight: 1.1,
            margin: "0 0 10px 0",
            maxWidth: "70%",
          }}
        >
          Welcome back, grab a cup &amp; a chapter.
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", margin: "0 0 22px 0", maxWidth: "60%" }}>
          {stats.currentlyReading > 0
            ? `You have ${stats.currentlyReading} ${stats.currentlyReading === 1 ? "book" : "books"} on the go and ${stats.tbr} waiting on your TBR.`
            : stats.tbr > 0
            ? `${stats.tbr} ${stats.tbr === 1 ? "book is" : "books are"} waiting on your TBR — time to start one?`
            : "Add your first book to start brewing your library."}
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            data-owner-only
            href="/add"
            style={{
              padding: "11px 20px",
              borderRadius: "12px",
              background: "var(--primary)",
              color: "var(--on-primary)",
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            + Add a book
          </Link>
          {stats.tbr > 0 && (
            <Link
              href="/random-picker"
              style={{
                padding: "11px 20px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                backgroundColor: "rgba(0,0,0,0.2)",
                color: "var(--text)",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              🎲 Pick my next read
            </Link>
          )}
        </div>
      </section>

      {isNewUser ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: "18px",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
          <h2 style={{ color: "var(--text)", fontSize: "22px", marginBottom: "8px" }}>
            Start your reading journey
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              maxWidth: "400px",
              margin: "0 auto 24px",
            }}
          >
            Search by title, scan a barcode or add a book by hand to start
            tracking your reading.
          </p>
          <Link
            data-owner-only
            href="/add"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "var(--primary)",
              color: "var(--on-primary)",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            + Add your first book
          </Link>
        </div>
      ) : (
        <>
          {/* Currently reading + goal */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "20px",
              marginBottom: "36px",
            }}
          >
            <div style={{ gridColumn: "span 2", minWidth: 0 }} className="dash-reading">
              <h2 className="section-title">📖 Currently Reading</h2>
              <CurrentlyReadingWidget books={currentlyReading} />
            </div>
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
              <h2 className="section-title">🎯 This Year</h2>
              <div style={{ flex: 1 }}>
                <DashboardGoal year={goal.year} target={goal.target} booksRead={goal.booksRead} />
              </div>
            </div>
          </section>

          {/* Quick stats */}
          <section style={{ marginBottom: "36px" }}>
            <h2 className="section-title">📊 At a Glance</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "14px",
              }}
            >
              <Link href="/library?shelf=read" style={{ textDecoration: "none" }}>
                <StatsCard
                  icon="✅"
                  label="Read"
                  value={stats.totalRead}
                  color="var(--success)"
                  subtitle={`${stats.readThisYear} this year`}
                />
              </Link>
              <Link href="/library?shelf=reading" style={{ textDecoration: "none" }}>
                <StatsCard
                  icon="📖"
                  label="Reading"
                  value={stats.currentlyReading}
                  color="var(--accent)"
                  subtitle="in progress"
                />
              </Link>
              <Link href="/library?shelf=tbr" style={{ textDecoration: "none" }}>
                <StatsCard
                  icon="📚"
                  label="TBR"
                  value={stats.tbr}
                  color="var(--primary)"
                  subtitle="waiting to be read"
                />
              </Link>
              <Link href="/stats" style={{ textDecoration: "none" }}>
                <StatsCard
                  icon="🔥"
                  label="Streak"
                  value={`${streak.current} ${streak.current === 1 ? "day" : "days"}`}
                  color="var(--success)"
                  subtitle={
                    streak.current > 0
                      ? `in a row · best ${streak.longest}`
                      : "read today to start one"
                  }
                />
              </Link>
              <Link href="/wishlist" style={{ textDecoration: "none" }}>
                <StatsCard
                  icon="💛"
                  label="Wishlist"
                  value={stats.wishlist}
                  color="var(--text-muted)"
                  subtitle="books to get"
                />
              </Link>
            </div>
          </section>

          {reminders.length > 0 && (
            <section style={{ marginBottom: "36px" }}>
              <h2 className="section-title">📚 Continue Your Series</h2>
              <SeriesReminders reminders={reminders.slice(0, 4)} />
            </section>
          )}

          {/* Random picker */}
          {stats.tbr > 0 && (
            <section style={{ marginBottom: "36px" }}>
              <h2 className="section-title">🎲 Can&apos;t Decide What to Read?</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px",
                }}
              >
                <PickerCard
                  href="/random-picker?mode=wheel"
                  icon="🎡"
                  title="Spinning Wheel"
                  description="Let the wheel decide"
                />
                <PickerCard
                  href="/random-picker?mode=slots"
                  icon="🎰"
                  title="Slot Machine"
                  description="Spin the reels"
                />
                <PickerCard
                  href="/random-picker?mode=cards"
                  icon="🃏"
                  title="Card Draw"
                  description="Shuffle and pick"
                />
              </div>
            </section>
          )}

          {recentlyAdded.length > 0 && (
            <section style={{ marginBottom: "36px" }}>
              <RecentBooksCarousel
                books={recentlyAdded}
                title="✨ Recently Added"
                emptyMessage="No books added yet"
              />
            </section>
          )}

          <section style={{ marginBottom: "36px" }}>
            <RecentBooksCarousel
              books={recentlyCompleted}
              title="✅ Recently Completed"
              emptyMessage="Finish a book and it will show up here."
              showRating
            />
          </section>
        </>
      )}

      <style>{`
        @media (max-width: 899px) {
          .dash-reading { grid-column: auto !important; }
        }
        @media (max-width: 600px) {
          section h1, section > p { max-width: 100% !important; }
          .hero-cup { display: none; }
        }
      `}</style>
    </div>
  );
}
