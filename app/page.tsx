import {
  getDashboardStats,
  getCurrentlyReading,
  getRecentlyAdded,
  getRecentlyCompleted,
} from "@/lib/actions/books";
import StatsCard from "@/components/StatsCard";
import CurrentlyReadingWidget from "@/components/CurrentlyReadingWidget";
import RecentBooksCarousel from "@/components/RecentBooksCarousel";
import PickerCard from "@/components/PickerCard"; 
import Link from "next/link";

export default async function HomePage() {
  const { stats } = await getDashboardStats();
  const { books: currentlyReading } = await getCurrentlyReading();
  const { books: recentlyAdded } = await getRecentlyAdded(6);
  const { books: recentlyCompleted } = await getRecentlyCompleted(6);

  return (
    <div style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            color: "#C8813A",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "6px",
          }}
        >
          Welcome back! ☕
        </h1>
        <p style={{ color: "#A89070", fontSize: "14px" }}>
          Here&apos;s what&apos;s happening with your reading
        </p>
      </div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              color: "#C8813A",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            📖 Currently Reading
          </h2>
          <CurrentlyReadingWidget books={currentlyReading} />
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            color: "#C8813A",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          📊 Quick Stats
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          <Link href="/library" style={{ textDecoration: "none" }}>
            <StatsCard
              icon="✅"
              label="Read This Year"
              value={stats.readThisYear}
              color="#7A9E7E"
            />
          </Link>

          <Link href="/library" style={{ textDecoration: "none" }}>
            <StatsCard
              icon="📖"
              label="Currently Reading"
              value={stats.currentlyReading}
              color="#D4A853"
            />
          </Link>

          <Link href="/library" style={{ textDecoration: "none" }}>
            <StatsCard
              icon="📚"
              label="TBR"
              value={stats.tbr}
              color="#C8813A"
            />
          </Link>

          <Link href="/wishlist" style={{ textDecoration: "none" }}>
            <StatsCard
              icon="💛"
              label="Wishlist"
              value={stats.wishlist}
              color="#A89070"
            />
          </Link>
        </div>
      </div>

      {/* Random Book Picker */}
      {stats.tbr > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              color: "#C8813A",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            🎲 Can&apos;t Decide What to Read?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
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
        </div>
      )}

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <RecentBooksCarousel
            books={recentlyAdded}
            title="✨ Recently Added"
            emptyMessage="No books added yet"
          />
        </div>
      )}

      {/* Recently Completed */}
      {recentlyCompleted.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <RecentBooksCarousel
            books={recentlyCompleted}
            title="✅ Recently Completed"
            emptyMessage="No books completed yet"
            showRating
          />
        </div>
      )}

      {/* Empty State for New Users */}
      {recentlyAdded.length === 0 && currentlyReading.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#2A1C0F",
            border: "1px solid #4A3020",
            borderRadius: "14px",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📚</div>
          <h2
            style={{
              color: "#F5ECD7",
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Start Your Reading Journey
          </h2>
          <p
            style={{
              color: "#A89070",
              fontSize: "14px",
              marginBottom: "24px",
              maxWidth: "400px",
              margin: "0 auto 24px",
            }}
          >
            Add your first book to start tracking your reading progress and building your personal library
          </p>
          <Link
            href="/add"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#C8813A",
              color: "#F5ECD7",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            + Add Your First Book
          </Link>
        </div>
      )}
    </div>
  );
}