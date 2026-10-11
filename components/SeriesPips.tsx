import { isMainBook, seriesSlots } from "@/lib/series";
import styles from "./Series.module.css";

type Props = {
  books: { position: number; shelf: string }[];
  totalBooks: number | null;
  // Large dots carry the book number
  size?: "sm" | "lg";
};

// Past this many books the dots turn into a plain progress bar
const MAX_PIPS = { sm: 18, lg: 60 };

const STATE_LABEL: Record<string, string> = {
  read: "read",
  reading: "reading now",
  tbr: "on your TBR",
  dnf: "did not finish",
  wishlist: "on your wishlist",
};

// A row of dots, one per book in the series: filled for read, tinted for
// books waiting on your shelf, dashed for the ones you don't have yet
export default function SeriesPips({ books, totalBooks, size = "sm" }: Props) {
  const slots = seriesSlots(books, totalBooks);
  // Against a known length only the main books count, not novellas
  const read = books.filter((b) => b.shelf === "read" && (!totalBooks || isMainBook(b.position))).length;
  const label = `${read} of ${totalBooks ?? books.length} read`;

  if (slots.length > MAX_PIPS[size]) {
    return (
      <div className={styles.bar} role="img" aria-label={label}>
        <div style={{ width: `${Math.min(100, Math.round((read / (totalBooks ?? slots.length)) * 100))}%` }} />
      </div>
    );
  }

  return (
    <div className={styles.pips} data-size={size} role="img" aria-label={label}>
      {slots.map((slot, i) => (
        <span
          key={i}
          className={styles.pip}
          data-state={slot.book?.shelf ?? "missing"}
          data-half={isMainBook(slot.position) ? undefined : true}
          title={`Book ${slot.position}: ${slot.book ? STATE_LABEL[slot.book.shelf] ?? slot.book.shelf : "not in your library yet"}`}
        >
          {size === "lg" ? slot.position : null}
        </span>
      ))}
    </div>
  );
}
