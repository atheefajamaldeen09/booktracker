"use client";

import { useState, useEffect, useRef } from "react";

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
  // Changing this number triggers a fresh spin (used by the "Re-spin" button)
  spinSignal?: number;
};

// Alternating slice colors, each with a readable label color
const palette = [
  { fill: "var(--primary)", text: "var(--on-primary)" },
  { fill: "var(--raised)", text: "var(--text)" },
  { fill: "var(--accent)", text: "var(--on-primary)" },
  { fill: "var(--surface)", text: "var(--text)" },
];

const CENTER = 110;
const RADIUS = 100;

// Strong ease-out so the wheel whips round and then slowly creeps to a stop
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

const normalize = (deg: number) => ((deg % 360) + 360) % 360;

export default function SpinningWheel({ books, onSelect, spinSignal = 0 }: Props) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const count = books.length;
  const segmentAngle = 360 / count;
  // Plenty of pegs round the rim even when there are only a few books
  const pegsPerSlice = Math.max(1, Math.ceil(16 / count));
  const pegAngle = segmentAngle / pegsPerSlice;

  // Slices start at the top (where the pointer is) and run clockwise, so the
  // slice under the pointer sits at angle (360 - rotation) on the wheel
  const pegUnderPointer = (rot: number) => Math.floor(normalize(360 - normalize(rot)) / pegAngle);

  const colorFor = (index: number) => {
    // Avoid two same-colored slices touching where the wheel wraps around
    if (count > 1 && index === count - 1 && index % palette.length === 0) {
      return palette[1];
    }
    return palette[index % palette.length];
  };

  const spinWheel = () => {
    if (isSpinning || count === 0) return;

    setIsSpinning(true);
    setWinnerIndex(null);

    // Choose the winner up front, then work out how far to turn to land on it.
    // Landing somewhere inside the slice (not on an edge) keeps it unambiguous.
    const winner = Math.floor(Math.random() * count);
    const landingPoint = (winner + 0.15 + Math.random() * 0.7) * segmentAngle;
    const start = rotation;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const delta = normalize(360 - landingPoint - start) + extraSpins * 360;
    const duration = 5000 + Math.random() * 1500;

    // Driven by requestAnimationFrame rather than a CSS transition, so the
    // spin still plays when the OS "reduce motion" setting disables transitions
    const startTime = performance.now();
    let lastPeg = pegUnderPointer(start);
    let kick = 0;

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const current = start + delta * easeOut(t);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${current}deg)`;
      }

      // Flick the pointer every time a peg passes it, like a real prize wheel
      const peg = pegUnderPointer(current);
      if (peg !== lastPeg) {
        lastPeg = peg;
        kick = 1;
      }
      kick *= 0.82;
      if (pointerRef.current) {
        pointerRef.current.style.transform = `rotate(${-kick * 24}deg)`;
      }

      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      frameRef.current = null;
      if (pointerRef.current) pointerRef.current.style.transform = "rotate(0deg)";
      setRotation(start + delta);
      setIsSpinning(false);
      setWinnerIndex(winner);
      // Brief pause on the result before the popup appears
      setTimeout(() => onSelect(books[winner]), 450);
    };

    frameRef.current = requestAnimationFrame(step);
  };

  // Stop the animation if the picker is unmounted mid-spin
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Re-spin requested from the winner popup
  const spinRef = useRef(spinWheel);
  useEffect(() => {
    spinRef.current = spinWheel;
  });
  useEffect(() => {
    if (spinSignal > 0) spinRef.current();
  }, [spinSignal]);

  // Smaller labels when there are lots of slices
  const fontSize = Math.max(3.2, Math.min(7, 110 / count));
  const maxChars = Math.floor(64 / (fontSize * 0.56));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(88vw, 420px)",
          height: "min(88vw, 420px)",
        }}
      >
        {/* Soft glow behind the wheel */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-6%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgb(var(--primary-rgb) / 0.18), transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Rotating wheel */}
        <div
          ref={wheelRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            transform: `rotate(${rotation}deg)`,
            boxShadow: "var(--shadow-lg)",
            willChange: "transform",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 220 220" style={{ display: "block" }}>
            <defs>
              <radialGradient id="wheel-sheen" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
                <stop offset="60%" stopColor="#fff" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
              </radialGradient>
            </defs>

            {/* Outer rim */}
            <circle cx={CENTER} cy={CENTER} r={109} style={{ fill: "var(--border)" }} />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 1}
              style={{ fill: "none", stroke: "var(--bg-deep)", strokeWidth: 2 }}
            />

            {books.map((book, index) => {
              const color = colorFor(index);
              const isWinner = winnerIndex === index;
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              const x1 = CENTER + RADIUS * Math.cos(startAngle);
              const y1 = CENTER + RADIUS * Math.sin(startAngle);
              const x2 = CENTER + RADIUS * Math.cos(endAngle);
              const y2 = CENTER + RADIUS * Math.sin(endAngle);
              const largeArc = segmentAngle > 180 ? 1 : 0;
              const midAngle = index * segmentAngle + segmentAngle / 2;
              // Flip labels on the left half so none are upside down at rest
              const flipped = midAngle > 180;
              const label =
                book.title.length > maxChars
                  ? book.title.substring(0, maxChars - 1) + "…"
                  : book.title;

              return (
                <g key={book.id}>
                  {count === 1 ? (
                    <circle cx={CENTER} cy={CENTER} r={RADIUS} style={{ fill: color.fill }} />
                  ) : (
                    <path
                      d={`M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      style={{
                        fill: color.fill,
                        stroke: "var(--bg-deep)",
                        strokeWidth: 0.6,
                        filter: isWinner ? "brightness(1.25)" : undefined,
                      }}
                    />
                  )}

                  {/* Label reads outward from the hub, like a real prize wheel */}
                  <text
                    x={flipped ? CENTER - 62 : CENTER + 62}
                    y={CENTER}
                    style={{ fill: color.text }}
                    fontSize={fontSize}
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${flipped ? midAngle + 90 : midAngle - 90} ${CENTER} ${CENTER})`}
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Light sheen so the face doesn't look flat */}
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#wheel-sheen)" pointerEvents="none" />

            {/* Highlight ring around the winning slice */}
            {winnerIndex !== null && count > 1 && (
              <path
                d={(() => {
                  const a1 = (winnerIndex * segmentAngle - 90) * (Math.PI / 180);
                  const a2 = ((winnerIndex + 1) * segmentAngle - 90) * (Math.PI / 180);
                  const r = RADIUS - 1;
                  return `M ${CENTER} ${CENTER} L ${CENTER + r * Math.cos(a1)} ${CENTER + r * Math.sin(a1)} A ${r} ${r} 0 ${segmentAngle > 180 ? 1 : 0} 1 ${CENTER + r * Math.cos(a2)} ${CENTER + r * Math.sin(a2)} Z`;
                })()}
                style={{ fill: "none", stroke: "var(--text)", strokeWidth: 1.6, strokeLinejoin: "round" }}
              />
            )}

            {/* Pegs on the rim — bigger ones mark the slice edges */}
            {Array.from({ length: count * pegsPerSlice }, (_, i) => {
              const a = (i * pegAngle - 90) * (Math.PI / 180);
              const edge = i % pegsPerSlice === 0 && count > 1;
              return (
                <circle
                  key={i}
                  cx={CENTER + 104.5 * Math.cos(a)}
                  cy={CENTER + 104.5 * Math.sin(a)}
                  r={edge ? 2.3 : 1.5}
                  style={{ fill: "var(--accent)", stroke: "var(--bg-deep)", strokeWidth: 0.6 }}
                />
              );
            })}
          </svg>
        </div>

        {/* Pointer — stays still while the wheel turns beneath it */}
        <div
          ref={pointerRef}
          aria-hidden
          style={{
            position: "absolute",
            top: "-14px",
            left: "50%",
            marginLeft: "-17px",
            width: "34px",
            height: "46px",
            transformOrigin: "50% 12px",
            zIndex: 2,
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.45))",
          }}
        >
          <svg width="34" height="46" viewBox="0 0 34 46">
            <path
              d="M17 44 L3 14 A14 14 0 1 1 31 14 Z"
              style={{ fill: "var(--primary)", stroke: "var(--bg-deep)", strokeWidth: 1.5 }}
            />
            <circle cx="17" cy="13" r="5" style={{ fill: "var(--on-primary)" }} />
          </svg>
        </div>

        {/* Hub — the spin button stays upright in the middle */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          aria-label="Spin the wheel"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "24%",
            height: "24%",
            minWidth: "76px",
            minHeight: "76px",
            borderRadius: "50%",
            background: isSpinning
              ? "var(--raised)"
              : "radial-gradient(circle at 35% 30%, var(--primary-hover), var(--primary) 60%)",
            border: "5px solid var(--bg-deep)",
            outline: "2px solid var(--accent)",
            outlineOffset: "-9px",
            color: isSpinning ? "var(--text-faint)" : "var(--on-primary)",
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(14px, 3vw, 19px)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: isSpinning ? "not-allowed" : "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
            zIndex: 1,
          }}
        >
          SPIN
        </button>
      </div>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "14px",
          textAlign: "center",
          margin: 0,
        }}
      >
        {isSpinning ? "Round and round it goes…" : "Tap SPIN to choose your next book!"}
      </p>
    </div>
  );
}
