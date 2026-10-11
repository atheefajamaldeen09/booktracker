import { connection } from "next/server";
import { getBooksByShelf } from "@/lib/actions/books";
import WishlistCard from "@/components/WishlistCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default async function WishlistPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const { books } = await getBooksByShelf("wishlist");

  return (
    <div style={{ maxWidth: "900px" }}>
      <PageHeader
        eyebrow="Someday soon"
        title="Wishlist"
        subtitle={`${books.length} ${books.length === 1 ? "book" : "books"} you want to get`}
        action={
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
        }
      />

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