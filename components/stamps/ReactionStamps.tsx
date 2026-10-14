"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { REACTIONS, STAMP_BOXES, reactionInk, type ReactionId } from "@/lib/reactions";
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

// A wavy-edged sticker outline: n bumps around an ellipse
const scallop = (cx: number, cy: number, rx: number, ry: number, n: number) => {
  const at = (a: number, k: number) => `${(cx + rx * k * Math.cos(a)).toFixed(1)} ${(cy + ry * k * Math.sin(a)).toFixed(1)}`;
  let d = `M${at(0, 1)}`;
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * Math.PI * 2;
    const b = ((i + 1) / n) * Math.PI * 2;
    d += ` Q${at(a, 1.1)} ${at(b, 1)}`;
  }
  return `${d} Z`;
};

// The label stuck on the lid, like a little thank-you sticker on a parcel
function Sticker({ title, sub, wide = false }: { title: string; sub: string; wide?: boolean }) {
  const clip = useId();
  const w = wide ? 300 : 200;
  const h = wide ? 92 : 150;
  const outline = scallop(w / 2, h / 2, w / 2 - 9, h / 2 - 9, wide ? 22 : 16);
  return (
    <span className={wide ? `${styles.sticker} ${styles.stickerWide}` : styles.sticker}>
      <svg viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
        <path d={outline} className={styles.stickerPaper} />
        <g clipPath={`url(#${clip})`}>
          <circle cx={w * 0.08} cy={h * 0.18} r={h * 0.26} className={styles.blobA} />
          <circle cx={w * 0.95} cy={h * 0.95} r={h * 0.3} className={styles.blobB} />
          <circle cx={w * 0.12} cy={h * 1.02} r={h * 0.22} className={styles.blobC} />
        </g>
        <path d={outline} className={styles.stickerEdge} />
      </svg>
      <span className={styles.stickerText}>
        <strong>{title}</strong>
        <small>{sub}</small>
      </span>
      {!wide && (
        <>
          <span className={`${styles.stickerDoodle} ${styles.doodleA}`}>
            <StampArt id="cosy" />
          </span>
          <span className={`${styles.stickerDoodle} ${styles.doodleB}`}>
            <StampArt id="swooned" />
          </span>
        </>
      )}
    </span>
  );
}

// Stamp a book with how it left you. The stamps live in a kraft box on the
// page; tap it and it opens up in front of everything else, a tray of little
// compartments you scroll through. Tap a stamp to press it on, again to lift it.
export default function ReactionStamps({ bookId, initial }: { bookId: number; initial: string[] }) {
  const canEdit = useCanEdit();
  const [stamped, setStamped] = useState(initial);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();
  // The stamp that was just pressed, so it can thump onto the page
  const [fresh, setFresh] = useState<string | null>(null);
  const printRefs = useRef<Record<string, HTMLElement | null>>({});
  const faceRefs = useRef<Record<string, HTMLElement | null>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);

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

  // Open the box: it rises up, the lid swings back and the tray slides into view.
  // Web Animations rather than CSS transitions, so it plays everywhere.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    doneRef.current?.focus();
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    boxRef.current?.animate(
      [
        { transform: "translateY(40px) scale(0.86)", opacity: 0 },
        { transform: "translateY(0) scale(1)", opacity: 1 },
      ],
      { duration: 320, easing: "cubic-bezier(0.2, 0.9, 0.3, 1.15)" }
    );
    lidRef.current?.animate(
      [
        { transform: "rotateX(-88deg)" },
        { transform: "rotateX(-88deg)", offset: 0.3 },
        { transform: "rotateX(10deg)", offset: 0.8 },
        { transform: "rotateX(0deg)" },
      ],
      { duration: 650, easing: "ease-out" }
    );
    trayRef.current?.animate(
      [
        { transform: "translateY(24px)", opacity: 0 },
        { transform: "translateY(24px)", opacity: 0, offset: 0.45 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      { duration: 650, easing: "ease-out" }
    );
    return () => {
      root.style.overflow = before;
    };
  }, [open]);

  const close = () => {
    const dialog = dialogRef.current;
    const anim = boxRef.current?.animate(
      [
        { transform: "translateY(0) scale(1)", opacity: 1 },
        { transform: "translateY(30px) scale(0.9)", opacity: 0 },
      ],
      { duration: 180, easing: "ease-in", fill: "forwards" }
    );
    let shut = false;
    const done = () => {
      if (shut) return;
      shut = true;
      dialog?.close();
      anim?.cancel();
      setOpen(false);
    };
    // onfinish never fires in a background tab, so don't wait on it for long
    if (anim) anim.onfinish = done;
    setTimeout(done, anim ? 220 : 0);
  };

  const toggle = (id: ReactionId) => {
    const adding = !stamped.includes(id);
    const next = adding ? [...stamped, id] : stamped.filter((s) => s !== id);
    setStamped(next);
    setFresh(adding ? id : null);
    setError(false);
    faceRefs.current[id]?.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(5px) scale(0.92)" }, { transform: "translateY(0)" }],
      { duration: 220, easing: "ease-out" }
    );
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
      <p className={styles.label}>
        Reaction stamps
        {canEdit && <span> — how did it leave you?</span>}
      </p>

      {prints.length > 0 && (
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

      {canEdit && (
        <button type="button" className={styles.closedBox} onClick={() => setOpen(true)} aria-haspopup="dialog">
          <span className={styles.flapL} aria-hidden />
          <span className={styles.flapR} aria-hidden />
          <Sticker title="stamp box" sub="tap to open ♡" />
          {prints.length > 0 && (
            <span className={styles.count} aria-label={`${prints.length} stamped`}>
              {prints.length}
            </span>
          )}
        </button>
      )}

      {canEdit && (
        <dialog
          ref={dialogRef}
          className={styles.dialog}
          aria-label="Stamp box"
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {open && (
            <div ref={boxRef} className={styles.openBox}>
              <div className={styles.lidWrap}>
                <div ref={lidRef} className={styles.lid}>
                  <span className={styles.lidFlapL} aria-hidden />
                  <span className={styles.lidFlapR} aria-hidden />
                  <Sticker
                    wide
                    title="reaction stamps"
                    sub={prints.length === 0 ? "tap one to press it on" : `${prints.length} pressed on this book`}
                  />
                </div>
              </div>

              <div className={styles.body}>
                <div ref={trayRef} className={styles.well}>
                  <div className={styles.scroll}>
                    {STAMP_BOXES.map((box) => (
                      <section key={box.id} className={styles.compartment}>
                        <h3 className={styles.compTitle}>{box.label}</h3>
                        <div className={styles.grid}>
                          {REACTIONS.filter((r) => r.box === box.id).map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              className={styles.block}
                              aria-pressed={stamped.includes(r.id)}
                              onClick={() => toggle(r.id)}
                            >
                              <span
                                ref={(el) => {
                                  faceRefs.current[r.id] = el;
                                }}
                                className={styles.face}
                                style={{ color: reactionInk(r.id) }}
                              >
                                <StampArt id={r.id} />
                              </span>
                              <span className={styles.blockLabel}>{r.label}</span>
                            </button>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
                <div className={styles.front}>
                  {error && <span className={styles.error}>Couldn&apos;t save that — try again.</span>}
                  <button ref={doneRef} type="button" className={styles.done} onClick={close}>
                    Close the box
                  </button>
                </div>
              </div>
            </div>
          )}
        </dialog>
      )}
      {error && !open && <p className={styles.error}>Couldn&apos;t save that — try again.</p>}
    </section>
  );
}
