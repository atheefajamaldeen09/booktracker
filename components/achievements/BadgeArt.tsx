// Little illustrations for the achievement stickers: thin ink outlines and
// flat colours, in the same storybook style as the bookshelf ornaments.
// Every drawing sits on a 100 × 100 canvas with the sticker centred at 50, 50.

import type { ReactNode } from "react";

const INK = "#3b2a22";
const CREAM = "#f7ecd8";
const PAPER = "#fffaf0";
const SHADE = "#e6d3b6";
const RED = "#c8674f";
const ROSE = "#e58f8a";
const GOLD = "#e9b949";
const LEAF = "#9bb87f";
const BLUE = "#6f8fb3";
const PLUM = "#8c5a7a";

const line = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const thin = { stroke: INK, strokeWidth: 1.4, strokeLinecap: "round", fill: "none" } as const;

const heart = (cx: number, cy: number, s: number) =>
  `M${cx} ${cy + s * 0.9} C${cx - s * 1.6} ${cy - s * 0.1} ${cx - s * 0.9} ${cy - s * 1.3} ${cx} ${cy - s * 0.45} C${cx + s * 0.9} ${cy - s * 1.3} ${cx + s * 1.6} ${cy - s * 0.1} ${cx} ${cy + s * 0.9} Z`;

const star = (cx: number, cy: number, outer: number, inner: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

function Sparkle({ x, y, s = 4, fill = CREAM }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`}
      fill={fill}
    />
  );
}

// An open book seen from the front, centred on (cx, cy)
function OpenBook({ cx, cy, s = 1, cover = RED }: { cx: number; cy: number; s?: number; cover?: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <path d="M-28 12 C-18 9 -8 10 0 16 C8 10 18 9 28 12 L28 15 C18 12 8 13 0 19 C-8 13 -18 12 -28 15 Z" fill={cover} {...line} />
      <path d="M0 14 C-10 8 -20 8 -26 10 L-26 -14 C-20 -16 -10 -16 0 -10 Z" fill={PAPER} {...line} />
      <path d="M0 14 C10 8 20 8 26 10 L26 -14 C20 -16 10 -16 0 -10 Z" fill={PAPER} {...line} />
      <path d="M-21 -8 C-15 -9 -9 -8 -5 -6 M-21 -2 C-15 -3 -9 -2 -5 0 M-21 4 C-16 3 -11 4 -8 5" {...thin} opacity="0.5" />
      <path d="M21 -8 C15 -9 9 -8 5 -6 M21 -2 C15 -3 9 -2 5 0 M21 4 C16 3 11 4 8 5" {...thin} opacity="0.5" />
    </g>
  );
}

const ART: Record<string, ReactNode> = {
  bibliophile: (
    <>
      <OpenBook cx={50} cy={58} />
      <path d={heart(50, 29, 9)} fill={RED} {...line} />
      <path d="M45 26 C46 24 47 23 49 23" stroke={PAPER} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <Sparkle x={28} y={30} />
      <Sparkle x={73} y={34} s={3} />
    </>
  ),

  bookworm: (
    <>
      <rect x="22" y="58" width="56" height="15" rx="3" fill={GOLD} {...line} />
      <rect x="26" y="60" width="46" height="5" rx="1" fill={PAPER} {...line} strokeWidth="1.4" />
      <path d="M30 68 L66 68" {...thin} opacity="0.4" />
      <circle cx="40" cy="55" r="7" fill="#b9d07a" {...line} />
      <circle cx="47" cy="47" r="7.5" fill="#b9d07a" {...line} />
      <circle cx="57" cy="40" r="10" fill="#c5db86" {...line} />
      <circle cx="53" cy="39" r="3.6" fill="rgba(255,255,255,0.6)" {...line} strokeWidth="1.4" />
      <circle cx="62" cy="39" r="3.6" fill="rgba(255,255,255,0.6)" {...line} strokeWidth="1.4" />
      <path d="M56.6 39 L58.4 39" {...thin} />
      <circle cx="53" cy="39" r="1" fill={INK} />
      <circle cx="62" cy="39" r="1" fill={INK} />
      <path d="M55 45 Q57.5 47 60 45" {...thin} />
      <circle cx="51" cy="44" r="1.6" fill={ROSE} />
      <circle cx="65" cy="44" r="1.6" fill={ROSE} />
      <path d="M57 30 Q55 25 52 25 M59 30 Q61 25 64 25" {...thin} />
      <Sparkle x={30} y={34} />
    </>
  ),

  "book-stack": (
    <>
      <rect x="25" y="63" width="50" height="11" rx="2" fill={RED} {...line} />
      <rect x="66" y="65" width="7" height="7" fill={PAPER} {...line} strokeWidth="1.2" />
      <rect x="29" y="53" width="44" height="10" rx="2" fill={LEAF} {...line} />
      <path d="M36 53 L36 63" {...thin} opacity="0.5" />
      <rect x="27" y="44" width="46" height="9" rx="2" fill={BLUE} {...line} />
      <rect x="27" y="46" width="6" height="5" fill={PAPER} {...line} strokeWidth="1.2" />
      <rect x="32" y="36" width="38" height="8" rx="2" fill={ROSE} {...line} />
      <path d="M62 36 L62 44" {...thin} opacity="0.5" />
      <rect x="45" y="24" width="7" height="12" rx="1.5" fill={CREAM} {...line} />
      <path d="M48.5 24 L48.5 21" {...thin} />
      <path d="M48.5 13 C52 17 52 20 48.5 21 C45 20 45 17 48.5 13 Z" fill={GOLD} {...line} strokeWidth="1.4" />
      <Sparkle x={30} y={27} />
      <Sparkle x={70} y={26} s={3} />
    </>
  ),

  "library-legend": (
    <>
      <rect x="35" y="40" width="30" height="38" rx="3" fill={BLUE} {...line} />
      <rect x="35" y="40" width="6" height="38" rx="2" fill="#56769b" {...line} />
      <polygon points={star(53, 58, 7, 3)} fill={GOLD} {...line} strokeWidth="1.4" />
      <path d="M45 70 L61 70" {...thin} stroke={CREAM} />
      <path d="M36 35 L39 21 L45 29 L50 17 L55 29 L61 21 L64 35 Z" fill={GOLD} {...line} />
      <circle cx="50" cy="29" r="2" fill={RED} />
      <circle cx="42" cy="31" r="1.4" fill={PAPER} />
      <circle cx="58" cy="31" r="1.4" fill={PAPER} />
      <Sparkle x={26} y={40} s={5} />
      <Sparkle x={74} y={46} s={4} />
      <Sparkle x={72} y={26} s={3} />
    </>
  ),

  "page-turner": (
    <>
      <rect x="28" y="28" width="40" height="48" rx="2" fill={SHADE} transform="rotate(-8 48 52)" {...line} />
      <path d="M33 26 L71 26 L71 66 L61 76 L33 76 Z" fill={PAPER} {...line} />
      <path d="M71 66 L63 66 Q61 66 61 68 L61 76 Z" fill={SHADE} {...line} />
      <path d="M39 36 L65 36 M39 43 L65 43 M39 50 L65 50 M39 57 L58 57 M39 64 L53 64" {...thin} opacity="0.45" />
      <path d="M22 44 C16 36 18 26 28 22" fill="none" {...line} stroke={CREAM} />
      <path d="M24 18 L29 22 L23 25" fill="none" {...line} stroke={CREAM} />
      <Sparkle x={77} y={30} />
    </>
  ),

  "paper-mountain": (
    <>
      <path d="M18 76 L44 34 L55 50 L62 41 L82 76 Z" fill={PAPER} {...line} />
      <path d="M44 34 L50 76 L82 76 L62 41 L55 50 Z" fill={SHADE} />
      <path d="M18 76 L44 34 L55 50 L62 41 L82 76 Z" fill="none" {...line} />
      <path d="M32 62 L40 62 M36 68 L48 68 M58 64 L66 64 M62 70 L72 70" {...thin} opacity="0.45" />
      <path d="M44 34 L44 17" {...line} />
      <path d="M44 17 L58 21 L44 26 Z" fill={GOLD} {...line} />
      <Sparkle x={27} y={34} />
      <Sparkle x={72} y={28} s={3} />
    </>
  ),

  "tea-time": (
    <>
      <ellipse cx="50" cy="73" rx="27" ry="5" fill={ROSE} {...line} />
      <path d="M71 52 C80 51 80 64 69 63" fill="none" {...line} strokeWidth="3.6" />
      <path d="M71 52 C80 51 80 64 69 63" fill="none" stroke={CREAM} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M28 46 L72 46 L68 66 Q50 76 32 66 Z" fill={CREAM} {...line} />
      <ellipse cx="50" cy="46" rx="22" ry="4" fill="#b98455" {...line} />
      <circle cx="50" cy="60" r="6.5" fill={PAPER} {...line} strokeWidth="1.4" />
      <path d="M50 56 L50 60 L53 61.5" {...thin} />
      <path d="M42 38 C38 33 46 30 42 24 M52 38 C48 33 56 30 52 24 M62 38 C58 33 66 30 62 24" {...thin} stroke={CREAM} strokeWidth="1.8" />
    </>
  ),

  doorstopper: (
    <>
      <rect x="20" y="33" width="10" height="42" rx="3" fill={RED} {...line} />
      <rect x="26" y="33" width="54" height="7" rx="2" fill={RED} {...line} />
      <rect x="28" y="40" width="50" height="28" fill={PAPER} {...line} />
      <path d="M30 44 L76 44 M30 48 L76 48 M30 52 L76 52 M30 56 L76 56 M30 60 L76 60 M30 64 L76 64" {...thin} opacity="0.3" />
      <rect x="26" y="68" width="54" height="7" rx="2" fill={RED} {...line} />
      <path d="M60 68 L60 82 L64 78 L68 82 L68 68" fill={GOLD} {...line} strokeWidth="1.6" />
      <path d="M24 39 L24 43 M24 64 L24 68" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      <text x="53" y="29" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="11" fill={CREAM}>600+</text>
    </>
  ),

  "cosy-week": (
    <>
      <circle cx="50" cy="30" r="13" fill={GOLD} opacity="0.35" />
      <ellipse cx="50" cy="75" rx="20" ry="5" fill={GOLD} {...line} />
      <rect x="40" y="40" width="20" height="34" rx="3" fill={CREAM} {...line} />
      <path d="M40 46 C44 50 46 46 48 52 C49 55 51 55 52 50 C54 45 57 49 60 46" fill="none" {...line} strokeWidth="1.6" />
      <path d="M50 40 L50 35" {...thin} />
      <path d="M50 20 C56 27 56 33 50 35 C44 33 44 27 50 20 Z" fill="#f2a541" {...line} strokeWidth="1.6" />
      <path d="M50 27 C52 30 52 32 50 33 C48 32 48 30 50 27 Z" fill="#fde3a0" />
      <text x="50" y="68" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="13" fill={INK}>7</text>
    </>
  ),

  "moonlit-month": (
    <>
      <circle cx="47" cy="40" r="19" fill={GOLD} {...line} />
      <circle cx="56" cy="34" r="17" fill="#4e5d82" />
      <path d="M38 50 C40 52 43 53 46 53" {...thin} opacity="0.4" />
      <OpenBook cx={50} cy={68} s={0.7} cover={BLUE} />
      <Sparkle x={70} y={28} s={4} fill={GOLD} />
      <Sparkle x={76} y={46} s={3} fill={CREAM} />
      <Sparkle x={62} y={52} s={2.5} fill={CREAM} />
      <Sparkle x={26} y={26} s={3} fill={CREAM} />
    </>
  ),

  "book-binge": (
    <>
      <rect x="27" y="28" width="46" height="46" rx="4" fill={PAPER} {...line} />
      <path d="M27 32 Q27 28 31 28 L69 28 Q73 28 73 32 L73 39 L27 39 Z" fill={RED} {...line} />
      <path d="M38 24 L38 33 M62 24 L62 33" {...line} strokeWidth="3" />
      <rect x="34" y="50" width="5" height="18" rx="1" fill={BLUE} {...line} strokeWidth="1.4" />
      <rect x="40" y="46" width="6" height="22" rx="1" fill={GOLD} {...line} strokeWidth="1.4" />
      <rect x="47" y="52" width="5" height="16" rx="1" fill={LEAF} {...line} strokeWidth="1.4" />
      <rect x="53" y="47" width="6" height="21" rx="1" fill={ROSE} {...line} strokeWidth="1.4" />
      <rect x="60" y="51" width="5" height="17" rx="1" fill={PLUM} {...line} strokeWidth="1.4" transform="rotate(8 62 60)" />
      <path d="M32 68 L68 68" {...line} strokeWidth="1.6" />
    </>
  ),

  "goal-getter": (
    <>
      <path d="M32 44 L68 44 L64 72 Q50 78 36 72 Z" fill={CREAM} {...line} />
      <path d="M67 50 C77 50 77 64 65 64" fill="none" {...line} strokeWidth="3.6" />
      <path d="M67 50 C77 50 77 64 65 64" fill="none" stroke={CREAM} strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="50" cy="44" rx="18" ry="5" fill="#f3e3c8" {...line} />
      <path d={heart(50, 44, 3.4)} fill="#b98455" transform="scale(1 0.6) translate(0 29)" />
      <path d="M58 40 L58 18" {...line} />
      <path d="M58 18 L72 22 L58 27 Z" fill={RED} {...line} />
      <Sparkle x={30} y={30} />
      <Sparkle x={40} y={22} s={3} />
    </>
  ),

  "heart-eyes": (
    <>
      <polygon points={star(50, 51, 29, 13)} fill={GOLD} {...line} />
      <path d={heart(43, 49, 3.6)} fill={RED} />
      <path d={heart(57, 49, 3.6)} fill={RED} />
      <path d="M45 56 Q50 61 55 56" {...thin} strokeWidth="1.8" />
      <circle cx="39" cy="56" r="2" fill={ROSE} />
      <circle cx="61" cy="56" r="2" fill={ROSE} />
      <Sparkle x={24} y={28} />
      <Sparkle x={77} y={30} s={3} />
    </>
  ),

  "little-critic": (
    <>
      <rect x="22" y="40" width="34" height="38" rx="2" fill={PAPER} transform="rotate(-6 39 59)" {...line} />
      <path d="M28 50 L48 48 M29 56 L49 54 M29 62 L44 61" {...thin} opacity="0.45" />
      <path d="M55 60 L60 60 L62 66 L66 66 L68 77 L47 77 L49 66 L53 66 Z" fill="#3f4a66" {...line} />
      <path d="M48 70 L67 70" stroke={CREAM} strokeWidth="1.4" opacity="0.6" />
      <path d="M58 62 C60 46 66 30 80 20 C80 34 72 50 60 62 Z" fill={CREAM} {...line} />
      <path d="M59 61 C64 50 70 38 78 24" {...thin} />
      <path d="M68 40 L74 38 M65 47 L71 46" {...thin} opacity="0.5" />
    </>
  ),

  "quote-keeper": (
    <>
      <path d="M22 30 Q22 24 28 24 L72 24 Q78 24 78 30 L78 58 Q78 64 72 64 L44 64 L32 75 L34 64 L28 64 Q22 64 22 58 Z" fill={PAPER} {...line} />
      <path d="M36 50 C36 42 38 38 44 35 L45 37 C42 39 41 41 41 43 C44 43 46 45 46 48 C46 51 44 53 41 53 C38 53 36 52 36 50 Z" fill={RED} />
      <path d="M52 50 C52 42 54 38 60 35 L61 37 C58 39 57 41 57 43 C60 43 62 45 62 48 C62 51 60 53 57 53 C54 53 52 52 52 50 Z" fill={RED} />
      <path d={heart(71, 70, 5)} fill={ROSE} {...line} strokeWidth="1.4" />
      <Sparkle x={27} y={18} s={3} />
    </>
  ),

  sweetheart: (
    <>
      <rect x="31" y="28" width="38" height="48" rx="3" fill={ROSE} {...line} />
      <rect x="31" y="28" width="7" height="48" rx="2" fill="#d27772" {...line} />
      <rect x="42" y="34" width="22" height="30" rx="2" fill="none" stroke={CREAM} strokeWidth="1.4" />
      <path d={heart(53, 48, 7)} fill={CREAM} />
      <path d="M58 76 L58 86 L62 82 L66 86 L66 76" fill={GOLD} {...line} strokeWidth="1.4" />
      <Sparkle x={24} y={34} />
      <Sparkle x={76} y={30} s={4} />
      <Sparkle x={77} y={60} s={3} />
    </>
  ),

  "genre-hopper": (
    <>
      <circle cx="50" cy="51" r="24" fill={CREAM} {...line} />
      <circle cx="50" cy="51" r="19" {...thin} opacity="0.4" />
      <path d="M50 30 L50 34 M50 68 L50 72 M29 51 L33 51 M67 51 L71 51" {...thin} />
      <polygon points="50,35 55,51 50,51" fill={RED} />
      <polygon points="50,35 45,51 50,51" fill="#a54d39" />
      <polygon points="50,67 45,51 50,51" fill={BLUE} />
      <polygon points="50,67 55,51 50,51" fill="#56769b" />
      <circle cx="50" cy="51" r="2.6" fill={GOLD} {...line} strokeWidth="1.2" />
      <rect x="46" y="23" width="8" height="5" rx="2" fill={GOLD} {...line} strokeWidth="1.4" />
      <Sparkle x={77} y={28} />
    </>
  ),

  "series-slayer": (
    <>
      <path d="M36 26 L64 26 L62 46 Q50 56 38 46 Z" fill={GOLD} {...line} />
      <path d="M36 30 C26 30 26 42 38 44 M64 30 C74 30 74 42 62 44" fill="none" {...line} strokeWidth="2.4" />
      <path d="M46 54 L54 54 L55 62 L45 62 Z" fill={GOLD} {...line} />
      <rect x="36" y="62" width="28" height="8" rx="2" fill="#a0703e" {...line} />
      <rect x="24" y="70" width="10" height="9" rx="1" fill={BLUE} {...line} strokeWidth="1.4" />
      <rect x="45" y="70" width="10" height="9" rx="1" fill={RED} {...line} strokeWidth="1.4" />
      <rect x="66" y="70" width="10" height="9" rx="1" fill={LEAF} {...line} strokeWidth="1.4" />
      <polygon points={star(50, 37, 6, 2.6)} fill={PAPER} />
      <Sparkle x={24} y={28} />
      <Sparkle x={76} y={22} s={3} />
    </>
  ),

  "time-traveller": (
    <>
      <rect x="31" y="20" width="38" height="7" rx="2" fill="#a0703e" {...line} />
      <rect x="31" y="73" width="38" height="7" rx="2" fill="#a0703e" {...line} />
      <path d="M36 27 L64 27 C64 40 54 44 52 50 C54 56 64 60 64 73 L36 73 C36 60 46 56 48 50 C46 44 36 40 36 27 Z" fill="rgba(255,250,240,0.75)" {...line} />
      <path d="M41 34 L59 34 C57 40 52 43 50 46 C48 43 43 40 41 34 Z" fill={GOLD} />
      <path d="M50 47 L50 64" stroke={GOLD} strokeWidth="1.6" strokeDasharray="1.5 2" />
      <path d="M38 72 C40 64 46 62 50 62 C54 62 60 64 62 72 Z" fill={GOLD} />
      <path d="M40 31 L40 38" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <Sparkle x={24} y={46} />
      <Sparkle x={76} y={40} s={3} />
    </>
  ),

  "letting-go": (
    <>
      <OpenBook cx={42} cy={66} s={0.75} cover={LEAF} />
      <path d="M44 52 C48 44 52 46 56 40 C60 34 58 30 62 27" {...thin} strokeDasharray="2 3" opacity="0.6" />
      <g transform="rotate(18 66 26)">
        <ellipse cx="60" cy="22" rx="7" ry="9" fill={PLUM} {...line} strokeWidth="1.6" transform="rotate(-25 60 22)" />
        <ellipse cx="72" cy="22" rx="7" ry="9" fill={PLUM} {...line} strokeWidth="1.6" transform="rotate(25 72 22)" />
        <ellipse cx="61" cy="33" rx="5" ry="6" fill={ROSE} {...line} strokeWidth="1.6" transform="rotate(-35 61 33)" />
        <ellipse cx="71" cy="33" rx="5" ry="6" fill={ROSE} {...line} strokeWidth="1.6" transform="rotate(35 71 33)" />
        <path d="M66 18 L66 38" {...line} strokeWidth="2.6" />
        <path d="M66 18 Q63 12 60 12 M66 18 Q69 12 72 12" {...thin} />
      </g>
      <Sparkle x={26} y={32} />
    </>
  ),

  "shelf-starter": (
    <>
      <rect x="18" y="66" width="64" height="6" rx="2" fill="#a0703e" {...line} />
      <path d="M26 72 L26 78 M74 72 L74 78" {...line} />
      <rect x="22" y="42" width="8" height="24" rx="1.5" fill={BLUE} {...line} />
      <rect x="30" y="38" width="9" height="28" rx="1.5" fill={RED} {...line} />
      <path d="M32 44 L37 44 M32 60 L37 60" stroke={GOLD} strokeWidth="1.6" />
      <rect x="39" y="45" width="7" height="21" rx="1.5" fill={GOLD} {...line} />
      <rect x="46" y="40" width="8" height="26" rx="1.5" fill={LEAF} {...line} />
      <rect x="55" y="44" width="8" height="22" rx="1.5" fill={ROSE} {...line} transform="rotate(14 55 66)" />
      <path d="M68 56 L80 56 L78 66 L70 66 Z" fill={RED} {...line} />
      <path d="M74 56 C71 50 67 48 64 48 C66 52 69 55 74 56 Z" fill={LEAF} {...line} strokeWidth="1.4" />
      <path d="M74 56 C76 48 80 46 83 46 C81 51 78 54 74 56 Z" fill={LEAF} {...line} strokeWidth="1.4" />
      <path d="M74 56 C73 50 72 46 74 41 C76 46 76 51 74 56 Z" fill={LEAF} {...line} strokeWidth="1.4" />
      <Sparkle x={30} y={28} />
    </>
  ),

  "book-dragon": (
    <>
      <rect x="25" y="68" width="50" height="9" rx="2" fill={RED} {...line} />
      <rect x="30" y="60" width="40" height="8" rx="2" fill={BLUE} {...line} />
      <circle cx="21" cy="74" r="3.5" fill={GOLD} {...line} strokeWidth="1.2" />
      <circle cx="79" cy="73" r="3.5" fill={GOLD} {...line} strokeWidth="1.2" />
      <path d="M61 56 C74 60 78 48 70 43" fill="none" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M61 56 C74 60 78 48 70 43" fill="none" stroke="#8fbf8a" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M70 43 L66 38 L73 39 Z" fill={GOLD} {...line} strokeWidth="1.2" />
      <path d="M39 46 C28 36 22 44 27 51 C31 49 35 50 39 52 Z" fill="#6f9a7e" {...line} />
      <path d="M61 46 C72 36 78 44 73 51 C69 49 65 50 61 52 Z" fill="#6f9a7e" {...line} />
      <ellipse cx="50" cy="50" rx="14" ry="12" fill="#8fbf8a" {...line} />
      <ellipse cx="50" cy="53" rx="8" ry="7" fill="#f3e3b5" {...line} strokeWidth="1.2" />
      <path d="M45 51 L55 51 M45 55 L55 55" {...thin} opacity="0.35" />
      <ellipse cx="42" cy="61" rx="4" ry="2.6" fill="#8fbf8a" {...line} strokeWidth="1.4" />
      <ellipse cx="58" cy="61" rx="4" ry="2.6" fill="#8fbf8a" {...line} strokeWidth="1.4" />
      <path d="M43 27 L40 18 L47 24 Z M57 27 L60 18 L53 24 Z" fill={GOLD} {...line} strokeWidth="1.4" />
      <circle cx="50" cy="34" r="11" fill="#8fbf8a" {...line} />
      <ellipse cx="50" cy="39" rx="5.5" ry="3.2" fill="#a9d1a1" {...line} strokeWidth="1.2" />
      <circle cx="48" cy="38.5" r="0.8" fill={INK} />
      <circle cx="52" cy="38.5" r="0.8" fill={INK} />
      <circle cx="45.5" cy="32.5" r="1.8" fill={INK} />
      <circle cx="54.5" cy="32.5" r="1.8" fill={INK} />
      <circle cx="46.1" cy="31.9" r="0.6" fill="#fff" />
      <circle cx="55.1" cy="31.9" r="0.6" fill="#fff" />
      <circle cx="42" cy="37" r="1.8" fill={ROSE} />
      <circle cx="58" cy="37" r="1.8" fill={ROSE} />
      <Sparkle x={24} y={30} />
      <Sparkle x={78} y={26} s={3} />
    </>
  ),

  "hundred-days": (
    <>
      <path d="M50 64 C50 54 49 46 50 38" fill="none" stroke={INK} strokeWidth="4.6" strokeLinecap="round" />
      <path d="M50 64 C50 54 49 46 50 38" fill="none" stroke="#6f9a55" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M50 56 C42 51 37 53 35 57 C41 60 46 59 50 56 Z" fill={LEAF} {...line} strokeWidth="1.4" />
      <path d="M50 50 C58 45 63 47 65 51 C59 54 54 53 50 50 Z" fill={LEAF} {...line} strokeWidth="1.4" />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="50" cy="20" rx="3.6" ry="7" transform={`rotate(${i * 30} 50 30)`} fill={GOLD} {...line} strokeWidth="1.2" />
      ))}
      <circle cx="50" cy="30" r="7" fill="#7a4a2a" {...line} />
      <path d="M47 28 L47.1 28 M50 26.5 L50.1 26.5 M53 28 L53.1 28 M48.5 31 L48.6 31 M51.5 31 L51.6 31" stroke="#c99a52" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="36" y="62" width="28" height="6" rx="2" fill="#d27772" {...line} />
      <path d="M38 68 L62 68 L59 80 L41 80 Z" fill={RED} {...line} />
    </>
  ),

  "twelve-moons": (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x = (50 + 27 * Math.cos(a)).toFixed(1);
        const y = (50 + 27 * Math.sin(a)).toFixed(1);
        // Waxing to full and back: a moon for every month
        const lit = [0.2, 0.4, 0.6, 0.8, 1, 1, 1, 1, 0.8, 0.6, 0.4, 0.2][i];
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill={CREAM} {...line} strokeWidth="1.2" />
            <circle cx={x} cy={y} r={(4 * lit).toFixed(1)} fill={GOLD} />
          </g>
        );
      })}
      <OpenBook cx={50} cy={53} s={0.62} cover={BLUE} />
      <Sparkle x={50} y={33} s={3} fill={GOLD} />
    </>
  ),

  "book-a-week": (
    <>
      <rect x="27" y="30" width="46" height="46" rx="4" fill={PAPER} {...line} />
      <path d="M27 34 Q27 30 31 30 L69 30 Q73 30 73 34 L73 42 L27 42 Z" fill={BLUE} {...line} />
      <path d="M38 25 L38 35 M50 25 L50 35 M62 25 L62 35" {...line} strokeWidth="3" />
      <text x="50" y="68" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="21" fill={INK}>
        52
      </text>
      <path d={heart(66, 50, 3)} fill={RED} />
      <Sparkle x={22} y={26} />
      <Sparkle x={79} y={70} s={3} />
    </>
  ),

  "goal-crusher": (
    <>
      <path d="M44 67 C44 77 50 84 50 84 C50 84 56 77 56 67 Z" fill="#f2a541" {...line} strokeWidth="1.4" />
      <path d="M47 68 C47 74 50 78 50 78 C50 78 53 74 53 68 Z" fill="#fde3a0" />
      <path d="M42 54 L32 68 L42 66 Z" fill={RED} {...line} />
      <path d="M58 54 L68 68 L58 66 Z" fill={RED} {...line} />
      <path d="M50 17 C60 25 62 44 58 68 L42 68 C38 44 40 25 50 17 Z" fill={PAPER} {...line} />
      <path d="M50 17 C55 21 57.6 25.5 58.7 31 L41.3 31 C42.4 25.5 45 21 50 17 Z" fill={RED} {...line} />
      <circle cx="50" cy="44" r="6" fill={BLUE} {...line} />
      <path d="M47 42 C48 40.5 49.5 40 51 40" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M50 58 L50 64" {...thin} opacity="0.4" />
      <Sparkle x={26} y={30} s={5} />
      <Sparkle x={75} y={36} />
      <Sparkle x={72} y={20} s={3} />
    </>
  ),

  "ink-ocean": (
    <>
      <path d="M50 24 L50 56 L33 56 Z" fill={PAPER} {...line} />
      <path d="M50 28 L50 56 L65 56 Z" fill={SHADE} {...line} />
      <path d="M38 50 L48 50 M41 44 L48 44" {...thin} opacity="0.4" />
      <path d="M28 56 L72 56 L63 67 L37 67 Z" fill={PAPER} {...line} />
      <path d="M17 66 Q25 60 33 66 T49 66 T65 66 T83 66 L83 82 L17 82 Z" fill="#6f8fb3" {...line} />
      <path d="M20 73 Q27 68 34 73 T48 73 T62 73 T80 73" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <circle cx="70" cy="28" r="6" fill={GOLD} {...line} strokeWidth="1.4" />
      <Sparkle x={26} y={30} />
      <Sparkle x={80} y={44} s={3} />
    </>
  ),

  "sunrise-sunset": (
    <>
      {[-160, -130, -100, -80, -50, -20].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <path
            key={a}
            d={`M${(50 + 26 * Math.cos(r)).toFixed(1)} ${(56 + 26 * Math.sin(r)).toFixed(1)} L${(50 + 34 * Math.cos(r)).toFixed(1)} ${(56 + 34 * Math.sin(r)).toFixed(1)}`}
            stroke={GOLD}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        );
      })}
      <path d="M28 58 A22 22 0 0 1 72 58 Z" fill={GOLD} {...line} />
      <path d="M36 50 C38 46 41 43 45 42" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
      <OpenBook cx={50} cy={64} s={0.85} />
    </>
  ),

  "lost-in-time": (
    <>
      <circle cx="33" cy="30" r="7" fill={GOLD} {...line} />
      <circle cx="67" cy="30" r="7" fill={GOLD} {...line} />
      <path d="M50 22 L50 30" {...line} />
      <circle cx="50" cy="21" r="2.4" fill={GOLD} {...line} strokeWidth="1.2" />
      <path d="M37 71 L31 79 M63 71 L69 79" {...line} strokeWidth="3" />
      <circle cx="50" cy="52" r="22" fill={RED} {...line} />
      <circle cx="50" cy="52" r="17" fill={PAPER} {...line} strokeWidth="1.4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <path
            key={i}
            d={`M${(50 + 14 * Math.cos(a)).toFixed(1)} ${(52 + 14 * Math.sin(a)).toFixed(1)} L${(50 + 15.6 * Math.cos(a)).toFixed(1)} ${(52 + 15.6 * Math.sin(a)).toFixed(1)}`}
            {...thin}
          />
        );
      })}
      <path d="M50 52 L50 41 M50 52 L58 56" {...line} />
      <circle cx="50" cy="52" r="1.8" fill={INK} />
      <path d="M74 44 C77 47 77 52 75 55 M78 40 C83 46 83 54 79 59" {...thin} opacity="0.6" />
    </>
  ),

  "bite-sized": (
    <>
      <path d="M32 54 L68 54 L63 78 L37 78 Z" fill={ROSE} {...line} />
      <path d="M41 54 L43 78 M50 54 L50 78 M59 54 L57 78" {...thin} opacity="0.45" />
      <path d="M30 56 C25 47 33 41 39 43 C39 35 49 31 54 37 C60 33 70 39 66 47 C72 49 72 57 66 57 Z" fill={PAPER} {...line} />
      <path d="M38 50 C44 52 52 52 60 49" {...thin} opacity="0.35" />
      <path d="M40 46 L43 45 M52 44 L54 46 M61 50 L63 48 M47 50 L49 51" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 42 L46 43 M57 47 L58 45" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      <path d="M55 30 C56 25 59 22 62 21" {...thin} strokeWidth="1.6" />
      <circle cx="54" cy="31" r="5" fill={RED} {...line} />
      <path d="M52 29 C52.5 28 53.5 27.5 54.5 27.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <Sparkle x={25} y={32} />
    </>
  ),

  "rainy-review": (
    <>
      <path d="M30 52 C21 52 21 40 31 40 C32 29 46 27 50 35 C55 27 71 31 68 42 C78 42 78 54 68 54 L32 54 Z" fill={PAPER} {...line} />
      <circle cx="43" cy="45" r="1.6" fill={INK} />
      <circle cx="57" cy="45" r="1.6" fill={INK} />
      <path d="M46 50 Q50 47.5 54 50" {...thin} strokeWidth="1.6" />
      <circle cx="39" cy="48" r="1.8" fill={ROSE} />
      <circle cx="61" cy="48" r="1.8" fill={ROSE} />
      {[[36, 63], [49, 67], [62, 63], [42, 75], [56, 75]].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 4} C${x + 3} ${y} ${x + 3} ${y + 3} ${x} ${y + 3} C${x - 3} ${y + 3} ${x - 3} ${y} ${x} ${y - 4} Z`} fill="#6f8fb3" {...line} strokeWidth="1.2" />
      ))}
    </>
  ),

  essayist: (
    <>
      <rect x="36" y="18" width="28" height="24" fill={PAPER} {...line} />
      <path d="M40 24 L60 24 M40 29 L60 29 M40 34 L54 34" {...thin} opacity="0.45" />
      <path d="M26 44 L74 44 L79 66 L21 66 Z" fill="#5f8a86" {...line} />
      <rect x="29" y="38" width="42" height="7" rx="3.5" fill="#3f4a66" {...line} strokeWidth="1.4" />
      {[30, 37, 44, 51, 58, 65].map((x) => (
        <circle key={`a${x}`} cx={x + 2} cy="52" r="2.4" fill={CREAM} {...line} strokeWidth="1" />
      ))}
      {[33, 40, 47, 54, 61].map((x) => (
        <circle key={`b${x}`} cx={x + 2} cy="59" r="2.4" fill={CREAM} {...line} strokeWidth="1" />
      ))}
      <rect x="18" y="66" width="64" height="8" rx="3" fill="#3f4a66" {...line} />
      <Sparkle x={74} y={26} />
    </>
  ),

  "quote-collector": (
    <>
      <path d="M40 30 L36 22 M50 28 L50 18 M60 30 L64 22" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 46 L70 46 L66 32 L34 32 Z" fill="#8a5a33" {...line} />
      <rect x="31" y="43" width="38" height="5" fill="#4a2e1a" />
      <text x="50" y="47" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="20" fill={RED}>
        “ ”
      </text>
      <rect x="28" y="48" width="44" height="27" rx="2" fill="#b98455" {...line} />
      <path d="M36 48 L36 75 M64 48 L64 75" stroke={GOLD} strokeWidth="3" />
      <rect x="45" y="50" width="10" height="11" rx="2" fill={GOLD} {...line} strokeWidth="1.4" />
      <circle cx="50" cy="54.5" r="1.4" fill={INK} />
      <path d="M50 55 L50 58" stroke={INK} strokeWidth="1.2" />
      <Sparkle x={24} y={36} />
      <Sparkle x={77} y={40} s={3} />
    </>
  ),

  "mood-ring": (
    <>
      <ellipse cx="50" cy="61" rx="19" ry="14" fill="none" stroke={INK} strokeWidth="7.4" />
      <ellipse cx="50" cy="61" rx="19" ry="14" fill="none" stroke={GOLD} strokeWidth="4.2" />
      <path d="M40 46 L60 46 L56 52 L44 52 Z" fill={GOLD} {...line} />
      <circle cx="50" cy="36" r="12" fill="url(#sticker-gem)" {...line} />
      <path d="M43 32 C44 29 46.5 27 49 26.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M44 38 L50 31 L56 38 L50 44 Z" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" />
      <path d={heart(73, 32, 3.6)} fill={ROSE} {...line} strokeWidth="1" />
      <Sparkle x={26} y={30} />
    </>
  ),

  globetrotter: (
    <>
      <path d="M44 78 L56 78 L54 72 L46 72 Z" fill="#a0703e" {...line} />
      <path d="M50 66 L50 72" {...line} strokeWidth="3" />
      <path d="M47 21 A25 25 0 0 1 47 71" fill="none" stroke="#a0703e" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="47" cy="46" r="20" fill={BLUE} {...line} />
      <path d="M35 38 C39 32 47 34 47 40 C45 44 39 44 37 48 C33 46 32 41 35 38 Z" fill={LEAF} {...line} strokeWidth="1.2" />
      <path d="M51 46 C55 44 61 46 60 52 C57 58 52 58 50 54 C49 51 49 48 51 46 Z" fill={LEAF} {...line} strokeWidth="1.2" />
      <path d="M48 29 C51 27 56 29 55 32 C53 34 49 33 48 29 Z" fill={LEAF} {...line} strokeWidth="1.2" />
      <path d="M33 54 C35 58 38 61 42 63" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" fill="none" />
      <Sparkle x={76} y={28} />
      <Sparkle x={24} y={26} s={3} />
    </>
  ),

  "series-collector": (
    <>
      <path d="M20 74 L80 74" {...line} />
      {[27, 43, 59].map((x, i) => (
        <g key={x}>
          <rect x={x} y="30" width="14" height="44" rx="2" fill={RED} {...line} />
          <path d={`M${x + 2} 36 L${x + 12} 36 M${x + 2} 68 L${x + 12} 68`} stroke={GOLD} strokeWidth="1.6" />
          <text x={x + 7} y="56" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="7" fill={CREAM}>
            {["I", "II", "III"][i]}
          </text>
        </g>
      ))}
      <path d="M24 46 L76 46" stroke={GOLD} strokeWidth="4" />
      <path d="M50 46 C44 38 38 40 40 46 C38 52 44 54 50 46 Z M50 46 C56 38 62 40 60 46 C62 52 56 54 50 46 Z" fill={GOLD} {...line} strokeWidth="1.4" />
      <circle cx="50" cy="46" r="2.6" fill={GOLD} {...line} strokeWidth="1.2" />
    </>
  ),

  "author-fan": (
    <>
      <g transform="rotate(-8 48 46)">
        <rect x="24" y="28" width="48" height="36" rx="3" fill={PAPER} {...line} />
        <path d="M30 50 C34 38 38 54 42 45 C45 39 46 52 50 46 C53 42 56 50 60 45 C62 43 64 44 66 46" {...thin} strokeWidth="1.8" />
        <path d="M30 56 L64 56" {...thin} opacity="0.3" />
      </g>
      <path d={heart(62, 36, 4)} fill={RED} />
      <path d="M58 72 L77 53 L82 58 L63 77 Z" fill={BLUE} {...line} />
      <path d="M58 72 L63 77 L55 80 Z" fill={GOLD} {...line} strokeWidth="1.2" />
      <Sparkle x={24} y={72} />
      <Sparkle x={78} y={30} s={3} />
    </>
  ),

  "fresh-ink": (
    <>
      <path d="M50 18 C61 28 65 43 59 57 L50 75 L41 57 C35 43 39 28 50 18 Z" fill={GOLD} {...line} />
      <path d="M50 18 C61 28 65 43 59 57 L50 75 Z" fill="#c99a32" opacity="0.5" />
      <path d="M50 46 L50 73" {...line} strokeWidth="1.4" />
      <circle cx="50" cy="44" r="3.2" fill={PAPER} {...line} strokeWidth="1.2" />
      <path d="M66 70 C69 74 69 77 66 78 C63 77 63 74 66 70 Z" fill="#3f4a66" {...line} strokeWidth="1.2" />
      <Sparkle x={28} y={32} s={5} />
      <Sparkle x={74} y={30} />
      <Sparkle x={30} y={64} s={3} />
    </>
  ),

  "wishful-thinking": (
    <>
      <path d="M20 72 L44 52 M26 80 L48 61 M16 62 L40 45" stroke={CREAM} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <polygon points={star(57, 41, 18, 8)} fill={GOLD} {...line} />
      <path d="M50 41 Q52 39 54 41 M60 41 Q62 39 64 41" {...thin} strokeWidth="1.6" />
      <path d="M54 46 Q57 49 60 46" {...thin} strokeWidth="1.6" />
      <circle cx="50" cy="45" r="1.8" fill={ROSE} />
      <circle cx="64" cy="45" r="1.8" fill={ROSE} />
      <Sparkle x={78} y={66} />
      <Sparkle x={30} y={28} s={3} />
    </>
  ),

  "tbr-mountain": (
    <>
      {(
        [
          [24, 72, 52, RED, -2],
          [28, 66, 44, BLUE, 3],
          [25, 60, 48, GOLD, -3],
          [30, 54, 40, LEAF, 2],
          [27, 48, 45, ROSE, -2],
          [32, 42, 37, PLUM, 4],
          [30, 36, 40, "#56769b", -3],
          [34, 30, 33, "#d27772", 3],
        ] as [number, number, number, string, number][]
      ).map(([x, y, w, fill, r]) => (
        <rect key={y} x={x} y={y} width={w} height="6" rx="1.5" fill={fill} {...line} strokeWidth="1.5" transform={`rotate(${r} ${x + w / 2} ${y + 3})`} />
      ))}
      <path d="M50 30 L50 15" {...line} />
      <path d="M50 15 L62 19 L50 23 Z" fill={RED} {...line} />
      <path d="M20 50 C18 46 18 42 20 38 M80 52 C82 48 82 44 80 40" {...thin} opacity="0.5" />
    </>
  ),

  juggler: (
    <>
      <path d="M26 66 C26 28 74 28 74 66" {...thin} strokeDasharray="2 3" opacity="0.6" />
      {(
        [
          [30, 50, -40, RED],
          [50, 30, 0, BLUE],
          [70, 50, 40, LEAF],
        ] as [number, number, number, string][]
      ).map(([x, y, r, fill]) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
          <rect x="-9" y="-7" width="18" height="14" rx="2" fill={fill} {...line} />
          <rect x="-9" y="-7" width="4" height="14" rx="1.5" fill="rgba(0,0,0,0.18)" />
          <path d="M-2 -2 L6 -2 M-2 2 L4 2" stroke={CREAM} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx="33" cy="73" rx="7" ry="4.5" fill={CREAM} {...line} />
      <ellipse cx="67" cy="73" rx="7" ry="4.5" fill={CREAM} {...line} />
      <Sparkle x={50} y={52} s={4} />
    </>
  ),

  curator: (
    <>
      <rect x="20" y="73" width="60" height="5" rx="1" fill={SHADE} {...line} />
      <rect x="24" y="68" width="52" height="5" rx="1" fill={PAPER} {...line} />
      <rect x="28" y="41" width="44" height="27" fill={PAPER} {...line} />
      {[31, 39, 56, 64].map((x) => (
        <rect key={x} x={x} y="43" width="5" height="25" fill={CREAM} {...line} strokeWidth="1.2" />
      ))}
      <path d="M45 68 L45 55 Q50 50 55 55 L55 68 Z" fill="#a0703e" {...line} strokeWidth="1.4" />
      <rect x="25" y="36" width="50" height="5" fill={PAPER} {...line} />
      <path d="M23 36 L50 20 L77 36 Z" fill={RED} {...line} />
      <circle cx="50" cy="30" r="3.4" fill={GOLD} {...line} strokeWidth="1.2" />
      <Sparkle x={80} y={24} />
      <Sparkle x={21} y={26} s={3} />
    </>
  ),

  "book-wizard": (
    <>
      <rect x="25" y="63" width="50" height="14" rx="3" fill={PLUM} {...line} />
      <rect x="29" y="65" width="42" height="5" fill={PAPER} {...line} strokeWidth="1.2" />
      <path d="M33 72 L67 72" {...thin} stroke={CREAM} opacity="0.6" />
      <ellipse cx="50" cy="61" rx="27" ry="5.5" fill="#3f4a66" {...line} />
      <path d="M34 60 C40 47 44 31 59 18 C56 31 60 47 66 60 Z" fill="#56769b" {...line} />
      <path d="M35.4 55.5 Q50 60 64.6 55.5 L65.6 59 Q50 63.5 34.4 59 Z" fill={GOLD} {...line} strokeWidth="1.2" />
      <polygon points={star(48, 42, 4.2, 1.8)} fill={GOLD} />
      <polygon points={star(55, 31, 3, 1.3)} fill={GOLD} />
      <circle cx="44" cy="51" r="1.2" fill={CREAM} />
      <path d="M71 47 L82 33" {...line} strokeWidth="3.2" />
      <path d="M71 47 L82 33" stroke="#a0703e" strokeWidth="1.4" strokeLinecap="round" />
      <Sparkle x={84} y={30} s={5} fill={GOLD} />
      <Sparkle x={22} y={34} />
      <Sparkle x={74} y={20} s={3} />
    </>
  ),

  "castle-of-tales": (
    <>
      <path d="M18 78 L82 78" {...line} />
      <rect x="22" y="38" width="16" height="40" rx="1.5" fill={BLUE} {...line} />
      <path d="M22 38 L22 33 L26 33 L26 37 L30 37 L30 33 L34 33 L34 37 L38 37 L38 33" fill={BLUE} {...line} strokeWidth="1.6" />
      <path d="M25 46 L35 46 M25 70 L35 70" stroke={GOLD} strokeWidth="1.4" />
      <rect x="62" y="38" width="16" height="40" rx="1.5" fill={LEAF} {...line} />
      <path d="M62 38 L62 33 L66 33 L66 37 L70 37 L70 33 L74 33 L74 37 L78 37 L78 33" fill={LEAF} {...line} strokeWidth="1.6" />
      <path d="M65 46 L75 46 M65 70 L75 70" stroke={GOLD} strokeWidth="1.4" />
      <rect x="37" y="48" width="26" height="30" rx="1.5" fill={RED} {...line} />
      <path d="M37 48 L37 43 L42 43 L42 47 L47 47 L47 43 L53 43 L53 47 L58 47 L58 43 L63 43 L63 48" fill={RED} {...line} strokeWidth="1.6" />
      <path d="M45 78 L45 66 Q50 60 55 66 L55 78 Z" fill="#7a4a2a" {...line} strokeWidth="1.4" />
      <path d="M40 55 L60 55" stroke={GOLD} strokeWidth="1.4" />
      <path d="M30 33 L30 20" {...line} strokeWidth="1.6" />
      <path d="M30 20 L39 23 L30 26 Z" fill={GOLD} {...line} strokeWidth="1.2" />
      <path d="M70 33 L70 20" {...line} strokeWidth="1.6" />
      <path d="M70 20 L79 23 L70 26 Z" fill={ROSE} {...line} strokeWidth="1.2" />
      <Sparkle x={50} y={30} s={5} fill={GOLD} />
    </>
  ),
};

// Three tiny stars along the bottom of the ring
const RING_STARS = [70, 90, 110].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: 50 + 43.5 * Math.cos(a), y: 50 + 43.5 * Math.sin(a), s: deg === 90 ? 2.6 : 1.9 };
});

// A round die-cut sticker like a real badge: white die-cut edge, a darker
// stitched ring with the badge text curving over the top, and the drawing in
// the middle. `label` is left off for tiny previews.
export function StickerArt({
  id,
  color,
  label,
  size = 100,
}: {
  id: string;
  color: string;
  label?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="-8 -8 116 116" aria-hidden>
      <circle cx="50" cy="50" r="57" fill="#fffdf8" />
      <circle cx="50" cy="50" r="50" style={{ fill: `color-mix(in srgb, ${color} 78%, ${INK})` }} />
      <circle cx="50" cy="50" r="47.6" fill="none" stroke={CREAM} strokeOpacity="0.55" strokeWidth="1.3" strokeDasharray="2.2 2.6" />
      <circle cx="50" cy="50" r="37" fill={color} />
      <circle cx="50" cy="50" r="37" fill="none" stroke={CREAM} strokeOpacity="0.8" strokeWidth="1.3" />
      <g transform="translate(50 51) scale(0.8) translate(-50 -50)">{ART[id]}</g>
      {label && (
        <text
          fill={CREAM}
          fontSize="8.4"
          fontWeight="700"
          letterSpacing="0.9"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          <textPath href="#sticker-arc" startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      )}
      {RING_STARS.map((star) => (
        <Sparkle key={star.x} x={star.x} y={star.y} s={star.s} />
      ))}
      <circle cx="50" cy="50" r="50" fill="url(#sticker-sheen)" />
    </svg>
  );
}

// Shared pieces for every sticker (gloss, gem, text arc); render once per page
export function StickerDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <radialGradient id="sticker-sheen" cx="32%" cy="24%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
        </radialGradient>
        <linearGradient id="sticker-gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fd1c8" />
          <stop offset="55%" stopColor="#7d6fc4" />
          <stop offset="100%" stopColor="#c46aa6" />
        </linearGradient>
        <path id="sticker-arc" d="M9.5 50 A40.5 40.5 0 0 1 90.5 50" />
      </defs>
    </svg>
  );
}
