"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { moodById } from "@/lib/moods";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  genres: string[] | null;
  pageCount: number | null;
  moods?: string[] | null;
  series?: { seriesId: number; seriesName: string; position: number } | null;
};

type Props = {
  books: Book[];
  onSelect: (book: Book) => void;
  // Changing this number wraps up a new book (used by the popup's "again" button)
  spinSignal?: number;
};

// A book in a brown paper envelope tied with twine, with only a few
// handwritten hints on the label. Untie the bow, lift the flap, and the book
// slides out to show who you've been set up with.
const W = 250;
const H = 350;
// How far down the flap's point reaches
const FLAP = 84;
const INK = "#3b2a22";
const NOTE_PAPER = "#f7f0e2";
const KRAFT = "#c9a27a";
const HAND = 'var(--font-hand), "Segoe Print", "Bradley Hand", cursive';

const KRAFT_PAPER =
  "repeating-linear-gradient(94deg, rgba(255,255,255,0.07) 0 2px, transparent 2px 7px), repeating-linear-gradient(4deg, rgba(90,50,20,0.06) 0 1px, transparent 1px 5px), linear-gradient(135deg, #d6b189, #b98f63)";

// The front of the envelope has a V cut out of the top, which the flap covers
const POCKET = `polygon(0 0, 50% ${FLAP}px, 100% 0, 100% 100%, 0 100%)`;

// Where the twine crosses, and the bow is tied
const KNOT_X = 210;
const KNOT_Y = 62;

// Hearts and sparkles that pop out around the book once it's out
const BURST: [number, number, string, string][] = [
  [-135, -120, "♥", "#e58aa0"],
  [130, -130, "✦", "#f2c14e"],
  [-160, 0, "✦", "#f2c14e"],
  [160, -10, "♥", "#e58aa0"],
  [-120, 140, "♥", "#f4a9b8"],
  [125, 150, "✦", "#f6d57a"],
  [0, -185, "♥", "#e58aa0"],
  [-60, -170, "✦", "#f6d57a"],
  [70, -175, "♥", "#f4a9b8"],
];

// Resolves when an animation ends — or after its duration anyway, because a
// hidden tab never reports animations as finished
function played(animation: Animation | undefined) {
  if (!animation) return Promise.resolve();
  const timing = animation.effect?.getTiming();
  const ms = (Number(timing?.duration) || 0) + (Number(timing?.delay) || 0);
  return Promise.race([
    animation.finished.catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, ms + 80)),
  ]);
}
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const pickOther = (books: Book[], not?: Book | null) => {
  const pool = books.length > 1 && not ? books.filter((b) => b.id !== not.id) : books;
  return pool[Math.floor(Math.random() * pool.length)];
};

// What the label gives away: the feel of the book, never its name
function hintsFor(book: Book) {
  const hints: string[] = [];
  const genres = Array.from(new Set(book.genres ?? [])).slice(0, 3);
  if (genres.length > 0) hints.push(genres.join(" · ").toLowerCase());

  const moods = (book.moods ?? []).map((m) => moodById(m)?.label.toLowerCase()).filter(Boolean).slice(0, 3);
  if (moods.length > 0) hints.push(`feels ${moods.join(", ")}`);

  if (book.pageCount) {
    const size =
      book.pageCount < 200
        ? "a quick little thing"
        : book.pageCount < 350
        ? "a comfy weekend read"
        : book.pageCount < 550
        ? "one to sink into"
        : "an absolute chonk";
    hints.push(`${size} (${book.pageCount} pages)`);
  }

  if (book.series) {
    hints.push(book.series.position === 1 ? "the start of a series" : `book ${book.series.position} of a series you're on`);
  } else {
    hints.push("stands all on its own");
  }

  if (genres.length === 0 && moods.length === 0) hints.unshift("a complete mystery");
  return hints;
}

// The front of the envelope, with white-pen doodles and the label taped on
function Front({ hints }: { hints: string[] }) {
  const pen = { stroke: "rgba(255,250,240,0.8)", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "6px",
        backgroundColor: KRAFT,
        backgroundImage: KRAFT_PAPER,
        boxShadow: "inset 0 0 0 1px rgba(59,42,34,0.35), inset 0 0 30px rgba(90,50,20,0.25)",
      }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden style={{ position: "absolute", inset: 0 }}>
        {/* the edge of the pocket, and the folds at the bottom */}
        <path d={`M0 0 L${W / 2} ${FLAP} L${W} 0`} stroke="rgba(59,42,34,0.4)" strokeWidth="1.5" fill="none" />
        <path d={`M0 ${H} L${W / 2} ${H - 110} L${W} ${H}`} stroke="rgba(90,50,20,0.16)" strokeWidth="1" fill="none" />
        {/* doodles in white pen */}
        <path d="M232 128 l1.5 4.5 l4.5 1.5 l-4.5 1.5 l-1.5 4.5 l-1.5 -4.5 l-4.5 -1.5 l4.5 -1.5 Z" {...pen} />
        <path d="M228 200 c-5 -7 -14 0 -7 7 l7 6 l7 -6 c7 -7 -2 -14 -7 -7 Z" {...pen} />
        <path d="M218 262 q7 -9 14 0 t14 0" {...pen} />
        <path d="M229 312 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" {...pen} />
      </svg>

      {/* the label */}
      <div
        style={{
          position: "absolute",
          left: "14px",
          right: "54px",
          top: "100px",
          padding: "16px 12px 14px",
          borderRadius: "3px",
          backgroundColor: NOTE_PAPER,
          boxShadow: "0 2px 6px rgba(60,30,10,0.35)",
          transform: "rotate(-2deg)",
          color: INK,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 2px", opacity: 0.6 }}>
          Blind date
        </p>
        <p style={{ fontFamily: HAND, fontSize: "27px", fontWeight: 700, lineHeight: 1, margin: "0 0 8px" }}>with a book</p>
        <div style={{ borderTop: `1.5px dashed rgba(59,42,34,0.35)`, margin: "0 6px 8px" }} />
        {hints.map((hint) => (
          <p key={hint} style={{ fontFamily: HAND, fontSize: "19px", lineHeight: 1.1, margin: "0 0 5px", overflowWrap: "anywhere" }}>
            ♡ {hint}
          </p>
        ))}
      </div>
    </div>
  );
}

// The flap that folds down over the top of the envelope
function Flap() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        backgroundColor: "#d2ac83",
        backgroundImage: KRAFT_PAPER,
      }}
    >
      <svg width={W} height={FLAP} viewBox={`0 0 ${W} ${FLAP}`} aria-hidden style={{ position: "absolute", inset: 0 }}>
        <path d={`M0 0 L${W / 2} ${FLAP} L${W} 0`} stroke="rgba(59,42,34,0.5)" strokeWidth="3" fill="none" />
        <path d={`M14 2 L${W / 2} ${FLAP - 10} L${W - 14} 2`} stroke="rgba(255,250,240,0.35)" strokeWidth="1.2" strokeDasharray="4 5" fill="none" />
      </svg>
    </div>
  );
}

// Baker's twine tied round the envelope, with a bow where it crosses.
// The parts are tagged so the bow can be pulled undone.
function Twine() {
  const cord = { fill: "none", strokeLinecap: "round" } as const;
  const strand = (d: string) => (
    <>
      <path d={d} stroke={INK} strokeOpacity="0.55" strokeWidth="5.4" {...cord} />
      <path d={d} stroke="#f6e9d8" strokeWidth="3.6" {...cord} />
      <path d={d} stroke="#b8483f" strokeWidth="3.6" strokeDasharray="3 5" fill="none" />
    </>
  );
  const atKnot: React.CSSProperties = { transformOrigin: `${KNOT_X}px ${KNOT_Y}px` };
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g data-twine="down">{strand(`M${KNOT_X} 0 L${KNOT_X} ${H}`)}</g>
      <g data-twine="across">{strand(`M0 ${KNOT_Y} L${W} ${KNOT_Y}`)}</g>
      <g data-twine="loop-left" style={atKnot}>
        {strand(`M${KNOT_X} ${KNOT_Y} C184 30 168 44 180 58 C188 66 200 64 ${KNOT_X} ${KNOT_Y}`)}
      </g>
      <g data-twine="loop-right" style={atKnot}>
        {strand(`M${KNOT_X} ${KNOT_Y} C236 30 252 44 240 58 C232 66 220 64 ${KNOT_X} ${KNOT_Y}`)}
      </g>
      <g data-twine="tail-left" style={atKnot}>{strand(`M${KNOT_X} ${KNOT_Y} C202 78 196 86 190 94`)}</g>
      <g data-twine="tail-right" style={atKnot}>{strand(`M${KNOT_X} ${KNOT_Y} C218 78 226 86 234 96`)}</g>
      <circle data-twine="knot" style={atKnot} cx={KNOT_X} cy={KNOT_Y} r="5.5" fill="#b8483f" stroke={INK} strokeOpacity="0.4" />
    </svg>
  );
}

function Cover({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false);
  const frame: React.CSSProperties = {
    position: "absolute",
    inset: "10px 14px",
    borderRadius: "6px",
    boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
  };
  if (book.cover && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={book.cover} alt={book.title} onError={() => setFailed(true)} style={{ ...frame, width: W - 28, height: H - 20, objectFit: "cover" }} />;
  }
  return (
    <div
      style={{
        ...frame,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "18px",
        textAlign: "center",
        backgroundColor: "var(--raised)",
        border: "1px solid var(--border)",
      }}
    >
      <span style={{ fontSize: "34px" }}>📖</span>
      <span style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 600, color: "var(--text)", lineHeight: 1.2, overflowWrap: "anywhere" }}>
        {book.title}
      </span>
      {book.author && <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{book.author}</span>}
    </div>
  );
}

export default function BlindDate({ books, onSelect, spinSignal = 0 }: Props) {
  const [current, setCurrent] = useState<Book>(() => pickOther(books));
  const [stage, setStage] = useState<"wrapped" | "opening" | "open">("wrapped");
  const [busy, setBusy] = useState(false);

  const parcelRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const twineRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const burstRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const hints = hintsFor(current);

  // Swap this envelope for a different one
  const another = async () => {
    const parcel = parcelRef.current;
    if (busy || !parcel) return;
    setBusy(true);
    await played(
      parcel.animate(
        [
          { transform: "translateX(0) rotate(0deg)", opacity: 1 },
          { transform: "translateX(-70px) rotate(-8deg)", opacity: 0 },
        ],
        { duration: 240, easing: "ease-in", fill: "forwards" }
      )
    );
    flushSync(() => {
      setCurrent((book) => pickOther(books, book));
      setStage("wrapped");
    });
    parcel.getAnimations().forEach((a) => a.cancel());
    await played(
      parcel.animate(
        [
          { transform: "translateX(70px) rotate(8deg)", opacity: 0 },
          { transform: "translateX(-6px) rotate(-1.5deg)", opacity: 1, offset: 0.7 },
          { transform: "translateX(0) rotate(0deg)", opacity: 1 },
        ],
        { duration: 380, easing: "ease-out" }
      )
    );
    setBusy(false);
  };

  const unwrap = async () => {
    const parcel = parcelRef.current;
    if (busy || !parcel || stage !== "wrapped") return;
    setBusy(true);

    // The book is slipped inside just before the envelope is opened
    flushSync(() => setStage("opening"));
    const twine = (part: string) => twineRef.current?.querySelector<SVGElement>(`[data-twine="${part}"]`) ?? undefined;

    // 1. Pull the tails: they stretch, and the loops of the bow slip through the knot
    const pull = { duration: 620, easing: "cubic-bezier(0.5, 0, 0.3, 1)", fill: "forwards" } as const;
    twine("tail-left")?.animate([{ transform: "scale(1)" }, { transform: "scale(1.7) rotate(8deg)" }], pull);
    twine("tail-right")?.animate([{ transform: "scale(1)" }, { transform: "scale(1.7) rotate(-8deg)" }], pull);
    twine("loop-left")?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.08)", offset: 0.15 }, { transform: "scale(0)" }],
      pull
    );
    twine("loop-right")?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.08)", offset: 0.3 }, { transform: "scale(0)" }],
      { ...pull, duration: 700 }
    );
    await played(
      twine("knot")?.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)", offset: 0.7 }, { transform: "scale(0)" }], {
        ...pull,
        duration: 760,
      })
    );

    // 2. With the knot gone the twine goes slack and slips off
    twine("across")?.animate(
      [
        { transform: "translate(0, 0)", opacity: 1 },
        { transform: "translate(-30px, 140px)", opacity: 0 },
      ],
      { duration: 520, easing: "ease-in", fill: "forwards" }
    );
    twine("down")?.animate(
      [
        { transform: "translate(0, 0)", opacity: 1 },
        { transform: "translate(70px, 60px)", opacity: 0 },
      ],
      { duration: 520, delay: 60, easing: "ease-in", fill: "forwards" }
    );
    await played(
      twineRef.current?.animate(
        [
          { transform: "translateY(0) rotate(0deg)", opacity: 1 },
          { transform: "translateY(110px) rotate(7deg)", opacity: 0 },
        ],
        { duration: 560, easing: "ease-in", fill: "forwards" }
      )
    );

    // 3. Lift the flap, like opening an envelope
    await played(
      flapRef.current?.animate(
        [
          { transform: "perspective(700px) rotateX(0deg)", filter: "brightness(1)" },
          { transform: "perspective(700px) rotateX(-95deg)", filter: "brightness(0.78)", offset: 0.5 },
          { transform: "perspective(700px) rotateX(-180deg)", filter: "brightness(0.9)" },
        ],
        { duration: 760, easing: "cubic-bezier(0.45, 0, 0.25, 1)", fill: "forwards" }
      )
    );
    // Now it's standing up behind the envelope, so the book passes in front of it
    if (flapRef.current) flapRef.current.style.zIndex = "0";
    await wait(120);

    // 4. The book slides up out of the envelope…
    await played(
      coverRef.current?.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(-138px)", offset: 0.8 },
          { transform: "translateY(-130px)" },
        ],
        { duration: 760, easing: "cubic-bezier(0.3, 0, 0.2, 1)", fill: "forwards" }
      )
    );

    // 5. …the envelope drops away, and the book settles in a puff of hearts
    if (coverRef.current) coverRef.current.style.zIndex = "5";
    [backRef.current, frontRef.current, flapRef.current].forEach((el) => {
      el?.animate(
        [
          { translate: "0 0", opacity: 1 },
          { translate: "0 150px", opacity: 0 },
        ],
        { duration: 480, easing: "ease-in", fill: "forwards" }
      );
    });
    burstRefs.current.forEach((el, i) => {
      const [x, y] = BURST[i];
      el?.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.2)", opacity: 0 },
          { transform: `translate(calc(-50% + ${x * 0.6}px), calc(-50% + ${y * 0.6}px)) scale(1.2)`, opacity: 1, offset: 0.4 },
          { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y - 20}px)) scale(0.8)`, opacity: 0 },
        ],
        { duration: 900 + (i % 3) * 120, delay: 260 + i * 30, easing: "ease-out", fill: "backwards" }
      );
    });
    await played(
      coverRef.current?.animate(
        [
          { transform: "translateY(-130px) scale(1) rotate(0deg)" },
          { transform: "translateY(8px) scale(1.06) rotate(-2.5deg)", offset: 0.6 },
          { transform: "translateY(-4px) scale(0.99) rotate(1deg)", offset: 0.82 },
          { transform: "translateY(0) scale(1) rotate(0deg)" },
        ],
        { duration: 680, easing: "ease-out", fill: "forwards" }
      )
    );

    setStage("open");
    // A moment to see the cover before the popup arrives
    await wait(700);
    onSelect(current);
    setBusy(false);
  };

  // Another one requested from the winner popup
  const anotherRef = useRef(another);
  useEffect(() => {
    anotherRef.current = another;
  });
  useEffect(() => {
    if (spinSignal > 0) anotherRef.current();
  }, [spinSignal]);

  const layer: React.CSSProperties = { position: "absolute", inset: 0 };

  return (
    // Room above for the opened flap and the book as it slides out
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "22px", padding: "100px 0 20px" }}>
      <div
        ref={parcelRef}
        style={{ position: "relative", width: `${W}px`, height: `${H}px`, filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.4))" }}
      >
        {BURST.map(([, , glyph, colour], i) => (
          <span
            key={i}
            ref={(el) => {
              burstRefs.current[i] = el;
            }}
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 6,
              fontSize: `${20 + (i % 3) * 7}px`,
              lineHeight: 1,
              color: colour,
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            {glyph}
          </span>
        ))}

        {stage !== "open" && (
          // The inside of the envelope, seen through the V once the flap is up
          <div
            ref={backRef}
            style={{ ...layer, zIndex: 0, borderRadius: "6px", backgroundColor: "#9c7449", boxShadow: "inset 0 12px 26px rgba(40,20,5,0.45)" }}
          />
        )}

        {stage !== "wrapped" && (
          // The key gives every new book a fresh element, clear of the last one's animations
          <div key={current.id} ref={coverRef} style={{ ...layer, zIndex: 1 }}>
            <Cover book={current} />
          </div>
        )}

        {stage !== "open" && (
          <>
            <div ref={frontRef} style={{ ...layer, zIndex: 2, clipPath: POCKET }}>
              <Front hints={hints} />
            </div>
            <div
              ref={flapRef}
              style={{ position: "absolute", top: 0, left: 0, width: `${W}px`, height: `${FLAP}px`, zIndex: 3, transformOrigin: "50% 0" }}
            >
              <Flap />
            </div>
            <div ref={twineRef} style={{ ...layer, zIndex: 4 }}>
              <Twine />
            </div>
          </>
        )}
      </div>

      {stage === "open" ? (
        <p style={{ fontFamily: HAND, fontSize: "26px", fontWeight: 700, color: "var(--text)", margin: 0, textAlign: "center" }}>
          It&apos;s a match: {current.title}
        </p>
      ) : (
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0, textAlign: "center", maxWidth: "320px" }}>
          No title, no cover. Just a few hints on the label. Untie the bow when you&apos;re ready to meet.
        </p>
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        {stage !== "open" && (
          <button
            onClick={unwrap}
            disabled={busy}
            style={{
              padding: "12px 28px",
              backgroundColor: busy ? "var(--raised)" : "var(--primary)",
              color: busy ? "var(--text-muted)" : "var(--on-primary)",
              border: "none",
              borderRadius: "14px",
              fontWeight: 700,
              fontSize: "15px",
              cursor: busy ? "not-allowed" : "pointer",
              boxShadow: busy ? "none" : "var(--shadow-md)",
            }}
          >
            {stage === "opening" ? "Opening…" : "Untie the bow"}
          </button>
        )}
        {(books.length > 1 || stage === "open") && (
          <button
            onClick={another}
            disabled={busy}
            style={{
              padding: "12px 22px",
              backgroundColor: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              fontWeight: 600,
              fontSize: "15px",
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            {stage === "open" ? "Wrap up another" : "Set me up with another"}
          </button>
        )}
      </div>
    </div>
  );
}
