import Link from "next/link";
import type { CSSProperties } from "react";
import { ChevronLeft } from "lucide-react";
import BookCover from "@/components/BookCover";
import SeriesEditForm from "@/components/SeriesEditForm";
import SeriesBooksList from "@/components/SeriesBooksList";
import SeriesPips from "@/components/SeriesPips";
import { isMainBook, seriesSlots } from "@/lib/series";
import styles from "./Series.module.css";

type Props = {
  series: { id: number; name: string; totalBooks: number | null };
  books: {
    id: number;
    title: string;
    author: string | null;
    cover: string | null;
    shelf: string;
    rating: number | null;
    position: number;
  }[];
};

// One series: how far along you are, what's next, and every book in order
export default function SeriesDetail({ series: seriesData, books: booksInSeries }: Props) {
  const total = seriesData.totalBooks;
  // When the series length is known, novellas (1.5 and the like) are extras
  // that don't count towards it
  const mainBooks = booksInSeries.filter((b) => !total || isMainBook(b.position));
  const extras = booksInSeries.length - mainBooks.length;
  // Only count books you actually own (not wishlist)
  const ownedBooks = mainBooks.filter((b) => b.shelf !== "wishlist");
  const wishlistBooks = mainBooks.filter((b) => b.shelf === "wishlist");

  const totalOwned = ownedBooks.length;
  const totalRead = ownedBooks.filter((b) => b.shelf === "read").length;
  const totalReading = ownedBooks.filter((b) => b.shelf === "reading").length;
  const totalWishlist = wishlistBooks.length;
  const missing = total ? Math.max(0, total - mainBooks.length) : 0;

  // Calculate completion percentage
  const completionPercentage = total
    ? Math.min(100, Math.round((totalRead / total) * 100))
    : totalOwned > 0
    ? Math.round((totalRead / totalOwned) * 100)
    : 0;

  // Whoever wrote most of the books
  const authorCounts = new Map<string, number>();
  booksInSeries.forEach((b) => b.author && authorCounts.set(b.author, (authorCounts.get(b.author) ?? 0) + 1));
  const author = [...authorCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  // The next book in line: the lowest number you haven't finished
  const slots = seriesSlots(booksInSeries, total);
  const next = slots.find((slot) => !slot.book || (slot.book.shelf !== "read" && slot.book.shelf !== "dnf"));
  const nextMessage = !next
    ? null
    : !next.book
    ? "It isn't in your library yet."
    : next.book.shelf === "reading"
    ? "You're in the middle of this one."
    : next.book.shelf === "wishlist"
    ? "It's on your wishlist, ready for when you get a copy."
    : "It's waiting on your shelf.";

  const legend = [
    { state: "read", label: "Read" },
    { state: "reading", label: "Reading" },
    { state: "tbr", label: "To be read" },
    { state: "dnf", label: "Did not finish" },
    { state: "wishlist", label: "Wishlist" },
    { state: "missing", label: "Not in your library" },
  ].filter((item) => (item.state === "missing" ? missing > 0 : booksInSeries.some((b) => b.shelf === item.state)));

  const covers = booksInSeries.slice(0, 3);

  return (
    <div style={{ maxWidth: "860px" }}>
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
          marginBottom: "20px",
        }}
      >
        <ChevronLeft size={16} />
        All series
      </Link>

      {/* Series Header */}
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          {covers.length > 0 && (
            <div className={styles.fan} data-count={covers.length} aria-hidden>
              {covers.map((b) => (
                <BookCover key={b.id} cover={b.cover} title={b.title} size="md" />
              ))}
            </div>
          )}

          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Series{author ? ` · ${author}` : ""}</p>
            <h1 className={styles.heroTitle}>{seriesData.name}</h1>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <strong>
                  {totalRead}
                  <small> / {total ?? totalOwned}</small>
                </strong>
                <span>read</span>
              </div>
              <div className={styles.stat}>
                <strong>{totalOwned}</strong>
                <span>on your shelf</span>
              </div>
              {totalReading > 0 && (
                <div className={styles.stat}>
                  <strong>{totalReading}</strong>
                  <span>reading now</span>
                </div>
              )}
              {totalWishlist > 0 && (
                <div className={styles.stat}>
                  <strong>{totalWishlist}</strong>
                  <span>on wishlist</span>
                </div>
              )}
              {missing > 0 && (
                <div className={styles.stat}>
                  <strong>{missing}</strong>
                  <span>to find</span>
                </div>
              )}
              {extras > 0 && (
                <div className={styles.stat}>
                  <strong>{extras}</strong>
                  <span>{extras === 1 ? "novella" : "novellas"}</span>
                </div>
              )}
            </div>
          </div>

          <div
            className={styles.percent}
            style={{ "--p": completionPercentage } as CSSProperties}
            role="img"
            aria-label={`${completionPercentage}% read`}
          >
            <span>
              {completionPercentage}%<small>read</small>
            </span>
          </div>
        </div>

        {/* One numbered dot per book */}
        <div className={styles.progress}>
          <SeriesPips books={booksInSeries} totalBooks={total} size="lg" />
          {legend.length > 1 && (
            <ul className={styles.legend}>
              {legend.map((item) => (
                <li key={item.state}>
                  <span className={styles.pip} data-state={item.state} />
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div data-owner-only className={styles.heroFoot}>
          <SeriesEditForm seriesId={seriesData.id} seriesName={seriesData.name} totalBooks={seriesData.totalBooks} bookCount={booksInSeries.length} />
        </div>
      </header>

      {/* What to pick up next */}
      {next && nextMessage && (
        <section className={styles.next}>
          {next.book ? (
            <BookCover cover={next.book.cover} title={next.book.title} size="sm" />
          ) : (
            <div className={styles.nextGhost} aria-hidden>
              {next.position}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className={styles.bookKicker}>Up next · Book {next.position}</p>
            <p className={styles.nextTitle}>{next.book?.title ?? `Book ${next.position} of ${seriesData.name}`}</p>
            <p className={styles.nextText}>{nextMessage}</p>
          </div>
          {next.book ? (
            <Link href={`/book/${next.book.id}`} className={styles.nextAction}>
              Open book
            </Link>
          ) : (
            <Link
              data-owner-only
              href={`/add?q=${encodeURIComponent(`${seriesData.name} book ${next.position}`)}`}
              className={styles.nextAction}
            >
              Find it
            </Link>
          )}
        </section>
      )}

      {/* Books in Series */}
      <h2 className="section-title">Books in this series</h2>

      <SeriesBooksList books={booksInSeries} seriesName={seriesData.name} totalBooks={total} />
    </div>
  );
}
