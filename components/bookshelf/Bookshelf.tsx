"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChevronUp, ChevronDown, Move, Palette } from "lucide-react";
import { saveShelfOrder, saveShelfDecor, type ShelfBook, type ShelfDecorSettings } from "@/lib/actions/bookshelf";
import { useCanEdit } from "@/components/Viewer";
import DecorPanel from "./DecorPanel";
import Book3D, { type BookLayout } from "./Book3D";
import OpenBook from "./OpenBook";
import {
  Decoration,
  DECORATION_SIZE,
  DECORATION_TYPES,
  SLIM_DECORATIONS,
  FairyLights,
  HangingIvy,
  ShelfVines,
  type DecorationType,
} from "./Decorations";
import NookArt from "@/components/nook/NookArt";
import type { NookId } from "@/lib/nooks";
import { useSpineColors, fallbackColor, hashString } from "./spineColors";
import styles from "./Bookshelf.module.css";

type Filter = "all" | "read" | "reading" | "tbr" | "fav";
type Sort = "shelf" | "author" | "colour" | "mine";

type Item =
  | { kind: "book"; key: string; book: ShelfBook; layout: BookLayout; width: number }
  | { kind: "deco"; key: string; type: DecorationType; seed: number; width: number; margin: number; height: number; push?: boolean; nook?: NookId };

type Row = {
  key: string;
  items: Item[];
  extra: "lights" | "ivy" | null;
  ivySide: "left" | "right";
  // Vines trailing along the front of the shelf board, from one side
  vines: "left" | "right" | null;
};

// A book being dragged in arrange mode. mids are the centres of the other
// books on the shelf, so the drop slot is simply how many of them the pointer
// has passed; nav is set while hovering the shelf-above/below arrows.
type DragState = {
  id: number;
  pointerId: number;
  startX: number;
  dx: number;
  rowIds: number[];
  mids: number[];
  target: number;
  nav: -1 | 0 | 1;
};

const SHELF_ORDER = { read: 0, reading: 1, tbr: 2 };
// Ten books per shelf; phones get seven so each book is big enough to read
const BOOKS_PER_SHELF = 10;
const PHONE_BOOKS_PER_SHELF = 7;
const ROW_PADDING = 36; // .row horizontal padding
const PHONE_ROW_PADDING = 16; // .row horizontal padding on phones
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
// A finished book nook stands about as tall as the books; slimmer on a phone
const NOOK_SIZE = { w: 150, h: 240 };
const PHONE_NOOK_SIZE = { w: 110, h: 176 };
const pick = (list: DecorationType[], r: number, seed: number) => list[(seed + r * 3) % list.length];

export default function Bookshelf({ books, decor, nooks }: { books: ShelfBook[]; decor: ShelfDecorSettings; nooks: NookId[] }) {
  // Everything here depends on the browser (width, cover colors)
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const [filter, setFilter] = useState<Filter>("all");
  // Your own order is the default once you've arranged the shelf
  const [sort, setSort] = useState<Sort>(() => (books.some((b) => b.shelfOrder !== null) ? "mine" : "shelf"));
  // The book lifted off the shelf, and where it was sitting when you clicked it
  const [open, setOpen] = useState<{ id: number; origin: DOMRect | null } | null>(null);
  const [width, setWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(800);
  // Matches the phone breakpoint in Bookshelf.module.css
  const [phone, setPhone] = useState(false);
  // Which shelf is in view; the arrows move between them
  const [shelfIndex, setShelfIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const canEdit = useCanEdit();
  const [arranging, setArranging] = useState(false);
  // The order you arranged in this visit, as book ids (saved to the server too)
  const [order, setOrder] = useState<number[] | null>(null);
  const [decorSettings, setDecorSettings] = useState(decor);
  const [showDecor, setShowDecor] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const colors = useSpineColors(books.map((b) => b.cover));
  const colorFor = (book: ShelfBook) => (book.cover && colors[book.cover]) || fallbackColor(book.title);

  // Size the shelf to the available width and screen height
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    const onResize = () => {
      setViewportHeight(window.innerHeight);
      setPhone(window.matchMedia("(max-width: 600px)").matches);
    };
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
      fav: books.filter((b) => b.favorite).length,
    }),
    [books]
  );

  const visibleBooks = useMemo(() => {
    const list = books.filter((b) => filter === "all" || (filter === "fav" ? b.favorite : b.shelf === filter));
    const lastName = (a: string) => a.trim().split(" ").slice(-1)[0].toLowerCase();
    const rank = new Map((order ?? []).map((id, i) => [id, i]));
    const place = (b: ShelfBook) => (order ? rank.get(b.id) : b.shelfOrder) ?? Number.MAX_SAFE_INTEGER;
    list.sort((a, b) => {
      if (sort === "mine" && place(a) !== place(b)) return place(a) - place(b);
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
    return list;
  }, [books, filter, sort, colors, order]);

  // The tallest a book can be: one shelf should fill most of the screen
  const maxHeight = Math.round(Math.min(470, Math.max(220, viewportHeight * (phone ? 0.5 : 0.56))));

  // Ten books per shelf plus an ornament, sized to fill the shelf width
  const shelf = useMemo(() => {
    if (width === 0) return null;
    // Phones get fewer, bigger books and slimmer ornaments with less space around them
    const roomy = !phone;
    const perShelf = roomy ? BOOKS_PER_SHELF : PHONE_BOOKS_PER_SHELF;
    const available = width - (roomy ? ROW_PADDING : PHONE_ROW_PADDING);
    const margin = roomy ? 16 : 6;
    // Only the ornaments you've chosen to show
    const allowed = DECORATION_TYPES.filter((t) => !decorSettings.hidden.includes(t));
    const slim = SLIM_DECORATIONS.filter((t) => allowed.includes(t));
    const pool = roomy ? allowed : slim.length > 0 ? slim : allowed;
    const tallPool = (roomy ? TALL : SLIM_TALL).filter((t) => allowed.includes(t));
    const hasDecor = pool.length > 0;
    const decoFor = (r: number, seed: number) => pick(pool, r, seed);
    // Finished book nooks take the ornament's place on every other shelf,
    // newest first, so the latest one is on the shelf you see when you arrive
    const shownNooks = decorSettings.nooks ? [...nooks].reverse() : [];
    const nookSize = roomy ? NOOK_SIZE : PHONE_NOOK_SIZE;

    const chunks: ShelfBook[][] = [];
    for (let i = 0; i < visibleBooks.length; i += perShelf) {
      chunks.push(visibleBooks.slice(i, i + perShelf));
    }
    if (chunks.length === 0) chunks.push([]);

    // How wide one unit of book weight is on a typical full shelf
    const meanWeight =
      visibleBooks.reduce((sum, b) => sum + bookShape(b).weight, 0) / Math.max(1, visibleBooks.length) || 1;
    // Book height and ornament width grow together, so solve for both: the
    // tallest books that still leave a full shelf of them book-shaped (no
    // wider than height / ratio) beside an ornament scaled to the same height
    const ratio = roomy ? 6.2 : 8;
    const basis: DecorationType = roomy ? "candles" : "cat";
    const ornament = hasDecor ? DECORATION_SIZE[pool.includes(basis) ? basis : pool[0]].w / DECO_REF : 0;
    const free = available - (hasDecor ? margin : 0) - perShelf * BOOK_GAP;
    const H = Math.round(Math.min(maxHeight, (ratio * free) / (perShelf * meanWeight + ratio * ornament)));
    const typicalUnit = (free - ornament * H) / (perShelf * meanWeight);

    const layouts = new Map<number, BookLayout>();
    const rows: Row[] = chunks.map((chunk, r) => {
      const seed = hashString(`shelf-${r}-${chunk[0]?.id ?? "empty"}`);
      const extra =
        decorSettings.lights && decorSettings.ivy
          ? r % 2 === 0
            ? "lights"
            : "ivy"
          : decorSettings.lights
            ? "lights"
            : decorSettings.ivy
              ? "ivy"
              : null;
      // Every other shelf gets vines draping over its front edge
      const vines = decorSettings.vines && r % 2 === 0 ? (r % 4 === 0 ? "right" : "left") : null;
      const decos: Extract<Item, { kind: "deco" }>[] = [];
      const addDeco = (type: DecorationType, key: string, nook?: NookId) => {
        const size = nook ? nookSize : DECORATION_SIZE[type];
        decos.push({
          kind: "deco",
          key,
          type,
          nook,
          seed: seed + decos.length,
          width: Math.round((size.w * H) / DECO_REF) + margin,
          margin,
          height: Math.round((size.h * H) / DECO_REF),
        });
      };
      const nook = r % 2 === 0 ? shownNooks[r / 2] : undefined;
      if (nook) addDeco("frame", `nook-${r}`, nook);
      else if (hasDecor) addDeco(decoFor(r, seed), `deco-${r}`);

      const decoSpace = decos.reduce((sum, d) => sum + d.width, 0);
      const shapes = chunk.map(bookShape);
      const totalWeight = shapes.reduce((sum, s) => sum + s.weight, 0);
      const space = available - decoSpace - chunk.length * BOOK_GAP;
      // A full shelf is packed edge to edge; a short one keeps the usual sizes
      const unit =
        chunk.length === perShelf
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

      if (chunk.length < perShelf) {
        let used = bookItems.reduce((sum, b) => sum + b.width, 0) + decoSpace;
        // Fill the gap on a short shelf with a few more ornaments
        for (let k = 1; k <= 3; k++) {
          const type = k === 1 && tallPool.length > 0 ? pick(tallPool, r, seed) : hasDecor ? decoFor(r + k * 2, seed + k) : null;
          if (!type) continue;
          const w = decoWidth(type, H) + margin;
          if (available - used < w + 40 || decos.some((d) => !d.nook && d.type === type)) continue;
          addDeco(type, `deco-${r}-${k}`);
          used += w;
        }
        // Spread the ornaments evenly through the free space. One only stands
        // between the books when that leaves at least 3 books on each side
        if (bookItems.length > 0) decos.forEach((d) => (d.push = true));
        const items: Item[] =
          bookItems.length >= 6 && decos.length >= 2
            ? [
                ...bookItems.slice(0, Math.ceil(bookItems.length / 2)),
                decos[0],
                ...bookItems.slice(Math.ceil(bookItems.length / 2)),
                ...decos.slice(1),
              ]
            : [...bookItems, ...decos];
        return { key: `shelf-${r}`, items, extra, ivySide: "left", vines };
      }

      // On a full shelf the ornament follows a set pattern so neighbouring
      // shelves never look alike: between the books on the first shelf and
      // every other one after it, and at the right or left end in between.
      // Ivy hangs on the other side. Between books it keeps at least 3 on
      // each side (3 to 7 of 10, or 3 to 4 of 7 on a phone)
      const spot = (["between", "right", "between", "left"] as const)[r % 4];
      if (spot === "between") {
        const side = perShelf >= 7 ? 3 : 2;
        const choices = perShelf - 2 * side + 1;
        // Move along the shelf from one "between" shelf to the next
        const at = side + (((seed >> 3) + r) % choices);
        return {
          key: `shelf-${r}`,
          items: [...bookItems.slice(0, at), ...decos, ...bookItems.slice(at)],
          extra,
          ivySide: at < perShelf / 2 ? "right" : "left",
          vines,
        };
      }
      const decoRight = spot === "right";
      return {
        key: `shelf-${r}`,
        items: decoRight ? [...bookItems, ...decos] : [...decos, ...bookItems],
        extra,
        ivySide: decoRight ? "left" : "right",
        vines,
      };
    });

    // Less empty space above the books on a phone
    return { rows, layouts, bayHeight: H + (roomy ? HEADROOM : 44) };
  }, [visibleBooks, width, maxHeight, decorSettings, phone, nooks]);

  const shelfCount = shelf?.rows.length ?? 1;
  const current = Math.min(shelfIndex, shelfCount - 1);
  const pitch = shelf ? shelf.bayHeight + BOARD : 0;
  const go = (delta: number) => setShelfIndex(Math.max(0, Math.min(shelfCount - 1, current + delta)));

  const openBook = open ? books.find((b) => b.id === open.id) ?? null : null;

  const startDrag = (book: ShelfBook, row: Row, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rowEl = e.currentTarget.parentElement;
    const rowIds = row.items.flatMap((item) => (item.kind === "book" ? [item.book.id] : []));
    const mids = rowIds
      .filter((id) => id !== book.id)
      .map((id) => {
        const rect = rowEl?.querySelector(`[data-book-id="${id}"]`)?.getBoundingClientRect();
        return rect ? rect.left + rect.width / 2 : 0;
      });
    const next: DragState = {
      id: book.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      dx: 0,
      rowIds,
      mids,
      target: rowIds.indexOf(book.id),
      nav: 0,
    };
    dragRef.current = next;
    setDrag(next);
  };

  const dragId = drag?.id ?? null;
  useEffect(() => {
    if (dragId === null) return;

    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      const over = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-nav]");
      const next: DragState = {
        ...d,
        dx: e.clientX - d.startX,
        target: d.mids.filter((m) => m < e.clientX).length,
        nav: over ? (Number(over.getAttribute("data-nav")) as -1 | 1) : 0,
      };
      dragRef.current = next;
      setDrag(next);
    };

    const end = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      dragRef.current = null;
      setDrag(null);
      if (e.type === "pointercancel" || (d.nav === 0 && Math.abs(d.dx) < 6)) return;

      // Put the book back into the full order next to its new neighbour
      const rest = d.rowIds.filter((id) => id !== d.id);
      if (rest.length === 0) return;
      const list = visibleBooks.map((b) => b.id).filter((id) => id !== d.id);
      const before = (id: number) => list.splice(list.indexOf(id), 0, d.id);
      const after = (id: number) => list.splice(list.indexOf(id) + 1, 0, d.id);
      if (d.nav === -1) before(rest[0]); // last book on the shelf above
      else if (d.nav === 1) after(rest[rest.length - 1]); // first book on the shelf below
      else if (d.target < rest.length) before(rest[d.target]);
      else after(rest[rest.length - 1]);

      setOrder(list);
      saveShelfOrder(list);
      if (d.nav !== 0) setShelfIndex((i) => Math.max(0, i + d.nav));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [dragId, visibleBooks]);

  // Where the drop marker shows while dragging
  const dropFor = (id: number): "before" | "after" | null => {
    if (!drag || drag.nav !== 0 || id === drag.id) return null;
    const rest = drag.rowIds.filter((r) => r !== drag.id);
    const i = rest.indexOf(id);
    if (i === drag.target) return "before";
    if (drag.target === rest.length && i === rest.length - 1) return "after";
    return null;
  };

  const changeDecor = (next: ShelfDecorSettings) => {
    setDecorSettings(next);
    saveShelfDecor(next);
  };

  const toggleArrange = () => {
    if (arranging) {
      setArranging(false);
      return;
    }
    setFilter("all");
    setSort("mine");
    setShelfIndex(0);
    setOpen(null);
    setArranging(true);
  };

  if (!mounted) {
    return <div style={{ height: "60vh", borderRadius: "14px", backgroundColor: "var(--surface)" }} />;
  }

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "read", label: "Read" },
    { id: "reading", label: "Reading" },
    { id: "tbr", label: "TBR" },
    { id: "fav", label: "♥ Favourites" },
  ];

  const activeTool: React.CSSProperties = {
    backgroundColor: "var(--primary)",
    border: "1px solid var(--primary)",
    color: "var(--on-primary)",
  };

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
                  setArranging(false);
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

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {canEdit && (
            <>
              <button
                type="button"
                onClick={toggleArrange}
                aria-pressed={arranging}
                style={{ ...selectStyle, display: "inline-flex", alignItems: "center", gap: "6px", ...(arranging ? activeTool : {}) }}
              >
                <Move size={15} /> Arrange
              </button>
              <button
                type="button"
                onClick={() => setShowDecor((v) => !v)}
                aria-pressed={showDecor}
                style={{ ...selectStyle, display: "inline-flex", alignItems: "center", gap: "6px", ...(showDecor ? activeTool : {}) }}
              >
                <Palette size={15} /> Decorations
              </button>
            </>
          )}
          <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-faint)", fontSize: "12px" }}>
            Sort
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as Sort);
                setShelfIndex(0);
                setArranging(false);
              }}
              style={selectStyle}
            >
              <option value="mine">My order</option>
              <option value="shelf">By shelf</option>
              <option value="author">By author</option>
              <option value="colour">Rainbow 🌈</option>
            </select>
          </label>
        </div>
      </div>

      {showDecor && (
        <DecorPanel settings={decorSettings} hasNooks={nooks.length > 0} onChange={changeDecor} onClose={() => setShowDecor(false)} />
      )}

      {arranging && (
        <div
          role="status"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "18px",
            padding: "12px 16px",
            backgroundColor: "rgb(var(--primary-rgb) / 0.12)",
            border: "1px solid var(--primary)",
            borderRadius: "14px",
            color: "var(--text)",
            fontSize: "14px",
          }}
        >
          <span style={{ flex: 1, minWidth: "220px" }}>
            ✋ Drag books left or right to reorder them. To move one to another shelf, drop it on the ▲ ▼ arrows.
          </span>
          <button
            type="button"
            onClick={() => setArranging(false)}
            style={{
              padding: "7px 16px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "var(--on-primary)",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      )}

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
                  {row.extra === "lights" && <FairyLights seed={r * 5} />}
                  {row.extra === "ivy" && <HangingIvy side={row.ivySide} height={Math.round(shelf.bayHeight * 0.45)} />}
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
                          arrange={
                            arranging && r === current
                              ? {
                                  dragging: drag?.id === item.book.id,
                                  offset: drag?.id === item.book.id ? drag.dx : 0,
                                  drop: dropFor(item.book.id),
                                  onDragStart: (e) => startDrag(item.book, row, e),
                                }
                              : undefined
                          }
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
                          {item.nook ? <NookArt nook={item.nook} /> : <Decoration type={item.type} seed={item.seed} />}
                        </div>
                      )
                    )}
                  </div>
                  <div className={styles.board}>
                    {row.vines && <ShelfVines width={width} side={row.vines} seed={r * 7 + 3} />}
                  </div>
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
            data-nav="-1"
            data-over={drag?.nav === -1 || undefined}
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
            data-nav="1"
            data-over={drag?.nav === 1 || undefined}
          >
            <ChevronDown size={22} />
          </button>
        </div>
      </div>

      <p style={{ color: "var(--text-faint)", fontSize: "13px", textAlign: "center", marginTop: "18px" }}>
        {filter === "fav" && visibleBooks.length === 0
          ? "No favourites yet — open a book and tap ♡ Favourite to add it here."
          : books.length === 0
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
