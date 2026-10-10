import { Cat, Glow, INK, Sparkle, Spines, Street, WARM, Win, ink, thin, type Ctx, type Scene } from "../kit";

const SLATE = "#3b3550";
const POTION = "#b8e986";

const STARS: [number, number, number][] = [
  [26, 40, 2.4], [52, 34, 1.6], [70, 52, 2], [118, 36, 2.2], [146, 46, 1.6], [172, 38, 2.4], [160, 70, 1.6], [34, 66, 1.6], [96, 60, 1.8], [182, 96, 1.4],
];
// Candles hanging in mid-air: x, y
const CANDLES: [number, number][] = [[84, 150], [98, 172], [114, 146], [106, 198], [90, 214], [120, 184]];

function Candle({ c, x, y }: { c: Ctx; x: number; y: number }) {
  return (
    <g>
      <Glow c={c} x={x} y={y - 3} r={11} o={0.85} />
      <rect x={x - 1.6} y={y} width="3.2" height="10" rx="0.8" fill="#f7ecd8" {...ink} strokeWidth="0.8" />
      <path d={`M${x} ${y - 6}C${x + 2.4} ${y - 3} ${x + 1.6} ${y} ${x} ${y}C${x - 1.6} ${y} ${x - 2.4} ${y - 3} ${x} ${y - 6}Z`} fill={c.lit ? "#ffcf6b" : "#d8c9a8"} {...ink} strokeWidth="0.7" />
    </g>
  );
}

// Little bottles lined up in the potion shop window
function Bottle({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g>
      <path d={`M${x - 1.2} ${y - 9}h2.4v3.2c2.6 0.8 3.4 3 3.4 5.8h-9.2c0 -2.8 0.8 -5 3.4 -5.8Z`} fill={fill} {...ink} strokeWidth="0.8" />
      <rect x={x - 1.6} y={y - 10.5} width="3.2" height="1.8" fill="#b08d61" stroke={INK} strokeWidth="0.6" />
    </g>
  );
}

// A crooked midnight lane of magic shops
export const wizard: Scene = {
  sky: {
    z: 0,
    art: (c) => (
      <g>
        <defs>
          <linearGradient id={`${c.id}-night`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#262347" />
            <stop offset="0.6" stopColor="#4b3f78" />
            <stop offset="1" stopColor="#7a5c8f" />
          </linearGradient>
        </defs>
        <rect x="12" y="26" width="176" height="282" fill={`url(#${c.id}-night)`} />
        <circle cx="134" cy="66" r="15" fill="#fbeec4" />
        <circle cx="128" cy="62" r="13" fill="#2f2a56" />
        {STARS.map(([x, y, s], i) => (
          <Sparkle key={i} x={x} y={y} s={s} />
        ))}
        <path d="M12 198Q56 172 100 190Q146 170 188 196V308H12Z" fill="#3a3460" {...ink} />
      </g>
    ),
  },

  street: {
    z: 1,
    art: () => (
      <g>
        <Street fill="#7b7290" />
        <path d="M88 252q12 -6 24 0M82 280q18 -8 36 0" {...thin} />
      </g>
    ),
  },

  tower: {
    z: 2,
    art: (c) => (
      <g>
        <Glow c={c} x={100} y={140} r={24} o={0.45} />
        <rect x="91" y="112" width="18" height="96" fill="#8477a0" {...ink} />
        <path d="M91 130h18M91 160h18M91 188h18" {...thin} />
        <path d="M86 114L100 76L114 114Z" fill={SLATE} {...ink} />
        <path d="M100 76V66l8 3l-8 3" fill="#c8674f" {...ink} strokeWidth="0.9" />
        <rect x="97" y="120" width="6" height="9" rx="3" fill={c.lit ? WARM : "#5a5270"} {...ink} strokeWidth="0.8" />
        <rect x="97" y="146" width="6" height="9" rx="3" fill={c.lit ? WARM : "#5a5270"} {...ink} strokeWidth="0.8" />
        <rect x="108" y="138" width="9" height="34" fill="#766a93" {...ink} />
        <path d="M106 139L112.500 122L119 139Z" fill={SLATE} {...ink} />
      </g>
    ),
  },

  houses: {
    z: 3,
    art: (c) => (
      <g>
        <g transform="rotate(-3 76 214)">
          <rect x="66" y="146" width="22" height="68" fill="#8a6f94" {...ink} />
          <path d="M62 148L77 124L92 148Z" fill={SLATE} {...ink} />
          <Win c={c} x={72} y={156} w={9} h={10} />
          <Win c={c} x={72} y={178} w={9} h={10} on={POTION} />
          <rect x="82" y="118" width="5" height="16" fill="#6a5a78" {...ink} />
        </g>
        <g transform="rotate(3 124 214)">
          <rect x="112" y="154" width="22" height="60" fill="#4f7f86" {...ink} />
          <path d="M108 156L123 134L138 156Z" fill="#4a3f63" {...ink} />
          <Win c={c} x={118} y={164} w={10} h={10} />
          <rect x="119" y="196" width="8" height="18" rx="4" fill="#3a2a3f" {...ink} />
        </g>
        <path d="M84 116q-4 -6 1 -10q4 -4 -1 -9" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
  },

  potions: {
    z: 4,
    art: (c) => (
      <g transform="rotate(-1.5 40 308)">
        {/* Downstairs */}
        <rect x="10" y="156" width="56" height="154" fill="#5e476b" {...ink} />
        <Win c={c} x={17} y={172} w={42} h={44} bars={false} on="#ffe2a0" off="#5a5a72" />
        <path d="M17 194H59" stroke="#7a5540" strokeWidth="2" />
        <Bottle x={25} y={193} fill="#b8e986" />
        <Bottle x={38} y={193} fill="#e58f8a" />
        <Bottle x={51} y={193} fill="#8fb8e0" />
        <Bottle x={31} y={215} fill="#d9a441" />
        <Bottle x={46} y={215} fill="#c79be0" />
        <Glow c={c} x={38} y={194} r={30} o={0.5} />
        <path d="M24 310V250a14 14 0 0 1 28 0V310Z" fill="#3a2a3f" {...ink} />
        <circle cx="38" cy="256" r="5" fill={c.lit ? POTION : "#5a5a72"} {...ink} />
        <circle cx="47" cy="282" r="1.4" fill="#d9a441" />
        {/* The upper floor leans out over the lane */}
        <rect x="8" y="78" width="66" height="80" fill="#7a5c86" {...ink} />
        <path d="M8 96H74M8 140H74M24 78V158M58 78V158M24 96L8 140M58 96L74 140" stroke="#3f2f48" strokeWidth="2" fill="none" />
        <circle cx="41" cy="118" r="14" fill={c.lit ? POTION : "#5a5a72"} {...ink} />
        <path d="M41 104V132M27 118H55" {...thin} strokeOpacity="0.8" />
        <Glow c={c} x={41} y={118} r={26} o={0.45} />
        <path d="M2 82L41 36L82 82Z" fill={SLATE} {...ink} />
        <path d="M18 70q5 4 10 0q5 4 10 0q5 4 10 0q5 4 10 0q5 4 10 0M30 56q5 4 10 0q5 4 10 0q5 4 10 0" {...thin} />
        <rect x="56" y="40" width="8" height="22" fill="#6a5a78" {...ink} />
        <rect x="54" y="38" width="12" height="4" fill="#6a5a78" {...ink} />
      </g>
    ),
  },

  wands: {
    z: 4,
    art: (c) => (
      <g transform="rotate(1.5 160 308)">
        <rect x="132" y="98" width="60" height="212" fill="#3f6b73" {...ink} />
        <path d="M132 150H192M150 98V150M172 98V150" stroke="#2b4a50" strokeWidth="2" />
        <path d="M122 100L162 50L200 100Z" fill="#4a3f63" {...ink} />
        <path d="M138 88q5 4 10 0q5 4 10 0q5 4 10 0q5 4 10 0q5 4 10 0M148 74q5 4 10 0q5 4 10 0q5 4 10 0" {...thin} />
        <circle cx="161" cy="122" r="9" fill={c.lit ? WARM : "#5a5a72"} {...ink} />
        <path d="M161 113V131M152 122H170" {...thin} strokeOpacity="0.8" />
        <rect x="136" y="160" width="48" height="14" rx="2" fill="#d9a441" {...ink} />
        <path d="M143 171l7 -7" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <Sparkle x={152} y={162.5} s={2.4} fill="#fffaf0" />
        <path d="M158 164h20M158 168h14M158 171h18" stroke={INK} strokeWidth="1" strokeLinecap="round" />
        {/* Bay window full of spell books */}
        <path d="M126 184H186V240H126Z" fill={c.lit ? "#ffe2a0" : "#5a5a72"} {...ink} />
        <Spines x={129} y={194} w={54} h={16} seed={3} />
        <Spines x={129} y={220} w={30} h={17} seed={5} />
        <path d="M164 237h18v-4h-16v-4h14v-4h-13" fill="#c8674f" {...ink} strokeWidth="0.8" />
        <path d="M126 212H186M146 184V240M166 184V240" stroke="#2b4a50" strokeWidth="1.6" />
        <Glow c={c} x={156} y={212} r={34} o={0.5} />
        <path d="M122 180H190V186H122ZM122 240H190V246H122Z" fill="#2b4a50" {...ink} />
        <path d="M146 310V268a12 12 0 0 1 24 0V310Z" fill="#2b3a45" {...ink} />
        <rect x="152" y="268" width="12" height="12" rx="1.5" fill={c.lit ? WARM : "#5a5a72"} {...ink} strokeWidth="0.8" />
      </g>
    ),
  },

  arch: {
    z: 6,
    art: (c) => (
      <g>
        <path d="M66 112Q100 78 134 112V126Q100 94 66 126Z" fill="#8f86a3" {...ink} />
        <path d="M78 104l2 9M90 96l1 9M100 93v9M110 96l-1 9M122 104l-2 9" {...thin} />
        {/* Shop sign swinging from an iron bracket */}
        <path d="M68 160H88M72 160q6 -8 14 -2M84 160V166" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M76 166H92V180Q84 188 76 180Z" fill="#d9a441" {...ink} />
        <path d="M82.800 169h2.400v2.600c1.800 0.600 2.600 2 2.600 4.200h-7.600c0 -2.200 0.800 -3.600 2.600 -4.200Z" fill={POTION} {...ink} strokeWidth="0.7" />
        {/* Lantern under the arch */}
        <path d="M100 95V104" {...ink} />
        <Glow c={c} x={100} y={110} r={16} o={0.8} />
        <path d="M96 104h8l1.500 10h-11Z" fill={c.lit ? WARM : "#6a6480"} {...ink} />
        <path d="M95 104h10M94 114h12" {...ink} />
      </g>
    ),
  },

  cauldron: {
    z: 8,
    art: (c) => (
      <g>
        {/* Broom leaning on the wand shop */}
        <path d="M118 226L130 292" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M118 226L130 292" stroke="#b08d61" strokeWidth="2" strokeLinecap="round" />
        <path d="M127 286L122 306L138 304L133 285Z" fill="#d9b565" {...ink} />
        <path d="M126 292l-1.500 12M130 291v14M133 291l2 12" {...thin} />
        <path d="M126 287h8" stroke="#c8674f" strokeWidth="2.4" strokeLinecap="round" />
        {/* Cauldron */}
        <Glow c={c} x={84} y={278} r={22} o={0.5} />
        <path d="M72 300l-3 6M96 300l3 6" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M68 280C66 296 74 304 84 304C94 304 102 296 100 280Z" fill="#3a3445" {...ink} />
        <ellipse cx="84" cy="280" rx="17" ry="4.6" fill="#4a4458" {...ink} />
        <ellipse cx="84" cy="280.500" rx="13.500" ry="3" fill={c.lit ? "#c9f59a" : "#8fbf72"} />
        <circle cx="79" cy="279.500" r="2" fill="#dbffc0" {...ink} strokeWidth="0.6" />
        <circle cx="88" cy="273" r="2.6" fill={POTION} {...ink} strokeWidth="0.6" />
        <circle cx="82" cy="266" r="1.8" fill={POTION} {...ink} strokeWidth="0.6" />
        <circle cx="90" cy="261" r="1.2" fill={POTION} />
        <path d="M72 290q4 4 8 5" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    ),
  },

  pumpkins: {
    z: 8,
    art: () => (
      <g>
        <path d="M150 304h24v-5h-22v-5h20v-5h-19" fill="#7d97b3" {...ink} />
        <path d="M152 299h22M152 294h20" {...thin} />
        <rect x="153" y="284" width="18" height="5" fill="#9a6a8a" {...ink} />
        {[[164, 276, 8], [180, 298, 9], [144, 300, 6]].map(([x, y, r], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.82} fill="#e08a3c" {...ink} />
            <path d={`M${x - r * 0.45} ${y - r * 0.7}Q${x - r * 0.75} ${y} ${x - r * 0.45} ${y + r * 0.7}M${x + r * 0.45} ${y - r * 0.7}Q${x + r * 0.75} ${y} ${x + r * 0.45} ${y + r * 0.7}M${x} ${y - r * 0.8}V${y + r * 0.8}`} {...thin} />
            <path d={`M${x} ${y - r * 0.8}q0 -3 2.500 -4`} stroke="#56743f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    ),
  },

  candles: {
    z: 9,
    art: (c) => (
      <g>
        {CANDLES.map(([x, y], i) => (
          <Candle key={i} c={c} x={x} y={y} />
        ))}
      </g>
    ),
  },

  owl: {
    z: 9,
    art: () => (
      <g transform="translate(100 85)">
        <path d="M-7 4C-9 -8 -5 -14 0 -14C5 -14 9 -8 7 4C5 9 -5 9 -7 4Z" fill="#c9a37a" {...ink} />
        <path d="M-6 -12L-7 -17L-2.500 -13.500ZM6 -12L7 -17L2.500 -13.500Z" fill="#c9a37a" {...ink} />
        <path d="M-3.500 0q3.500 3 7 0q-1 6 -3.500 6q-2.500 0 -3.500 -6Z" fill="#f1e2c8" />
        <circle cx="-3" cy="-7" r="3.200" fill="#fff8e6" {...ink} strokeWidth="0.8" />
        <circle cx="3" cy="-7" r="3.200" fill="#fff8e6" {...ink} strokeWidth="0.8" />
        <circle cx="-3" cy="-7" r="1.300" fill={INK} />
        <circle cx="3" cy="-7" r="1.300" fill={INK} />
        <path d="M-1 -4.500h2l-1 2z" fill="#d9a441" stroke={INK} strokeWidth="0.5" />
        <path d="M-3 8v3M3 8v3" stroke="#d9a441" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    ),
  },

  bats: {
    z: 0.5,
    art: () => (
      <g fill="#1f1b38">
        {[[60, 62, 1], [152, 98, 0.7], [94, 44, 0.6]].map(([x, y, s], i) => (
          <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 0q-3 -4 -8 -2q2 1 2 3q-3 -1 -4 1q4 0 6 3q2 -2 4 -2q2 0 4 2q2 -3 6 -3q-1 -2 -4 -1q0 -2 2 -3q-5 -2 -8 2Z" />
        ))}
      </g>
    ),
  },

  star: {
    z: 0.6,
    art: () => (
      <g>
        <path d="M176 54L152 66" stroke="#fff3c4" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        <Sparkle x={178} y={53} s={3.4} />
      </g>
    ),
  },

  ivy: {
    z: 5,
    art: () => (
      <g>
        <path d="M186 100C180 116 188 130 182 146C178 160 186 172 182 184" fill="none" stroke="#3f6b3a" strokeWidth="1.4" strokeLinecap="round" />
        {[[184, 108, -50], [185, 122, 50], [183, 136, -60], [182, 150, 60], [183, 164, -50], [183, 178, 50]].map(([x, y, rot], i) => (
          <path key={i} transform={`translate(${x} ${y}) rotate(${rot})`} d="M0 0C3 -1.500 3 -6 0 -8C-3 -6 -3 -1.500 0 0Z" fill={i % 2 ? "#6f9a5f" : "#4f7a48"} stroke={INK} strokeWidth="0.6" />
        ))}
      </g>
    ),
  },

  barrel: {
    z: 5,
    art: () => (
      <g>
        <path d="M53 284Q50.500 295 53 306H67Q69.500 295 67 284Z" fill="#8a5a3c" {...ink} />
        <path d="M52 290h16M52 300h16" stroke={INK} strokeWidth="1.4" />
        <ellipse cx="60" cy="284" rx="7" ry="2" fill="#a8714b" {...ink} />
      </g>
    ),
  },

  walllamp: {
    z: 5,
    art: (c) => (
      <g>
        <path d="M136 254h-7v5" fill="none" {...ink} />
        <Glow c={c} x={129} y={264} r={14} o={0.85} />
        <path d="M125.500 259h7l1.500 10h-10Z" fill={c.lit ? WARM : "#6a6480"} {...ink} />
        <path d="M124.500 259h9" {...ink} />
      </g>
    ),
  },

  letters: {
    z: 9,
    art: () => (
      <g>
        {[[70, 236, -15], [112, 240, 10], [128, 208, -25]].map(([x, y, rot], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <rect x="-5.500" y="-3.800" width="11" height="7.600" fill="#f7ecd8" {...ink} strokeWidth="0.8" />
            <path d="M-5.500 -3.800L0 1L5.500 -3.800" {...thin} strokeOpacity="0.8" />
            <circle cx="0" cy="1" r="1.300" fill="#c8473c" />
          </g>
        ))}
      </g>
    ),
  },

  web: {
    z: 9.5,
    art: () => (
      <g fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.7">
        <path d="M188 26L158 26M188 26L162 42M188 26L174 54M188 26L188 58" />
        <path d="M168 26Q172 34 171 36.500Q178 38 180 42.500Q186 42 188 44M178 26Q180 30 179.500 31.500Q183 32 184 34.500Q186 34 188 35" />
        <path d="M176 49V60" />
        <circle cx="176" cy="62" r="2.200" fill="#1f1b38" stroke="none" />
      </g>
    ),
  },

  blackcat: {
    z: 9,
    art: () => (
      <g>
        <Cat x={106} y={304} s={0.9} fill="#2c2738" />
        <circle cx="103.300" cy="289.200" r="1" fill="#f7e08a" />
        <circle cx="108.700" cy="289.200" r="1" fill="#f7e08a" />
      </g>
    ),
  },

  lights: {
    z: 10,
    art: () => (
      <g>
        {[[74, 136, 2.6], [126, 160, 2.2], [96, 232, 2.4], [112, 256, 1.8], [70, 250, 2], [134, 266, 1.6], [104, 130, 1.6]].map(([x, y, s], i) => (
          <Sparkle key={i} x={x} y={y} s={s} fill="#ffe9a8" />
        ))}
      </g>
    ),
  },
};
