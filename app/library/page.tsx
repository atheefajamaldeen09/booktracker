import { getAllBooks } from "@/lib/actions/books";
import BookCard from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

export default async function LibraryPage() {
  const { books } = await getAllBooks();

  // Library only shows your actual owned books — not wishlist
  const tbr = books.filter((b) => b.shelf === "tbr");
  const reading = books.filter((b) => b.shelf === "reading");
  const read = books.filter((b) => b.shelf === "read");
  const dnf = books.filter((b) => b.shelf === "dnf");

  const ownedBooks = [...tbr, ...reading, ...read, ...dnf];

  const shelfSections = [
    { label: "📖 Currently Reading", books: reading, color: "#D4A853" },
    { label: "📚 TBR", books: tbr, color: "#C8813A" },
    { label: "✅ Read", books: read, color: "#7A9E7E" },
    { label: "🚫 Did Not Finish", books: dnf, color: "#8B3A3A" },
  ];

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
              color: "#C8813A",
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            My Library
          </h1>
          <p style={{ color: "#A89070", fontSize: "14px" }}>
            {ownedBooks.length}{" "}
            {ownedBooks.length === 1 ? "book" : "books"} in your collection
          </p>
        </div>
        <Link
          href="/add"
          style={{
            padding: "10px 20px",
            backgroundColor: "#C8813A",
            color: "#F5ECD7",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          + Add Book
        </Link>
      </div>

      {/* Empty state */}
      {ownedBooks.length === 0 && (
        <EmptyState
          icon="📚"
          title="Your library is empty"
          message="Start by adding your first book. If you are looking for your wishlist it has its own page in the navigation."
        />
      )}

      {/* Shelf Sections */}
      {shelfSections.map((section) => {
        if (section.books.length === 0) return null;
        return (
          <div key={section.label} style={{ marginBottom: "36px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  color: section.color,
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                {section.label}
              </h2>
              <span
                style={{
                  backgroundColor: "#2A1C0F",
                  border: "1px solid #4A3020",
                  color: "#A89070",
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "999px",
                }}
              >
                {section.books.length}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "12px",
              }}
            >
              {section.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}