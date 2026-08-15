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
          color: "#A89070",
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
            color: "#F5ECD7",
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
              backgroundColor: "#2A1C0F",
              border: "1px solid #4A3020",
              color: "#A89070",
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
                backgroundColor: "#2A1C0F",
                border: "1px solid #4A3020",
                color: "#A89070",
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
                backgroundColor: "#2A1C0F",
                border: "1px solid #7A9E7E",
                color: "#7A9E7E",
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
                backgroundColor: "#2A1C0F",
                border: "1px solid #D4A853",
                color: "#D4A853",
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
                backgroundColor: "#2A1C0F",
                border: "1px solid #A89070",
                color: "#A89070",
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
                color: "#A89070",
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
                color: "#F5ECD7",
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
              backgroundColor: "#2A1C0F",
              border: "1px solid #4A3020",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${completionPercentage}%`,
                height: "100%",
                backgroundColor: "#7A9E7E",
                transition: "width 0.3s",
              }}
            />
          </div>

          <p
            style={{
                color: "#6B5040",
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
      <SeriesEditForm
        seriesId={seriesData.id}
        seriesName={seriesData.name}
        totalBooks={seriesData.totalBooks}
      />

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid #4A3020",
          marginBottom: "28px",
        }}
      />

      {/* Books in Series */}
      <h2
        style={{
          color: "#C8813A",
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