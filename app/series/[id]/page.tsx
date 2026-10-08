import { getSeriesById } from "@/lib/actions/books";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import SeriesEditForm from "@/components/SeriesEditForm";
import SeriesBooksList from "@/components/SeriesBooksList";

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seriesId = parseInt(id);
  const { series: seriesData, books: booksInSeries } = await getSeriesById(seriesId);

  if (!seriesData) return notFound();

    // Only count books you actually own (not wishlist)
    const ownedBooks = booksInSeries.filter((b) => b.shelf !== "wishlist");
    const wishlistBooks = booksInSeries.filter((b) => b.shelf === "wishlist");

    const totalOwned = ownedBooks.length;
    const totalRead = ownedBooks.filter((b) => b.shelf === "read").length;
    const totalReading = ownedBooks.filter((b) => b.shelf === "reading").length;
    const totalWishlist = wishlistBooks.length;

  // Calculate completion percentage
  const completionPercentage = seriesData.totalBooks
    ? Math.round((totalRead / seriesData.totalBooks) * 100)
    : totalOwned > 0
    ? Math.round((totalRead / totalOwned) * 100)
    : 0;

  return (
    <div style={{ maxWidth: "800px" }}>
      {/* Back Button */}
      <Link
        href="/series"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          color: "var(--text-muted)",
          fontSize: "14px",
          textDecoration: "none",
          marginBottom: "24px",
        }}
      >
        <ChevronLeft size={16} />
        Back to All Series
      </Link>

      {/* Series Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            color: "var(--text)",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "8px",
            lineHeight: "1.2",
          }}
        >
          📚 {seriesData.name}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontSize: "13px",
              padding: "6px 12px",
              borderRadius: "999px",
            }}
          >
            {totalOwned} {totalOwned === 1 ? "book" : "books"} owned
          </span>

          {seriesData.totalBooks && (
            <span
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "13px",
                padding: "6px 12px",
                borderRadius: "999px",
              }}
            >
              {seriesData.totalBooks} total in series
            </span>
          )}

          {totalRead > 0 && (
            <span
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--success)",
                color: "var(--success)",
                fontSize: "13px",
                padding: "6px 12px",
                borderRadius: "999px",
              }}
            >
              ✓ {totalRead} read
            </span>
          )}

          {totalReading > 0 && (
            <span
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                fontSize: "13px",
                padding: "6px 12px",
                borderRadius: "999px",
              }}
            >
              📖 {totalReading} reading
            </span>
          )}

          {totalWishlist > 0 && (
            <span
                style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--text-muted)",
                color: "var(--text-muted)",
                fontSize: "13px",
                padding: "6px 12px",
                borderRadius: "999px",
                }}
            >
                💛 {totalWishlist} wishlist
            </span>
            )}
        </div>

        {/* Progress Bar */}
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              Reading Progress
            </p>
            <p
              style={{
                color: "var(--text)",
                fontSize: "13px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              {completionPercentage}%
            </p>
          </div>

          <div
            style={{
              width: "100%",
              height: "12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${completionPercentage}%`,
                height: "100%",
                backgroundColor: "var(--success)",
                transition: "width 0.3s",
              }}
            />
          </div>

          <p
            style={{
                color: "var(--text-faint)",
                fontSize: "12px",
                marginTop: "6px",
            }}
            >
            {seriesData.totalBooks
                ? `Read ${totalRead} of ${seriesData.totalBooks} books • Own ${totalOwned}`
                : `Read ${totalRead} of ${totalOwned} owned books`}
            {totalWishlist > 0 && ` • ${totalWishlist} on wishlist`}
            </p>
        </div>
      </div>

      {/* Edit Series Form */}
      <div data-owner-only>
        <SeriesEditForm
          seriesId={seriesData.id}
          seriesName={seriesData.name}
          totalBooks={seriesData.totalBooks}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          marginBottom: "28px",
        }}
      />

      {/* Books in Series */}
      <h2
        style={{
          color: "var(--primary)",
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Books in This Series
      </h2>

      <SeriesBooksList books={booksInSeries} />
    </div>
  );
}