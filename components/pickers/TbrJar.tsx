"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  genres: string[] | null;
  pageCount: number | null;
};

type Props = {
  books: Book[];
  onSelect: (book: Book) => void;
  // Changing this number triggers a fresh shake (used by the "Re-spin" button)
  spinSignal?: number;
};

// A round glass jar with a wooden lid and a satin bow, packed with pastel
// cards, standing on a marble coaster with roses beside it. Drawn on a
// 300 × 390 canvas; the jar is a cylinder seen from slightly above.
const W = 300;
const H = 390;
const JAR = { x: 70, y: 104, w: 160, h: 218 };
const RY = 12; // how round the rims look
const CX = JAR.x + JAR.w / 2;
const RX = JAR.w / 2;
const BOTTOM = JAR.y + JAR.h;
const MOUTH = { x: CX, y: JAR.y };
const LID_OFF = "translate(-84px, -6px) rotate(-12deg)";
const REST_TILT = -6;

const INK = "#3b2a22";
const NOTE_PAPER = "#f7f0e2";
// Pastel card stock, like the cards in a real TBR jar
const CARDS = ["#f7c6d3", "#c9e3f2", "#f6e7a8", "#cfe8c8", "#ddd0f0", "#fbd5b8", "#bfe3dc", "#f4c2c2"];
const DOODLES = ["heart", "star", "book", "bow", "key", "cup", "flower"] as const;
type Doodle = (typeof DOODLES)[number];

const PER_ROW = 6;
const MAX_CARDS = PER_ROW * 4;
const CARD_W = 28;
const CARD_H = 64;

type Card = { x: number; y: number; rotate: number; color: string; doodle: Doodle; row: number };

// Cards standing in rows from the bottom of the jar up — one per book, up to
// 24. Seeded, so the server and the browser draw the same jar.
function makeCards(count: number): Card[] {
  let seed = count * 2654435761;
  const next = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rand = (min: number, max: number) => min + next() * (max - min);
  return Array.from({ length: Math.min(count, MAX_CARDS) }, (_, i) => {
    const row = Math.floor(i / PER_ROW);
    const col = i % PER_ROW;
    return {
      x: JAR.x + 7 + col * 23.5 + (row % 2 ? 5 : 0) + rand(-2, 2),
      // Rows further back sit higher up, like cards packed in a round jar
      y: BOTTOM + 6 - CARD_H - row * 48 + rand(-2, 2),
      // Cards near the glass lean out a little
      rotate: (col - 2.5) * 1.6 + rand(-5, 5),
      color: CARDS[Math.floor(rand(0, CARDS.length))],
      doodle: DOODLES[Math.floor(rand(0, DOODLES.length))],
      row,
    };
  });
}

// Resolves when an animation ends — or after its duration anyway, because a
// hidden tab never reports animations as finished
function played(animation: Animation) {
  const timing = animation.effect?.getTiming();
  const ms = (Number(timing?.duration) || 0) + (Number(timing?.delay) || 0);
  return Promise.race([
    animation.finished.catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, ms + 80)),
  ]);
}
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Little doodles printed on the cards
function DoodleIcon({ kind }: { kind: Doodle }) {
  const ink = { stroke: "rgba(59,42,34,0.7)", strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden style={{ display: "block" }}>
      {kind === "heart" && <path d="M8 13 C2 9 2.5 4.5 5.3 4.2 C6.6 4 7.5 4.8 8 6 C8.5 4.8 9.4 4 10.7 4.2 C13.5 4.5 14 9 8 13 Z" fill="#e5788f" {...ink} />}
      {kind === "star" && <path d="M8 2.5 L9.6 6.2 L13.5 6.5 L10.5 9 L11.5 13 L8 10.8 L4.5 13 L5.5 9 L2.5 6.5 L6.4 6.2 Z" fill="#f2c14e" {...ink} />}
      {kind === "book" && (
        <>
          <rect x="3.5" y="3" width="9" height="10.5" rx="1" fill="#7fa8d1" {...ink} />
          <path d="M5.5 3 L5.5 13.5 M7.5 6 L11 6" {...ink} fill="none" />
        </>
      )}
      {kind === "bow" && (
        <>
          <path d="M8 8 L3 5 L3 11 Z M8 8 L13 5 L13 11 Z" fill="#e5788f" {...ink} />
          <circle cx="8" cy="8" r="1.6" fill="#f7a6b8" {...ink} />
        </>
      )}
      {kind === "key" && (
        <>
          <circle cx="5" cy="6" r="2.6" fill="#f2c14e" {...ink} />
          <path d="M7 7.5 L12.5 13 M10.5 11 L12 9.5 M11.8 12.3 L13 11" {...ink} fill="none" />
        </>
      )}
      {kind === "cup" && (
        <>
          <path d="M3.5 6 L11 6 L10.3 12 Q7.2 13.6 4.2 12 Z" fill="#f4f0e6" {...ink} />
          <path d="M11 7.3 C13.6 7.3 13.6 10.6 10.6 10.6" fill="none" {...ink} />
          <path d="M6 4.5 C5.5 3.5 6.5 3 6 2 M8.5 4.5 C8 3.5 9 3 8.5 2" fill="none" {...ink} />
        </>
      )}
      {kind === "flower" && (
        <>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="8" cy="5" rx="2" ry="2.8" transform={`rotate(${a} 8 8)`} fill="#f7a6b8" {...ink} />
          ))}
          <circle cx="8" cy="8" r="1.8" fill="#f2c14e" {...ink} />
        </>
      )}
    </svg>
  );
}

function CardShape({ card }: { card: Card }) {
  return (
    <span
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "6px",
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        borderRadius: "3px",
        backgroundColor: card.color,
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.35), transparent 30%, transparent 75%, rgba(59,42,34,0.08)), radial-gradient(rgba(255,255,255,0.7) 0.8px, transparent 1.2px)",
        backgroundSize: "auto, 8px 8px",
        border: "1px solid rgba(59,42,34,0.14)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
      }}
    >
      <DoodleIcon kind={card.doodle} />
    </span>
  );
}

// The unfolded slip: lined paper, a crease, a strip of tape
function Note({ book, small = false }: { book: Book; small?: boolean }) {
  return (
    <>
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: small ? "-7px" : "-10px",
          left: "50%",
          width: small ? "46px" : "70px",
          height: small ? "14px" : "20px",
          transform: "translateX(-50%) rotate(-3deg)",
          backgroundColor: "rgb(var(--primary-rgb) / 0.55)",
          backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.3) 0 4px, transparent 4px 8px)",
        }}
      />
      <p style={{ fontSize: small ? "9px" : "11px", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 6px 0", opacity: 0.55 }}>
        Your next read
      </p>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: small ? "14px" : "22px",
          fontWeight: 600,
          lineHeight: 1.2,
          margin: 0,
          overflowWrap: "anywhere",
        }}
      >
        {book.title}
      </p>
      {book.author && <p style={{ fontSize: small ? "11px" : "14px", margin: "6px 0 0 0", opacity: 0.7 }}>{book.author}</p>}
    </>
  );
}

const noteStyle: React.CSSProperties = {
  borderRadius: "4px",
  backgroundColor: NOTE_PAPER,
  backgroundImage:
    "linear-gradient(180deg, transparent 49%, rgba(59,42,34,0.1) 50%, transparent 51%), repeating-linear-gradient(180deg, transparent 0 21px, rgba(91,127,147,0.16) 21px 22px)",
  color: INK,
  textAlign: "center",
};

// A garden rose seen from above: a ring of outer petals around a tight,
// darker cup with a curl of petals in the middle
function Rose({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  const petals = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2 + 0.3);
  return (
    <g transform={`translate(${x} ${y})`}>
      {petals.map((a) => (
        <circle key={a} cx={(Math.cos(a) * r * 0.5).toFixed(1)} cy={(Math.sin(a) * r * 0.5).toFixed(1)} r={r * 0.55} fill={color} stroke={INK} strokeWidth="1" />
      ))}
      <circle r={r * 0.58} style={{ fill: `color-mix(in srgb, ${color} 80%, #b0405e)` }} stroke={INK} strokeWidth="1" />
      <path
        d={`M${-r * 0.35} ${r * 0.1} C${-r * 0.35} ${-r * 0.4} ${r * 0.38} ${-r * 0.42} ${r * 0.36} 0 C${r * 0.34} ${r * 0.3} ${-r * 0.15} ${r * 0.32} ${-r * 0.14} 0 C${-r * 0.12} ${-r * 0.18} ${r * 0.14} ${-r * 0.16} ${r * 0.1} 0.5`}
        fill="none"
        stroke={INK}
        strokeOpacity="0.6"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle r={r} fill="url(#jar-rose-shade)" />
    </g>
  );
}

export default function TbrJar({ books, onSelect, spinSignal = 0 }: Props) {
  const [cards] = useState<Card[]>(() => makeCards(books.length));
  const [busy, setBusy] = useState(false);
  // The book drawn: shown big over the page, then resting beside the jar
  const [picked, setPicked] = useState<Book | null>(null);
  const [stage, setStage] = useState<"idle" | "reveal" | "resting">("idle");
  const [hiddenCard, setHiddenCard] = useState<number | null>(null);

  const jarRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backdropRef = useRef<HTMLDivElement>(null);
  const bigNoteRef = useRef<HTMLDivElement>(null);
  const restingRef = useRef<HTMLDivElement>(null);

  const mouthOnScreen = () => {
    const rect = jarRef.current!.getBoundingClientRect();
    return { x: rect.left + MOUTH.x, y: rect.top + MOUTH.y };
  };

  // Last time's card goes back in the jar (you didn't start that one)
  const putCardBack = async () => {
    const note = restingRef.current;
    if (note) {
      const from = note.getBoundingClientRect();
      const mouth = mouthOnScreen();
      const dx = mouth.x - (from.left + from.width / 2);
      const dy = mouth.y - (from.top + from.height / 2);
      await played(
        note.animate(
          [
            { transform: `rotate(${REST_TILT}deg) scale(1, 1)`, opacity: 1 },
            { transform: `rotate(${REST_TILT}deg) scale(0.3, 1)`, opacity: 1, offset: 0.35 },
            { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(0.2, 0.6)`, opacity: 0.9 },
          ],
          { duration: 750, easing: "ease-in-out", fill: "forwards" }
        )
      );
    }
    flushSync(() => {
      setStage("idle");
      setPicked(null);
      setHiddenCard(null);
    });
    // Lid back on
    const lid = lidRef.current;
    if (lid && lid.getAnimations().length) {
      await played(
        lid.animate([{ transform: LID_OFF }, { transform: "translate(0, 0) rotate(0deg)" }], {
          duration: 320,
          easing: "ease-in",
          fill: "forwards",
        })
      );
      lid.getAnimations().forEach((a) => a.cancel());
    }
  };

  const shake = async () => {
    if (busy || books.length === 0 || !jarRef.current || !lidRef.current) return;
    setBusy(true);
    if (stage !== "idle") await putCardBack();

    const jar = jarRef.current;
    const lid = lidRef.current;

    // Web Animations rather than CSS transitions, so it plays even with
    // reduced motion switched on in the system settings
    const wobble = jar.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(-8deg)" },
        { transform: "rotate(7deg)" },
        { transform: "rotate(-6deg)" },
        { transform: "rotate(5deg)" },
        { transform: "rotate(-3deg)" },
        { transform: "rotate(1.5deg)" },
        { transform: "rotate(0deg)" },
      ],
      { duration: 1100, easing: "ease-in-out" }
    );
    cardRefs.current.forEach((el) => {
      if (!el) return;
      const r = () => Math.random() * 8 - 4;
      el.animate(
        [
          { translate: "0 0" },
          { translate: `${r()}px ${r() - 8}px` },
          { translate: `${r()}px ${r() - 3}px` },
          { translate: `${r()}px ${r() - 9}px` },
          { translate: "0 0" },
        ],
        { duration: 1100, easing: "ease-in-out" }
      );
    });
    await played(wobble);

    const book = books[Math.floor(Math.random() * books.length)];
    // A card from the top row comes out
    const topRow = Math.max(0, ...cards.map((c) => c.row));
    const candidates = cards.map((c, i) => (c.row === topRow ? i : -1)).filter((i) => i >= 0);
    const cardIndex = candidates[Math.floor(Math.random() * candidates.length)] ?? null;

    // Lift the lid off
    await played(
      lid.animate([{ transform: "translate(0, 0) rotate(0deg)" }, { transform: LID_OFF }], {
        duration: 380,
        easing: "cubic-bezier(.2,.9,.3,1.3)",
        fill: "forwards",
      })
    );

    // The card rises out of the jar…
    const card = cardIndex !== null ? cardRefs.current[cardIndex] : null;
    if (card) {
      await played(
        card.animate(
          [
            { translate: "0 0", opacity: 1 },
            { translate: `${MOUTH.x - (cards[cardIndex!].x + CARD_W / 2)}px ${MOUTH.y - CARD_H - cards[cardIndex!].y - 10}px`, opacity: 1 },
          ],
          { duration: 450, easing: "cubic-bezier(.3,.7,.4,1)", fill: "forwards" }
        )
      );
    }

    // …and flies to the middle of the screen, where it opens into a note
    const mouth = mouthOnScreen();
    flushSync(() => {
      setHiddenCard(cardIndex);
      setPicked(book);
      setStage("reveal");
    });
    card?.getAnimations().forEach((a) => a.cancel());
    const note = bigNoteRef.current;
    const backdrop = backdropRef.current;
    if (note && backdrop) {
      const dx = mouth.x - window.innerWidth / 2;
      const dy = mouth.y - CARD_H / 2 - window.innerHeight * 0.45;
      backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, fill: "forwards" });
      await played(
        note.animate(
          [
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(0deg) scale(0.11, 0.42)` },
            { transform: "translate(-50%, -50%) rotate(-360deg) scale(0.11, 0.42)", offset: 0.75 },
            { transform: "translate(-50%, -50%) rotate(-363deg) scale(0.12, 1)" },
          ],
          { duration: 800, easing: "cubic-bezier(.25,.8,.35,1)", fill: "forwards" }
        )
      );
      await played(
        note.animate(
          [
            { transform: "translate(-50%, -50%) rotate(-363deg) scale(0.12, 1)" },
            { transform: "translate(-50%, -50%) rotate(-363deg) scale(1.05, 1)" },
            { transform: "translate(-50%, -50%) rotate(-363deg) scale(1, 1)" },
          ],
          { duration: 480, easing: "ease-out", fill: "forwards" }
        )
      );
    }

    await wait(1000);

    // The popup takes over; the card settles beside the jar for afterwards
    onSelect(book);
    if (note && backdrop) {
      note.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" });
      await played(backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" }));
    }
    setStage("resting");
    setBusy(false);
  };

  // Re-spin requested from the winner popup
  const shakeRef = useRef(shake);
  useEffect(() => {
    shakeRef.current = shake;
  });
  useEffect(() => {
    if (spinSignal > 0) shakeRef.current();
  }, [spinSignal]);

  // Back rows are drawn first, so the front rows stand in front of them
  const drawOrder = cards.map((_, i) => i).sort((a, b) => cards[b].row - cards[a].row);

  // A few sparkles around the jar twinkle softly
  const sparkleRefs = useRef<(SVGPathElement | null)[]>([]);
  useEffect(() => {
    const animations = sparkleRefs.current.map((el, i) =>
      el?.animate([{ opacity: 0.25, transform: "scale(0.7)" }, { opacity: 1, transform: "scale(1)" }, { opacity: 0.25, transform: "scale(0.7)" }], {
        duration: 2400 + i * 500,
        delay: i * 400,
        iterations: Infinity,
        easing: "ease-in-out",
      })
    );
    return () => animations.forEach((a) => a?.cancel());
  }, []);

  // The glass: a cylinder with rounded rims
  const body = `M${JAR.x} ${JAR.y} L${JAR.x} ${BOTTOM} A${RX} ${RY} 0 0 0 ${JAR.x + JAR.w} ${BOTTOM} L${JAR.x + JAR.w} ${JAR.y} A${RX} ${RY} 0 0 0 ${JAR.x} ${JAR.y} Z`;
  const sparkle = (x: number, y: number, r: number) =>
    `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;
  const sparkles: [number, number, number][] = [
    [40, 150, 7],
    [262, 128, 6],
    [252, 236, 4.5],
    [30, 228, 4],
    [270, 60, 4],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", margin: 0 }}>
        {busy && stage === "idle"
          ? "Shaking the jar…"
          : stage === "resting" && picked
          ? "Not feeling it? Shake again and it goes back in the jar."
          : "Every card is a book from your TBR."}
      </p>

      <div style={{ position: "relative", width: `${W}px`, height: `${H}px`, maxWidth: "100%" }}>
        {/* Shared gradients */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <defs>
            <radialGradient id="jar-rose-shade" cx="35%" cy="30%" r="75%">
              <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.15" />
            </radialGradient>
            <radialGradient id="jar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0" style={{ stopColor: "var(--primary)" }} stopOpacity="0.28" />
              <stop offset="1" style={{ stopColor: "var(--primary)" }} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="jar-glass" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="0.18" stopColor="#fff" stopOpacity="0.06" />
              <stop offset="0.7" stopColor="#fff" stopOpacity="0.02" />
              <stop offset="0.92" stopColor="#fff" stopOpacity="0.14" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="jar-wood-side" x1="0" x2="1">
              <stop offset="0" stopColor="#b98a52" />
              <stop offset="0.35" stopColor="#e2bd88" />
              <stop offset="0.65" stopColor="#d9b07a" />
              <stop offset="1" stopColor="#a87a45" />
            </linearGradient>
            <linearGradient id="jar-wood-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f0d3a4" />
              <stop offset="1" stopColor="#dcb47e" />
            </linearGradient>
            <linearGradient id="jar-marble" x1="0" x2="1">
              <stop offset="0" stopColor="#e4ddd6" />
              <stop offset="0.5" stopColor="#f6f2ee" />
              <stop offset="1" stopColor="#ddd5cd" />
            </linearGradient>
          </defs>
        </svg>

        {/* Soft glow, table shadow and the marble coaster */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }} aria-hidden>
          <ellipse cx={CX} cy="210" rx="150" ry="170" fill="url(#jar-glow)" />
          <ellipse cx={CX} cy="354" rx="124" ry="14" fill="rgba(0,0,0,0.3)" />
          <path d={`M48 ${BOTTOM + 4} L48 ${BOTTOM + 16} A102 18 0 0 0 252 ${BOTTOM + 16} L252 ${BOTTOM + 4} Z`} fill="#cfc6bd" stroke={INK} strokeWidth="1.3" />
          <ellipse cx={CX} cy={BOTTOM + 4} rx="102" ry="18" fill="url(#jar-marble)" stroke={INK} strokeWidth="1.3" />
          <path d="M72 330 C92 322 104 334 128 326 M176 336 C196 328 214 334 232 326 M140 340 C150 344 160 345 172 343" fill="none" stroke="#a9a29b" strokeWidth="0.9" strokeLinecap="round" />
        </svg>

        {/* The jar: glass, cards, lettering, ribbon and lid move together when shaken */}
        <div ref={jarRef} style={{ position: "absolute", inset: 0, transformOrigin: "50% 86%" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }} aria-hidden>
            <path d={body} style={{ fill: "rgb(var(--primary-rgb) / 0.08)" }} />
            <path d={body} fill="url(#jar-glass)" />
            {/* Back half of the rim, seen through the glass */}
            <path d={`M${JAR.x} ${JAR.y} A${RX} ${RY} 0 0 1 ${JAR.x + JAR.w} ${JAR.y}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
            <path d={`M${JAR.x + 6} ${BOTTOM} A${RX - 6} ${RY - 3} 0 0 1 ${JAR.x + JAR.w - 6} ${BOTTOM}`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          </svg>

          {/* Cards */}
          <div style={{ position: "absolute", inset: 0 }}>
            {drawOrder.map((i) => {
              const card = cards[i];
              return (
                <div
                  key={i}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  style={{
                    position: "absolute",
                    left: `${card.x}px`,
                    top: `${card.y}px`,
                    transform: `rotate(${card.rotate}deg)`,
                    transformOrigin: "50% 100%",
                    // Further back is a touch darker
                    filter: `brightness(${1 - card.row * 0.06})`,
                    opacity: hiddenCard === i ? 0 : 1,
                  }}
                >
                  <CardShape card={card} />
                </div>
              );
            })}
          </div>

          {/* Glass front: rims, shine, thick base and the lettering */}
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }} aria-hidden>
            <path d={body} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.4" />
            <path d={`M${JAR.x} ${JAR.y} A${RX} ${RY} 0 0 0 ${JAR.x + JAR.w} ${JAR.y}`} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.6" />
            <path d={`M${JAR.x + 4} ${BOTTOM - 6} A${RX - 4} ${RY} 0 0 0 ${JAR.x + JAR.w - 4} ${BOTTOM - 6} L${JAR.x + JAR.w} ${BOTTOM} A${RX} ${RY} 0 0 1 ${JAR.x} ${BOTTOM} Z`} fill="rgba(255,255,255,0.16)" />
            <path d={`M${JAR.x + 12} ${JAR.y + 22} L${JAR.x + 12} ${BOTTOM - 14}`} stroke="rgba(255,255,255,0.42)" strokeWidth="9" strokeLinecap="round" />
            <path d={`M${JAR.x + 26} ${JAR.y + 28} L${JAR.x + 26} ${JAR.y + 74}`} stroke="rgba(255,255,255,0.32)" strokeWidth="3" strokeLinecap="round" />
            <path d={`M${JAR.x + JAR.w - 12} ${JAR.y + 34} L${JAR.x + JAR.w - 12} ${BOTTOM - 40}`} stroke="rgba(255,255,255,0.24)" strokeWidth="4" strokeLinecap="round" />
            <g style={{ fontFamily: "var(--font-sans), 'Arial Black', sans-serif" }} fontWeight="900" fontSize="42" textAnchor="middle" letterSpacing="3">
              {(
                [
                  ["TBR", 206],
                  ["JAR", 254],
                ] as [string, number][]
              ).map(([word, y]) => (
                <g key={word}>
                  <text x={CX} y={y} fill="none" stroke="#fffaf0" strokeOpacity="0.85" strokeWidth="6" strokeLinejoin="round">
                    {word}
                  </text>
                  <text x={CX} y={y} fill="#1f1714">
                    {word}
                  </text>
                </g>
              ))}
            </g>

            {/* Satin ribbon round the neck, with a bow and a little tag */}
            <path d={`M${JAR.x} ${JAR.y + 14} A${RX} ${RY} 0 0 0 ${JAR.x + JAR.w} ${JAR.y + 14} L${JAR.x + JAR.w} ${JAR.y + 24} A${RX} ${RY} 0 0 1 ${JAR.x} ${JAR.y + 24} Z`} fill="#f2a7b8" stroke={INK} strokeWidth="1.2" />
            <path d={`M${JAR.x + 4} ${JAR.y + 18} A${RX - 4} ${RY} 0 0 0 ${JAR.x + JAR.w - 4} ${JAR.y + 18}`} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.6" />
            <g transform={`translate(${CX + 44} ${JAR.y + 30})`}>
              <path d="M0 0 L-8 22 L-3 20 L-1 25 Z" fill="#e88ea2" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
              <path d="M0 0 L9 21 L4 20 L3 25 Z" fill="#e88ea2" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
              <path d="M0 0 C-10 -12 -24 -8 -20 2 C-17 8 -8 5 0 0 Z" fill="#f2a7b8" stroke={INK} strokeWidth="1.2" />
              <path d="M0 0 C10 -12 24 -8 20 2 C17 8 8 5 0 0 Z" fill="#f2a7b8" stroke={INK} strokeWidth="1.2" />
              <path d="M-15 -3 C-11 -5 -7 -4 -4 -1 M15 -3 C11 -5 7 -4 4 -1" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round" />
              <ellipse rx="4" ry="3.6" fill="#e88ea2" stroke={INK} strokeWidth="1.1" />
            </g>
            <path d={`M${CX - 30} ${JAR.y + 34} L${CX - 36} ${JAR.y + 48}`} stroke="#c9a26b" strokeWidth="1.2" />
            <g transform={`rotate(-8 ${CX - 38} ${JAR.y + 58})`}>
              <path d={`M${CX - 62} ${JAR.y + 48} L${CX - 14} ${JAR.y + 48} L${CX - 14} ${JAR.y + 66} L${CX - 62} ${JAR.y + 66} L${CX - 68} ${JAR.y + 57} Z`} fill="#dcbb90" stroke={INK} strokeWidth="1.1" />
              <circle cx={CX - 62} cy={JAR.y + 57} r="1.6" fill={INK} />
              <text x={CX - 37} y={JAR.y + 60.5} textAnchor="middle" fontSize="8" fontWeight="700" fill={INK} style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                pick me ♡
              </text>
            </g>
          </svg>

          {/* Wooden lid: grain on the side, growth rings on top */}
          <div ref={lidRef} style={{ position: "absolute", left: 0, top: 0, width: `${W}px`, height: "130px", transformOrigin: "30% 80%" }}>
            <svg width={W} height="130" viewBox={`0 0 ${W} 130`} aria-hidden>
              <path d={`M${JAR.x + 4} ${JAR.y - 4} L${JAR.x + 4} ${JAR.y + 2} A${RX - 4} ${RY} 0 0 0 ${JAR.x + JAR.w - 4} ${JAR.y + 2} L${JAR.x + JAR.w - 4} ${JAR.y - 4} Z`} fill="#cfc9c0" stroke={INK} strokeWidth="1.1" />
              <path d={`M${JAR.x - 8} ${JAR.y - 26} L${JAR.x - 8} ${JAR.y - 6} A${RX + 8} ${RY + 1} 0 0 0 ${JAR.x + JAR.w + 8} ${JAR.y - 6} L${JAR.x + JAR.w + 8} ${JAR.y - 26} Z`} fill="url(#jar-wood-side)" stroke={INK} strokeWidth="1.4" />
              <path d={`M${JAR.x - 2} ${JAR.y - 18} C${JAR.x + 40} ${JAR.y - 14} ${JAR.x + 90} ${JAR.y - 20} ${JAR.x + JAR.w + 2} ${JAR.y - 15} M${JAR.x + 6} ${JAR.y - 11} C${JAR.x + 60} ${JAR.y - 6} ${JAR.x + 110} ${JAR.y - 12} ${JAR.x + JAR.w - 4} ${JAR.y - 8}`} fill="none" stroke="#9c703f" strokeOpacity="0.45" strokeWidth="1" />
              <ellipse cx={CX} cy={JAR.y - 26} rx={RX + 8} ry={RY + 1} fill="url(#jar-wood-top)" stroke={INK} strokeWidth="1.4" />
              <ellipse cx={CX + 6} cy={JAR.y - 26} rx={RX - 16} ry={RY - 4} fill="none" stroke="#b98a52" strokeOpacity="0.5" strokeWidth="1" />
              <ellipse cx={CX + 10} cy={JAR.y - 26.5} rx={RX - 40} ry={RY - 7} fill="none" stroke="#b98a52" strokeOpacity="0.45" strokeWidth="1" />
              <ellipse cx={CX + 13} cy={JAR.y - 27} rx={RX - 62} ry={RY - 9.5} fill="none" stroke="#b98a52" strokeOpacity="0.4" strokeWidth="1" />
              <path d={`M${JAR.x + 6} ${JAR.y - 31} C${JAR.x + 40} ${JAR.y - 37} ${JAR.x + 110} ${JAR.y - 38} ${JAR.x + JAR.w - 10} ${JAR.y - 32}`} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Roses, spare cards and twinkles on the table */}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
          <path d="M34 306 C26 290 18 286 6 284 C14 296 22 302 34 306 Z" fill="#8fb27a" stroke={INK} strokeWidth="1.1" />
          <path d="M46 324 C54 306 66 304 76 306 C68 316 58 322 46 324 Z" fill="#8fb27a" stroke={INK} strokeWidth="1.1" />
          <Rose x={28} y={324} r={17} color="#f3a7b8" />
          <Rose x={56} y={340} r={13} color="#ea8ea4" />
          <Rose x={16} y={350} r={11} color="#f7c1cc" />
          {(
            [
              [212, 360, -14, CARDS[0]],
              [226, 358, -6, CARDS[1]],
              [240, 357, 3, CARDS[3]],
              [254, 359, 11, CARDS[4]],
            ] as [number, number, number, string][]
          ).map(([x, y, r, fill]) => (
            <rect key={x} x={x} y={y} width="40" height="10" rx="1.5" fill={fill} stroke={INK} strokeOpacity="0.4" strokeWidth="1" transform={`rotate(${r} ${x} ${y})`} />
          ))}
          {sparkles.map(([x, y, r], i) => (
            <path
              key={i}
              ref={(el) => {
                sparkleRefs.current[i] = el;
              }}
              d={sparkle(x, y, r)}
              style={{ fill: "var(--accent)", transformBox: "fill-box", transformOrigin: "center" }}
            />
          ))}
        </svg>

        {/* The card you drew, propped by the jar once the popup is closed */}
        {stage === "resting" && picked && (
          <div
            ref={restingRef}
            style={{
              ...noteStyle,
              position: "absolute",
              right: "-4px",
              bottom: "40px",
              width: "128px",
              padding: "14px 10px 12px",
              transform: `rotate(${REST_TILT}deg)`,
              boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
              zIndex: 2,
            }}
          >
            <Note book={picked} small />
          </div>
        )}
      </div>

      <button
        onClick={shake}
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
        {busy ? "Shaking…" : stage === "resting" ? "Shake again" : "Shake the jar"}
      </button>
      {books.length > MAX_CARDS && (
        <p style={{ color: "var(--text-faint)", fontSize: "12px", margin: "-4px 0 0 0" }}>
          All {books.length} books are in the jar, even if not every card fits in the picture.
        </p>
      )}

      {/* The card, opened over the page (outside any transformed parent) */}
      {stage === "reveal" &&
        picked &&
        createPortal(
          <>
            <div
              ref={backdropRef}
              style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", opacity: 0, zIndex: 998 }}
            />
            <div
              ref={bigNoteRef}
              role="status"
              style={{
                ...noteStyle,
                position: "fixed",
                left: "50%",
                top: "45%",
                width: "min(280px, 80vw)",
                padding: "26px 22px 22px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
                transform: "translate(-50%, -50%) scale(0)",
                zIndex: 998,
              }}
            >
              <Note book={picked} />
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
