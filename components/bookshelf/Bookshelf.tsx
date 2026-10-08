"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { ShelfBook } from "@/lib/actions/bookshelf";
import Book3D, { type BookLayout } from "./Book3D";
import OpenBook from "./OpenBook";
import { Decoration, DECORATION_SIZE, DECORATION_TYPES, type DecorationType } from "./Decorations";
import { useSpineColors, fallbackColor, hashString } from "./spineColors";
import styles from "./Bookshelf.module.css";

type Filter = "all" | "read" | "reading" | "tbr";
type Sort = "shelf" | "author" | "colour";

type Item =
  | { kind: "book"; key: string; book: ShelfBook; layout: BookLayout; width: number }
  | { kind: "deco"; key: string; type: DecorationType; seed: number; width: number; height: number };

const SHELF_ORDER = { read: 0, reading: 1, tbr: 2 };
const ROW_PADDING = 36; // .row horizontal padding
const LEAN_ROOM = Math.sin((5 * Math.PI) / 180);

const subscribeNoop = () => () => {};

// Size and spine design come from the book itself, so a book always looks
// the same no matter where it ends up on the shelf
function layoutFor(book: ShelfBook, scale: number): BookLayout {
  const h = hashString(`book-${book.id}-${book.title}`);
  const height = Math.round((150 + (h % 44)) * scale);
  const thickness = Math.round(
    (book.pageCount ? Math.min(50, Math.max(18, book.pageCount / 13)) : 20 + (h % 16)) * scale
  );
  return { height, thickness, depth: Math.round(height * 0.66), variant: (h >> 4) % 3, lean: false };
}

export default function Bookshelf({ books }: { books: ShelfBook[] }) {
  // Everything here depends on the browser (width, cover colors)
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("shelf");
  // The book lifted off the shelf, and where it was sitting when you clicked it
  const [open, setOpen] = useState<{ id: number; origin: DOMRect | null } | null>(null);
  const [width, setWidth] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const colors = useSpineColors(books.map((b) => b.cover));
  const colorFor = (book: ShelfBook) => (book.cover && colors[book.cover]) || fallbackColor(book.title);

  // Keep the shelf packed to the available width
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
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

  const scale = width > 0 && width < 560 ? 0.74 : 1;
  const rowHeight = Math.round(232 * scale);

  // Books plus decorations, packed into rows that fit the shelf width
  const rows = useMemo(() => {
    if (width === 0) return [];
    const available = width - ROW_PADDING;

    const sequence: Item[] = [];
    let sinceDecoration = 0;
    let lastType: DecorationType | null = null;
    const addDecoration = (key: string, seed: number) => {
      let type = DECORATION_TYPES[seed % DECORATION_TYPES.length];
      if (type === lastType) type = DECORATION_TYPES[(seed + 1) % DECORATION_TYPES.length];
      lastType = type;
      const size = DECORATION_SIZE[type];
      sequence.push({
        kind: "deco",
        key,
        type,
        seed,
        width: Math.round(size.w * scale) + 16,
        height: Math.round(size.h * scale),
      });
      sinceDecoration = 0;
    };

    visibleBooks.forEach((book) => {
      const layout = layoutFor(book, scale);
      sequence.push({ kind: "book", key: `book-${book.id}`, book, layout, width: layout.thickness + 2 });
      sinceDecoration++;
      // Decorations are tied to a book, so they stay put as new books arrive
      const seed = hashString(`deco-${book.id}`);
      if ((sinceDecoration >= 4 && seed % 100 < 24) || sinceDecoration >= 9) {
        addDecoration(`deco-${book.id}`, seed >> 3);
      }
    });
    if (!sequence.some((i) => i.kind === "deco")) addDecoration("deco-solo", 0);

    const packed: Item[][] = [[]];
    let used = 0;
    sequence.forEach((item) => {
      if (used + item.width > available && packed[packed.length - 1].length > 0) {
        packed.push([]);
        used = 0;
      }
      packed[packed.length - 1].push(item);
      used += item.width;
    });

    // Let the last book on a row lean into the empty space now and then
    packed.forEach((row) => {
      const last = row[row.length - 1];
      const rowWidth = row.reduce((sum, i) => sum + i.width, 0);
      if (
        last?.kind === "book" &&
        hashString(`lean-${last.book.id}`) % 2 === 0 &&
        available - rowWidth > last.layout.height * LEAN_ROOM + 6
      ) {
        last.layout = { ...last.layout, lean: true };
      }
    });

    // An empty shelf below always looks nicer than a lone row
    if (packed.length < 2) {
      packed.push([
        { kind: "deco", key: "spare-cat", type: "cat", seed: 1, width: 0, height: Math.round(86 * scale) },
        { kind: "deco", key: "spare-stack", type: "stack", seed: 3, width: 0, height: Math.round(56 * scale) },
      ]);
    }
    return packed;
  }, [visibleBooks, width, scale]);

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
                onClick={() => setFilter(f.id)}
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
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} style={selectStyle}>
              <option value="shelf">By shelf</option>
              <option value="author">By author</option>
              <option value="colour">Rainbow 🌈</option>
            </select>
          </label>
        </div>
      </div>

      {/* The bookcase */}
      <div className={styles.case}>
        <div ref={scrollerRef} className={styles.scroller}>
          {rows.map((row, r) => (
            <div key={r} className={styles.bay}>
              <div className={styles.row} style={{ height: rowHeight }}>
                {row.map((item) =>
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
                        width: DECORATION_SIZE[item.type].w * scale,
                        height: item.height,
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
        </div>
      </div>

      <p style={{ color: "var(--text-faint)", fontSize: "13px", textAlign: "center", marginTop: "18px" }}>
        {books.length === 0
          ? "Your shelf is waiting — add books to your TBR or mark one as read and they'll appear here."
          : "Tap a book to take it off the shelf and open it."}
      </p>

      {openBook &&
        createPortal(
          <OpenBook
            key={openBook.id}
            book={openBook}
            color={colorFor(openBook)}
            origin={open!.origin}
            shelfThickness={layoutFor(openBook, scale).thickness}
            onClosed={() => setOpen(null)}
          />,
          document.body
        )}
    </div>
  );
}
