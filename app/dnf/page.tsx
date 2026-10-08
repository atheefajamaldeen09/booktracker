import { connection } from "next/server";
import { getBooksByShelf } from "@/lib/actions/books";
import BookCard from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

export default async function DNFPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const { books } = await getBooksByShelf("dnf");

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
            🚫 Did Not Finish
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {books.length} {books.length === 1 ? "book" : "books"} you did not
            finish
          </p>
        </div>
        <Link
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
          icon="🚫"
          title="No DNF books"
          message="Books you did not finish will appear here"
        />
      )}

      {/* Books Grid */}
      {books.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}