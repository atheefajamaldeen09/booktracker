"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { ShelfBook } from "@/lib/actions/bookshelf";
import Book3D, { type BookLayout } from "./Book3D";
import OpenBook from "./OpenBook";
import {
  Decoration,
  DECORATION_SIZE,
  DECORATION_TYPES,
  SLIM_DECORATIONS,
  FairyLights,
  HangingIvy,
  type DecorationType,
} from "./Decorations";
import { useSpineColors, fallbackColor, hashString } from "./spineColors";
import styles from "./Bookshelf.module.css";

type Filter = "all" | "read" | "reading" | "tbr";
type Sort = "shelf" | "author" | "colour";

type Item =
  | { kind: "book"; key: string; book: ShelfBook; layout: BookLayout; width: number }
  | { kind: "deco"; key: string; type: DecorationType; seed: number; width: number; margin: number; height: number; push?: boolean };

type Row = { key: string; items: Item[]; extra: "lights" | "ivy"; ivySide: "left" | "right" };

const SHELF_ORDER = { read: 0, reading: 1, tbr: 2 };
const BOOKS_PER_SHELF = 10;
const ROW_PADDING = 36; // .row horizontal padding
const BOOK_GAP = 2; // .book margin-right
const HEADROOM = 64; // space above the tallest book for the lights and hover lift
const BOARD = 22; // shelf plank thickness, matches .board
const PEEK = 30; // a sliver of the next shelf shows below the current one

const subscribeNoop = () => () => {};

// Proportions come from the book itself, so a book always looks the same no
// matter where it ends up: thickness follows the page count, height varies a bit
function bookShape(book: ShelfBook) {
  const h = hashString(`book-${book.id}-${book.title}`);
  const weight = book.pageCount
    ? Math.min(1.5, Math.max(0.65, 0.55 + book.pageCount / 650))
    : 0.75 + (h % 45) / 100;
  return { weight, heightShare: 0.8 + (h % 21) / 100 };
}

// Ornaments are drawn for a book this tall; a smaller number makes them bigger
const DECO_REF = 290;
const decoWidth = (type: DecorationType, H: number) => Math.round((DECORATION_SIZE[type].w * H) / DECO_REF);
// Tall ornaments fill the empty height of a half-empty shelf
const TALL: DecorationType[] = ["plant", "roses", "lantern", "globe"];
const SLIM_TALL: DecorationType[] = ["roses", "lantern"];
const pick = (list: DecorationType[], r: number, seed: number) => list[(seed + r * 3) % list.length];

export default function Bookshelf({ books }: { books: ShelfBook[] }) {
  // Everything here depends on the browser (width, cover colors)
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("shelf");
  // The book lifted off the shelf, and where it was sitting when you clicked it
  const [open, setOpen] = useState<{ id: number; origin: DOMRect | null } | null>(null);
  const [width, setWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(800);
  // Which shelf is in view; the arrows move between them
  const [shelfIndex, setShelfIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const colors = useSpineColors(books.map((b) => b.cover));
  const colorFor = (book: ShelfBook) => (book.cover && colors[book.cover]) || fallbackColor(book.title);

  // Size the shelf to the available width and screen height
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    const onResize = () => setViewportHeight(window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [mounted]);

  const counts = useMemo(
    () => ({
      all: books.length,
      read: books.filter((b) => b.shelf === "read").length,
      reading: books.filter((b) => b.shelf === "reading").length,
      tbr: books.filter((b) => b.shelf === "tbr").length,
    }),
    [books]
  );

  const visibleBooks = useMemo(() => {
    const list = books.filter((b) => filter === "all" || b.shelf === filter);
    const lastName = (a: string) => a.trim().split(" ").slice(-1)[0].toLowerCase();
    return list.sort((a, b) => {
      if (sort === "author") return lastName(a.author).localeCompare(lastName(b.author)) || a.title.localeCompare(b.title);
      if (sort === "colour") {
        const ca = (a.cover && colors[a.cover]) || fallbackColor(a.title);
        const cb = (b.cover && colors[b.cover]) || fallbackColor(b.title);
        return ca.hue - cb.hue;
      }
      // Read books in the order you finished them, then current reads, then your TBR
      return (
        SHELF_ORDER[a.shelf] - SHELF_ORDER[b.shelf] ||
        (a.dateCompleted ?? a.dateAdded ?? "").localeCompare(b.dateCompleted ?? b.dateAdded ?? "")
      );
    });
  }, [books, filter, sort, colors]);

  // The tallest a book can be: one shelf should fill most of the screen
  const maxHeight = Math.round(Math.min(470, Math.max(220, viewportHeight * 0.56)));

  // Ten books per shelf plus an ornament, sized to fill the shelf width
  const shelf = useMemo(() => {
    if (width === 0) return null;
    const available = width - ROW_PADDING;
    // Phones get slimmer ornaments with less space around them
    const roomy = width >= 600;
    const margin = roomy ? 16 : 6;
    const decoFor = (r: number, seed: number) => pick(roomy ? DECORATION_TYPES : SLIM_DECORATIONS, r, seed);

    const chunks: ShelfBook[][] = [];
    for (let i = 0; i < visibleBooks.length; i += BOOKS_PER_SHELF) {
      chunks.push(visibleBooks.slice(i, i + BOOKS_PER_SHELF));
    }
    if (chunks.length === 0) chunks.push([]);

    // How wide one unit of book weight is on a typical full shelf
    const meanWeight =
      visibleBooks.reduce((sum, b) => sum + bookShape(b).weight, 0) / Math.max(1, visibleBooks.length) || 1;
    // Book height and ornament width grow together, so solve for both: the
    // tallest books that still leave ten of them book-shaped (no wider than
    // height / ratio) beside an ornament scaled to the same height
    const ratio = roomy ? 6.2 : 7.5;
    const ornament = DECORATION_SIZE[roomy ? "candles" : "cat"].w / DECO_REF;
    const free = available - margin - BOOKS_PER_SHELF * BOOK_GAP;
    const H = Math.round(Math.min(maxHeight, (ratio * free) / (BOOKS_PER_SHELF * meanWeight + ratio * ornament)));
    const typicalUnit = (free - ornament * H) / (BOOKS_PER_SHELF * meanWeight);

    const layouts = new Map<number, BookLayout>();
    const rows: Row[] = chunks.map((chunk, r) => {
      const seed = hashString(`shelf-${r}-${chunk[0]?.id ?? "empty"}`);
      const extra = r % 2 === 0 ? "lights" : "ivy";
      const decos: Extract<Item, { kind: "deco" }>[] = [];
      const addDeco = (type: DecorationType, key: string) => {
        decos.push({
          kind: "deco",
          key,
          type,
          seed: seed + decos.length,
          width: decoWidth(type, H) + margin,
          margin,
          height: Math.round((DECORATION_SIZE[type].h * H) / DECO_REF),
        });
      };
      addDeco(decoFor(r, seed), `deco-${r}`);

      const decoSpace = decos.reduce((sum, d) => sum + d.width, 0);
      const shapes = chunk.map(bookShape);
      const totalWeight = shapes.reduce((sum, s) => sum + s.weight, 0);
      const space = available - decoSpace - chunk.length * BOOK_GAP;
      // A full shelf is packed edge to edge; a short one keeps the usual sizes
      const unit =
        chunk.length === BOOKS_PER_SHELF
          ? space / totalWeight
          : Math.min(typicalUnit, space / Math.max(totalWeight, 1));

      const bookItems = chunk.map((book, i): Extract<Item, { kind: "book" }> => {
        const shape = shapes[i];
        const height = Math.round(H * shape.heightShare);
        const layout: BookLayout = {
          thickness: Math.max(12, Math.floor(shape.weight * unit)),
          height,
          depth: Math.round(height * 0.62),
        };
        layouts.set(book.id, layout);
        return { kind: "book", key: `book-${book.id}`, book, layout, width: layout.thickness + BOOK_GAP };
      });

      if (chunk.length < BOOKS_PER_SHELF) {
        let used = bookItems.reduce((sum, b) => sum + b.width, 0) + decoSpace;
        // Fill the gap on a short shelf with a few more ornaments
        for (let k = 1; k <= 3; k++) {
          const type = k === 1 ? pick(roomy ? TALL : SLIM_TALL, r, seed) : decoFor(r + k * 2, seed + k);
          const w = decoWidth(type, H) + margin;
          if (available - used < w + 40 || decos.some((d) => d.type === type)) continue;
          addDeco(type, `deco-${r}-${k}`);
          used += w;
        }
        // Spread the ornaments evenly through the free space
        if (bookItems.length > 0) decos.forEach((d) => (d.push = true));
        return { key: `shelf-${r}`, items: [...bookItems, ...decos], extra, ivySide: "left" };
      }

      // Ornament alternates ends; ivy hangs on the other side
      const decoRight = r % 2 === 0;
      return {
        key: `shelf-${r}`,
        items: decoRight ? [...bookItems, ...decos] : [...decos, ...bookItems],
        extra,
        ivySide: decoRight ? "left" : "right",
      };
    });

    return { rows, layouts, bayHeight: H + HEADROOM };
  }, [visibleBooks, width, maxHeight]);

  const shelfCount = shelf?.rows.length ?? 1;
  const current = Math.min(shelfIndex, shelfCount - 1);
  const pitch = shelf ? shelf.bayHeight + BOARD : 0;
  const go = (delta: number) => setShelfIndex(Math.max(0, Math.min(shelfCount - 1, current + delta)));

  const openBook = open ? books.find((b) => b.id === open.id) ?? null : null;

  if (!mounted) {
    return <div style={{ height: "60vh", borderRadius: "14px", backgroundColor: "var(--surface)" }} />;
  }

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "read", label: "Read" },
    { id: "reading", label: "Reading" },
    { id: "tbr", label: "TBR" },
  ];

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    backgroundColor: "var(--surface)",
    color: "var(--text)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >
        <div
          role="tablist"
          style={{
            display: "inline-flex",
            gap: "4px",
            padding: "4px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            flexWrap: "wrap",
          }}
        >
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(f.id);
                  setShelfIndex(0);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: active ? "var(--primary)" : "transparent",
                  color: active ? "var(--on-primary)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {f.label}
                <span style={{ opacity: 0.7, fontWeight: 500 }}>{counts[f.id]}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-faint)", fontSize: "12px" }}>
            Sort
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as Sort);
                setShelfIndex(0);
              }}
              style={selectStyle}
            >
              <option value="shelf">By shelf</option>
              <option value="author">By author</option>
              <option value="colour">Rainbow 🌈</option>
            </select>
          </label>
        </div>
      </div>

      {/* The bookcase, one shelf at a time */}
      <div
        className={styles.stage}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "PageDown") {
            e.preventDefault();
            go(1);
          } else if (e.key === "ArrowUp" || e.key === "PageUp") {
            e.preventDefault();
            go(-1);
          }
        }}
      >
        <div className={styles.case}>
          <div
            ref={scrollerRef}
            className={styles.viewport}
            style={{ height: shelf ? shelf.bayHeight + BOARD + PEEK : "60vh" }}
          >
            <div className={styles.track} style={{ transform: `translate3d(0, ${-current * pitch}px, 0)` }}>
              {shelf?.rows.map((row, r) => (
                <div key={row.key} className={styles.bay} inert={r !== current}>
                  {row.extra === "lights" ? <FairyLights seed={r * 5} /> : <HangingIvy side={row.ivySide} height={Math.round(shelf.bayHeight * 0.45)} />}
                  <div className={styles.row} style={{ height: shelf.bayHeight }}>
                    {row.items.map((item) =>
                      item.kind === "book" ? (
                        <Book3D
                          key={item.key}
                          book={item.book}
                          layout={item.layout}
                          color={colorFor(item.book)}
                          lifted={open?.id === item.book.id}
                          onSelect={(id, origin) => setOpen({ id, origin })}
                        />
                      ) : (
                        <div
                          key={item.key}
                          aria-hidden
                          className={styles.deco}
                          style={{
                            width: item.width - item.margin,
                            height: item.height,
                            marginLeft: item.push ? "auto" : item.margin / 2,
                            marginRight: item.push ? "auto" : item.margin / 2,
                          }}
                        >
                          <Decoration type={item.type} seed={item.seed} />
                        </div>
                      )
                    )}
                  </div>
                  <div className={styles.board} />
                </div>
              ))}
              <div className={styles.plinth} style={{ height: PEEK }} />
            </div>
          </div>
        </div>

        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => go(-1)}
            disabled={current === 0}
            aria-label="Shelf above"
          >
            <ChevronUp size={22} />
          </button>
          <span className={styles.navCount} aria-live="polite">
            {current + 1}
            <small>of {shelfCount}</small>
          </span>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => go(1)}
            disabled={current >= shelfCount - 1}
            aria-label="Shelf below"
          >
            <ChevronDown size={22} />
          </button>
        </div>
      </div>

      <p style={{ color: "var(--text-faint)", fontSize: "13px", textAlign: "center", marginTop: "18px" }}>
        {books.length === 0
          ? "Your shelf is waiting — add books to your TBR or mark one as read and they'll appear here."
          : "Tap a book to take it off the shelf and open it. Use the arrows to move between shelves."}
      </p>

      {openBook &&
        createPortal(
          <OpenBook
            key={openBook.id}
            book={openBook}
            color={colorFor(openBook)}
            origin={open!.origin}
            shelfThickness={shelf?.layouts.get(openBook.id)?.thickness ?? 24}
            onClosed={() => setOpen(null)}
          />,
          document.body
        )}
    </div>
  );
}
