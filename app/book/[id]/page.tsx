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
import { getQuotes } from "@/lib/actions/quotes";
import MoodPicker from "@/components/MoodPicker";
import BookQuotes from "@/components/BookQuotes";
import FavoriteButton from "@/components/FavoriteButton";
import FinishDateEditor from "@/components/FinishDateEditor";
import DnfNote from "@/components/DnfNote";
import BookSeriesEditor from "@/components/BookSeriesEditor";
import ReactionStamps from "@/components/stamps/ReactionStamps";
import { formatFinish } from "@/lib/finishDate";
import { Caveat } from "next/font/google";
import styles from "@/components/scrapbook/Scrapbook.module.css";

// Handwriting for the scrapbook page
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });

// Washi tape colours for the genre labels (each theme sets its own roll)
const TAPES = ["var(--tape-1)", "var(--tape-2)", "var(--tape-3)", "var(--tape-4)", "var(--tape-5)"];

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

  const [{ series: bookSeriesInfo }, { tags: allTags }, { tags: bookTagsList }, { sessions }, { quotes }] =
    await Promise.all([
      getSeriesForBook(bookId),
      getAllTags(),
      getTagsForBook(bookId),
      getReadingSessions(bookId),
      getQuotes(bookId),
    ]);
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

  // The handwritten line under the cover photo
  const snapCaptions: Record<string, string> = {
    tbr: "soon, I promise",
    reading: "in the middle of it…",
    read: "the end ♡",
    wishlist: "one day ♡",
    dnf: "not for me",
  };

  // The inked stamp beside the cover: what happened, and when
  const started = book.dateStarted
    ? new Date(book.dateStarted).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;
  const dateStamps: Record<string, { top: string; main: string; ink: string }> = {
    tbr: { top: "To be read", main: "soon™", ink: "#4a4f8a" },
    reading: { top: "Checked out", main: started ?? "in progress", ink: "#3f7c7a" },
    read: {
      top: "Finished",
      main: formatFinish(book.dateCompleted, book.dateCompletedPrecision) ?? "once upon a time",
      ink: "#a8495a",
    },
    wishlist: { top: "Wanted", main: "one day", ink: "#5c7a45" },
    dnf: { top: "Did not finish", main: book.dnfPage ? `stopped p. ${book.dnfPage}` : "parted ways", ink: "#5b6b7a" },
  };
  const dateStamp = dateStamps[book.shelf];

  const genres = Array.from(new Set(book.genres ?? []));

  return (
    <div className={`${hand.variable} ${styles.spread}`}>
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

      {/* The uneven ink that every stamp on the page is pressed with */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="stamp-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* The scrapbook page */}
      <article className={styles.sheet}>
        {/* Cover photo and title */}
        <div className={styles.header}>
          <div className={styles.polaroid}>
            <span className={styles.tape} aria-hidden />
            <BookCover
              cover={book.cover}
              title={book.title}
              author={book.author ?? undefined}
              size="lg"
            />
            <p className={styles.snapCaption}>{snapCaptions[book.shelf] ?? "a book"}</p>
          </div>

          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{book.title}</h1>
            <p className={styles.author}>by {book.author}</p>

            {/* Current Shelf Badge */}
            <span
              className={styles.shelfTag}
              style={{ color: shelfColors[book.shelf] || "var(--text-muted)" }}
            >
              {shelfLabels[book.shelf] || book.shelf}
            </span>
            <FavoriteButton bookId={book.id} initial={book.favorite} />

            {/* Book Meta */}
            <div className={styles.meta}>
              {book.pageCount && <p>📄 {book.pageCount} pages</p>}
              {book.publicationYear && <p>📅 Published {book.publicationYear}</p>}
              {book.isbn && <p>🔖 ISBN: {book.isbn}</p>}
              {book.shelf === "read" && (
                <FinishDateEditor
                  bookId={book.id}
                  dateCompleted={book.dateCompleted}
                  precision={book.dateCompletedPrecision}
                />
              )}
              {book.rating && book.rating > 0 && (
                <p style={{ color: "var(--star)" }}>
                  {"★".repeat(Math.floor(book.rating))}
                  {book.rating % 1 >= 0.5 ? "½" : ""}{" "}
                  <span style={{ color: "var(--text-muted)" }}>{book.rating} / 5</span>
                </p>
              )}
            </div>

            {dateStamp && (
              <p className={styles.dateStamp} style={{ color: dateStamp.ink }}>
                <small>{dateStamp.top}</small>
                <strong>{dateStamp.main}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <>
            <p className={styles.sectionLabel}>Genres</p>
            <div className={styles.labels}>
              {genres.map((genre, i) => (
                <span
                  key={genre}
                  className={styles.tape}
                  style={{ "--tape": TAPES[i % TAPES.length] } as React.CSSProperties}
                >
                  {genre}
                </span>
              ))}
            </div>
          </>
        )}

        {book.shelf === "dnf" && (
          <DnfNote bookId={book.id} page={book.dnfPage} reason={book.dnfReason} pageCount={book.pageCount} />
        )}

        <MoodPicker bookId={book.id} initial={book.moods ?? []} />

        {/* Reaction stamps — once you've started the book */}
        {(book.shelf === "read" || book.shelf === "reading" || book.shelf === "dnf") && (
          <ReactionStamps bookId={book.id} initial={book.reactions ?? []} />
        )}

        {/* Series Info */}
        <BookSeriesEditor bookId={book.id} bookTitle={book.title} current={bookSeriesInfo} />

        {/* Tags */}
        <TagManager
          bookId={book.id}
          allTags={allTags}
          bookTags={bookTagsList}
        />

        {book.shelf !== "wishlist" && (
          <>
            <div className={styles.rule} />
            <BookQuotes bookId={book.id} quotes={quotes} />
          </>
        )}

        {/* Rating & Review — only shown for read books */}
        {book.shelf === "read" && (
          <>
            <div className={styles.rule} />
            <RatingReview
              bookId={book.id}
              bookTitle={book.title}
              initialRating={book.rating}
              initialReview={book.review}
            />
          </>
        )}
      </article>

      {/* Reading Progress — only shown when currently reading */}
      {book.shelf === "reading" && (
        <>
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

      {/* Editing — hidden for guests (the server refuses their edits anyway) */}
      <div data-owner-only>
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
            currentPage: book.currentPage,
            pageCount: book.pageCount,
          }}
        />
      </div>
    </div>
  );
}