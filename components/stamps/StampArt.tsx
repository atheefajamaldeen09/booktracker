// Rubber-stamp faces for the reaction stamps: one ink colour (currentColor),
// thin wobbly lines and pale tone fills, like a set of hand-carved stamps.
// Every face sits on a 64 × 64 canvas with the head centred at 32, 34.

import type { ReactNode } from "react";
import type { ReactionId } from "@/lib/reactions";

// What shows through where the stamp left no ink
const PAPER = "var(--stamp-paper, #fffdf6)";

const ink = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;
const fine = { ...ink, strokeWidth: 1.3 } as const;

const heart = (cx: number, cy: number, s: number) =>
  `M${cx} ${cy + s * 0.9} C${cx - s * 1.6} ${cy - s * 0.1} ${cx - s * 0.9} ${cy - s * 1.3} ${cx} ${cy - s * 0.45} C${cx + s * 0.9} ${cy - s * 1.3} ${cx + s * 1.6} ${cy - s * 0.1} ${cx} ${cy + s * 0.9} Z`;

const star = (cx: number, cy: number, outer: number, inner: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

const sparkle = (x: number, y: number, s: number) =>
  `M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`;

const spiral = (cx: number, cy: number, rMax = 6.5, turns = 2.4) =>
  Array.from({ length: 44 }, (_, i) => {
    const t = i / 43;
    const a = t * turns * Math.PI * 2;
    return `${i ? "L" : "M"}${(cx + t * rMax * Math.cos(a)).toFixed(1)} ${(cy + t * rMax * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

// A flame with a pointed, leaning tip, cut flat where it meets the ground
const flame = (cx: number, base: number, h: number) =>
  `M${cx + h * 0.12} ${base - h} C${cx + h * 0.1} ${base - h * 0.62} ${cx + h * 0.5} ${base - h * 0.5} ${cx + h * 0.36} ${base} L${cx - h * 0.36} ${base} C${cx - h * 0.56} ${base - h * 0.42} ${cx - h * 0.1} ${base - h * 0.5} ${cx + h * 0.12} ${base - h} Z`;

const drop = (x: number, y: number, s = 1) =>
  `M${x} ${y} c${2 * s} ${3 * s} ${3 * s} ${5 * s} 0 ${6.5 * s} c${-3 * s} ${-1.5 * s} ${-2 * s} ${-3.5 * s} 0 ${-6.5 * s} Z`;

const circ = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;

const flake = (x: number, y: number, s: number) =>
  `M${x} ${y - s} L${x} ${y + s} M${x - s * 0.87} ${y - s * 0.5} L${x + s * 0.87} ${y + s * 0.5} M${x - s * 0.87} ${y + s * 0.5} L${x + s * 0.87} ${y - s * 0.5}`;

function Head() {
  return (
    <path
      d="M32 12.5 C44.5 12 54 21.5 54 34 C54 46.5 44.5 56 32 56 C19.5 56 10 46.5 10 34 C10 21.5 19.5 13 32 12.5 Z"
      {...ink}
      fill={PAPER}
    />
  );
}

// A shape filled with a pale wash of the ink, outlined
function Tone({ d, w = 1.3 }: { d: string; w?: number }) {
  return (
    <>
      <path d={d} fill={PAPER} />
      <path d={d} {...ink} strokeWidth={w} fill="currentColor" fillOpacity="0.22" />
    </>
  );
}

// A round eye: p is how big the pupil is, dx/dy where it's looking
function Eye({ x, y = 32, r = 6, p = 0.55, dx = 0, dy = 0, shine = true }: { x: number; y?: number; r?: number; p?: number; dx?: number; dy?: number; shine?: boolean }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} {...ink} strokeWidth={1.6} fill={PAPER} />
      <circle cx={x + dx} cy={y + dy} r={r * p} fill="currentColor" />
      {shine && <circle cx={x + dx - r * 0.2} cy={y + dy - r * 0.22} r={r * 0.2} fill={PAPER} />}
    </>
  );
}

// A big glossy eye, all pupil
function Shiny({ x, y = 31, r = 7 }: { x: number; y?: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill="currentColor" />
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.34} fill={PAPER} />
      <circle cx={x + r * 0.38} cy={y + r * 0.32} r={r * 0.17} fill={PAPER} />
    </>
  );
}

function Blush({ x, y = 39 }: { x: number; y?: number }) {
  return (
    <>
      <ellipse cx={x} cy={y} rx="4.6" ry="2.8" fill="currentColor" fillOpacity="0.2" />
      <path d={`M${x - 3.4} ${y + 2} l1.6 -4 M${x - 0.6} ${y + 2} l1.6 -4 M${x + 2.2} ${y + 2} l1.6 -4`} {...fine} strokeWidth={1} />
    </>
  );
}

// Faces share a few stock features: smiling and sleeping eyes, brows, a smile
const happy = (y = 31) => `M17 ${y} Q23 ${y - 6} 29 ${y} M35 ${y} Q41 ${y - 6} 47 ${y}`;
const shut = (y = 31) => `M17 ${y} Q23 ${y + 5} 29 ${y} M35 ${y} Q41 ${y + 5} 47 ${y}`;
const brows = (y = 21) => `M17 ${y} Q23 ${y - 3} 29 ${y} M35 ${y} Q41 ${y - 3} 47 ${y}`;
const worry = (y = 24) => `M17 ${y + 2} L28 ${y - 1.5} M47 ${y + 2} L36 ${y - 1.5}`;
const smile = (y = 44, w = 6, d = 5) => `M${32 - w} ${y} Q32 ${y + d} ${32 + w} ${y}`;
const grin = (y = 41, cx = 32) =>
  `M${cx - 8} ${y} Q${cx} ${y + 2} ${cx + 8} ${y} Q${cx + 7} ${y + 10} ${cx} ${y + 10} Q${cx - 7} ${y + 10} ${cx - 8} ${y} Z`;

const starPath = (cx: number, cy: number, outer: number, inner: number) => `M${star(cx, cy, outer, inner).split(" ").join(" L")} Z`;

const ghost = (x: number, y: number) =>
  `M${x} ${y + 6.5} C${x} ${y} ${x + 9} ${y} ${x + 9} ${y + 6.5} L${x + 9} ${y + 13} l-2.25 -1.6 l-2.25 1.6 l-2.25 -1.6 l-2.25 1.6 Z`;

const leaf = (x: number, y: number, s: number) => `M${x} ${y} Q${x + s} ${y - s} ${x + 2 * s} ${y} Q${x + s} ${y + s} ${x} ${y} Z`;

const lips = (x: number, y: number) => `M${x} ${y} q2 -2.6 4 -0.8 q2 -1.8 4 0.8 q-4 4.6 -8 0 Z`;

// Sleepy half-closed eyes, looking wherever dx points
function Lids({ y = 30, dx = 0 }: { y?: number; dx?: number }) {
  return (
    <>
      <path d={`M17 ${y} L29 ${y} A6 6 0 0 1 17 ${y} Z`} {...ink} strokeWidth={1.6} fill={PAPER} />
      <circle cx={23 + dx} cy={y + 2.5} r="2.2" fill="currentColor" />
      <path d={`M35 ${y} L47 ${y} A6 6 0 0 1 35 ${y} Z`} {...ink} strokeWidth={1.6} fill={PAPER} />
      <circle cx={41 + dx} cy={y + 2.5} r="2.2" fill="currentColor" />
    </>
  );
}

// A little round hand
function Mitt({ x, y, rx = 3.8, ry = 3.2 }: { x: number; y: number; rx?: number; ry?: number }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} {...ink} strokeWidth={1.6} fill={PAPER} />;
}

function Note({ x, y }: { x: number; y: number }) {
  return (
    <>
      <path d={`M${x} ${y} v8 M${x} ${y} q3 1 3.4 4.2`} {...ink} strokeWidth={1.5} />
      <ellipse cx={x - 1.7} cy={y + 8.2} rx="2.1" ry="1.6" fill="currentColor" />
    </>
  );
}

// A puffy cloud sitting on y, s wide
const cloud = (x: number, y: number, s: number) =>
  `M${x} ${y} q${-s * 0.18} ${-s * 0.42} ${s * 0.2} ${-s * 0.46} q${s * 0.08} ${-s * 0.4} ${s * 0.4} ${-s * 0.3} q${s * 0.3} ${-s * 0.06} ${s * 0.32} ${s * 0.3} q${s * 0.34} ${s * 0.06} ${s * 0.26} ${s * 0.46} Z`;

const question = (x: number, y: number, s = 1) =>
  `M${x} ${y + 2 * s} q0 ${-3.4 * s} ${3.4 * s} ${-3.4 * s} q${3.4 * s} 0 ${3.4 * s} ${3.2 * s} q0 ${2.4 * s} ${-3.4 * s} ${3.6 * s} v${2 * s}`;

function Butterfly({ x, y, s = 1, r = 0 }: { x: number; y: number; s?: number; r?: number }) {
  return (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <Tone d={`M${x} ${y} C${x - 5 * s} ${y - 6 * s} ${x - 8 * s} ${y - 1 * s} ${x} ${y} Z M${x} ${y} C${x + 5 * s} ${y - 6 * s} ${x + 8 * s} ${y - 1 * s} ${x} ${y} Z`} w={1.1} />
      <Tone d={`M${x} ${y} C${x - 5 * s} ${y + 1 * s} ${x - 4 * s} ${y + 5 * s} ${x} ${y} Z M${x} ${y} C${x + 5 * s} ${y + 1 * s} ${x + 4 * s} ${y + 5 * s} ${x} ${y} Z`} w={1.1} />
      <path d={`M${x} ${y - 2.6 * s} L${x} ${y + 3 * s} M${x} ${y - 2.6 * s} l${-1.4 * s} ${-2 * s} M${x} ${y - 2.6 * s} l${1.4 * s} ${-2 * s}`} {...fine} strokeWidth={1} />
    </g>
  );
}

// A little round head for group shots, happy and blushing
function Buddy({ x, y, r = 8.5 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} {...ink} strokeWidth={1.7} fill={PAPER} />
      <path d={`M${x - 4.6} ${y - 0.6} q1.6 -2.2 3.2 0 M${x + 1.4} ${y - 0.6} q1.6 -2.2 3.2 0`} {...fine} strokeWidth={1.2} />
      <path d={`M${x - 2} ${y + 3} q2 2 4 0`} {...fine} strokeWidth={1.2} />
      <ellipse cx={x - 5} cy={y + 2.6} rx="1.8" ry="1.1" fill="currentColor" fillOpacity="0.25" />
      <ellipse cx={x + 5} cy={y + 2.6} rx="1.8" ry="1.1" fill="currentColor" fillOpacity="0.25" />
    </>
  );
}

const ART: Record<ReactionId, ReactNode> = {
  sobbed: (
    <>
      <Head />
      <path d="M16 24 L26 21 M48 24 L38 21" {...ink} />
      <Shiny x={23} r={6.5} />
      <Shiny x={41} r={6.5} />
      <Tone d="M19 38.5 C17 45 20 50 17 59 L25.5 59 C23.5 50 26.5 45 26 38.5 Z" />
      <Tone d="M38 38.5 C37.5 45 40.5 50 38.5 59 L47 59 C44 50 47 45 45 38.5 Z" />
      <path d="M27.5 47 Q29.7 43.5 32 46.5 Q34.3 49.5 36.5 46" {...ink} />
    </>
  ),

  "up-late": (
    <>
      <Head />
      <path d="M29.5 12.5 C28.5 7 33 5.5 32 10 M35 13 C37 8.5 40.5 8.5 38.5 12" {...fine} />
      <Eye x={23} y={30} r={7} p={0.26} shine={false} />
      <Eye x={41} y={30} r={7} p={0.26} shine={false} />
      <path d="M17 29 l2.6 0.8 M29 32.5 l-2.6 -0.8 M35 29 l2.6 0.8 M47 32.5 l-2.6 -0.8" {...fine} strokeWidth={0.9} />
      <path d="M17 40 Q23 43.5 29 40 M18.5 43 Q23 45.5 27.5 43 M35 40 Q41 43.5 47 40 M36.5 43 Q41 45.5 45.5 43" {...fine} />
      <path d="M28 50 L36 50" {...ink} />
      <Tone d="M55 4 A6.5 6.5 0 1 0 61 14 A5.5 5.5 0 0 1 55 4 Z" />
      <path d={sparkle(8, 12, 3.2)} fill="currentColor" />
      <path d={sparkle(14, 5, 1.8)} fill="currentColor" />
    </>
  ),

  comfort: (
    <>
      <Head />
      <path d="M17 31 Q23 25 29 31 M35 31 Q41 25 47 31" {...ink} />
      <Blush x={18} y={37} />
      <Blush x={46} y={37} />
      <path d="M28 39.5 Q30 42.5 32 39.5 Q34 42.5 36 39.5" {...ink} strokeWidth={1.7} />
      <path d="M41 50 C47.5 50 47.5 57.5 40.4 57.5" {...ink} />
      <path d="M23 47 L41 47 L39.6 60 Q32 63 24.4 60 Z" {...ink} fill={PAPER} />
      <path d={heart(32, 53.5, 2.6)} fill="currentColor" />
      <ellipse cx="22" cy="54.5" rx="3.6" ry="3" {...ink} strokeWidth={1.6} fill={PAPER} />
      <path d="M28 45.5 q-1.4 -1.6 0 -3 M32 45.5 q1.4 -1.4 0 -2.6 M36 45.5 q-1.4 -1.6 0 -3" {...fine} strokeWidth={1} />
      <Tone d={heart(55, 11, 3)} />
      <path d={sparkle(8, 14, 3)} fill="currentColor" />
    </>
  ),

  yeeted: (
    <>
      <Head />
      <path d="M15 22 L28 27.5 M49 22 L36 27.5" {...ink} strokeWidth={2.4} />
      <Eye x={23} y={33} r={4.6} p={0.5} shine={false} />
      <Eye x={41} y={33} r={4.6} p={0.5} shine={false} />
      <path d="M24 44 Q32 41 40 44 L40 49.5 Q32 52.5 24 49.5 Z" {...ink} fill={PAPER} />
      <path d="M28 43 L28 50.6 M32 42.6 L32 51 M36 43 L36 50.6 M24 46.8 L40 46.8" {...fine} strokeWidth={1.1} />
      <path d="M8 7 q3 1.5 1 4.5 M15 7 q-3 1.5 -1 4.5 M8 18.5 q3 -1.5 1 -4.5 M15 18.5 q-3 -1.5 -1 -4.5" {...ink} strokeWidth={1.7} />
      <g transform="rotate(24 54 10)">
        <rect x="47.5" y="4.5" width="12" height="10" rx="1.2" {...ink} strokeWidth={1.6} fill={PAPER} />
        <path d="M50.5 4.5 L50.5 14.5 M53 8 L57 8" {...fine} strokeWidth={1.1} />
      </g>
      <path d="M38 5 L43.5 6.5 M39 10.5 L44 10.5 M40.5 16 L44.5 14.5" {...fine} />
    </>
  ),

  swooned: (
    <>
      <Head />
      <path d={heart(23, 31, 5.4)} fill="currentColor" />
      <path d={heart(41, 31, 5.4)} fill="currentColor" />
      <circle cx="20.4" cy="28.8" r="1.3" fill={PAPER} />
      <circle cx="38.4" cy="28.8" r="1.3" fill={PAPER} />
      <Blush x={17.5} y={41} />
      <Blush x={46.5} y={41} />
      <path d="M26 43.5 Q32 54 38 43.5 Z" {...ink} fill={PAPER} />
      <Tone d={heart(55, 10, 3.6)} />
      <Tone d={heart(8, 13, 2.6)} />
      <path d={heart(59, 23, 1.8)} fill="currentColor" />
    </>
  ),

  "plot-twist": (
    <>
      <Head />
      <path d="M17 20.5 Q23 16.5 29 20.5 M35 20.5 Q41 16.5 47 20.5" {...ink} />
      <Eye x={23} y={31} r={7.4} p={0.22} shine={false} />
      <Eye x={41} y={31} r={7.4} p={0.22} shine={false} />
      <ellipse cx="32" cy="47.5" rx="4.4" ry="5.4" fill="currentColor" />
      <ellipse cx="32" cy="50" rx="2.2" ry="1.6" fill={PAPER} fillOpacity="0.6" />
      <path d="M32 2.5 L32 8 M20 4.5 L22 9.5 M44 4.5 L42 9.5 M9.5 12 L13.5 15.5 M54.5 12 L50.5 15.5" {...ink} />
      <Tone d={drop(49.5, 21, 0.9)} />
    </>
  ),

  cackled: (
    <>
      <Head />
      <path d="M16.5 31 Q23 23.5 29.5 31 M34.5 31 Q41 23.5 47.5 31" {...ink} strokeWidth={2.2} />
      <path d="M21 37.5 Q32 40 43 37.5 Q42 53.5 32 53.5 Q22 53.5 21 37.5 Z" fill="currentColor" />
      <path d="M23.4 39 Q32 41 40.6 39 L40.2 42 Q32 43.6 23.8 42 Z" fill={PAPER} />
      <path d="M27 50 Q32 45.5 37 50 Q35 52.6 32 52.6 Q29 52.6 27 50 Z" fill={PAPER} fillOpacity="0.7" />
      <Tone d="M13 27.5 c-3 -1.2 -5.4 0 -6.4 2.6 c2.6 1.6 5.4 0.6 6.4 -2.6 Z" />
      <Tone d="M51 27.5 c3 -1.2 5.4 0 6.4 2.6 c-2.6 1.6 -5.4 0.6 -6.4 -2.6 Z" />
      <path d="M6.5 40 l-3.4 1.4 M7 45 l-3.2 2.6 M57.5 40 l3.4 1.4 M57 45 l3.2 2.6" {...fine} />
    </>
  ),

  hangover: (
    <>
      <Head />
      <path d={spiral(23, 32)} {...fine} strokeWidth={1.5} />
      <path d={spiral(41, 32)} {...fine} strokeWidth={1.5} />
      <path d="M24 46.5 q2 -3 4 0 t4 0 t4 0 t4 0" {...ink} />
      <path d="M46.5 21 q2.2 -0.4 2.6 -2.6" {...fine} />
      <path d="M50 13.5 C50 7 59 7 59 13.5 L59 20 l-2.25 -1.6 l-2.25 1.6 l-2.25 -1.6 l-2.25 1.6 Z" {...fine} fill={PAPER} />
      <circle cx="53" cy="12.8" r="0.9" fill="currentColor" />
      <circle cx="56.2" cy="12.8" r="0.9" fill="currentColor" />
      <path d={sparkle(9, 13, 3)} fill="currentColor" />
      <path d={sparkle(15, 6, 1.8)} fill="currentColor" />
    </>
  ),

  screamed: (
    <>
      <Head />
      <path d="M17 26.5 L27 31 L17 35.5 M47 26.5 L37 31 L47 35.5" {...ink} strokeWidth={2.2} />
      <path d="M27 42 Q32 37.5 37 42 Q39 54 32 54 Q25 54 27 42 Z" fill="currentColor" />
      <ellipse cx="32" cy="50.6" rx="2.8" ry="1.9" fill={PAPER} fillOpacity="0.7" />
      <path d="M9 40 C6 44 7 52 12 54 C16 55 18 50 17 46 C16 42 12 38 9 40 Z" {...ink} fill={PAPER} />
      <path d="M10.4 45 l3 1 M10.4 48.6 l3.4 0.5" {...fine} strokeWidth={1.1} />
      <path d="M55 40 C58 44 57 52 52 54 C48 55 46 50 47 46 C48 42 52 38 55 40 Z" {...ink} fill={PAPER} />
      <path d="M53.6 45 l-3 1 M53.6 48.6 l-3.4 0.5" {...fine} strokeWidth={1.1} />
      <path d="M32 2 L32 8 M18 4 L20.5 9 M46 4 L43.5 9 M6 14 L10.5 17 M58 14 L53.5 17 M2.5 27 L7.5 28.5 M61.5 27 L56.5 28.5" {...ink} />
    </>
  ),

  "side-eye": (
    <>
      <Head />
      <path d="M16 24.5 L29 24.5 M35 22.5 Q41 19 47 22.5" {...ink} />
      <path d="M16.5 30 L29.5 30 A6.5 6.5 0 0 1 16.5 30 Z" {...ink} strokeWidth={1.6} fill={PAPER} />
      <circle cx="26.6" cy="32.4" r="2.4" fill="currentColor" />
      <path d="M34.5 30 L47.5 30 A6.5 6.5 0 0 1 34.5 30 Z" {...ink} strokeWidth={1.6} fill={PAPER} />
      <circle cx="44.6" cy="32.4" r="2.4" fill="currentColor" />
      <path d="M27 46.5 L37 45.5" {...ink} />
      <path d="M38.6 43.6 q1.6 1.6 0 3.6" {...fine} />
      <path d="M56 8 l0 5 M56 16 l0 0.4 M60 9 l0 4 M60 16 l0 0.4" {...ink} strokeWidth={1.7} />
    </>
  ),

  "kicking-feet": (
    <>
      <Head />
      <path d="M17 30 Q23 24 29 30 M35 30 Q41 24 47 30" {...ink} />
      <Blush x={17.5} y={36.5} />
      <Blush x={46.5} y={36.5} />
      <path d="M25.5 45 C25.5 40 38.5 40 38.5 45 L39.5 52 C39.5 58.5 25 58.5 24.5 52 Z" {...ink} fill={PAPER} />
      <path d="M29 41.6 L29 47 M32 41.2 L32 47.4 M35 41.6 L35 47" {...fine} strokeWidth={1.1} />
      <Tone d={heart(54, 10, 3.2)} />
      <Tone d={heart(9, 13, 2.5)} />
      <path d="M57 34 l3.2 -1 M57.5 38 l3.2 1 M7 34 l-3.2 -1 M6.5 38 l-3.2 1" {...fine} />
    </>
  ),

  "this-is-fine": (
    <>
      <Head />
      <path d="M17.5 23.5 Q23 21.5 28 23.5 M36 23.5 Q41 21.5 46.5 23.5" {...fine} />
      <circle cx="23" cy="30" r="2.3" fill="currentColor" />
      <circle cx="41" cy="30" r="2.3" fill="currentColor" />
      <path d="M22 39.5 Q32 47.5 42 39.5" {...ink} />
      <path d="M46.5 28.5 l2.6 -1 M47 31.5 l2.6 0.4" {...fine} strokeWidth={1} />
      <Tone d={drop(46, 14.5, 0.9)} />
      <Tone d={flame(8, 63, 24)} />
      <Tone d={flame(54, 63, 24)} />
      <Tone d={flame(20, 63, 15)} />
      <Tone d={flame(42, 63, 15)} />
      <Tone d={flame(31, 63, 9)} />
      <path d="M8 63 q-2 -6 1.5 -10 M54 63 q-2 -6 1.5 -10" {...fine} strokeWidth={1.1} />
    </>
  ),

  "need-sequel": (
    <>
      <Head />
      <path d="M15 23 L26 19 M49 23 L38 19" {...ink} />
      <Shiny x={22.5} y={31.5} r={8} />
      <Shiny x={41.5} y={31.5} r={8} />
      <path d="M29 44.5 Q32 42 35 44.5" {...ink} />
      <path
        d="M25 51.5 C25 47.5 31 47 32 50.5 C33 47 39 47.5 39 51.5 C39 57 35 59.5 32 59.5 C29 59.5 25 57 25 51.5 Z"
        {...ink}
        fill={PAPER}
      />
      <path d="M32 50.5 L32 55.5 M28.5 53.5 l2 1 M35.5 53.5 l-2 1" {...fine} strokeWidth={1.1} />
      <path d={sparkle(55, 11, 4.4)} fill="currentColor" />
      <path d={sparkle(8, 15, 3.2)} fill="currentColor" />
      <path d={sparkle(59, 23, 2)} fill="currentColor" />
    </>
  ),

  "brain-melted": (
    <>
      <Tone d="M17.5 51 C17.5 57 16 60 19.5 61.5 C23 60 21.5 56 22.5 52.5 Z" />
      <Tone d="M40 54 C40 59 39 62 41.8 62.8 C44.6 62 43.5 58 44.5 53 Z" />
      <Tone d="M28.5 55 C28.5 58 28 60.4 30 60.8 C32 60.4 31.5 58 32 55 Z" />
      <Head />
      <Eye x={22} y={30} r={7.5} p={0.34} dx={-2.2} dy={-2} shine={false} />
      <Eye x={42} y={33} r={4.6} p={0.42} dx={1.4} dy={1.4} shine={false} />
      <path d="M22.5 45.5 q2.5 -3 5 0 t5 0" {...ink} />
      <path d="M32.5 45.5 L32.5 49.5 Q35.5 53.5 38.5 49.5 L38.5 45.5" {...ink} strokeWidth={1.7} fill={PAPER} />
      <path d="M35.5 46 L35.5 49.5" {...fine} strokeWidth={1} />
      <path d="M8 8 q3 -4.5 6 -1.4 q1.6 2.6 -2.4 4.6 l0 2.2" {...ink} strokeWidth={1.7} />
      <circle cx="11.6" cy="17" r="1" fill="currentColor" />
      <path d="M50 5 q3 -4.5 6 -1.4 q1.6 2.6 -2.4 4.6 l0 2.2" {...ink} strokeWidth={1.7} />
      <circle cx="53.6" cy="14" r="1" fill="currentColor" />
    </>
  ),

  "fell-asleep": (
    <>
      <Head />
      <path d="M17 31.5 Q23 36.5 29 31.5 M35 31.5 Q41 36.5 47 31.5" {...ink} />
      <path d="M18.4 34.4 l-1.5 2 M23 35.6 l0 2.4 M27.6 34.4 l1.5 2 M36.4 34.4 l-1.5 2 M41 35.6 l0 2.4 M45.6 34.4 l1.5 2" {...fine} strokeWidth={1.1} />
      <Blush x={18} y={42} />
      <Blush x={46} y={42} />
      <ellipse cx="32" cy="45.5" rx="2.5" ry="3.1" fill="currentColor" />
      <Tone d={drop(35.6, 47.5, 0.8)} />
      <path d="M32 3.5 L50.5 13 L48 18.5 L32 10.5 L16 18.5 L13.5 13 Z" {...ink} fill={PAPER} />
      <path d="M32 3.5 L32 10.5 M20 13 L27 9.6 M44 13 L37 9.6" {...fine} strokeWidth={1.1} />
      <path d="M54 2.5 h5.5 l-5.5 5.5 h5.5" {...ink} strokeWidth={1.7} />
      <path d="M57.5 12.5 h3.6 l-3.6 3.6 h3.6" {...fine} />
    </>
  ),

  obsessed: (
    <>
      <Head />
      <polygon points={star(23, 31, 7.6, 3.4)} fill="currentColor" />
      <polygon points={star(41, 31, 7.6, 3.4)} fill="currentColor" />
      <circle cx="21.6" cy="29.4" r="1.2" fill={PAPER} />
      <circle cx="39.6" cy="29.4" r="1.2" fill={PAPER} />
      <path d="M22 41.5 Q32 43.5 42 41.5 Q41 52.5 32 52.5 Q23 52.5 22 41.5 Z" {...ink} fill={PAPER} />
      <path d="M23 46 Q32 48 41 46 M28 42.6 L28.3 51 M32 43 L32 52 M36 42.6 L35.7 51" {...fine} strokeWidth={1.1} />
      <path d={sparkle(54, 9, 4.6)} fill="currentColor" />
      <path d={sparkle(9, 11, 3.6)} fill="currentColor" />
      <path d={sparkle(59, 22, 2.2)} fill="currentColor" />
      <path d={sparkle(5, 24, 2)} fill="currentColor" />
    </>
  ),
  "slow-burn": (
    <>
      <Head />
      <Tone d={flame(31, 13.5, 11)} />
      <path d="M16.5 26 L28 22.5 M47.5 26 L36 22.5" {...ink} />
      <Shiny x={23} y={32.5} r={4.6} />
      <Shiny x={41} y={32.5} r={4.6} />
      <Blush x={17.5} y={40} />
      <Blush x={46.5} y={40} />
      <path d="M25 47 q2.3 -3 4.6 0 t4.6 0 t4.6 0" {...ink} />
      <Tone d={drop(51, 17, 0.9)} />
      <Tone d={drop(11, 19, 0.8)} />
      <path d="M57 30 l3 -1 M57.5 34 l3 0.6 M7 30 l-3 -1 M6.5 34 l-3 0.6" {...fine} />
    </>
  ),

  "lights-on": (
    <>
      <Head />
      <path d="M17 21 Q23 18 29 21 M35 21 Q41 18 47 21" {...ink} />
      <Eye x={23} y={30} r={6.5} p={0.3} shine={false} />
      <Eye x={41} y={30} r={6.5} p={0.3} shine={false} />
      <path d="M5 41 Q14 36.5 22 39.5 Q32 43.5 42 39.5 Q50 36.5 59 41 L60.5 62 L3.5 62 Z" {...ink} fill={PAPER} />
      <path d="M14 45 l-2 17 M26 46 l-1 16 M38 46 l1 16 M50 45 l2 17 M4.5 52.5 Q32 57 59.5 52.5" {...fine} strokeWidth={1.1} />
      <ellipse cx="17" cy="40" rx="4.2" ry="3.2" {...ink} strokeWidth={1.6} fill={PAPER} />
      <ellipse cx="47" cy="40" rx="4.2" ry="3.2" {...ink} strokeWidth={1.6} fill={PAPER} />
      <Tone d={circ(55, 9, 4.6)} />
      <path d="M53.2 13.4 h3.6 v2.6 h-3.6 Z" {...fine} fill={PAPER} />
      <path d="M55 0.8 v1.8 M61.4 9 h1.8 M48.6 9 h-1.8 M59.8 4 l1.3 -1.3 M50.2 4 l-1.3 -1.3" {...fine} />
    </>
  ),

  "chefs-kiss": (
    <>
      <Head />
      <path d="M21.5 16 C14.5 14 15 5 22.5 6 C24.5 0.5 39.5 0.5 41.5 6 C49 5 49.5 14 42.5 16 Z" {...ink} fill={PAPER} />
      <path d="M21.5 16 Q32 13.5 42.5 16 L42.5 19.5 Q32 17 21.5 19.5 Z" {...ink} strokeWidth={1.6} fill={PAPER} />
      <path d="M27 5.5 q-0.5 3.5 1 6 M36.5 5.5 q0.5 3.5 -1 6" {...fine} strokeWidth={1.1} />
      <path d="M17 31 Q23 36 29 31 M35 31 Q41 36 47 31" {...ink} />
      <Blush x={17.5} y={40} />
      <path d="M29 42.5 q4.5 1.6 0 3.6 q4.5 1.6 0 3.6" {...ink} strokeWidth={1.8} />
      <path d="M35.5 46 C39 42.5 46.5 42.5 49.5 46.5 C52.5 50.5 50 56.5 45 56.5 C40.5 56.5 39.5 52 35.5 46 Z" {...ink} fill={PAPER} />
      <path d="M41 47 q3 1.2 2.6 4.4" {...fine} strokeWidth={1.1} />
      <Tone d={heart(56, 26, 2.8)} />
      <path d={sparkle(56, 13, 3.4)} fill="currentColor" />
      <path d={sparkle(8, 16, 3)} fill="currentColor" />
    </>
  ),

  betrayed: (
    <>
      <g transform="rotate(26 46 12)">
        <rect x="43.6" y="-1.5" width="4.8" height="7.5" rx="1.6" {...ink} strokeWidth={1.5} fill="currentColor" fillOpacity="0.22" />
        <path d="M40 7 L52 7" {...ink} />
        <path d="M43.8 8 L48.2 8 L47.6 18 L46 20.5 L44.4 18 Z" {...ink} strokeWidth={1.4} fill={PAPER} />
      </g>
      <Head />
      <path d="M36.5 12.5 l-1.6 -3.6 M31.5 12 l-3.4 -2.2" {...fine} />
      <path d="M16 26 L27 21.5 M48 26 L37 21.5" {...ink} />
      <Eye x={23} y={32.5} r={5.6} p={0.5} />
      <Eye x={41} y={32.5} r={5.6} p={0.5} />
      <Tone d={drop(43.5, 39.5, 1)} />
      <path d="M26 48.5 Q32 43 38 48.5" {...ink} />
      <Tone d={heart(10, 13, 3.8)} />
      <path d="M10 10.8 l-1.6 2 l2.8 1.6 l-1.4 2" {...fine} strokeWidth={1.1} />
    </>
  ),

  "eye-roll": (
    <>
      <Head />
      <path d="M16.5 20.5 L29 21.5 M35 21.5 L47.5 20.5" {...ink} />
      <Eye x={23} y={31} r={6.6} p={0.4} dx={1.4} dy={-3.6} shine={false} />
      <Eye x={41} y={31} r={6.6} p={0.4} dx={1.4} dy={-3.6} shine={false} />
      <path d="M17 39.5 Q23 41.5 29 39.5 M35 39.5 Q41 41.5 47 39.5" {...fine} strokeWidth={1} />
      <path d="M25 47.5 L39 46" {...ink} />
      <path d="M39 46 q2 -0.5 2.4 -2.6" {...fine} />
      <path d="M49 9 a5.5 5.5 0 1 1 5.5 5.5" {...ink} strokeWidth={1.7} />
      <path d="M57.2 12.2 L54.5 14.5 L57.4 16.6" {...ink} strokeWidth={1.7} />
      <path d="M7 12 q2 -3 4 0 t4 0" {...fine} />
    </>
  ),

  hungry: (
    <>
      <Head />
      <Shiny x={23} y={30} r={6.2} />
      <Shiny x={41} y={30} r={6.2} />
      <Blush x={16.5} y={39.5} />
      <Blush x={47.5} y={39.5} />
      <path d="M24 41 Q32 43 40 41 Q39 52 32 52 Q25 52 24 41 Z" fill="currentColor" />
      <path d="M27.5 48.6 Q32 44.5 36.5 48.6 Q34.4 51 32 51 Q29.6 51 27.5 48.6 Z" fill={PAPER} fillOpacity="0.7" />
      <Tone d="M38.2 47.5 C38.2 51.5 37.2 55 39.2 56 C41.2 55 40.4 51.5 40.6 46.5 Z" />
      <Tone d="M49.5 12 C47.5 8 52 7.5 52.5 6 C54 2.5 58.5 4 57.5 7 C61.5 7.5 62 11 60.5 12 Z" />
      <path d="M50 12 L60 12 L58.4 19.5 L51.6 19.5 Z" {...ink} strokeWidth={1.5} fill={PAPER} />
      <path d="M53.2 12.5 l0.5 6.5 M56.8 12.5 l-0.5 6.5" {...fine} strokeWidth={1} />
      <circle cx="55" cy="3.2" r="1.6" fill="currentColor" />
      <path d={sparkle(9, 13, 3.2)} fill="currentColor" />
      <path d={sparkle(15, 6, 1.8)} fill="currentColor" />
    </>
  ),

  villain: (
    <>
      <Tone d="M16 21 C10.5 16 10 8 13.5 3.5 C15.5 9 20 12.5 25 14.5 Z" w={1.7} />
      <Tone d="M48 21 C53.5 16 54 8 50.5 3.5 C48.5 9 44 12.5 39 14.5 Z" w={1.7} />
      <Head />
      <path d="M15 24 L28 28.5 M49 24 L36 28.5" {...ink} strokeWidth={2.4} />
      <path d="M17 32 L29 32 A6 6 0 0 1 17 32 Z" {...ink} strokeWidth={1.6} fill={PAPER} />
      <circle cx="23.6" cy="34.4" r="2.3" fill="currentColor" />
      <path d="M35 32 L47 32 A6 6 0 0 1 35 32 Z" {...ink} strokeWidth={1.6} fill={PAPER} />
      <circle cx="40.4" cy="34.4" r="2.3" fill="currentColor" />
      <path d="M22 44 Q31 53 43 42.5" {...ink} />
      <path d="M43 42.5 q1.8 -0.4 1.8 -2.6" {...fine} />
      <path d="M27.4 47.6 l1.4 3.2 l1.8 -2.2" {...fine} fill={PAPER} />
      <Tone d={heart(58, 28, 2.6)} />
      <path d={heart(6, 28, 1.8)} fill="currentColor" />
    </>
  ),

  annotated: (
    <>
      <Head />
      <path d="M18 21.5 Q22.5 19.5 27 21.5 M37 21.5 Q41.5 19.5 46 21.5" {...fine} />
      <circle cx="22.5" cy="31.5" r="7.2" {...ink} fill={PAPER} />
      <circle cx="41.5" cy="31.5" r="7.2" {...ink} fill={PAPER} />
      <path d="M29.7 30.5 Q32 28.5 34.3 30.5 M15.3 30.5 L11 28.5 M48.7 30.5 L53 28.5" {...ink} strokeWidth={1.7} />
      <circle cx="23.5" cy="32.5" r="2.2" fill="currentColor" />
      <circle cx="42.5" cy="32.5" r="2.2" fill="currentColor" />
      <path d="M27 45.5 Q32 49 37 45.5" {...ink} />
      <Tone d="M33.4 47.4 q3.8 -0.4 3.4 3 q-3.2 0.8 -3.4 -3 Z" />
      <g transform="rotate(38 54 11)">
        <path d="M51.5 2 h5 v12 h-5 Z" {...ink} strokeWidth={1.5} fill={PAPER} />
        <path d="M51.5 5 h5 M54 5 v9" {...fine} strokeWidth={1} />
        <path d="M51.5 14 L54 19.5 L56.5 14 Z" {...ink} strokeWidth={1.5} fill="currentColor" fillOpacity="0.3" />
      </g>
      <Tone d="M3 9 h9 l-2 2.2 l2 2.2 h-9 Z" />
      <Tone d="M3 16.5 h6.5 l-1.8 1.9 l1.8 1.9 h-6.5 Z" />
    </>
  ),

  deceased: (
    <>
      <ellipse cx="32" cy="6.5" rx="10" ry="3" {...ink} strokeWidth={1.8} />
      <Head />
      <path d="M18.5 27 L27.5 35.5 M27.5 27 L18.5 35.5 M36.5 27 L45.5 35.5 M45.5 27 L36.5 35.5" {...ink} strokeWidth={2.3} />
      <path d="M24.5 45 L39.5 45" {...ink} />
      <Tone d="M31 45 L38 45 L38 49.5 Q34.5 53.5 31 49.5 Z" />
      <path d="M34.5 45.5 L34.5 49" {...fine} strokeWidth={1} />
      <Tone d="M48.5 62.5 L48.5 53 C48.5 46 60 46 60 53 L60 62.5 Z" w={1.6} />
      <path d="M54.2 50.5 v6 M51.8 52.8 h4.8" {...fine} />
      <path d="M46 62.8 L62.5 62.8" {...ink} strokeWidth={1.6} />
      <path d={sparkle(8, 14, 3.2)} fill="currentColor" />
      <path d={sparkle(56, 13, 2.4)} fill="currentColor" />
    </>
  ),

  reread: (
    <>
      <Head />
      <path d="M17 29 Q23 23 29 29 M35 29 Q41 23 47 29" {...ink} />
      <Blush x={17.5} y={35} />
      <Blush x={46.5} y={35} />
      <path d="M28 37.5 Q32 41 36 37.5" {...ink} strokeWidth={1.8} />
      <path d="M13 47 Q22.5 43.5 32 47 Q41.5 43.5 51 47 L51 61 Q41.5 57.5 32 61 Q22.5 57.5 13 61 Z" {...ink} fill={PAPER} />
      <path d="M32 47 L32 61" {...ink} strokeWidth={1.5} />
      <path d="M17.5 50.5 q5 -1.6 10.5 0 M17.5 54 q5 -1.6 10.5 0" {...fine} strokeWidth={1} />
      <path d={heart(41.5, 53, 2.6)} fill="currentColor" />
      <ellipse cx="13" cy="54.5" rx="3.3" ry="3.7" {...ink} strokeWidth={1.6} fill={PAPER} />
      <ellipse cx="51" cy="54.5" rx="3.3" ry="3.7" {...ink} strokeWidth={1.6} fill={PAPER} />
      <path d="M53.5 10 C55.5 6 61 6 61 10 C61 14 55.5 14 53.5 10 C51.5 6 46 6 46 10 C46 14 51.5 14 53.5 10 Z" {...ink} strokeWidth={1.7} />
      <Tone d={heart(9, 13, 3)} />
    </>
  ),

  furious: (
    <>
      <Head />
      <path d="M11.5 30 Q14 15 32 13.5 Q50 15 52.5 30 Q32 23 11.5 30 Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M15 23.5 L28 29.5 M49 23.5 L36 29.5" {...ink} strokeWidth={2.6} />
      <circle cx="23" cy="34" r="2.7" fill="currentColor" />
      <circle cx="41" cy="34" r="2.7" fill="currentColor" />
      <path d="M24 49 Q32 41.5 40 49" {...ink} strokeWidth={2.3} />
      <Tone d={circ(5.6, 28, 3.3)} />
      <Tone d={circ(4, 20.5, 2.4)} />
      <Tone d={circ(58.4, 28, 3.3)} />
      <Tone d={circ(60, 20.5, 2.4)} />
      <path d="M51 5 q3 1.5 1 4.5 M58 5 q-3 1.5 -1 4.5 M51 16.5 q3 -1.5 1 -4.5 M58 16.5 q-3 -1.5 -1 -4.5" {...ink} strokeWidth={1.7} />
      <path d="M8 8 l3 3 M13.5 5.5 l1 4" {...fine} />
    </>
  ),

  "called-it": (
    <>
      <Head />
      <path d="M35 21 Q42 16.5 49 20.5" {...ink} />
      <path d="M17 22 L28 22" {...ink} />
      <path d="M14 26 L30 26 L29 33 Q26.5 37.5 21.5 37.5 Q16 37.5 15 33 Z" fill="currentColor" />
      <path d="M50 26 L34 26 L35 33 Q37.5 37.5 42.5 37.5 Q48 37.5 49 33 Z" fill="currentColor" />
      <path d="M29 27.5 L35 27.5 M14.5 27 L10.5 25.5 M49.5 27 L53.5 25.5" {...ink} />
      <path d="M18 32 l4.5 -3.4 M38.5 32 l4.5 -3.4" stroke={PAPER} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M24.5 46 Q33 50 41.5 43" {...ink} />
      <path d="M41.5 43 q1.8 -0.2 2 -2.4" {...fine} />
      <path d={sparkle(55, 11, 4.2)} fill="currentColor" />
      <path d={sparkle(9, 13, 3.2)} fill="currentColor" />
      <path d={sparkle(59, 22, 2)} fill="currentColor" />
    </>
  ),

  chills: (
    <>
      <Head />
      <path d="M17 24 L28 21 M47 24 L36 21" {...ink} />
      <Eye x={23} y={31.5} r={5.6} p={0.3} shine={false} />
      <Eye x={41} y={31.5} r={5.6} p={0.3} shine={false} />
      <path d="M24.5 42.5 h15 q1.2 0 1.2 1.2 v5.6 q0 1.2 -1.2 1.2 h-15 q-1.2 0 -1.2 -1.2 v-5.6 q0 -1.2 1.2 -1.2 Z" {...ink} fill={PAPER} />
      <path d="M23.5 46.5 l2.8 -1.6 l2.8 3.2 l2.9 -3.2 l2.9 3.2 l2.8 -3.2 l2.8 1.6" {...fine} strokeWidth={1.1} />
      <path d="M5.5 28 q-2.4 3 0 6 q2.4 3 0 6 M58.5 28 q2.4 3 0 6 q-2.4 3 0 6" {...fine} />
      <path d={flake(54.5, 10, 5.2)} {...ink} strokeWidth={1.6} />
      <path d={flake(9.5, 12, 4)} {...ink} strokeWidth={1.5} />
      <path d={flake(57.5, 53, 3)} {...fine} />
      <path d={flake(6, 53, 2.4)} {...fine} />
    </>
  ),

  "told-everyone": (
    <>
      <Head />
      <path d="M17 22 Q23 19 29 22 M35 22 Q41 19 47 22" {...ink} />
      <Eye x={23} y={30.5} r={5.2} p={0.55} dx={0.8} />
      <Eye x={41} y={30.5} r={5.2} p={0.55} dx={0.8} />
      <path d="M20.5 41.5 Q26 39.5 31.5 41.5 Q31.5 51.5 26 51.5 Q20.5 51.5 20.5 41.5 Z" fill="currentColor" />
      <path d="M31 43 h5 v7.5 h-5 Z" {...ink} strokeWidth={1.6} fill={PAPER} />
      <path d="M36 43 L54 35.5 Q56.6 46.5 54 58 L36 50.5 Z" {...ink} fill={PAPER} />
      <path d="M49.6 37.4 Q51.8 46.5 49.6 56.2" {...fine} />
      <ellipse cx="41.5" cy="53.5" rx="3.8" ry="3.2" {...ink} strokeWidth={1.6} fill={PAPER} />
      <path d="M58.5 39 l3.6 -2.2 M59.6 46.8 h3.8 M58.5 54.5 l3.6 2.2" {...ink} strokeWidth={1.7} />
      <Tone d={heart(55, 13, 3.2)} />
      <path d={sparkle(9, 13, 3.2)} fill="currentColor" />
    </>
  ),

  "wall-stare": (
    <>
      <Head />
      <circle cx="23" cy="31.5" r="1.9" fill="currentColor" />
      <circle cx="41" cy="31.5" r="1.9" fill="currentColor" />
      <path d="M18.5 36.5 Q23 39 27.5 36.5 M36.5 36.5 Q41 39 45.5 36.5" {...fine} strokeWidth={1.1} />
      <path d="M29 46 L35 46" {...ink} />
      <path d="M46 3.5 h12 q3 0 3 3 v6 q0 3 -3 3 h-6.5 l-4.5 4 l1.2 -4 h-2.2 q-3 0 -3 -3 v-6 q0 -3 3 -3 Z" {...ink} strokeWidth={1.5} fill={PAPER} />
      <circle cx="48.5" cy="9.5" r="1.1" fill="currentColor" />
      <circle cx="52" cy="9.5" r="1.1" fill="currentColor" />
      <circle cx="55.5" cy="9.5" r="1.1" fill="currentColor" />
      <path d="M2 2 L17 4 M2 2 L12.5 12.5 M2 2 L4 17 M9 3 Q8.5 7.5 3 9 M14 3.6 Q12.5 11.5 3.6 14" {...fine} strokeWidth={1.1} />
    </>
  ),

  drama: (
    <>
      <Head />
      <path d="M17 21.5 Q23 18.5 29 21.5 M35 21.5 Q41 18.5 47 21.5" {...ink} />
      <Eye x={24} y={30.5} r={6} p={0.5} dx={1.8} />
      <Eye x={42} y={30.5} r={6} p={0.5} dx={1.8} />
      <path d="M31 43 Q35 46.5 39 43" {...ink} />
      <path d="M43.5 40.5 q4 2.4 0.8 6.4" {...fine} />
      <Tone d="M7 46.5 C4.5 42 9 39.5 11.5 42 C12.5 37.5 18.5 37.5 19.5 41.5 C21.5 38.5 27 40 26 43.5 C28.5 44 28.5 46.5 27 46.5 Z" />
      <path d="M7.5 46.5 L26.5 46.5 L24 62.5 L10 62.5 Z" {...ink} fill={PAPER} />
      <path d="M12.6 46.5 l1.2 16 M17 46.5 l0 16 M21.4 46.5 l-1.2 16" {...fine} strokeWidth={1.1} />
      <Tone d={circ(5, 33, 1.8)} />
      <Tone d={circ(8.5, 27.5, 1.4)} />
      <path d={sparkle(55, 11, 3.8)} fill="currentColor" />
      <path d={sparkle(59, 22, 2)} fill="currentColor" />
    </>
  ),
  peeking: (
    <>
      <Head />
      <Blush x={17} y={45} />
      <Blush x={47} y={45} />
      <path d="M26 50 q2 -2.6 4 0 t4 0 t4 0" {...ink} />
      <path d="M12 36 C10 28 14 22 20 22 C27 22 30 27 30 33 C30 38 26 40 21 40 C16 40 13 39 12 36 Z" {...ink} fill={PAPER} />
      <path d="M17 23.5 L17.5 31 M22 22.5 L22 31 M26.5 24 L26 31" {...fine} strokeWidth={1.1} />
      <path d="M52 36 C54 28 50 22 44 22 C37 22 34 27 34 33 C34 38 38 40 43 40 C48 40 51 39 52 36 Z" {...ink} fill={PAPER} />
      <path d="M47 23.5 L46.5 31 M37.5 24 L38 31" {...fine} strokeWidth={1.1} />
      <path d="M40.2 25 L40.2 31 L43.8 31 L43.8 25" {...fine} strokeWidth={1.1} fill={PAPER} />
      <circle cx="42" cy="28.6" r="1.7" fill="currentColor" />
      <Tone d={drop(51, 11, 0.9)} />
      <path d="M8 13 l3.5 2.5 M12.5 7.5 l2 3.8" {...fine} />
    </>
  ),

  tea: (
    <>
      <Head />
      <path d="M17 21 L29 22.5 M35 22.5 L47 21" {...ink} />
      <Lids y={28} dx={-2.4} />
      <path d="M27 40.5 q-1.6 -2 0 -4 M32 40.5 q1.6 -2 0 -4 M37 40.5 q-1.6 -2 0 -4" {...fine} strokeWidth={1.1} />
      <path d="M43 45.5 C49.5 44.5 49.5 52.5 42 52" {...ink} />
      <path d="M21 42.5 L43 42.5 Q43 56 32 56 Q21 56 21 42.5 Z" {...ink} fill={PAPER} />
      <path d={heart(32, 48.5, 2.4)} fill="currentColor" />
      <path d="M17 59.5 Q32 63.5 47 59.5" {...ink} />
      <path d={sparkle(55, 11, 3.6)} fill="currentColor" />
      <path d={sparkle(9, 14, 2.6)} fill="currentColor" />
    </>
  ),

  detective: (
    <>
      <Head />
      <Tone d="M13 21 C13 6 51 6 51 21 Z" w={1.7} />
      <path d="M7 21.5 Q32 16 57 21.5 Q32 26.5 7 21.5 Z" {...ink} fill={PAPER} />
      <path d="M27.5 5 l4.5 2.6 l4.5 -2.6 l0 5.4 l-4.5 -2.6 l-4.5 2.6 Z" {...ink} strokeWidth={1.4} fill={PAPER} />
      <Eye x={21.5} y={34} r={4} p={0.5} shine={false} />
      <path d="M47.5 41 L56.5 50" {...ink} strokeWidth={3.2} />
      <circle cx="41.5" cy="35" r="8.6" {...ink} strokeWidth={2.2} fill={PAPER} />
      <Eye x={41.5} y={35} r={5.8} p={0.5} />
      <path d="M22 48 Q28 51.5 34 47" {...ink} />
      <path d={sparkle(6, 42, 2.6)} fill="currentColor" />
    </>
  ),

  crown: (
    <>
      <Head />
      <Tone d="M17.5 18 L15 3.5 L24 10.5 L32 2 L40 10.5 L49 3.5 L46.5 18 Q32 14 17.5 18 Z" w={1.7} />
      <circle cx="15" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="32" cy="2" r="1.5" fill="currentColor" />
      <circle cx="49" cy="3.5" r="1.5" fill="currentColor" />
      <path d={shut(30)} {...ink} />
      <path d="M17 30 l-2.6 -1.4 M47 30 l2.6 -1.4" {...fine} />
      <Blush x={17.5} y={38} />
      <Blush x={46.5} y={38} />
      <path d="M25 43 Q33 50 41 41.5" {...ink} />
      <path d={sparkle(58, 24, 3.6)} fill="currentColor" />
      <path d={sparkle(6, 24, 3)} fill="currentColor" />
      <path d={sparkle(59, 38, 1.8)} fill="currentColor" />
    </>
  ),

  clown: (
    <>
      <Tone d={circ(9.5, 27, 4.2)} />
      <Tone d={circ(7.5, 35, 3.6)} />
      <Tone d={circ(54.5, 27, 4.2)} />
      <Tone d={circ(56.5, 35, 3.6)} />
      <Head />
      <Tone d="M26 13.5 L34 2.5 L40 13 Z" w={1.6} />
      <circle cx="34" cy="2.5" r="1.9" fill="currentColor" />
      <path d="M23 24.5 v12 M41 24.5 v12" {...fine} />
      <circle cx="23" cy="30.5" r="2.4" fill="currentColor" />
      <circle cx="41" cy="30.5" r="2.4" fill="currentColor" />
      <Tone d={circ(32, 38.5, 4.2)} w={1.6} />
      <circle cx="30.6" cy="37" r="1" fill={PAPER} />
      <path d="M21 46 Q32 54 43 46" {...ink} />
      <path d="M21 46 q-1.6 -0.4 -1.8 -2.4 M43 46 q1.6 -0.4 1.8 -2.4" {...fine} />
      <Tone d={drop(46.5, 35, 0.9)} />
    </>
  ),

  snail: (
    <>
      <Head />
      <path d="M27 13.5 C24.5 13 24.5 9 25 5.5" {...ink} />
      <path d="M25 5.5 l-2.2 -3 M25 5.5 l1.6 -3.4" {...fine} />
      <path d="M26 13.6 L43 13.6" {...ink} />
      <Tone d={circ(36, 8, 5.6)} w={1.6} />
      <path d={spiral(36, 8, 4, 1.7)} {...fine} strokeWidth={1.1} />
      <Lids y={30} />
      <path d="M27 46 L37 46" {...ink} />
      <circle cx="50" cy="12" r="1.1" fill="currentColor" />
      <circle cx="54" cy="9.5" r="1.1" fill="currentColor" />
      <circle cx="58" cy="7" r="1.1" fill="currentColor" />
      <Tone d={drop(11, 20, 0.8)} />
    </>
  ),

  rollercoaster: (
    <>
      <path d="M2 12 C9 12 10 2 19 2 C28 2 29 9.5 37 9.5 C45 9.5 46 3 54 3 C59 3 60 6 62 9" {...ink} strokeWidth={1.7} />
      <path d="M8 9.5 v4 M14 4 v4 M24 3 v4 M31 8 v3.6 M43 8.5 v3.6 M50 3.6 v4 M58 4.5 v4" {...fine} strokeWidth={1} />
      <Head />
      <path d="M17 31 Q23 25 29 31" {...ink} />
      <Blush x={17.5} y={37} />
      <Shiny x={41} y={31} r={5.6} />
      <Tone d="M38.5 38 C38 44 40.5 48 39 56 L45 56 C43 48 45.5 44 44 38 Z" />
      <path d="M21 47 q2.4 -3.4 4.8 0 t4.8 0 t4.8 0" {...ink} />
    </>
  ),

  attacked: (
    <>
      <path d="M3 4 L25 22" {...ink} />
      <path d="M3 4 l5.5 0.6 M3 4 l0.6 5.5 M6.6 7 l5.5 0.6 M6.6 7 l0.6 5.5" {...fine} />
      <Head />
      <path d="M27.5 15 l1.4 -3.6 M18.5 25.5 l-3.8 0.8" {...fine} />
      <path d="M21 23 L29 22 M35 21.5 L47 21.5" {...ink} />
      <Eye x={23} y={32} r={6} p={0.3} shine={false} />
      <Eye x={41} y={32} r={6} p={0.3} shine={false} />
      <path d="M27 47 L37 47" {...ink} />
      <Tone d={drop(50, 15, 1)} />
      <path d="M56 28 l3.4 -1 M56.5 33 l3.4 0.6" {...fine} />
    </>
  ),

  healed: (
    <>
      <Head />
      <Tone d={heart(32, 5.6, 3.6)} />
      <path d="M24 5 l-3.4 -1.6 M40 5 l3.4 -1.6" {...fine} />
      <path d={shut(30)} {...ink} />
      <Blush x={17.5} y={38} />
      <Blush x={46.5} y={38} />
      <path d={smile(41, 5, 4)} {...ink} />
      <g transform="rotate(-32 44 21)">
        <rect x="36.5" y="18" width="15" height="6.4" rx="3.2" {...ink} strokeWidth={1.4} fill={PAPER} />
        <path d="M41.5 18 v6.4 M46.5 18 v6.4" {...fine} strokeWidth={1} />
      </g>
      <Mitt x={28} y={52} />
      <Mitt x={36} y={52} />
      <path d={sparkle(8, 16, 3)} fill="currentColor" />
      <path d={sparkle(57, 12, 2.6)} fill="currentColor" />
    </>
  ),

  wrecked: (
    <>
      <Head />
      <path d="M30 12.6 l3.4 5.2 l-4.4 4 l4 3.8 l-2 3" {...ink} strokeWidth={1.6} />
      <Tone d="M38 6.5 l4.4 -2.4 l1.2 4.8 Z" />
      <circle cx="21.5" cy="34" r="1.9" fill="currentColor" />
      <circle cx="42.5" cy="34" r="1.9" fill="currentColor" />
      <path d="M17 39 Q21.5 41.5 26 39 M38 39 Q42.5 41.5 47 39" {...fine} strokeWidth={1.1} />
      <path d="M23 48 q2.25 -3 4.5 0 t4.5 0 t4.5 0 t4.5 0" {...ink} />
      <path d="M44 43 l5 4 M49 43 l-5 4" {...ink} strokeWidth={1.6} />
      <Tone d={drop(18.5, 40.5, 0.8)} />
      <path d="M8 14 l3 2.6 M54 16 l3 -2.6" {...fine} />
    </>
  ),

  nostalgia: (
    <>
      <Head />
      <Eye x={23} y={31} r={5.8} p={0.5} dx={1.6} dy={-2} />
      <Eye x={41} y={31} r={5.8} p={0.5} dx={1.6} dy={-2} />
      <Blush x={17.5} y={40} />
      <Blush x={46.5} y={40} />
      <path d={smile(44, 5, 3.6)} {...ink} />
      <Tone d="M44 12.5 C39.5 12.5 39.5 6 44.5 6.5 C45.5 1.5 53.5 1.5 54.5 6 C60 5.5 61.5 12.5 56.5 13 Z" />
      <path d={heart(50, 8.4, 2)} fill="currentColor" />
      <Tone d={circ(47.5, 16.6, 1.5)} />
      <path d={sparkle(9, 14, 3.2)} fill="currentColor" />
      <path d={sparkle(15, 6, 1.8)} fill="currentColor" />
    </>
  ),

  hug: (
    <>
      <path d="M12 43 L6 46 M52 43 L58 46" {...ink} strokeWidth={2.4} />
      <Head />
      <Mitt x={5} y={47} rx={4.2} ry={3.8} />
      <Mitt x={59} y={47} rx={4.2} ry={3.8} />
      <path d={happy(30)} {...ink} />
      <Blush x={17.5} y={36} />
      <Blush x={46.5} y={36} />
      <path d={grin(40)} fill="currentColor" />
      <path d="M27.5 47.6 Q32 43.8 36.5 47.6 Q34.4 49.6 32 49.6 Q29.6 49.6 27.5 47.6 Z" fill={PAPER} fillOpacity="0.7" />
      <Tone d={heart(8, 14, 3)} />
      <Tone d={heart(56, 13, 3.4)} />
      <path d={heart(59, 29, 1.8)} fill="currentColor" />
      <path d={heart(5, 31, 1.6)} fill="currentColor" />
    </>
  ),

  fight: (
    <>
      <Head />
      <path d="M11.6 25 Q32 17.5 52.4 25" {...ink} strokeWidth={2.6} />
      <path d="M52.4 25 l5.6 -2.4 M52.4 25 l5.4 2.8" {...ink} strokeWidth={1.6} />
      <path d="M17 28.5 L28 31.5 M47 28.5 L36 31.5" {...ink} strokeWidth={2.3} />
      <Eye x={23} y={36} r={4.2} p={0.55} shine={false} />
      <Eye x={41} y={36} r={4.2} p={0.55} shine={false} />
      <path d="M26.5 48 Q32 45.5 37.5 48" {...ink} />
      <Tone d="M4 53 C1 47 5 42 10 43 C15 42 19 46 18 52 C17 58 8 60 4 53 Z" w={1.7} />
      <path d="M13 45 q3 2 1.5 6" {...fine} />
      <Tone d="M60 53 C63 47 59 42 54 43 C49 42 45 46 46 52 C47 58 56 60 60 53 Z" w={1.7} />
      <path d="M51 45 q-3 2 -1.5 6" {...fine} />
      <path d="M5 38 l-3 -2 M59 38 l3 -2" {...fine} />
    </>
  ),

  haunted: (
    <>
      <Head />
      <path d={worry(22)} {...ink} />
      <Eye x={23} y={31.5} r={5.8} p={0.36} dx={2.2} shine={false} />
      <Eye x={41} y={31.5} r={5.8} p={0.36} dx={2.2} shine={false} />
      <path d="M27 46.5 q2.5 -2.6 5 0 t5 0" {...ink} />
      <path d={ghost(51, 3)} {...fine} fill={PAPER} />
      <circle cx="54" cy="9" r="0.9" fill="currentColor" />
      <circle cx="57.2" cy="9" r="0.9" fill="currentColor" />
      <Tone d={ghost(2, 9)} />
      <circle cx="5" cy="15" r="0.9" fill="currentColor" />
      <circle cx="8.2" cy="15" r="0.9" fill="currentColor" />
      <path d="M57 26 q2.4 2.6 0 5.2 q-2.4 2.6 0 5.2" {...fine} />
      <Tone d={drop(13.5, 27, 0.7)} />
    </>
  ),

  magic: (
    <>
      <Head />
      <Tone d="M17 18 C24 11 28 4.5 40 1.5 C38.5 7 42 12.5 47 18 Z" w={1.7} />
      <path d="M9 18.5 Q32 11.5 55 18.5 Q32 23.5 9 18.5 Z" {...ink} fill={PAPER} />
      <polygon points={star(33, 10.5, 2.8, 1.2)} fill="currentColor" />
      <Shiny x={23} y={33} r={6} />
      <Shiny x={41} y={33} r={6} />
      <Blush x={16.5} y={42} />
      <Blush x={47.5} y={42} />
      <path d={smile(45, 5, 4.5)} {...ink} />
      <path d="M50 57 L58.5 42" {...ink} strokeWidth={2.2} />
      <path d={sparkle(59.5, 37.5, 3.8)} fill="currentColor" />
      <path d={sparkle(5.5, 30, 2.8)} fill="currentColor" />
      <path d={sparkle(8, 44, 1.8)} fill="currentColor" />
    </>
  ),

  spicy: (
    <>
      <Head />
      <path d={brows(21)} {...ink} />
      <Lids y={29} />
      <Blush x={17} y={40} />
      <Blush x={47} y={40} />
      <path d="M28 45.5 Q32 43 36 45.5 Q36 50.5 32 50.5 Q28 50.5 28 45.5 Z" fill="currentColor" />
      <Tone d={drop(12, 16, 0.9)} />
      <Tone d={drop(7.5, 26, 0.7)} />
      <Tone d="M53 62.5 L38 57 A16 16 0 0 1 61 48.6 Z" w={1.6} />
      <path d="M53 62.5 L41.7 51.2 M53 62.5 L47.5 47.5 M53 62.5 L54.4 46.6" {...fine} strokeWidth={1.1} />
      <path d="M36 52 l-3 -1.2 M37.5 47.5 l-2.6 -2" {...fine} />
      <Tone d={flame(54, 17, 12)} />
    </>
  ),

  nope: (
    <>
      <Head />
      <path d={brows(21)} {...ink} />
      <path d={shut(29)} {...ink} />
      <path d="M24 45.5 Q28 43 33 45" {...ink} />
      <path d="M40 61 C38 53 40 45 46 44 C52 43 57.5 48 56.5 55 C56 59 52 62 48 63 Z" {...ink} fill={PAPER} />
      <path d="M44.5 45.5 L45 51.5 M48.5 44.5 L48.5 51.5 M52.5 46 L52 52" {...fine} strokeWidth={1.1} />
      <path d="M51 4.5 l8.5 8.5 M59.5 4.5 l-8.5 8.5" {...ink} strokeWidth={2.4} />
      <path d="M6 14 q2 -3 4 0 t4 0" {...fine} />
    </>
  ),

  forgot: (
    <>
      <Head />
      <path d="M17 23 Q23 20 29 23 M35 21 L47 22.5" {...ink} />
      <circle cx="23" cy="31" r="2.1" fill="currentColor" />
      <circle cx="41" cy="31" r="2.1" fill="currentColor" />
      <path d={grin(41.5)} {...ink} fill={PAPER} />
      <path d="M24.8 45 Q32 46.8 39.2 45 M28 42.4 L28.3 50 M32 42.8 L32 51 M36 42.4 L35.7 50" {...fine} strokeWidth={1.1} />
      <Tone d={drop(50, 17, 1)} />
      <path d="M6 13.5 C1.5 13.5 1.5 7 6.5 7.5 C7.5 2.5 15.5 2.5 16.5 7 C22 6.5 23.5 13.5 18.5 14 Z" {...fine} fill={PAPER} />
      <path d={circ(20, 18, 1.4)} {...fine} fill={PAPER} />
      <path d="M8 10.5 h1 M12 10.5 h1 M16 10.5 h1" {...ink} strokeWidth={1.6} />
    </>
  ),

  prose: (
    <>
      <Head />
      <path d={brows(21)} {...ink} />
      <path d={shut(29.5)} {...ink} />
      <Blush x={46.5} y={38} />
      <path d="M27 42.5 Q32 44.5 37 42.5 Q36.5 49.5 32 49.5 Q27.5 49.5 27 42.5 Z" fill="currentColor" />
      <Mitt x={15} y={43} rx={4.4} ry={3.8} />
      <Tone d="M60.5 2 C52 3 47 9 46 17.5 C52.5 16.5 59.5 11 60.5 2 Z" w={1.5} />
      <path d="M60.5 2 L43 21.5" {...ink} strokeWidth={1.4} />
      <path d="M52.5 6.5 l-1 4.2 M56 9 l-4.2 1" {...fine} strokeWidth={1} />
      <Tone d={heart(9, 13, 3)} />
      <path d={sparkle(6, 28, 2.2)} fill="currentColor" />
    </>
  ),

  protect: (
    <>
      <Head />
      <path d="M17 23.5 L28 26.5 M47 23.5 L36 26.5" {...ink} strokeWidth={2.3} />
      <Eye x={23} y={32} r={4.8} p={0.55} />
      <Eye x={41} y={32} r={4.8} p={0.55} />
      <path d="M27 41.5 Q32 39.5 37 41.5" {...ink} />
      <path d="M22 45.5 L42 45.5 L42 53.5 C42 58.5 37 62 32 63.5 C27 62 22 58.5 22 53.5 Z" {...ink} fill={PAPER} />
      <path d={heart(32, 53.5, 3.4)} fill="currentColor" />
      <Mitt x={21} y={51.5} />
      <Mitt x={43} y={51.5} />
      <path d={sparkle(55, 11, 3.6)} fill="currentColor" />
      <path d={sparkle(9, 13, 2.8)} fill="currentColor" />
    </>
  ),

  bought: (
    <>
      <Head />
      <Shiny x={23} y={30} r={6} />
      <Shiny x={41} y={30} r={6} />
      <Blush x={16.5} y={39.5} />
      <path d={grin(41, 28)} fill="currentColor" />
      <path d="M44 46.5 C44 39 54 39 54 46.5" {...ink} strokeWidth={1.6} />
      <path d="M40 46.5 L58 46.5 L59.5 62.5 L38.5 62.5 Z" {...ink} fill={PAPER} />
      <path d={heart(49, 54.5, 2.8)} fill="currentColor" />
      <Tone d={circ(11, 12, 4.2)} w={1.5} />
      <path d="M11 10 v4 M5.6 9.6 l-3 -1.6 M5.2 12.6 l-3.2 0.2" {...fine} />
      <Tone d={circ(20, 5.5, 2.6)} />
      <path d={sparkle(56, 13, 3.4)} fill="currentColor" />
    </>
  ),

  overdue: (
    <>
      <Head />
      <path d={happy(31)} {...ink} />
      <path d={grin(41.5)} {...ink} fill={PAPER} />
      <path d="M24.8 45 Q32 46.8 39.2 45 M28 42.4 L28.3 50 M32 42.8 L32 51 M36 42.4 L35.7 50" {...fine} strokeWidth={1.1} />
      <Tone d={drop(50, 17, 1)} />
      <path d="M4.5 6.5 l2.2 -2.6 M15.5 6.5 l-2.2 -2.6 M6.5 17.5 l-1.6 2.2 M13.5 17.5 l1.6 2.2" {...ink} strokeWidth={1.6} />
      <Tone d={circ(10, 12, 6.4)} w={1.6} />
      <path d="M10 12 L10 8 M10 12 L13 13.6" {...ink} strokeWidth={1.4} />
      <path d="M19 6 l2.4 -1.6 M20 10.5 l2.8 0" {...fine} />
    </>
  ),

  audiobook: (
    <>
      <path d="M10 30 C10 3 54 3 54 30" {...ink} strokeWidth={2.4} />
      <Head />
      <Tone d="M5 26 h5 q2 0 2 2 v11 q0 2 -2 2 h-5 q-2 0 -2 -2 v-11 q0 -2 2 -2 Z" w={1.7} />
      <Tone d="M54 26 h5 q2 0 2 2 v11 q0 2 -2 2 h-5 q-2 0 -2 -2 v-11 q0 -2 2 -2 Z" w={1.7} />
      <path d={happy(31)} {...ink} />
      <Blush x={20} y={37.5} />
      <Blush x={44} y={37.5} />
      <path d={smile(42, 6, 5)} {...ink} />
      <Note x={59} y={5} />
      <Note x={7} y={7} />
      <path d="M5 50 l-2.6 1.6 M59 50 l2.6 1.6" {...fine} />
    </>
  ),

  bath: (
    <>
      <Head />
      <Tone d="M13 22 C10 6 30 0.5 42 5 C52 9 54 16 51 22 C40 16 24 16 13 22 Z" w={1.7} />
      <path d="M22 9 Q30 12 34 17.5 M40 6 Q40.5 12 37 16.5" {...fine} strokeWidth={1.1} />
      <path d={shut(30)} {...ink} />
      <Blush x={17.5} y={38} />
      <Blush x={46.5} y={38} />
      <path d={smile(41, 5, 4)} {...ink} />
      <Tone d="M1.5 56 Q8 52.5 14 56 T26 56 T38 56 T50 56 T62.5 56 L62.5 64 L1.5 64 Z" w={1.6} />
      <Tone d="M43 56 C43 51.5 53 51.5 54.5 56 Z" />
      <Tone d={circ(47, 50, 2.7)} />
      <path d="M49.5 49.6 l2.8 0.6 l-2.8 1" {...fine} strokeWidth={1.1} />
      <circle cx="46.4" cy="49.4" r="0.6" fill="currentColor" />
      <path d={circ(6, 45, 3.4)} {...fine} fill={PAPER} />
      <path d={circ(10.5, 51, 2.2)} {...fine} fill={PAPER} />
      <path d={circ(58.5, 44, 2.8)} {...fine} fill={PAPER} />
      <path d={circ(56.5, 37.5, 1.8)} {...fine} fill={PAPER} />
    </>
  ),

  cat: (
    <>
      <Head />
      <path d="M45.5 15.5 C54 15.5 56.5 9 52 5.5" {...ink} />
      <Tone d="M20 9.5 L19.5 1.5 L26.5 5 Z" w={1.6} />
      <Tone d="M44 9.5 L44.5 1.5 L37.5 5 Z" w={1.6} />
      <Tone d="M18 17 C15.5 6.5 26 3.5 32 3.5 C38 3.5 48.5 6.5 46 17 Q32 13 18 17 Z" w={1.7} />
      <path d="M25 9 q1.6 1.6 3.2 0 M35.8 9 q1.6 1.6 3.2 0 M31 11.2 l1 1 l1 -1" {...fine} strokeWidth={1.1} />
      <path d="M23 11.6 l-4 -0.4 M41 11.6 l4 -0.4" {...fine} strokeWidth={0.9} />
      <Eye x={23} y={32} r={5.2} p={0.5} dy={-2.2} />
      <Eye x={41} y={32} r={5.2} p={0.5} dy={-2.2} />
      <Blush x={17.5} y={40.5} />
      <Blush x={46.5} y={40.5} />
      <path d={smile(45, 5, 4)} {...ink} />
      <Tone d={heart(8, 14, 2.8)} />
      <path d={heart(58, 24, 1.8)} fill="currentColor" />
    </>
  ),

  rainy: (
    <>
      <Head />
      <Tone d="M7 16 C7 -3.5 57 -3.5 57 16 Q50.75 11.5 44.5 16 Q38.25 11.5 32 16 Q25.75 11.5 19.5 16 Q13.25 11.5 7 16 Z" w={1.7} />
      <path d="M19.5 16 Q22 6 32 1.6 Q42 6 44.5 16" {...fine} strokeWidth={1.1} />
      <path d={happy(32)} {...ink} />
      <Blush x={17.5} y={38.5} />
      <Blush x={46.5} y={38.5} />
      <path d={smile(44, 5, 4)} {...ink} />
      <Tone d={drop(4.5, 24, 0.8)} />
      <Tone d={drop(59, 25, 0.8)} />
      <Tone d={drop(6, 41, 0.7)} />
      <Tone d={drop(58, 43, 0.7)} />
      <Tone d={drop(11, 54, 0.6)} />
      <Tone d={drop(52.5, 55, 0.6)} />
    </>
  ),

  beach: (
    <>
      <Head />
      <Tone d="M19 16 C19 2 45 2 45 16 Z" w={1.7} />
      <path d="M2.5 16.5 Q32 8.5 61.5 16.5 Q32 24 2.5 16.5 Z" {...ink} fill={PAPER} />
      <path d="M19.4 12.6 Q32 9.5 44.6 12.6" {...ink} strokeWidth={1.7} />
      <path d={happy(33)} {...ink} />
      <Blush x={17.5} y={39.5} />
      <Blush x={46.5} y={39.5} />
      <path d={smile(44, 7, 6)} {...ink} />
      <Tone d={starPath(8, 50, 5.2, 2.3)} />
      <path d="M43 58.5 q3 -3.4 6 0 t6 0 t6 0" {...ink} strokeWidth={1.6} />
      <path d="M47 62.5 q3 -3 6 0 t6 0" {...fine} />
      <path d={sparkle(58, 32, 2.4)} fill="currentColor" />
    </>
  ),

  autumn: (
    <>
      <Head />
      <path d={happy(29)} {...ink} />
      <Blush x={17.5} y={35} />
      <Blush x={46.5} y={35} />
      <path d={smile(39, 5, 3.6)} {...ink} />
      <Tone d="M36 57 L44.5 55 L46.5 63.5 L38.5 64 Z" w={1.6} />
      <Tone d="M13.5 46.5 Q32 55 50.5 46.5 L51.5 55 Q32 63.5 12.5 55 Z" w={1.7} />
      <path d="M22 50.5 l-1 7.6 M32 52.5 l0 8 M42 50.5 l1 7.6" {...fine} strokeWidth={1.1} />
      <g transform="rotate(-28 51 9)">
        <Tone d={leaf(46, 9, 5)} />
        <path d="M46 9 h12.5" {...fine} strokeWidth={1} />
      </g>
      <g transform="rotate(35 8 14)">
        <Tone d={leaf(4, 14, 4)} />
        <path d="M4 14 h10" {...fine} strokeWidth={1} />
      </g>
      <g transform="rotate(-60 57 26)">
        <Tone d={leaf(54, 26, 3)} />
      </g>
    </>
  ),

  "mind-blown": (
    <>
      <Head />
      <Tone d="M17 18 C9.5 16 10.5 7 17 8 C17 0.5 28.5 0 30.5 5 C34.5 -1 45.5 1 44.5 8 C52 6 55 15 47 18 C40 21 24 21 17 18 Z" w={1.7} />
      <path d="M24 10 q2.5 2.6 5.5 0.6 M36 8.5 q2 2.8 5 1.2" {...fine} strokeWidth={1.1} />
      <path d="M7 5 l3.2 3.2 M57 5 l-3.2 3.2 M3 14 l4 0.8 M61 14 l-4 0.8" {...ink} strokeWidth={1.6} />
      <Eye x={23} y={33} r={6.4} p={0.22} shine={false} />
      <Eye x={41} y={33} r={6.4} p={0.22} shine={false} />
      <ellipse cx="32" cy="48" rx="3.6" ry="4.6" fill="currentColor" />
      <path d={sparkle(6, 28, 2.6)} fill="currentColor" />
      <path d={sparkle(58, 28, 2.6)} fill="currentColor" />
    </>
  ),

  proud: (
    <>
      <Head />
      <path d={happy(31)} {...ink} />
      <Tone d={drop(15.5, 33, 0.9)} />
      <Tone d={drop(48.5, 33, 0.9)} />
      <Blush x={21} y={38.5} />
      <Blush x={43} y={38.5} />
      <path d="M24 41.5 Q32 49.5 40 41.5" {...ink} />
      <path d="M32 50 v-2.4 M26.5 50.5 l-1.6 -2 M37.5 50.5 l1.6 -2" {...fine} />
      <Mitt x={28} y={56.5} rx={4.6} ry={4} />
      <Mitt x={36} y={56.5} rx={4.6} ry={4} />
      <Tone d={starPath(55, 12, 6.2, 2.7)} />
      <path d={sparkle(9, 13, 3.2)} fill="currentColor" />
    </>
  ),

  triangle: (
    <>
      <Head />
      <path d="M17 22.5 L28 20.5 M36 20.5 L47 22.5" {...ink} />
      <Eye x={23} y={31} r={5.6} p={0.42} dx={-2.4} shine={false} />
      <Eye x={41} y={31} r={5.6} p={0.42} dx={2.4} shine={false} />
      <path d="M25 46.5 q2.3 -3 4.6 0 t4.6 0 t4.6 0" {...ink} />
      <path d="M54 4 L61 17 L47 17 Z" {...ink} strokeWidth={1.5} />
      <path d={heart(54, 4, 2)} fill="currentColor" />
      <path d={heart(61, 17, 2)} fill="currentColor" />
      <path d={heart(47, 17, 2)} fill="currentColor" />
      <path d="M7 9 q3 -4.5 6 -1.4 q1.6 2.6 -2.4 4.6 l0 2.2" {...ink} strokeWidth={1.7} />
      <circle cx="10.6" cy="18" r="1" fill="currentColor" />
      <Tone d={drop(52.5, 24, 0.8)} />
    </>
  ),

  cliffhanger: (
    <>
      <path d="M19 9 L20.5 17 M35 9 L36.5 13.5" {...ink} strokeWidth={2.4} />
      <Head />
      <Tone d="M0 0 L43 0 L43 7 Q38 9.5 33 7.5 Q25 10 18 8 Q9 10.5 0 8 Z" w={1.7} />
      <Mitt x={19} y={8.5} rx={4} ry={3.2} />
      <Mitt x={35} y={8.5} rx={4} ry={3.2} />
      <path d={worry(23)} {...ink} />
      <Eye x={23} y={32} r={5.6} p={0.4} dy={2.4} shine={false} />
      <Eye x={41} y={32} r={5.6} p={0.4} dy={2.4} shine={false} />
      <path d="M27 47 Q32 43 37 47 Q32 50 27 47 Z" fill="currentColor" />
      <Tone d={drop(50.5, 18, 0.9)} />
      <Tone d={circ(53, 50, 1.5)} />
      <Tone d={circ(57.5, 57, 1.1)} />
      <path d="M53 44 v3 M57.5 51 v3" {...fine} />
    </>
  ),

  yawn: (
    <>
      <Head />
      <path d="M17 22 L29 22 M35 22 L47 22" {...ink} />
      <path d={shut(29)} {...ink} />
      <Tone d={drop(47.5, 33, 0.8)} />
      <ellipse cx="31" cy="46" rx="5.6" ry="6.6" fill="currentColor" />
      <ellipse cx="31" cy="50" rx="3" ry="2" fill={PAPER} fillOpacity="0.7" />
      <Mitt x={41} y={50} rx={4.4} ry={3.8} />
      <path d="M51 13 q4.5 -7 9 0 q-4.5 6 -9 0" {...fine} strokeDasharray="1.6 2.2" />
      <circle cx="51" cy="13" r="1.5" fill="currentColor" />
      <path d="M49.6 11.6 l-1.6 -1.8 M52.2 11.4 l0.8 -2.2" {...fine} strokeWidth={1} />
      <path d="M7 12 h4.5 l-4.5 4.5 h4.5" {...fine} />
    </>
  ),

  kisses: (
    <>
      <Head />
      <path d={happy(31)} {...ink} />
      <Blush x={17} y={40} />
      <path d="M26 44 q3 4.4 6 0 q3 4.4 6 0" {...ink} />
      <g transform="rotate(-14 30 17)">
        <Tone d={lips(26, 17)} w={1.2} />
      </g>
      <g transform="rotate(16 45 39)">
        <Tone d={lips(41, 39)} w={1.2} />
      </g>
      <g transform="rotate(-20 17 48)">
        <Tone d={lips(15, 49)} w={1.2} />
      </g>
      <Tone d={heart(55, 11, 3.6)} />
      <path d={heart(8, 13, 2.2)} fill="currentColor" />
      <path d={heart(59, 24, 1.6)} fill="currentColor" />
    </>
  ),
  cosy: (
    <>
      <Head />
      <Tone d="M8.5 38 C6 18 18 6.5 32 6.5 C46 6.5 58 18 55.5 38 C53 24 44 15.5 32 15.5 C20 15.5 11 24 8.5 38 Z" w={1.7} />
      <path d="M16 21 l3 2.4 M22 13.6 l1.6 3 M42 13.6 l-1.6 3 M48 21 l-3 2.4" {...fine} strokeWidth={1} />
      <path d={shut(32)} {...ink} />
      <Blush x={18} y={39} />
      <Blush x={46} y={39} />
      <path d={smile(42, 3.6, 2.6)} {...ink} />
      <Tone d="M5 49 Q32 42 59 49 L61 63.5 L3 63.5 Z" w={1.7} />
      <path d="M16 47 l-1.6 16 M24 45.6 l-0.6 17.4 M40 45.6 l0.6 17.4 M48 47 l1.6 16 M4 55.5 Q32 49 60 55.5" {...fine} strokeWidth={1} strokeDasharray="2.4 1.8" />
      <path d={sparkle(5, 10, 2.6)} fill="currentColor" />
      <path d={sparkle(59, 9, 2.6)} fill="currentColor" />
    </>
  ),

  "happy-tears": (
    <>
      <Head />
      <path d={happy(31)} {...ink} strokeWidth={2.2} />
      <Tone d={drop(14.5, 33, 1.1)} />
      <Tone d={drop(49.5, 33, 1.1)} />
      <Tone d={drop(11, 45, 0.8)} />
      <Tone d={drop(53, 45, 0.8)} />
      <path d={grin(40)} {...ink} fill={PAPER} />
      <path d="M26 43.5 Q32 45 38 43.5" {...fine} strokeWidth={1} />
      <path d={sparkle(8, 13, 3)} fill="currentColor" />
      <Tone d={heart(55, 11, 3.2)} />
    </>
  ),

  "laughed-cried": (
    <>
      <Head />
      <path d="M16.5 31 Q23 24 29.5 31" {...ink} strokeWidth={2.2} />
      <path d="M35 22.5 L47 25" {...ink} />
      <Shiny x={41} y={32} r={6} />
      <Tone d={drop(45, 39, 1.2)} />
      <path d="M21 42 Q26 50 31 45 Q34 42.5 38 46 Q40 48 43 45" {...ink} />
      <path d="M5 22 l3 1.6 M5.5 28 l3.4 0 M6 34 l3 -1.4" {...fine} />
      <path d={sparkle(9, 11, 2.8)} fill="currentColor" />
      <Tone d={drop(55, 8, 0.8)} />
    </>
  ),

  "soft-cry": (
    <>
      <Head />
      <path d={worry(23)} {...ink} />
      <Shiny x={23} y={32} r={5.6} />
      <Shiny x={41} y={32} r={5.6} />
      <Tone d={drop(20, 39, 1.3)} />
      <path d="M27 47.5 q2.5 -3 5 0 q2.5 3 5 0" {...ink} strokeWidth={1.7} />
      <Blush x={46} y={40} />
      <path d={heart(55, 11, 2.6)} fill="currentColor" />
      <path d={sparkle(8, 14, 2.4)} fill="currentColor" />
    </>
  ),

  "happy-ending": (
    <>
      <circle cx="55" cy="9.5" r="4" {...ink} strokeWidth={1.5} fill="currentColor" fillOpacity="0.22" />
      <path d="M55 1.5 v2 M62.5 9.5 h-2 M60.5 4 l-1.4 1.4 M60.5 15 l-1.4 -1.4 M49.5 4 l1.4 1.4" {...fine} />
      <Head />
      <path d="M17 30 Q23 35 29 30 M35 30 Q41 35 47 30" {...ink} />
      <Blush x={18} y={38} />
      <Blush x={46} y={38} />
      <path d={smile(42, 6, 4.5)} {...ink} />
      <Tone d="M12 51 L52 51 L50 60 L54 63 L10 63 L14 60 Z" w={1.5} />
      <path d={heart(32, 57, 2.4)} fill="currentColor" />
      <path d="M51 41 q4 -1 4.5 3.4 q-0.4 3.4 -4 3" {...fine} strokeDasharray="1.4 1.8" />
      <path d={sparkle(7, 12, 2.8)} fill="currentColor" />
    </>
  ),

  butterflies: (
    <>
      <Head />
      <Shiny x={23} y={31} r={6} />
      <Shiny x={41} y={31} r={6} />
      <Blush x={17} y={40} />
      <Blush x={47} y={40} />
      <path d="M26 45 q3 3 6 0 q3 3 6 0" {...ink} />
      <Butterfly x={53} y={11} s={1.5} r={18} />
      <Butterfly x={9} y={13} s={1.2} r={-16} />
      <Butterfly x={56} y={54} s={1.1} r={-10} />
      <path d="M40 15 q4 -6 6.5 -2 M17 24 q-2 -4 -5.5 -2" {...fine} strokeDasharray="1.4 2" />
    </>
  ),

  pining: (
    <>
      <Tone d="M52 2.5 A7 7 0 1 0 60.5 13 A6 6 0 0 1 52 2.5 Z" />
      <Head />
      <path d="M17 22 Q23 19.5 29 23 M35 23 Q41 19.5 47 22" {...fine} strokeWidth={1.5} />
      <Shiny x={24} y={29} r={5.6} />
      <Shiny x={42} y={29} r={5.6} />
      <Blush x={17} y={38} />
      <Blush x={47} y={38} />
      <ellipse cx="32" cy="43" rx="2" ry="2.4" {...ink} strokeWidth={1.5} fill={PAPER} />
      <Mitt x={26} y={52} />
      <Mitt x={38} y={52} />
      <path d={heart(9, 12, 2.6)} fill="currentColor" />
      <path d="M44 9 q2 -3 4 0" {...fine} />
      <path d={sparkle(6, 26, 2)} fill="currentColor" />
    </>
  ),

  "enemies-lovers": (
    <>
      <path d="M43 2.5 L61 20.5 M61 2.5 L43 20.5" {...ink} strokeWidth={2} />
      <path d="M45.5 9 l-3 3 M58.5 9 l3 3" {...ink} strokeWidth={2.4} />
      <Head />
      <path d="M16 22 L28 25 M48 22 L36 25" {...ink} />
      <Lids y={29} dx={1.4} />
      <Blush x={18} y={39} />
      <Blush x={46} y={39} />
      <path d="M26 45 Q32 48 38.5 42.5" {...ink} />
      <Tone d={heart(52, 13, 3.4)} />
      <path d="M7 6 L11.5 12 L8 12 L12 18.5" {...fine} strokeWidth={1.4} />
    </>
  ),

  confused: (
    <>
      <Head />
      <path d="M16 23 Q22 17 29 21 M36 25.5 L47 25.5" {...ink} />
      <Eye x={23} y={31} r={6.2} p={0.34} shine={false} />
      <Eye x={41} y={32} r={4.2} p={0.45} shine={false} />
      <path d="M24 45 q2 -2.6 4 0 t4 0 t4 0 t4 0" {...ink} />
      <path d={question(48, 4, 1.2)} {...ink} />
      <circle cx="51.4" cy="16.6" r="1.2" fill="currentColor" />
      <path d={question(6, 8, 0.9)} {...fine} strokeWidth={1.5} />
      <circle cx="9.1" cy="18" r="1" fill="currentColor" />
      <Tone d={drop(55, 30, 0.9)} />
    </>
  ),

  "morally-grey": (
    <>
      <Head />
      <path d="M32 12.5 C19.5 13 10 21.5 10 34 C10 46.5 19.5 56 32 56 Z" fill="currentColor" fillOpacity="0.2" />
      <ellipse cx="22" cy="7" rx="9" ry="2.6" {...fine} strokeWidth={1.4} transform="rotate(-10 22 7)" />
      <Tone d="M43 17.5 L50.5 4.5 L49 19 Z" w={1.4} />
      <path d="M16 23 L28 25 M48 21 L36 25" {...ink} />
      <Lids y={29.5} dx={-1.6} />
      <path d="M25 44 Q32 47 39 41" {...ink} />
      <path d={sparkle(6, 22, 2.4)} fill="currentColor" />
      <path d={flame(57, 30, 7)} {...fine} fill="currentColor" fillOpacity="0.22" />
    </>
  ),

  winter: (
    <>
      <Head />
      <Tone d="M11 31 C10 12 54 12 53 31 Z" w={1.7} />
      <rect x="9.5" y="27" width="45" height="7" rx="3" {...ink} strokeWidth={1.6} fill={PAPER} />
      <path d="M15 27.5 v6 M21 27.5 v6 M27 27.5 v6 M33 27.5 v6 M39 27.5 v6 M45 27.5 v6 M51 28 v5" {...fine} strokeWidth={1} />
      <circle cx="32" cy="9.5" r="4.4" {...ink} strokeWidth={1.6} fill={PAPER} />
      <path d={happy(40)} {...ink} />
      <Blush x={17} y={46} />
      <Blush x={47} y={46} />
      <path d={smile(48, 3.6, 3)} {...ink} />
      <path d={flake(6, 12, 3.4)} {...fine} />
      <path d={flake(58, 15, 3)} {...fine} />
      <path d={flake(58, 50, 2.4)} {...fine} />
      <path d={flake(6, 47, 2.4)} {...fine} />
    </>
  ),

  spooky: (
    <>
      <Head />
      <path d="M17 24 L28 27 M47 24 L36 27" {...ink} />
      <Shiny x={23} y={33} r={5.6} />
      <Shiny x={41} y={33} r={5.6} />
      <ellipse cx="32" cy="45" rx="3.6" ry="4.4" fill="currentColor" />
      <g transform="rotate(10 53 11)">
        <path d={ghost(48, 3)} {...ink} strokeWidth={1.5} fill={PAPER} />
        <circle cx="51" cy="9" r="0.9" fill="currentColor" />
        <circle cx="54" cy="9" r="0.9" fill="currentColor" />
      </g>
      <Tone d="M3 57 C3 50 9.5 49 11 52 C12.5 49 19 50 19 57 C19 63 12 63.5 11 61.6 C10 63.5 3 63 3 57 Z" w={1.4} />
      <path d="M11 52 q-0.4 -2.6 1.6 -3.6 M7 56 l1.6 -1.4 l1.4 1.4 M12 56 l1.6 -1.4 l1.4 1.4" {...fine} strokeWidth={1} />
      <path d="M3 13 q2.4 -3 4.6 0 q1.2 -2 2.4 -0.4 q1.2 -1.6 2.4 0.4 q2.2 -3 4.6 0 q-3.6 -0.8 -4.6 2.4 q-1.4 -1 -2.4 0 q-1 -1 -2.4 0 q-1 -3.2 -4.6 -2.4 Z" fill="currentColor" />
    </>
  ),

  wholesome: (
    <>
      <path d="M32 2.5 v5 M2.5 34 h4 M61.5 34 h-4 M11 13 l3.4 3.4 M53 13 l-3.4 3.4 M11 55 l3.4 -3.4 M53 55 l-3.4 -3.4 M20 5 l1.6 4 M44 5 l-1.6 4 M4.5 22 l4 1.6 M59.5 22 l-4 1.6" {...ink} strokeWidth={1.7} />
      <Head />
      <path d={happy(31)} {...ink} />
      <Blush x={17.5} y={38} />
      <Blush x={46.5} y={38} />
      <path d="M25 42 Q32 51 39 42 Z" {...ink} fill={PAPER} />
      <path d="M28.6 46.4 Q32 44.4 35.4 46.4" {...fine} strokeWidth={1} />
    </>
  ),

  dreamy: (
    <>
      <Head />
      <path d="M17 22.5 Q23 20 29 22.5 M35 22.5 Q41 20 47 22.5" {...fine} strokeWidth={1.5} />
      <Lids y={30} />
      <path d="M17 30 l-1.6 -1.8 M47 30 l1.6 -1.8" {...fine} strokeWidth={1} />
      <Blush x={18} y={39} />
      <Blush x={46} y={39} />
      <path d={smile(43, 4, 3)} {...ink} />
      <Tone d={cloud(3, 62, 22)} w={1.5} />
      <Tone d={cloud(39, 62, 22)} w={1.5} />
      <Tone d={cloud(45, 16, 15)} w={1.3} />
      <polygon points={star(9, 10, 3.4, 1.4)} fill="currentColor" />
      <path d={sparkle(17, 4, 1.8)} fill="currentColor" />
      <path d={sparkle(59, 28, 2.2)} fill="currentColor" />
    </>
  ),

  worldbuilding: (
    <>
      <Head />
      <polygon points={star(23, 30, 6.4, 2.8)} fill="currentColor" />
      <polygon points={star(41, 30, 6.4, 2.8)} fill="currentColor" />
      <ellipse cx="32" cy="41.5" rx="2.6" ry="3" fill="currentColor" />
      <Tone d="M11 48 L53 48 L53 61 L11 61 Z" w={1.6} />
      <path d="M8.5 47 C8.5 44 13.5 44 13.5 47 L13.5 62 C13.5 64.5 8.5 64.5 8.5 62 Z M50.5 47 C50.5 44 55.5 44 55.5 47 L55.5 62 C55.5 64.5 50.5 64.5 50.5 62 Z" {...ink} strokeWidth={1.5} fill={PAPER} />
      <path d="M17 58 l4 -6 l3 3.4 l3 -5 l4 7.6 M36 52 q4 3 8 0 q2 4 -1 6" {...fine} strokeWidth={1.1} />
      <path d="M44.5 54 l2.4 2.4 M46.9 54 l-2.4 2.4" {...fine} strokeWidth={1.2} />
      <path d={sparkle(6, 12, 3)} fill="currentColor" />
      <path d={sparkle(58, 12, 3)} fill="currentColor" />
    </>
  ),

  "hidden-gem": (
    <>
      <Head />
      <Shiny x={23} y={29} r={5.8} />
      <Shiny x={41} y={29} r={5.8} />
      <Blush x={16.5} y={37} />
      <Blush x={47.5} y={37} />
      <ellipse cx="32" cy="38.5" rx="2.2" ry="2.6" {...ink} strokeWidth={1.5} fill={PAPER} />
      <Tone d="M21 49 L26.5 43.5 L37.5 43.5 L43 49 L32 61.5 Z" w={1.6} />
      <path d="M21 49 L43 49 M26.5 43.5 L29 49 L32 61.5 L35 49 L37.5 43.5" {...fine} strokeWidth={1.1} />
      <Mitt x={18.5} y={52} />
      <Mitt x={45.5} y={52} />
      <path d={sparkle(52, 44, 2.6)} fill="currentColor" />
      <path d={sparkle(8, 12, 3.2)} fill="currentColor" />
      <path d={sparkle(56, 11, 2.2)} fill="currentColor" />
    </>
  ),

  "found-family": (
    <>
      <Tone d={heart(32, 14, 6)} />
      <path d={sparkle(14, 12, 2.6)} fill="currentColor" />
      <path d={sparkle(50, 12, 2.6)} fill="currentColor" />
      <Buddy x={14} y={41} r={8.5} />
      <Buddy x={50} y={41} r={8.5} />
      <Buddy x={32} y={36} r={10} />
      <path d="M8 52 Q14 60 22 54 M42 54 Q50 60 56 52" {...ink} strokeWidth={1.6} />
      <path d="M22 50.5 Q32 57 42 50.5" {...ink} strokeWidth={1.6} />
      <Mitt x={22} y={52} rx={2.8} ry={2.4} />
      <Mitt x={42} y={52} rx={2.8} ry={2.4} />
    </>
  ),

  discuss: (
    <>
      <Head />
      <Eye x={23} y={32} r={5.6} p={0.5} />
      <Eye x={41} y={32} r={5.6} p={0.5} />
      <path d="M17 23 L28 21 M47 23 L36 21" {...ink} />
      <path d={grin(41)} fill="currentColor" />
      <Tone d="M2 4.5 Q2 1.5 5 1.5 L19 1.5 Q22 1.5 22 4.5 L22 10 Q22 13 19 13 L13 13 L10 17.5 L9.6 13 L5 13 Q2 13 2 10 Z" w={1.4} />
      <path d="M9 4.2 v3.8 M15 4.2 v3.8" {...ink} strokeWidth={1.8} />
      <circle cx="9" cy="10.4" r="0.8" fill="currentColor" />
      <circle cx="15" cy="10.4" r="0.8" fill="currentColor" />
      <Tone d="M42 4.5 Q42 1.5 45 1.5 L59 1.5 Q62 1.5 62 4.5 L62 10 Q62 13 59 13 L54.4 13 L54 17.5 L51 13 L45 13 Q42 13 42 10 Z" w={1.4} />
      <path d="M46.5 7.4 h1 M51.5 7.4 h1 M56.5 7.4 h1" {...ink} strokeWidth={2.2} />
    </>
  ),

  "made-me-think": (
    <>
      <circle cx="50" cy="12" r="9" {...ink} strokeWidth={1.5} fill={PAPER} />
      <circle cx="41" cy="24" r="2" {...fine} />
      <circle cx="37" cy="28.5" r="1.2" fill="currentColor" />
      <path d="M47 15.5 C44 13 45.5 6.5 50 6.5 C54.5 6.5 56 13 53 15.5 Z" {...fine} fill="currentColor" fillOpacity="0.22" />
      <path d="M47.6 17.6 h4.8 M48.4 19.6 h3.2" {...fine} strokeWidth={1.1} />
      <Head />
      <path d="M17 22 Q23 18 29 22 M35 25 L46 25" {...ink} />
      <Eye x={23} y={31} r={5.6} p={0.5} dx={1.8} dy={-1.8} shine={false} />
      <path d="M35 31 L47 31" {...ink} />
      <path d="M26 45 L36 43.5" {...ink} />
      <Mitt x={37} y={51} rx={4.4} ry={3.8} />
      <path d="M33.6 49 q1.6 -2 3.4 -2.4" {...fine} strokeWidth={1} />
      <path d={sparkle(7, 12, 2.8)} fill="currentColor" />
    </>
  ),

  inspired: (
    <>
      <Head />
      <path d="M16 23 L28 21.5 M48 23 L36 21.5" {...ink} />
      <polygon points={star(23, 31, 5.8, 2.6)} fill="currentColor" />
      <polygon points={star(41, 31, 5.8, 2.6)} fill="currentColor" />
      <path d={smile(42, 5.5, 4.5)} {...ink} />
      <g transform="rotate(40 49 47)">
        <rect x="46.5" y="34" width="5" height="20" rx="1.2" {...ink} strokeWidth={1.6} fill={PAPER} />
        <path d="M46.5 54 L49 59.5 L51.5 54 Z" {...fine} fill="currentColor" />
        <path d="M46.5 38 h5" {...fine} />
      </g>
      <path d="M9 55 q4 -4 8 0 t8 0" {...fine} />
      <path d={sparkle(58, 6, 3.4)} fill="currentColor" />
      <path d={sparkle(6, 10, 2.4)} fill="currentColor" />
      <path d={sparkle(12, 4, 1.6)} fill="currentColor" />
    </>
  ),

  "one-sitting": (
    <>
      <Head />
      <Eye x={23} y={29} r={6.6} p={0.3} dy={1.6} shine={false} />
      <Eye x={41} y={29} r={6.6} p={0.3} dy={1.6} shine={false} />
      <path d="M29 39.5 L35 39.5" {...ink} />
      <Tone d="M12 49 Q22 44.5 32 49 Q42 44.5 52 49 L52 60 Q42 55.5 32 60 Q22 55.5 12 60 Z" w={1.6} />
      <path d="M32 49 L32 60 M16 51.5 q7 -2.6 12 0 M36 51.5 q6 -2.6 12 0 M16 54.5 q7 -2.6 12 0 M36 54.5 q6 -2.6 12 0" {...fine} strokeWidth={1} />
      <path d="M53 2.5 h9 M53 17.5 h9 M54.5 2.5 C54.5 8 57.5 8 57.5 10 C57.5 12 54.5 12 54.5 17.5 M60.5 2.5 C60.5 8 57.5 8 57.5 10 C57.5 12 60.5 12 60.5 17.5" {...fine} strokeWidth={1.3} />
      <path d="M55.5 17 L57.5 13.6 L59.5 17 Z" fill="currentColor" />
      <path d={sparkle(7, 11, 2.6)} fill="currentColor" />
    </>
  ),

  "slump-breaker": (
    <>
      <path d="M4.5 30 A28 28 0 0 1 59.5 30" {...ink} strokeWidth={1.8} />
      <path d="M7.6 30 A24.8 24.8 0 0 1 56.4 30" {...fine} strokeWidth={4} strokeOpacity="0.22" />
      <path d="M10.6 30 A21.6 21.6 0 0 1 53.4 30" {...fine} strokeWidth={1.4} />
      <Head />
      <path d={happy(32)} {...ink} strokeWidth={2.2} />
      <path d={grin(40)} {...ink} fill={PAPER} />
      <Mitt x={7.5} y={42} />
      <Mitt x={56.5} y={42} />
      <path d="M4 50 l-1.6 2.6 M7.6 51 v3 M60 50 l1.6 2.6 M56.4 51 v3" {...fine} />
      <path d={sparkle(32, 4, 3)} fill="currentColor" />
    </>
  ),

  overhyped: (
    <>
      <Head />
      <path d="M17 26 L29 26 M35 26 L47 26" {...ink} />
      <Lids y={30.5} dx={2} />
      <path d="M26 44.5 L38 44.5" {...ink} />
      <Tone d="M43 12 L56.5 4.5 L56.5 21 L43 15.5 Z" w={1.5} />
      <rect x="39" y="11.5" width="4" height="4.6" rx="1" {...fine} fill={PAPER} />
      <path d="M44 15.6 l1 4.6 l2.4 -0.4 l-0.6 -3.4" {...fine} strokeWidth={1.1} />
      <path d="M59 9 q1.6 1 0 2 M59 14 q1.6 1 0 2" {...fine} strokeWidth={1} strokeDasharray="1 1.4" />
      <circle cx="7" cy="16" r="1.1" fill="currentColor" />
      <circle cx="11" cy="16" r="1.1" fill="currentColor" />
      <circle cx="15" cy="16" r="1.1" fill="currentColor" />
    </>
  ),

  "almost-dnf": (
    <>
      <Head />
      <path d={worry(23)} {...ink} />
      <Lids y={30} dx={-1.6} />
      <path d="M25 46 q2.3 -2.6 4.6 0 t4.6 0 t4.6 0" {...ink} />
      <Tone d={drop(50, 17, 1.2)} />
      <g transform="rotate(-12 11 11)">
        <rect x="3.5" y="4" width="14" height="11" rx="1.2" {...ink} strokeWidth={1.6} fill={PAPER} />
        <path d="M7 4 L7 15 M10.5 8 h4.4" {...fine} strokeWidth={1.1} />
        <path d="M13 15 L13 23 L14.6 21.4 L16.2 23 L16.2 15" {...fine} fill="currentColor" fillOpacity="0.22" />
      </g>
      <path d="M53 32 l4 -1 M54 37 l4 0.4" {...fine} />
    </>
  ),
};

export default function StampArt({ id, title }: { id: ReactionId; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {ART[id]}
    </svg>
  );
}
