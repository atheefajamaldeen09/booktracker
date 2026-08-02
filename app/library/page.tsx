import { getAllBooks } from "@/lib/actions/books";
import LibraryView from "@/components/LibraryView";
import Link from "next/link";

export default async function LibraryPage() {
  const { books } = await getAllBooks();

  // Library only shows owned books — not wishlist
  const ownedBooks = books.filter((b) => b.shelf !== "wishlist");

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

      {/* Library View with Search Filter Sort */}
      <LibraryView books={ownedBooks} />
    </div>
  );
}