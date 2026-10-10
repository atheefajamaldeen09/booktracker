"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { ShelfBook } from "@/lib/actions/bookshelf";
import { formatFinish } from "@/lib/finishDate";
import type { SpineColor } from "./spineColors";
import styles from "./OpenBook.module.css";

type Props = {
  book: ShelfBook;
  color: SpineColor;
  // Where the book sat on the shelf, so it can fly out from (and back to) there
  origin: DOMRect | null;
  shelfThickness: number;
  onClosed: () => void;
};

const DURATION = 2600;
const LEAVES = 3;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const FLIP_EASE = "cubic-bezier(0.45, 0.05, 0.35, 1)";
const SHELF_LABEL = { read: "Finished", reading: "Currently reading", tbr: "On your TBR" };
const EMPTY_NOTE = {
  read: "No notes yet — what stayed with you?",
  reading: "Happy reading. Your notes will live here.",
  tbr: "Still waiting for its turn on your nightstand.",
};

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : null;

export default function OpenBook({ book, color, origin, shelfThickness, onClosed }: Props) {
  const [size] = useState(() => {
    const width = Math.floor(Math.min(330, (window.innerWidth - 24) / 2, (window.innerHeight - 140) / 1.45));
    return { W: width, H: Math.round(width * 1.45) };
  });
  const { W, H } = size;
  // Spine thickness that matches the book on the shelf once scaled up
  const T = Math.round(Math.min(56, Math.max(14, origin ? (shelfThickness * H) / origin.height : 24)));

  const bookRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const animations = useRef<Animation[]>([]);
  const closing = useRef(false);

  // One shared timeline for every moving part, so closing is simply the
  // same animation played backwards (and faster)
  useLayoutEffect(() => {
    const bookEl = bookRef.current!;
    const dx = origin ? origin.left + origin.width / 2 - window.innerWidth / 2 : 0;
    const dy = origin ? origin.top + origin.height / 2 - window.innerHeight / 2 : 60;
    const s = origin ? origin.height / H : 0.5;
    const pose = (x: number, y: number, turn: number, scale: number, tilt = 0) =>
      `translate3d(${x}px, ${y}px, 0) rotateX(${tilt}deg) rotateY(${turn}deg) scale(${scale})`;

    const timing = { duration: DURATION, fill: "both" as const };
    const anims = [
      backdropRef.current!.animate(
        [{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1 }],
        timing
      ),
      // Fly out spine-first, turn to show the cover, then slide over as it opens
      bookEl.animate(
        [
          { transform: pose(dx + (T * s) / 2, dy, 90, s), easing: EASE },
          { transform: pose(-W / 2, 0, 0, 1), offset: 0.3 },
          { transform: pose(-W / 2, 0, 0, 1), offset: 0.36, easing: FLIP_EASE },
          { transform: pose(0, 0, 0, 1, 4), offset: 0.62 },
          { transform: pose(0, 0, 0, 1, 4) },
        ],
        timing
      ),
      coverRef.current!.animate(
        [
          { transform: "rotateY(0deg)" },
          { transform: "rotateY(0deg)", offset: 0.36, easing: FLIP_EASE },
          { transform: "rotateY(-180deg)", offset: 0.62 },
          { transform: "rotateY(-180deg)" },
        ],
        timing
      ),
      // A few pages riffle over before settling on the spread
      ...leafRefs.current.map((leaf, i) => {
        const start = 0.5 + i * 0.08;
        return leaf!.animate(
          [
            { transform: `translateZ(${-(i + 1)}px) rotateY(0deg)` },
            { transform: `translateZ(${-(i + 1)}px) rotateY(0deg)`, offset: start, easing: FLIP_EASE },
            { transform: `translateZ(${i + 1}px) rotateY(-180deg)`, offset: start + 0.22 },
            { transform: `translateZ(${i + 1}px) rotateY(-180deg)` },
          ],
          timing
        );
      }),
    ];
    animations.current = anims;
    anims[1].finished.then(() => closeRef.current?.focus({ preventScroll: true })).catch(() => {});

    return () => anims.forEach((a) => a.cancel());
  }, [origin, W, H, T]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const anims = animations.current;
    anims.forEach((a) => {
      a.playbackRate = 1.7;
      a.reverse();
    });
    Promise.all(anims.map((a) => a.finished)).then(onClosed, onClosed);
  }, [onClosed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const vars = {
    "--W": `${W}px`,
    "--H": `${H}px`,
    "--T": `${T}px`,
    "--u": W / 330,
    "--spine": color.spine,
    "--spine-dark": color.dark,
    "--spine-ink": color.text,
  } as CSSProperties;

  const progress =
    book.shelf === "reading" && book.pageCount
      ? Math.min(100, Math.round(((book.currentPage ?? 0) / book.pageCount) * 100))
      : null;
  const genres = Array.from(new Set(book.genres ?? [])).slice(0, 3);
  const finished = formatFinish(book.dateCompleted, book.dateCompletedPrecision);
  const started = formatDate(book.dateStarted);
  const added = formatDate(book.dateAdded);

  return (
    <div className={styles.overlay} style={vars} role="dialog" aria-modal="true" aria-label={book.title}>
      <div ref={backdropRef} className={styles.backdrop} onClick={close} />

      <div className={styles.stage}>
        <div ref={bookRef} className={styles.book}>
          {/* Right-hand page, revealed once everything has turned */}
          <div className={`${styles.page} ${styles.rightPage}`}>
            <div className={styles.pageInner}>
              {book.review ? (
                <>
                  <p className={styles.kicker}>Your notes</p>
                  <blockquote className={styles.review}>{book.review}</blockquote>
                </>
              ) : (
                <>
                  <p className={styles.kicker}>At a glance</p>
                  <p className={styles.emptyNote}>{EMPTY_NOTE[book.shelf]}</p>
                </>
              )}

              <dl className={styles.facts}>
                {book.pageCount ? (
                  <>
                    <dt>Pages</dt>
                    <dd>{book.pageCount}</dd>
                  </>
                ) : null}
                {book.publicationYear ? (
                  <>
                    <dt>Published</dt>
                    <dd>{book.publicationYear}</dd>
                  </>
                ) : null}
                {book.shelf === "read" && finished && (
                  <>
                    <dt>Finished</dt>
                    <dd>{finished}</dd>
                  </>
                )}
                {book.shelf === "reading" && started && (
                  <>
                    <dt>Started</dt>
                    <dd>{started}</dd>
                  </>
                )}
                {book.shelf === "tbr" && added && (
                  <>
                    <dt>Waiting since</dt>
                    <dd>{added}</dd>
                  </>
                )}
              </dl>

              {progress !== null && (
                <div className={styles.progress}>
                  <div className={styles.progressTrack}>
                    <div style={{ width: `${progress}%` }} />
                  </div>
                  <span>
                    Page {book.currentPage ?? 0} of {book.pageCount} · {progress}%
                  </span>
                </div>
              )}

              <div className={styles.actions}>
                <Link href={`/book/${book.id}`} className={styles.primaryAction}>
                  Open book →
                </Link>
                <button ref={closeRef} onClick={close} className={styles.secondaryAction}>
                  Back to shelf
                </button>
              </div>
              <span className={styles.folio}>— ii —</span>
            </div>
          </div>

          {/* Page block edge */}
          <div className={styles.pageEdge} />

          {/* Leaves that flip; the last one carries the left-hand page */}
          {Array.from({ length: LEAVES }, (_, i) => (
            <div
              key={i}
              ref={(el) => {
                leafRefs.current[i] = el;
              }}
              className={styles.leaf}
            >
              <div className={`${styles.face} ${styles.page} ${styles.leafFront}`} />
              <div className={`${styles.face} ${styles.page} ${styles.leafBack}`}>
                {i === LEAVES - 1 && (
                  <div className={styles.pageInner}>
                    <p className={styles.kicker}>{SHELF_LABEL[book.shelf]}</p>
                    <h2 className={styles.title}>{book.title}</h2>
                    <p className={styles.byline}>by {book.author}</p>
                    <span className={styles.ornament} aria-hidden>
                      ❦
                    </span>
                    {book.rating !== null && book.rating > 0 && (
                      <p className={styles.stars} aria-label={`${book.rating} out of 5 stars`}>
                        {"★".repeat(Math.floor(book.rating))}
                        {book.rating % 1 ? "½" : ""}
                      </p>
                    )}
                    {genres.length > 0 && (
                      <div className={styles.genres}>
                        {genres.map((g) => (
                          <span key={g}>{g}</span>
                        ))}
                      </div>
                    )}
                    <span className={styles.folio}>— i —</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Front cover, hinged on the spine */}
          <div ref={coverRef} className={styles.cover}>
            <div
              className={`${styles.face} ${styles.coverFront}`}
              style={book.cover ? { backgroundImage: `url("${book.cover.replace(/"/g, "%22")}")` } : undefined}
            >
              {!book.cover && (
                <div className={styles.plainCover}>
                  <span>{book.title}</span>
                  <small>{book.author}</small>
                </div>
              )}
            </div>
            <div className={`${styles.face} ${styles.endpaper}`} />
          </div>

          {/* Spine — what you first see as it leaves the shelf */}
          <div className={styles.spine} />
        </div>
      </div>
    </div>
  );
}
