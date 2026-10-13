"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { REACTIONS, reactionInk, type ReactionId } from "@/lib/reactions";
import { updateBookReactions } from "@/lib/actions/books";
import { useCanEdit } from "@/components/Viewer";
import StampArt from "./StampArt";
import styles from "./Stamps.module.css";

// Each print sits a little crooked, always the same way for the same stamp
const tilt = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return (Math.abs(hash) % 13) - 6;
};

// Stamp a book with how it left you. Tap a stamp in the box to press it onto
// the page, tap it again to lift it off; it saves straight away.
export default function ReactionStamps({ bookId, initial }: { bookId: number; initial: string[] }) {
  const canEdit = useCanEdit();
  const [stamped, setStamped] = useState(initial);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();
  // The stamp that was just pressed, so it can thump onto the page
  const [fresh, setFresh] = useState<string | null>(null);
  const printRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!fresh) return;
    const r = tilt(fresh);
    printRefs.current[fresh]?.animate(
      [
        { transform: `rotate(${r + 8}deg) scale(1.9)`, opacity: 0 },
        { transform: `rotate(${r}deg) scale(0.9)`, opacity: 1, offset: 0.55 },
        { transform: `rotate(${r}deg) scale(1.04)`, offset: 0.8 },
        { transform: `rotate(${r}deg) scale(1)` },
      ],
      { duration: 380, easing: "cubic-bezier(0.3, 0, 0.3, 1)" }
    );
  }, [fresh]);

  const toggle = (id: ReactionId) => {
    const adding = !stamped.includes(id);
    const next = adding ? [...stamped, id] : stamped.filter((s) => s !== id);
    setStamped(next);
    setFresh(adding ? id : null);
    setError(false);
    startTransition(async () => {
      const result = await updateBookReactions(bookId, next);
      if (!result.success) {
        setStamped(stamped);
        setError(true);
      }
    });
  };

  const prints = REACTIONS.filter((r) => stamped.includes(r.id));
  if (!canEdit && prints.length === 0) return null;

  return (
    <section className={styles.wrap}>
      <div className={styles.head}>
        <p className={styles.label}>
          Reaction stamps
          {canEdit && <span> — how did it leave you?</span>}
        </p>
        {canEdit && (
          <button type="button" className={styles.toggle} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? "Close the stamp box" : "Open the stamp box"}
          </button>
        )}
      </div>

      {prints.length === 0 ? (
        <p className={styles.none}>No stamps yet. Open the box and press a few on.</p>
      ) : (
        <div className={styles.prints}>
          {prints.map((r) => (
            <figure key={r.id} className={styles.print}>
              <span
                ref={(el) => {
                  printRefs.current[r.id] = el;
                }}
                className={styles.impression}
                style={{ color: reactionInk(r.id), transform: `rotate(${tilt(r.id)}deg)` }}
              >
                <StampArt id={r.id} />
              </span>
              <figcaption className={styles.caption}>{r.label}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {canEdit && open && (
        <div className={styles.box}>
          <p className={styles.boxTitle}>tap a stamp to press it on</p>
          <div className={styles.grid}>
            {REACTIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={styles.block}
                aria-pressed={stamped.includes(r.id)}
                onClick={() => toggle(r.id)}
              >
                <span className={styles.face}>
                  <StampArt id={r.id} />
                </span>
                <span className={styles.blockLabel}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className={styles.error}>Couldn&apos;t save that — try again.</p>}
    </section>
  );
}
