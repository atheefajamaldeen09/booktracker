import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import type { ShelfBook } from "@/lib/actions/bookshelf";
import type { SpineColor } from "./spineColors";
import { useSpineFontSizes } from "./spineText";
import CharmBookmark from "./CharmBookmark";
import styles from "./Bookshelf.module.css";

export type BookLayout = {
  thickness: number;
  height: number;
  depth: number;
};

type Props = {
  book: ShelfBook;
  layout: BookLayout;
  color: SpineColor;
  // Hidden while its twin is open above the shelf
  lifted: boolean;
  onSelect: (id: number, origin: DOMRect | null) => void;
};

// A book made of four real faces (spine, front cover, back cover, page edges)
// arranged in 3D with CSS transforms. On the shelf mostly the spine faces you;
// selecting it hands its position to OpenBook, which flies it out and opens it.
export default function Book3D({ book, layout, color, lifted, onSelect }: Props) {
  const { thickness, height, depth } = layout;
  // .titleBox leaves 2px at each side and 12px at each end
  const sizes = useSpineFontSizes(book.title, book.author, thickness - 6, height - 30);

  const vars = {
    "--t": `${thickness}px`,
    "--h": `${height}px`,
    "--d": `${depth}px`,
    "--spine": color.spine,
    "--dark": color.dark,
    "--ink": color.text,
    "--foil": color.foil,
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
      className={`${styles.book} ${lifted ? styles.lifted : ""}`}
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
        <div className={styles.titleBox}>
          <div className={styles.title} style={{ fontSize: sizes.title }}>
            {book.title}
          </div>
          {book.author && (
            <div className={styles.author} style={{ fontSize: sizes.author }}>
              {book.author}
            </div>
          )}
        </div>
      </div>

      {/* Charm bookmark hooked over the top of books you're in the middle of */}
      {book.shelf === "reading" && <CharmBookmark bookId={book.id} height={height} thickness={thickness} />}
    </div>
  );
}
