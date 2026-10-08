import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import type { ShelfBook } from "@/lib/actions/bookshelf";
import type { SpineColor } from "./spineColors";
import styles from "./Bookshelf.module.css";

export type BookLayout = {
  thickness: number;
  height: number;
  depth: number;
  variant: number; // spine design: foil bands, label panel or colored cap
  lean: boolean;
};

type Props = {
  book: ShelfBook;
  layout: BookLayout;
  color: SpineColor;
  // Hidden while its twin is open above the shelf
  lifted: boolean;
  onSelect: (id: number, origin: DOMRect | null) => void;
};

const variants = [styles.bands, styles.panel, styles.cap];

// A book made of four real faces (spine, front cover, back cover, page edges)
// arranged in 3D with CSS transforms. On the shelf mostly the spine faces you;
// selecting it hands its position to OpenBook, which flies it out and opens it.
export default function Book3D({ book, layout, color, lifted, onSelect }: Props) {
  const { thickness, height, depth, variant, lean } = layout;
  const lightSpine = color.text !== "#f6ecdc";

  const vars = {
    "--t": `${thickness}px`,
    "--h": `${height}px`,
    "--d": `${depth}px`,
    "--spine": color.spine,
    "--dark": color.dark,
    "--ink": color.text,
    "--foil": color.foil,
    "--panel": lightSpine ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.3)",
    "--fs": `${Math.max(9, Math.min(13, thickness * 0.42))}px`,
    "--lean": lean ? "5deg" : "0deg",
    "--origin": lean ? "100% 100%" : "50% 100%",
    marginRight: lean ? `${Math.ceil(height * Math.sin((5 * Math.PI) / 180)) + 2}px` : undefined,
  } as CSSProperties;

  const select = (e: MouseEvent | KeyboardEvent) => {
    const spine = (e.currentTarget as HTMLElement).querySelector("[data-spine]");
    onSelect(book.id, spine ? spine.getBoundingClientRect() : null);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`${book.title} by ${book.author}`}
      className={`${styles.book} ${variants[variant]} ${lifted ? styles.lifted : ""}`}
      style={vars}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(e);
        }
      }}
    >
      {/* Page edges, seen from above */}
      <div className={`${styles.face} ${styles.top}`} />

      {/* Back cover (left side) */}
      <div className={`${styles.face} ${styles.back}`} />

      {/* Front cover (right side) — the real cover art */}
      <div
        className={`${styles.face} ${styles.cover}`}
        style={book.cover ? { backgroundImage: `url("${book.cover.replace(/"/g, "%22")}")` } : undefined}
      >
        {!book.cover && (
          <div className={styles.coverText}>
            <span>{book.title}</span>
            <small>{book.author}</small>
          </div>
        )}
      </div>

      {/* Spine */}
      <div className={`${styles.face} ${styles.spine}`} data-spine>
        {book.rating !== null && book.rating >= 4.5 && <span className={styles.sticker}>★</span>}
        <span className={styles.title}>{book.title}</span>
        <span className={styles.author}>{book.author.split(" ").slice(-1)[0]}</span>
      </div>

      {/* Bookmark ribbon on books you're in the middle of */}
      {book.shelf === "reading" && <div className={`${styles.face} ${styles.ribbon}`} />}
    </div>
  );
}
