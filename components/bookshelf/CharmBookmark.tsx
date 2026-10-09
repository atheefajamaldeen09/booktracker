import { useId } from "react";
import { hashString } from "./spineColors";
import styles from "./Bookshelf.module.css";

// A gold charm bookmark hooked over the top of a book you're reading: the
// hook rises above the book, and a fine chain with pearls hangs down the
// spine to a little enamel charm. Drawn in units where the book's top edge
// sits at y = 12; the chain hangs at x = 11.

const GOLD = "#e2b85a";
const GOLD_DARK = "#8a6420";
const TOP = 12;
const CHAIN_X = 11;
const WIDTH = 18;

type Charm = "flower" | "heart" | "bow" | "clover";
const CHARMS: Charm[] = ["flower", "heart", "bow", "clover"];

function CharmShape({ type, y }: { type: Charm; y: number }) {
  const x = CHAIN_X;
  switch (type) {
    case "flower":
      return (
        <g transform={`translate(${x} ${y + 5})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={Math.round(Math.sin((a * Math.PI) / 180) * 300) / 100} cy={Math.round(-Math.cos((a * Math.PI) / 180) * 300) / 100} r="2.6" fill="#f6c4cf" stroke="#c77d8c" strokeWidth="0.6" />
          ))}
          <circle r="1.8" fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.5" />
        </g>
      );
    case "heart":
      return (
        <path
          transform={`translate(${x} ${y + 1})`}
          d="M0 9 C-6 5 -6.5 -0.5 -3.3 -1 C-1.6 -1.3 -0.4 0 0 1 C0.4 0 1.6 -1.3 3.3 -1 C6.5 -0.5 6 5 0 9Z"
          fill="#d9536a"
          stroke={GOLD}
          strokeWidth="1"
        />
      );
    case "bow":
      return (
        <g transform={`translate(${x} ${y + 4})`} fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.5">
          <path d="M0 0 C-3 -4 -7 -3 -6 0 C-7 3 -3 4 0 0Z" />
          <path d="M0 0 C3 -4 7 -3 6 0 C7 3 3 4 0 0Z" />
          <path d="M-0.6 0.5 L-3 7 M0.6 0.5 L3 7" fill="none" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
          <circle r="1.3" />
        </g>
      );
    case "clover":
      return (
        <g transform={`translate(${x} ${y + 5})`} fill="#7fb77e" stroke={GOLD} strokeWidth="0.7">
          <circle cx="0" cy="-2.4" r="2.4" />
          <circle cx="2.4" cy="0" r="2.4" />
          <circle cx="0" cy="2.4" r="2.4" />
          <circle cx="-2.4" cy="0" r="2.4" />
          <circle r="0.9" fill={GOLD} stroke="none" />
        </g>
      );
  }
}

export default function CharmBookmark({ bookId, height, thickness }: { bookId: number; height: number; thickness: number }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const seed = hashString(`charm-${bookId}`);
  const charm = CHARMS[seed % CHARMS.length];

  // Scale with the book, and hang the chain about half way down the spine
  const s = Math.min(2.2, Math.max(0.4, height / 190));
  const chainTop = 22;
  const chainLength = Math.round((height * 0.48) / s) - (chainTop - TOP);
  const chainEnd = chainTop + chainLength;
  const units = chainEnd + 16;

  const links = Array.from({ length: Math.floor(chainLength / 3) }, (_, i) => chainTop + i * 3);
  const pearls = [0.3, 0.64].map((f) => Math.round(chainTop + chainLength * f));
  const leaf = Math.round(chainTop + chainLength * 0.47);

  return (
    <svg
      className={styles.charm}
      viewBox={`0 0 ${WIDTH} ${units}`}
      width={WIDTH * s}
      height={units * s}
      // The chain hangs close to the spine's right edge, clear of the title
      style={{ top: -TOP * s, right: Math.round(Math.min(6, Math.max(2, thickness * 0.1)) - (WIDTH - CHAIN_X) * s) }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${id}-pearl`} cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.6" stopColor="#efe6d8" />
          <stop offset="1" stopColor="#c9b89c" />
        </radialGradient>
      </defs>
      {/* Hook: the back leg disappears behind the pages at the top edge */}
      <path d={`M3 ${TOP} V8 A4 4 0 0 1 ${CHAIN_X} 8`} fill="none" stroke={GOLD_DARK} strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M${CHAIN_X} 8 V${chainTop}`} fill="none" stroke={GOLD_DARK} strokeWidth="2.6" strokeLinecap="round" />
      <path d={`M${CHAIN_X} 8 V${chainTop}`} fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
      <path d={`M${CHAIN_X - 0.4} 9 V${chainTop - 1}`} fill="none" stroke="#fff3c9" strokeWidth="0.5" strokeLinecap="round" />
      {/* Fine chain: links alternate face-on and side-on */}
      {links.map((y, i) =>
        i % 2 === 0 ? (
          <ellipse key={y} cx={CHAIN_X} cy={y + 1.5} rx="1.1" ry="1.8" fill="none" stroke={GOLD} strokeWidth="0.7" />
        ) : (
          <path key={y} d={`M${CHAIN_X} ${y} v3`} stroke={GOLD_DARK} strokeWidth="0.9" />
        )
      )}
      {/* Little gold leaf and pearls along the chain */}
      <path d={`M${CHAIN_X} ${leaf} c3 -1 4.5 1.5 4 4 c-2.5 0.5 -4.5 -1 -4 -4z`} fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.4" />
      {pearls.map((y) => (
        <circle key={y} cx={CHAIN_X} cy={y} r="2.2" fill={`url(#${id}-pearl)`} stroke="#a8977a" strokeWidth="0.3" />
      ))}
      <circle cx={CHAIN_X} cy={chainEnd + 0.6} r="1" fill="none" stroke={GOLD} strokeWidth="0.7" />
      <CharmShape type={charm} y={chainEnd + 1.5} />
    </svg>
  );
}
