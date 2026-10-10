"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, X } from "lucide-react";
import { dealBingoCard, stampBingoSquare } from "@/lib/actions/bingo";
import { BINGO_LINES, FREE, completedLines, isStamped, promptById, type BingoBook, type BingoCard as Card } from "@/lib/bingo";
import { useCanEdit } from "@/components/Viewer";
import BookCover from "@/components/BookCover";
import styles from "./BingoCard.module.css";

const LETTERS = ["B", "I", "N", "G", "O"];
const INKS = ["#c8674f", "#7d97b3", "#8fa58a", "#9a6a8a", "#d9a441"];

// Each stamp lands a little crooked, the same way every visit
const tilt = (id: string) => {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return (Math.abs(hash) % 25) - 12;
};

export default function BingoCard({ card, books }: { card: Card | null; books: BingoBook[] }) {
  const canEdit = useCanEdit();
  const router = useRouter();
  const [stamps, setStamps] = useState(card?.stamps ?? {});
  // The square you're choosing a book for
  const [picking, setPicking] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The square to press the stamp onto once it's on the page
  const [fresh, setFresh] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Web Animations rather than CSS, so the stamp thumps down even with
  // reduced motion switched on in the system settings
  useEffect(() => {
    if (!fresh) return;
    gridRef.current?.querySelector(`[data-stamp="${fresh}"]`)?.animate(
      [
        { transform: "scale(2.4) rotate(-30deg)", opacity: 0 },
        { transform: "scale(0.9) rotate(0deg)", opacity: 1, offset: 0.6 },
        { transform: "scale(1.06) rotate(0deg)", opacity: 1, offset: 0.8 },
        { transform: "scale(1) rotate(0deg)", opacity: 1 },
      ],
      { duration: 480, easing: "cubic-bezier(.3,1.3,.5,1)" }
    );
  }, [fresh]);

  const deal = async () => {
    setDealing(true);
    setError(null);
    const result = await dealBingoCard();
    setDealing(false);
    setConfirmReset(false);
    if (!result.success) return setError(result.error ?? "Couldn't deal a new card");
    router.refresh();
  };

  if (!card) {
    return (
      <div className={styles.wrap}>
        <div className={styles.paper} style={{ textAlign: "center", padding: "48px 24px" }}>
          <span className={styles.tape} style={{ "--tape": "#e3a3a0" } as CSSProperties} />
          <p className={styles.title}>Reading Bingo</p>
          <p className={styles.sub}>
            25 little reading prompts on a card. Finish a book, stamp a square, and try for five in a row.
          </p>
          {canEdit ? (
            <button className={styles.primary} onClick={deal} disabled={dealing}>
              {dealing ? "Shuffling…" : "Deal my first card"}
            </button>
          ) : (
            <p className={styles.sub}>No card has been dealt yet.</p>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  const live: Card = { ...card, stamps };
  const bookById = new Map(books.map((b) => [b.id, b]));
  const lines = completedLines(live);
  const inLine = new Set(lines.flat());
  const stampedCount = card.squares.filter((_, i) => isStamped(live, i)).length;
  const full = stampedCount === card.squares.length;
  const usedBooks = new Set(Object.values(stamps));

  const stamp = async (promptId: string, bookId: number | null) => {
    const before = stamps;
    const next = { ...stamps };
    if (bookId === null) delete next[promptId];
    else {
      for (const [other, id] of Object.entries(next)) if (id === bookId) delete next[other];
      next[promptId] = bookId;
    }
    setStamps(next);
    setPicking(null);
    setError(null);
    setFresh(bookId === null ? null : promptId);
    const result = await stampBingoSquare(promptId, bookId);
    if (!result.success) {
      setStamps(before);
      setError(result.error ?? "Couldn't save that stamp");
    }
  };

  // How close each unfinished line is, to cheer you on
  const closest = Math.max(
    0,
    ...BINGO_LINES.filter((l) => !l.every((i) => isStamped(live, i))).map((l) => l.filter((i) => isStamped(live, i)).length)
  );

  const pickingPrompt = picking ? promptById(picking) : null;
  const fits = pickingPrompt?.fits;
  const suggested = fits ? books.filter((b) => fits(b)) : [];
  const others = books.filter((b) => !suggested.includes(b));

  const bookRow = (b: BingoBook) => {
    const usedOn = Object.entries(stamps).find(([, id]) => id === b.id)?.[0];
    return (
      <button key={b.id} className={styles.bookRow} onClick={() => stamp(picking!, b.id)}>
        <BookCover cover={b.cover} title={b.title} author={b.author} size="sm" />
        <span style={{ minWidth: 0 }}>
          <span className={styles.bookTitle}>{b.title}</span>
          <span className={styles.bookAuthor}>{b.author}</span>
          {usedOn && usedOn !== picking && (
            <span className={styles.bookNote}>Stamped on “{promptById(usedOn)?.text}”. Choosing it here moves the stamp.</span>
          )}
        </span>
      </button>
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.paper}>
        <span className={styles.tape} style={{ "--tape": "#e3a3a0" } as CSSProperties} />
        <p className={styles.title}>Reading Bingo</p>
        <p className={styles.sub}>
          Card no. {card.round} · {stampedCount} of 25 stamped
          {lines.length > 0 && ` · ${lines.length} ${lines.length === 1 ? "bingo" : "bingos"}!`}
        </p>

        {full ? (
          <p className={styles.cheer}>🎉 Full house! Every square is stamped.</p>
        ) : lines.length > 0 ? (
          <p className={styles.cheer}>✨ Bingo! Keep going for a full house.</p>
        ) : closest >= 3 ? (
          <p className={styles.cheer}>So close: {5 - closest} more for your first bingo.</p>
        ) : null}

        <div className={styles.letters} aria-hidden>
          {LETTERS.map((l, i) => (
            <span key={l} style={{ color: INKS[i] }}>
              {l}
            </span>
          ))}
        </div>

        <div className={styles.grid} ref={gridRef}>
          {card.squares.map((id, i) => {
            if (id === FREE) {
              return (
                <div key={id} className={`${styles.square} ${styles.free} ${inLine.has(i) ? styles.won : ""}`}>
                  <span className={styles.emoji}>💛</span>
                  <span className={styles.prompt}>Free space</span>
                </div>
              );
            }
            const prompt = promptById(id);
            const book = stamps[id] !== undefined ? bookById.get(stamps[id]) : undefined;
            const ready = !book && !!prompt?.fits && books.some((b) => !usedBooks.has(b.id) && prompt.fits!(b));
            return (
              <button
                key={id}
                className={`${styles.square} ${inLine.has(i) ? styles.won : ""} ${ready ? styles.ready : ""}`}
                onClick={() => canEdit && setPicking(id)}
                disabled={!canEdit}
                aria-label={`${prompt?.text}${book ? `, stamped with ${book.title}` : ""}`}
              >
                <span className={styles.emoji}>{prompt?.emoji}</span>
                <span className={styles.prompt}>{prompt?.text}</span>
                {book && (
                  <span
                    className={styles.stamp}
                    data-stamp={id}
                    style={{ color: INKS[i % INKS.length], rotate: `${tilt(id)}deg` }}
                    title={book.title}
                  >
                    <span className={styles.stampWord}>READ</span>
                    <span className={styles.stampBook}>{book.title}</span>
                  </span>
                )}
                {ready && <span className={styles.readyDot} title="A book you finished fits this square" />}
              </button>
            );
          })}
        </div>

        <p className={styles.hint}>
          {canEdit
            ? books.length === 0
              ? "Finish a book and come back to stamp your first square. Books finished before this card was dealt don't count."
              : "Tap a square to stamp it with a book you've finished. Each book stamps one square."
            : "Stamped with books finished since this card was dealt."}
        </p>
        {error && <p className={styles.error}>{error}</p>}
      </div>

      {canEdit && (
        <div className={styles.reset}>
          {confirmReset ? (
            <>
              <span>Deal a new card? The stamps on this one will be cleared.</span>
              <button className={styles.primary} onClick={deal} disabled={dealing}>
                {dealing ? "Shuffling…" : "Yes, new card"}
              </button>
              <button className={styles.plain} onClick={() => setConfirmReset(false)}>
                Keep this one
              </button>
            </>
          ) : (
            <button className={styles.plain} onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} /> Deal a new card
            </button>
          )}
        </div>
      )}

      {pickingPrompt && (
        <div className={styles.backdrop} onClick={() => setPicking(null)}>
          <div className={styles.sheet} role="dialog" aria-label={pickingPrompt.text} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHead}>
              <div>
                <p className={styles.sheetTitle}>
                  {pickingPrompt.emoji} {pickingPrompt.text}
                </p>
                <p className={styles.sheetSub}>Which book earns this stamp?</p>
              </div>
              <button className={styles.close} onClick={() => setPicking(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {stamps[picking!] !== undefined && (
              <button className={styles.plain} style={{ marginBottom: "12px" }} onClick={() => stamp(picking!, null)}>
                Remove this stamp
              </button>
            )}

            {books.length === 0 ? (
              <p className={styles.sheetEmpty}>
                No books finished since this card was dealt. Mark one as read and it will show up here.
              </p>
            ) : (
              <div className={styles.bookList}>
                {suggested.length > 0 && <p className={styles.group}>Looks like a match</p>}
                {suggested.map(bookRow)}
                {others.length > 0 && (
                  <p className={styles.group}>{pickingPrompt.fits ? "Or use another book (your call)" : "Books you've finished"}</p>
                )}
                {others.map(bookRow)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
