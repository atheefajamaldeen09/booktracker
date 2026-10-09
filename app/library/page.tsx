import { getAllBooksWithTags } from "@/lib/actions/books";
import LibraryView from "@/components/LibraryView";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

const validShelves = ["tbr", "reading", "read", "dnf", "fav"];

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ shelf?: string }>;
}) {
  const { shelf } = await searchParams;
  const { books } = await getAllBooksWithTags();

  const ownedBooks = books.filter((b) => b.shelf !== "wishlist");
  const initialShelf = shelf && validShelves.includes(shelf) ? shelf : "all";

  return (
    <div style={{ maxWidth: "960px" }}>
      <PageHeader
        eyebrow="Your collection"
        title="My Library"
        subtitle={`${ownedBooks.length} ${
          ownedBooks.length === 1 ? "book" : "books"
        } on your shelves`}
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

      {/* key resets the filters when arriving from a different shelf link */}
      <LibraryView key={initialShelf} books={ownedBooks} initialShelf={initialShelf} />
    </div>
  );
}
