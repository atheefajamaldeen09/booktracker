import { Glow, INK, Leaf, Pot, SleepingCat, Spines, WARM, ink, thin, type Scene } from "../kit";

const WHITE = "#fbf8ef";
const LEAF = "#7f9e5f";
const LEAF_DARK = "#56743f";
const WICKER = "#c9a06a";

// One white French door, its panes cut out so the room shows through
function Door({ x }: { x: number }) {
  const panes = [0, 1, 2, 3, 4].flatMap((r) => [0, 1].map((col) => `M${x + 4 + col * 12} ${70 + r * 34}h10v28h-10Z`)).join("");
  return (
    <g>
      <path d={`M${x} 60h30v248h-30Z${panes}`} fillRule="evenodd" fill={WHITE} {...ink} />
      <rect x={x + 4} y="242" width="22" height="58" rx="1.500" {...thin} strokeOpacity="0.6" />
    </g>
  );
}

function Sunflower({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={i} cx={x} cy={y - r * 0.85} rx={r * 0.26} ry={r * 0.5} fill="#f2c230" stroke={INK} strokeWidth="0.5" transform={`rotate(${i * 36} ${x} ${y})`} />
      ))}
      <circle cx={x} cy={y} r={r * 0.5} fill="#7a5540" {...ink} strokeWidth="0.7" />
    </g>
  );
}

function Butterfly({ x, y, s, fill, rot }: { x: number; y: number; s: number; fill: string; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0C-3 -7 -9 -6 -8 -1C-7 2 -3 2 0 0C-3 1 -6 3 -5 6C-3 8 0 4 0 0Z" fill={fill} {...ink} strokeWidth="0.7" />
      <path d="M0 0C3 -7 9 -6 8 -1C7 2 3 2 0 0C3 1 6 3 5 6C3 8 0 4 0 0Z" fill={fill} {...ink} strokeWidth="0.7" />
      <path d="M0 -3V5" {...ink} strokeWidth="0.8" />
    </g>
  );
}

// A sunny garden room behind white French doors
export const garden: Scene = {
  wall: {
    z: 0,
    art: () => (
      <g>
        <rect x="12" y="26" width="176" height="252" fill="#f6e3a8" />
        <rect x="12" y="232" width="176" height="46" fill="#ecd08a" />
        <path d="M12 232H188" {...thin} strokeOpacity="0.6" />
      </g>
    ),
  },

  floor: {
    z: 1,
    art: () => (
      <g>
        <rect x="12" y="276" width="176" height="32" fill="#d99a6c" {...ink} />
        <path d="M12 286H188M12 297H188" {...thin} strokeOpacity="0.45" />
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${100 + (i - 5) * 15} 276L${100 + (i - 5) * 22} 308`} {...thin} strokeOpacity="0.45" />
        ))}
      </g>
    ),
  },

  window: {
    z: 1.5,
    art: (c) => (
      <g>
        <defs>
          <linearGradient id={`${c.id}-view`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#a9d3e0" />
            <stop offset="1" stopColor="#e6f1d8" />
          </linearGradient>
        </defs>
        <rect x="50" y="66" width="48" height="104" fill={`url(#${c.id}-view)`} {...ink} />
        <path d="M50 150q12 -14 24 -4q12 -12 24 0v24h-48Z" fill="#9bb87f" />
        <circle cx="84" cy="86" r="6" fill="#fde6a0" />
        <path d="M74 66V170M50 100H98M50 134H98" stroke={WHITE} strokeWidth="3" />
        <rect x="50" y="66" width="48" height="104" fill="none" stroke={WHITE} strokeWidth="4" />
        <rect x="48" y="64" width="52" height="108" fill="none" {...ink} />
        <rect x="46" y="170" width="56" height="5" rx="1" fill={WHITE} {...ink} />
      </g>
    ),
  },

  shelves: {
    z: 2,
    art: () => (
      <g>
        {[96, 132, 168].map((y, r) => (
          <g key={y}>
            <Spines x={108} y={y - 24} w={r === 1 ? 26 : 44} h={24} seed={r * 3 + 2} />
            <rect x="106" y={y} width="48" height="3.500" fill="#c9a37a" {...ink} strokeWidth="0.8" />
            <path d={`M110 ${y + 3.500}l3 5M150 ${y + 3.500}l-3 5`} {...ink} strokeWidth="0.8" />
          </g>
        ))}
        <circle cx="145" cy="120" r="5" fill="#6f9a7e" {...ink} strokeWidth="0.8" />
        <Pot x={145} y={132} w={10} h={7} />
      </g>
    ),
  },

  hat: {
    z: 3,
    art: () => (
      <g transform="translate(100 196) scale(0.82) translate(-70 -204)">
        <path d="M70 186v6" {...ink} />
        <ellipse cx="70" cy="204" rx="14" ry="12" fill="#e9d08a" {...ink} />
        <ellipse cx="70" cy="203" rx="7.500" ry="6.500" fill="#f1dca0" {...ink} />
        <path d="M62.500 204a7.500 6.500 0 0 0 15 0" fill="none" stroke="#f2c230" strokeWidth="2" />
        <path d="M77 207q5 4 4 11" fill="none" stroke="#f2c230" strokeWidth="1.800" strokeLinecap="round" />
      </g>
    ),
  },

  tools: {
    z: 3,
    art: () => (
      <g>
        <path d="M118 184V224M132 184V222" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M118 184V224M132 184V222" stroke="#b08d61" strokeWidth="1.600" strokeLinecap="round" />
        <path d="M113 224h10v10q-5 5 -10 0Z" fill="#b9b3a8" {...ink} />
        <path d="M127 222h10M128 222v11M132 222v12M136 222v11" fill="none" {...ink} strokeWidth="1.400" />
        <path d="M112 182h26" {...ink} />
      </g>
    ),
  },

  sunflowers: {
    z: 4,
    art: () => (
      <g>
        <path d="M54 280V196M62 280V214M48 280V228" stroke={LEAF_DARK} strokeWidth="1.800" strokeLinecap="round" />
        <Leaf x={54} y={244} len={11} w={4.4} rot={60} fill={LEAF} />
        <Leaf x={54} y={228} len={10} w={4} rot={-60} fill={LEAF} />
        <Leaf x={62} y={254} len={10} w={4} rot={55} fill={LEAF} />
        <Sunflower x={54} y={190} r={9} />
        <Sunflower x={63} y={210} r={7.500} />
        <Sunflower x={47} y={224} r={6.500} />
        <path d="M44 278L46 300H66L68 278Z" fill="#9fb4c4" {...ink} />
        <path d="M44.500 284h23" {...thin} />
      </g>
    ),
  },

  wicker: {
    z: 5,
    art: () => (
      <g>
        <path d="M86 268V300M122 268V300" stroke={INK} strokeWidth="3.200" strokeLinecap="round" />
        <path d="M86 268V300M122 268V300" stroke={WICKER} strokeWidth="1.800" strokeLinecap="round" />
        <path d="M82 262q0 -46 22 -46q22 0 22 46Z" fill={WICKER} {...ink} />
        <path d="M88 258q0 -36 16 -36q16 0 16 36M96 258V224M104 258V222M112 258V224M84 244h40M88 232h32" {...thin} strokeOpacity="0.7" />
        <rect x="80" y="258" width="48" height="10" rx="4" fill="#d8b584" {...ink} />
      </g>
    ),
  },

  cat: {
    z: 6,
    art: () => <SleepingCat x={105} y={259} s={1.150} fill="#f4f1ea" />,
  },

  table: {
    z: 6,
    art: () => (
      <g>
        <path d="M140 284V304" stroke={INK} strokeWidth="2.400" strokeLinecap="round" />
        <path d="M124 262q16 -7 32 0l4 24q-20 7 -40 0Z" fill="#fffaf0" {...ink} />
        {[[130, 270], [140, 274], [150, 270], [126, 280], [136, 284], [146, 282], [155, 281]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.500" fill="#3f4a45" />
        ))}
        <ellipse cx="140" cy="262" rx="16" ry="3.600" fill="#fffaf0" {...ink} />
      </g>
    ),
  },

  lavender: {
    z: 7,
    art: () => (
      <g>
        <path d="M140 250V228M137 250q-4 -10 -7 -18M143 250q4 -10 8 -16" fill="none" stroke={LEAF_DARK} strokeWidth="1.200" strokeLinecap="round" />
        {[[140, 226], [130, 230], [151, 232]].map(([x, y], i) => (
          <g key={i}>
            {[0, 1, 2, 3].map((j) => (
              <circle key={j} cx={x + (j % 2 ? 1.200 : -1.200)} cy={y + j * 3} r="1.800" fill="#b79be0" stroke={INK} strokeWidth="0.4" />
            ))}
          </g>
        ))}
        <circle cx="134" cy="244" r="3.200" fill="#fffaf0" {...ink} strokeWidth="0.7" />
        <circle cx="134" cy="244" r="1.200" fill="#f2c230" />
        <path d="M135 262q-4 -6 0 -12h10q4 6 0 12Z" fill="#b9c7d8" {...ink} />
      </g>
    ),
  },

  cactus: {
    z: 7.5,
    art: () => (
      <g>
        <path d="M140 276q-8 0 -7 -10M150 268q8 0 7 -10" fill="none" stroke={INK} strokeWidth="6.400" strokeLinecap="round" />
        <path d="M140 276q-8 0 -7 -10M150 268q8 0 7 -10" fill="none" stroke="#6f9a7e" strokeWidth="4.800" strokeLinecap="round" />
        <rect x="140" y="248" width="10" height="46" rx="5" fill="#6f9a7e" {...ink} />
        <path d="M145 252V292M142.500 258v30M147.500 258v30" {...thin} strokeOpacity="0.5" />
        <circle cx="145" cy="247" r="2.600" fill="#f4b8c4" {...ink} strokeWidth="0.7" />
        <Pot x={145} y={306} w={16} h={12} />
      </g>
    ),
  },

  hanging: {
    z: 6.5,
    art: () => (
      <g>
        <path d="M130 60L122 78M130 60L138 78M130 60V78" {...thin} strokeOpacity="0.9" />
        {[-60, -30, 0, 30, 60].map((rot, i) => (
          <Leaf key={rot} x={130} y={80} len={11} w={4} rot={rot} fill={i % 2 ? LEAF : LEAF_DARK} />
        ))}
        <path d="M121 78h18q-1 10 -9 10q-8 0 -9 -10Z" fill="#f4b8c4" {...ink} />
        <path d="M123 82q-5 14 -2 28M137 82q5 12 2 22" fill="none" stroke={LEAF_DARK} strokeWidth="1.200" strokeLinecap="round" />
        {[[120, 94, -130], [121, 106, 130], [139, 92, 130], [139, 102, -130]].map(([x, y, rot], i) => (
          <Leaf key={i} x={x} y={y} len={6} w={3} rot={rot} fill={LEAF} />
        ))}
      </g>
    ),
  },

  arch: {
    z: 7,
    art: () => (
      <g>
        <rect x="12" y="26" width="176" height="34" fill={WHITE} {...ink} />
        <path d="M60 58Q100 26 140 58Z" fill="#cfe6ea" {...ink} />
        <path d="M100 58V42M100 58L80 46M100 58L120 46M100 58L68 54M100 58L132 54" {...thin} strokeOpacity="0.8" />
        <path d="M18 32h30v22h-30ZM152 32h30v22h-30Z" {...thin} strokeOpacity="0.5" />
      </g>
    ),
  },

  doors: {
    z: 8,
    art: () => (
      <g>
        <Door x={12} />
        <Door x={158} />
        <circle cx="38" cy="186" r="1.800" fill="#c99a52" {...ink} strokeWidth="0.6" />
        <circle cx="162" cy="186" r="1.800" fill="#c99a52" {...ink} strokeWidth="0.6" />
      </g>
    ),
  },

  vine: {
    z: 8.5,
    art: () => (
      <g>
        <path d="M14 70C20 62 34 64 44 58C70 48 96 64 122 56C146 50 166 62 186 56" fill="none" stroke={LEAF_DARK} strokeWidth="1.600" strokeLinecap="round" />
        <path d="M16 70C12 100 22 120 16 150" fill="none" stroke={LEAF_DARK} strokeWidth="1.400" strokeLinecap="round" />
        {[[26, 64, 200], [40, 60, 160], [56, 55, 200], [72, 55, 160], [88, 58, 200], [104, 59, 160], [120, 56, 200], [136, 54, 160], [152, 56, 200], [168, 58, 160], [180, 57, 200], [15, 86, 60], [18, 104, 120], [19, 122, 60], [17, 140, 120]].map(([x, y, rot], i) => (
          <Leaf key={i} x={x} y={y} len={7} w={3.200} rot={rot} fill={i % 3 ? LEAF : "#9bb87f"} />
        ))}
        {[[48, 58], [96, 60], [144, 55]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.400" fill="#f4b8c4" stroke={INK} strokeWidth="0.5" />
        ))}
      </g>
    ),
  },

  can: {
    z: 9,
    art: () => (
      <g>
        <path d="M60 292L72 282" stroke={INK} strokeWidth="3.800" strokeLinecap="round" />
        <path d="M60 292L72 282" stroke="#f2c230" strokeWidth="2.400" strokeLinecap="round" />
        <path d="M44 286q-7 0 -6 8q1 6 6 6" fill="none" stroke={INK} strokeWidth="3.400" strokeLinecap="round" />
        <path d="M44 286q-7 0 -6 8q1 6 6 6" fill="none" stroke="#f2c230" strokeWidth="2" strokeLinecap="round" />
        <path d="M43 284H61L59 306H45Z" fill="#f2c230" {...ink} />
        <ellipse cx="52" cy="284" rx="9" ry="2.400" fill="#f7d860" {...ink} />
      </g>
    ),
  },

  pots: {
    z: 9,
    art: () => (
      <g>
        {[-50, -20, 10, 40].map((rot) => (
          <Leaf key={rot} x={80} y={293} len={9} w={3.400} rot={rot} fill="#6f9a7e" />
        ))}
        <Pot x={80} y={306} w={13} h={10} fill="#fbf8ef" />
        <path d="M97 294V286" stroke={LEAF_DARK} strokeWidth="1.200" />
        <circle cx="97" cy="283" r="3.400" fill="#e58f8a" {...ink} strokeWidth="0.7" />
        <Leaf x={97} y={293} len={6} w={2.800} rot={-60} fill={LEAF} />
        <Leaf x={97} y={293} len={6} w={2.800} rot={60} fill={LEAF} />
        <Pot x={97} y={306} w={11} h={9} />
        <circle cx="174" cy="290" r="6.500" fill={LEAF} {...ink} />
        <circle cx="172" cy="287" r="1.600" fill="#fffaf0" />
        <circle cx="177" cy="290" r="1.600" fill="#fffaf0" />
        <Pot x={174} y={306} w={13} h={10} fill="#7d97b3" />
      </g>
    ),
  },

  butterflies: {
    z: 9.5,
    art: () => (
      <g>
        <Butterfly x={84} y={184} s={0.900} fill="#f7e08a" rot={-15} />
        <Butterfly x={148} y={206} s={0.700} fill="#fbdbe1" rot={20} />
        <Butterfly x={72} y={130} s={0.650} fill="#c79be0" rot={-25} />
      </g>
    ),
  },

  lights: {
    z: 10,
    art: (c) => (
      <g>
        <path d="M44 64Q72 76 100 66Q128 76 156 64" fill="none" stroke={INK} strokeWidth="0.800" />
        {[[52, 67], [64, 70], [76, 71], [88, 69], [100, 66.500], [112, 69], [124, 71], [136, 70], [148, 67]].map(([x, y], i) => (
          <g key={i}>
            <Glow c={c} x={x} y={y + 2.500} r={8} o={0.9} />
            <circle cx={x} cy={y + 2.500} r="2" fill={WARM} stroke={INK} strokeWidth="0.5" />
          </g>
        ))}
        <ellipse cx="100" cy="296" rx="56" ry="8" fill="#ffd98a" opacity="0.22" />
      </g>
    ),
  },
};
