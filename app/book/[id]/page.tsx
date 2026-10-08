import {
  getBookById,
  getSeriesForBook,
  getAllTags,
  getTagsForBook,
  getReadingSessions,
} from "@/lib/actions/books";
import BookCover from "@/components/BookCover";
import BookActions from "@/components/BookActions";
import EditBookForm from "@/components/EditBookForm";
import ReadingProgress from "@/components/ReadingProgress";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TagManager from "@/components/TagManager";
import RatingReview from "@/components/RatingReview";
import GoalReachedBanner from "@/components/GoalReachedBanner";
import { getGoalProgress } from "@/lib/actions/goals";

export default async function BookDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ goalReached?: string }>;
}) {
  const { id } = await params;
  const { goalReached } = await searchParams;
  const bookId = parseInt(id);
  const { book } = await getBookById(bookId);

  if (!book) return notFound();

  const { series: bookSeriesInfo } = await getSeriesForBook(bookId);
  const { tags: allTags } = await getAllTags();
  const { tags: bookTagsList } = await getTagsForBook(bookId);
  const { sessions } = await getReadingSessions(bookId);
  const goal = goalReached === "1" ? await getGoalProgress() : null;

  const shelfLabels: Record<string, string> = {
    tbr: "📚 TBR",
    reading: "📖 Currently Reading",
    read: "✅ Read",
    wishlist: "💛 Wishlist",
    dnf: "🚫 Did Not Finish",
  };

  const shelfColors: Record<string, string> = {
    tbr: "var(--primary)",
    reading: "var(--accent)",
    read: "var(--success)",
    wishlist: "var(--text-muted)",
    dnf: "var(--danger)",
  };

  // Back link depends on which shelf the book is on
  const backLinks: Record<string, { href: string; label: string }> = {
    tbr: { href: "/library", label: "Back to Library" },
    reading: { href: "/library", label: "Back to Library" },
    read: { href: "/library", label: "Back to Library" },
    wishlist: { href: "/wishlist", label: "Back to Wishlist" },
    dnf: { href: "/dnf", label: "Back to Did Not Finish" },
  };

  const backLink = backLinks[book.shelf] || {
    href: "/library",
    label: "Back to Library",
  };

  return (
    <div style={{ maxWidth: "680px" }}>
      {goal?.target && goal.booksRead >= goal.target && (
        <GoalReachedBanner year={goal.year} target={goal.target} />
      )}

      {/* Back Button */}
      <Link
        href={backLink.href}
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
        {backLink.label}
      </Link>

      {/* Book Header */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "32px",
          alignItems: "flex-start",
        }}
      >
        <BookCover
          cover={book.cover}
          title={book.title}
          author={book.author ?? undefined}
          size="lg"
        />
        <div style={{ flex: 1 }}>
          <h1
            style={{
              color: "var(--text)",
              fontSize: "22px",
              fontWeight: "bold",
              lineHeight: "1.3",
              marginBottom: "8px",
            }}
          >
            {book.title}
          </h1>
          <p
            style={{
              color: "var(--primary)",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          >
            {book.author}
          </p>

          {/* Current Shelf Badge */}
          <span
            style={{
              display: "inline-block",
              backgroundColor: "var(--surface)",
              border: `1px solid ${shelfColors[book.shelf] || "var(--border)"}`,
              color: shelfColors[book.shelf] || "var(--text-muted)",
              fontSize: "12px",
              fontWeight: "600",
              padding: "4px 12px",
              borderRadius: "999px",
              marginBottom: "16px",
            }}
          >
            {shelfLabels[book.shelf] || book.shelf}
          </span>

          {/* Book Meta */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            {book.pageCount && (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                📄 {book.pageCount} pages
              </p>
            )}
            {book.publicationYear && (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                📅 Published {book.publicationYear}
              </p>
            )}
            {book.isbn && (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                🔖 ISBN: {book.isbn}
              </p>
            )}
            {book.rating && book.rating > 0 && (
              <p style={{ color: "var(--star)", fontSize: "13px" }}>
                {"★".repeat(Math.floor(book.rating))}
                {book.rating % 1 >= 0.5 ? "½" : ""}{" "}
                <span style={{ color: "var(--text-muted)" }}>{book.rating} / 5</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Genres */}
      {book.genres && book.genres.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "10px",
            }}
          >
            Genres
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Array.from(new Set(book.genres)).map((genre) => (
              <span
                key={genre}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Series Info */}
      {bookSeriesInfo && (
        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "10px",
            }}
          >
            Series
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "12px 16px",
            }}
          >
            <span style={{ fontSize: "20px" }}>📚</span>
            <div>
              <p
                style={{
                  color: "var(--text)",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {bookSeriesInfo.seriesName}
              </p>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  margin: "2px 0 0 0",
                }}
              >
                Book {bookSeriesInfo.position} in the series
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      <TagManager
        bookId={book.id}
        allTags={allTags}
        bookTags={bookTagsList}
      />

      {/* Rating & Review — only shown for read books */}
      {book.shelf === "read" && (
        <>
          <div
            style={{
              borderTop: "1px solid var(--border)",
              marginBottom: "28px",
            }}
          />
          <RatingReview
            bookId={book.id}
            bookTitle={book.title}
            initialRating={book.rating}
            initialReview={book.review}
          />
        </>
      )}

      {/* Reading Progress — only shown when currently reading */}
      {book.shelf === "reading" && (
        <>
          <div
            style={{
              borderTop: "1px solid var(--border)",
              marginBottom: "28px",
            }}
          />
          <ReadingProgress
            book={{
              id: book.id,
              title: book.title,
              currentPage: book.currentPage,
              pageCount: book.pageCount,
              shelf: book.shelf,
            }}
            sessions={sessions}
          />
        </>
      )}

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          marginBottom: "28px",
        }}
      />

      {/* Edit Book Form */}
      <EditBookForm
        book={{
          id: book.id,
          title: book.title,
          author: book.author,
          cover: book.cover,
          genres: book.genres,
          pageCount: book.pageCount,
          publicationYear: book.publicationYear,
          isbn: book.isbn,
        }}
      />

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          marginBottom: "28px",
        }}
      />

      {/* Actions */}
      <BookActions
        book={{
          id: book.id,
          shelf: book.shelf,
          title: book.title,
        }}
      />
    </div>
  );
}