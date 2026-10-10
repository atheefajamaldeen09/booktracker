// Shared bits for drawing the book nooks: the same storybook style as the
// shelf ornaments (thin ink outlines, flat colour), on a 200 × 320 canvas.
// The scene shows through the opening of the case: x 12–188, y 26–308.

import type { ReactNode } from "react";

export const INK = "#3b2a22";
export const WARM = "#ffd98a";
export const GLASS = "#6a7180";

export const ink = { stroke: INK, strokeWidth: 1.1, strokeLinejoin: "round", strokeLinecap: "round" } as const;
export const thin = { stroke: INK, strokeWidth: 0.7, strokeOpacity: 0.5, strokeLinecap: "round", fill: "none" } as const;

// lit: the lights piece is in, so windows and lamps glow. id keeps gradient ids unique.
export type Ctx = { lit: boolean; id: string };
// z is the drawing order (low = further back), separate from the building order
export type PieceArt = { z: number; art: (c: Ctx) => ReactNode };
export type Scene = Record<string, PieceArt>;

const n = (v: number) => Math.round(v * 100) / 100;

// A soft halo round a light; only there once the lights are on
export function Glow({ c, x, y, r, o = 0.9 }: { c: Ctx; x: number; y: number; r: number; o?: number }) {
  if (!c.lit) return null;
  return <circle cx={x} cy={y} r={r} fill={`url(#${c.id}-glow)`} opacity={o} />;
}

// A window pane: dull glass until the lights go on
export function Win({
  c, x, y, w, h, r = 1.5, bars = true, on = WARM, off = GLASS,
}: { c: Ctx; x: number; y: number; w: number; h: number; r?: number; bars?: boolean; on?: string; off?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={c.lit ? on : off} {...ink} />
      {bars && <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} {...thin} strokeOpacity="0.7" />}
    </g>
  );
}

// A paper lantern hanging from (x, y)
export function Lantern({ c, x, y, s = 1, fill = "#d9534a" }: { c: Ctx; x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow c={c} x={0} y={9} r={16} o={0.7} />
      <path d="M0 0V3" {...ink} />
      <rect x="-2.5" y="2.5" width="5" height="2" fill={INK} />
      <ellipse cx="0" cy="10" rx="5.2" ry="6.4" fill={c.lit && fill !== "#d9534a" ? WARM : fill} {...ink} />
      <path d="M-2.4 4.6Q-4 10 -2.4 15.4M2.4 4.6Q4 10 2.4 15.4" {...thin} />
      <rect x="-2.5" y="15.5" width="5" height="2" fill={INK} />
    </g>
  );
}

// A small sitting cat, its feet at (x, y)
export function Cat({ x, y, s = 1, fill = "#e8a87c", flip = false }: { x: number; y: number; s?: number; fill?: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M6 -2C13 -2 14 -10 9 -12" fill="none" stroke={INK} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M6 -2C13 -2 14 -10 9 -12" fill="none" stroke={fill} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M-7 0C-9 -9 -5 -14 0 -14C5 -14 9 -9 7 0Z" fill={fill} {...ink} />
      <path d="M-5.5 -17L-5 -23L-1 -19.5ZM5.5 -17L5 -23L1 -19.5Z" fill={fill} {...ink} />
      <circle cx="0" cy="-16" r="5.6" fill={fill} {...ink} />
      <path d="M-3.2 -16.5q1.2 1 2.4 0M0.8 -16.5q1.2 1 2.4 0" {...thin} strokeOpacity="0.9" />
      <path d="M-0.8 -14.4h1.6l-0.8 0.9z" fill="#c9776b" />
    </g>
  );
}

// A curled-up sleeping cat, lying on (x, y)
export function SleepingCat({ x, y, s = 1, fill = "#8c8480" }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-11 0C-13 -8 -5 -11 2 -10C9 -9 12 -5 11 0Z" fill={fill} {...ink} />
      <circle cx="-7" cy="-5" r="4.6" fill={fill} {...ink} />
      <path d="M-10.5 -8L-10.5 -12L-7.5 -9.5ZM-4 -8.5L-3.5 -12L-6.3 -9.6Z" fill={fill} {...ink} />
      <path d="M-9 -5q1 0.8 2 0M-5.8 -5q1 0.8 2 0" {...thin} strokeOpacity="0.9" />
      <path d="M11 0C6 2 -2 2 -6 0" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
      <path d="M11 0C6 2 -2 2 -6 0" fill="none" stroke={fill} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

export const BOOK_COLOURS = ["#c8674f", "#7d97b3", "#d9a441", "#8fa58a", "#9a6a8a", "#e3a3a0", "#5f8a86", "#e8a87c", "#4e5d82", "#efe3cf"];

// A row of book spines standing on a shelf, filling the width
export function Spines({ x, y, w, h, seed = 0 }: { x: number; y: number; w: number; h: number; seed?: number }) {
  const out: ReactNode[] = [];
  let cx = x;
  for (let i = 0; cx < x + w - 1.5; i++) {
    const k = (seed * 7 + i * 13) % 11;
    const bw = Math.min(3 + (k % 4) * 0.8, x + w - cx);
    const bh = h - (k % 5) * (h * 0.06);
    // Now and then a book leans on its neighbour
    const lean = k === 4 && bw > 3 ? -8 : 0;
    out.push(
      <rect
        key={i}
        x={n(cx)}
        y={n(y + h - bh)}
        width={n(bw)}
        height={n(bh)}
        fill={BOOK_COLOURS[(k + i + seed) % BOOK_COLOURS.length]}
        stroke={INK}
        strokeWidth="0.5"
        strokeOpacity="0.7"
        transform={lean ? `rotate(${lean} ${n(cx + bw)} ${n(y + h)})` : undefined}
      />
    );
    cx += bw;
  }
  return <>{out}</>;
}

// A leaf growing from (x, y), pointing up before it's turned
export function Leaf({ x, y, len, w, rot, fill = "#7f9e5f" }: { x: number; y: number; len: number; w: number; rot: number; fill?: string }) {
  const d = `M0 0C${w} ${n(-len * 0.2)} ${n(w * 0.8)} ${n(-len * 0.78)} 0 ${-len}C${n(-w * 0.8)} ${n(-len * 0.78)} ${-w} ${n(-len * 0.2)} 0 0Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d} fill={fill} {...ink} strokeWidth="0.8" />
      <path d={`M0 -1V${n(-len * 0.85)}`} {...thin} />
    </g>
  );
}

// A flower pot with its rim at the top, standing on (x, y)
export function Pot({ x, y, w = 12, h = 10, fill = "#c27a4e" }: { x: number; y: number; w?: number; h?: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x - w / 2 + 1} ${y - h}L${n(x - w / 2 + 2.5)} ${y}H${n(x + w / 2 - 2.5)}L${x + w / 2 - 1} ${y - h}Z`} fill={fill} {...ink} />
      <rect x={x - w / 2} y={y - h - 2.5} width={w} height="3" rx="1" fill={fill} {...ink} />
    </g>
  );
}

// A four-point sparkle
export function Sparkle({ x, y, s = 3, fill = "#fff3c4" }: { x: number; y: number; s?: number; fill?: string }) {
  return <path d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`} fill={fill} />;
}

// The street running away from you, with a few cobbles
export function Street({ fill, far = 205 }: { fill: string; far?: number }) {
  return (
    <g>
      <path d={`M12 308H188L116 ${far}H84Z`} fill={fill} {...ink} />
      <path
        d="M30 300q6 -3 12 0M60 292q6 -3 12 0M132 296q6 -3 12 0M156 302q6 -3 12 0M74 262q5 -2 10 0M118 270q5 -2 10 0M92 236q4 -2 8 0M106 222q3 -1 6 0M40 284q5 -2 10 0M146 280q5 -2 10 0"
        {...thin}
      />
    </g>
  );
}

// A sitting teddy bear, its seat at (x, y)
export function Bear({ x, y, s = 1, fill = "#c9925a" }: { x: number; y: number; s?: number; fill?: string }) {
  const PALE = "#ecd3ae";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-9" cy="-2.5" rx="5" ry="3.6" fill={fill} {...ink} />
      <ellipse cx="9" cy="-2.5" rx="5" ry="3.6" fill={fill} {...ink} />
      <ellipse cx="0" cy="-10" rx="10" ry="11" fill={fill} {...ink} />
      <ellipse cx="0" cy="-8.5" rx="5.6" ry="6.6" fill={PALE} />
      <ellipse cx="-10.5" cy="-13" rx="3.4" ry="5.6" fill={fill} {...ink} transform="rotate(25 -10.5 -13)" />
      <ellipse cx="10.5" cy="-13" rx="3.4" ry="5.6" fill={fill} {...ink} transform="rotate(-25 10.5 -13)" />
      <circle cx="-6.5" cy="-30.5" r="3.4" fill={fill} {...ink} />
      <circle cx="6.5" cy="-30.5" r="3.4" fill={fill} {...ink} />
      <circle cx="0" cy="-24" r="8.6" fill={fill} {...ink} />
      <ellipse cx="0" cy="-21.4" rx="3.7" ry="2.9" fill={PALE} />
      <circle cx="-3.2" cy="-25.6" r="0.95" fill={INK} />
      <circle cx="3.2" cy="-25.6" r="0.95" fill={INK} />
      <path d="M-1.1 -22.6h2.2l-1.1 1.3z" fill={INK} />
    </g>
  );
}

const FLAGS = ["#c8674f", "#d9a441", "#8fa58a", "#7d97b3", "#e3a3a0"];

// A string of little flags from (x1, y1) to (x2, y2), dipping by `sag` in the middle
export function Bunting({ x1, y1, x2, y2, sag = 8, count = 8 }: { x1: number; y1: number; x2: number; y2: number; sag?: number; count?: number }) {
  const cy = (y1 + y2) / 2 + sag * 2;
  return (
    <g>
      <path d={`M${x1} ${y1}Q${(x1 + x2) / 2} ${cy} ${x2} ${y2}`} fill="none" stroke={INK} strokeWidth="0.8" />
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count;
        const x = n(x1 + (x2 - x1) * t);
        const y = n((1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2);
        return <path key={i} d={`M${n(x - 3.6)} ${y}h7.2l-3.6 7.5Z`} fill={FLAGS[i % FLAGS.length]} {...ink} strokeWidth="0.7" />;
      })}
    </g>
  );
}
