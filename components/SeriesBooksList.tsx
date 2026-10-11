import Link from "next/link";
import { Ban, Bookmark, BookOpen, Check, ChevronRight, Heart, type LucideIcon } from "lucide-react";
import BookCover from "@/components/BookCover";
import { seriesSlots } from "@/lib/series";
import styles from "./Series.module.css";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  shelf: string;
  rating: number | null;
  position: number;
};

type Props = {
  books: Book[];
  seriesName: string;
  totalBooks: number | null;
};

const SHELVES: Record<string, { label: string; color: string; Icon: LucideIcon }> = {
  read: { label: "Read", color: "var(--success)", Icon: Check },
  reading: { label: "Reading now", color: "var(--accent)", Icon: BookOpen },
  tbr: { label: "To be read", color: "var(--primary)", Icon: Bookmark },
  wishlist: { label: "Wishlist", color: "var(--star)", Icon: Heart },
  dnf: { label: "Did not finish", color: "var(--danger)", Icon: Ban },
};

type Entry = { kind: "book"; book: Book } | { kind: "missing"; from: number; to: number };

// Every book number in order. The ones you don't have show as dashed rows,
// with a run of them folded into one ("Books 4–6")
export default function SeriesBooksList({ books, seriesName, totalBooks }: Props) {
  if (books.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          No books added to this series yet.
        </p>
      </div>
    );
  }

  const entries: Entry[] = [];
  for (const slot of seriesSlots(books, totalBooks)) {
    const last = entries[entries.length - 1];
    if (slot.book) entries.push({ kind: "book", book: slot.book });
    else if (last?.kind === "missing") last.to = slot.position;
    else entries.push({ kind: "missing", from: slot.position, to: slot.position });
  }

  return (
    <ol className={styles.list}>
      {entries.map((entry) => {
        if (entry.kind === "missing") {
          const one = entry.from === entry.to;
          const search = one ? `${seriesName} book ${entry.from}` : seriesName;
          return (
            <li key={`missing-${entry.from}`} className={styles.item}>
              <span className={styles.number} data-state="missing">
                {one ? entry.from : `${entry.from}–${entry.to}`}
              </span>
              <div className={styles.bookRow} data-missing>
                <p className={styles.missingText}>
                  {one ? "Not in your library yet" : `${entry.to - entry.from + 1} books not in your library yet`}
                </p>
                <Link data-owner-only href={`/add?q=${encodeURIComponent(search)}`} className={styles.findLink}>
                  Find {one ? "it" : "them"}
                </Link>
              </div>
            </li>
          );
        }

        const { book } = entry;
        const shelf = SHELVES[book.shelf];
        return (
          <li key={book.id} className={styles.item}>
            <span
              className={styles.number}
              data-state={book.shelf}
              data-half={Number.isInteger(book.position) ? undefined : true}
            >
              {book.position}
            </span>
            <Link href={`/book/${book.id}`} className={styles.bookRow}>
              <BookCover cover={book.cover} title={book.title} author={book.author ?? undefined} size="sm" />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p className={styles.bookKicker}>
                  {Number.isInteger(book.position) ? `Book ${book.position}` : `Novella ${book.position}`}
                </p>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>{book.author}</p>
              </div>

              <div className={styles.bookSide}>
                {shelf && (
                  <span className={styles.shelfChip} style={{ color: shelf.color }}>
                    <shelf.Icon size={12} strokeWidth={2.5} />
                    {shelf.label}
                  </span>
                )}
                {book.rating && book.rating > 0 ? (
                  <span className={styles.rating} aria-label={`Rated ${book.rating} out of 5`}>
                    ★ {book.rating}
                  </span>
                ) : null}
              </div>

              <ChevronRight size={18} className={styles.chevron} />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
