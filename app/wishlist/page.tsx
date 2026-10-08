import { connection } from "next/server";
import { getBooksByShelf } from "@/lib/actions/books";
import WishlistCard from "@/components/WishlistCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

export default async function WishlistPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const { books } = await getBooksByShelf("wishlist");

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              color: "var(--primary)",
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            💛 Wishlist
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {books.length} {books.length === 1 ? "book" : "books"} you want to
            get
          </p>
        </div>
        <Link
          data-owner-only
          href="/add"
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--primary)",
            color: "var(--on-primary)",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          + Add Book
        </Link>
      </div>

      {/* Empty State */}
      {books.length === 0 && (
        <EmptyState
          icon="💛"
          title="Your wishlist is empty"
          message="Add books you want to get in the future using the button above"
        />
      )}

      {/* Wishlist Books */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "12px",
        }}
      >
        {books.map((book) => (
          <WishlistCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}