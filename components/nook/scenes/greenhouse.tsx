import { Cat, Glow, INK, Leaf, Pot, WARM, ink, thin, type Scene } from "../kit";

const FRAME = "#f4f1e6";
const LEAF = "#7f9e5f";
const LEAF_DARK = "#56743f";
const ROSE = "#e58f8a";

// A rose seen from the front
function Rose({ x, y, r = 4, fill = ROSE }: { x: number; y: number; r?: number; fill?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} {...ink} strokeWidth="0.8" />
      <path d={`M${x - r * 0.5} ${y}q${r * 0.5} ${-r * 0.8} ${r} 0q${-r * 0.5} ${r * 0.6} ${-r * 0.6} ${-r * 0.1}`} {...thin} strokeOpacity="0.7" />
    </g>
  );
}

function Butterfly({ x, y, s = 1, fill, rot = 0 }: { x: number; y: number; s?: number; fill: string; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0C-3 -7 -9 -6 -8 -1C-7 2 -3 2 0 0C-3 1 -6 3 -5 6C-3 8 0 4 0 0Z" fill={fill} {...ink} strokeWidth="0.7" />
      <path d="M0 0C3 -7 9 -6 8 -1C7 2 3 2 0 0C3 1 6 3 5 6C3 8 0 4 0 0Z" fill={fill} {...ink} strokeWidth="0.7" />
      <path d="M0 -3V5M0 -3l-2 -3M0 -3l2 -3" {...ink} strokeWidth="0.8" fill="none" />
    </g>
  );
}

// A glasshouse on a sunny morning
export const greenhouse: Scene = {
  sky: {
    z: 0,
    art: (c) => (
      <g>
        <defs>
          <linearGradient id={`${c.id}-morning`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#a9d3e0" />
            <stop offset="0.6" stopColor="#dcefe6" />
            <stop offset="1" stopColor="#f8ecc8" />
          </linearGradient>
        </defs>
        <rect x="12" y="26" width="176" height="282" fill={`url(#${c.id}-morning)`} />
        <circle cx="150" cy="78" r="15" fill="#fde6a0" />
        <circle cx="150" cy="78" r="22" fill="#fde6a0" opacity="0.35" />
        <path d="M30 90a8 6 0 0 1 14 -4a9 7 0 0 1 16 4ZM92 66a7 5 0 0 1 12 -3a8 6 0 0 1 14 3Z" fill="#fff" opacity="0.85" />
        <path d="M12 190Q40 150 70 180Q96 150 126 178Q156 150 188 184V250H12Z" fill="#9bb87f" {...ink} />
        <path d="M12 214Q34 192 58 210Q84 190 110 210Q140 190 164 208Q178 198 188 206V250H12Z" fill="#6f9a5f" {...ink} />
        {[[30, 206], [76, 204], [130, 204], [170, 210], [104, 216]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill={i % 2 ? "#f7e08a" : "#fbdbe1"} stroke={INK} strokeWidth="0.4" />
        ))}
      </g>
    ),
  },

  floor: {
    z: 1,
    art: () => (
      <g>
        <rect x="12" y="226" width="176" height="38" fill="#c98263" {...ink} />
        {[236, 246, 255].map((y, r) => (
          <g key={y}>
            <path d={`M12 ${y}H188`} {...thin} />
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M${20 + i * 20 + (r % 2) * 10} ${y - 10}V${y}`} {...thin} />
            ))}
          </g>
        ))}
        <rect x="12" y="222" width="176" height="6" fill="#e6d6bd" {...ink} />
        <rect x="12" y="264" width="176" height="44" fill="#e9dcc3" {...ink} />
        <path d="M12 278H188M12 293H188" {...thin} />
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M${100 + (i - 4.5) * 16} 264L${100 + (i - 4.5) * 24} 308`} {...thin} />
        ))}
        {[[36, 271], [84, 271], [132, 271], [180, 271], [56, 285], [112, 285], [164, 285], [30, 300], [98, 300], [152, 300]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 4}l6 4l-6 4l-6 -4Z`} fill="#8fa58a" opacity="0.55" />
        ))}
      </g>
    ),
  },

  glass: {
    z: 2,
    art: () => (
      <g>
        <path d="M12 222V104Q100 4 188 104V222Z" fill="#fff" opacity="0.16" />
        <g fill="none" strokeLinecap="round">
          <path d="M12 104Q100 4 188 104M56 222V70M100 222V54M144 222V70M12 160H188M12 104H188M56 70Q100 40 144 70" stroke={INK} strokeWidth="4.4" />
          <path d="M12 104Q100 4 188 104M56 222V70M100 222V54M144 222V70M12 160H188M12 104H188M56 70Q100 40 144 70" stroke={FRAME} strokeWidth="2.8" />
        </g>
        <path d="M22 118L40 140M26 112L50 142M112 116L128 136" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M100 54V44" {...ink} />
        <circle cx="100" cy="42" r="2.6" fill="#d9a441" {...ink} />
      </g>
    ),
  },

  bench: {
    z: 4,
    art: () => (
      <g>
        <path d="M22 232V300M84 232V300" stroke={INK} strokeWidth="4.4" strokeLinecap="round" />
        <path d="M22 232V300M84 232V300" stroke="#b08d61" strokeWidth="3" strokeLinecap="round" />
        <rect x="20" y="272" width="66" height="5" fill="#b08d61" {...ink} />
        <rect x="16" y="228" width="74" height="7" rx="1.5" fill="#c9a37a" {...ink} />
        {/* Pots on the bench */}
        {[-30, 0, 30].map((rot) => (
          <Leaf key={rot} x={30} y={214} len={12} w={3.6} rot={rot} fill={LEAF} />
        ))}
        <Pot x={30} y={228} w={13} h={11} />
        <path d="M50 216V206M50 210q-5 -2 -5 -7M50 208q5 -2 5 -7" fill="none" stroke={LEAF_DARK} strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="50" cy="204" r="3.4" fill="#f7e08a" {...ink} strokeWidth="0.8" />
        <Pot x={50} y={228} w={11} h={10} fill="#e6d6bd" />
        <path d="M70 222c-7 0 -8 -12 0 -14c8 2 7 14 0 14Z" fill="#6f9a7e" {...ink} />
        <path d="M70 210v10M66 213l8 4M74 213l-8 4" {...thin} />
        <Pot x={70} y={228} w={10} h={6} fill="#7d97b3" />
        {/* A crate and a sack underneath */}
        <rect x="28" y="254" width="22" height="18" rx="1" fill="#d8b98a" {...ink} />
        <path d="M28 260H50M28 266H50" {...thin} />
        <path d="M56 272c-3 -10 0 -18 8 -18s11 8 8 18Z" fill="#c9b08a" {...ink} />
        <path d="M60 256q4 3 8 0" {...thin} />
      </g>
    ),
  },

  shelf: {
    z: 3,
    art: () => (
      <g>
        <path d="M112 176l6 10M176 176l-6 10" {...ink} />
        <rect x="108" y="172" width="72" height="5" rx="1" fill="#c9a37a" {...ink} />
        {[118, 133, 148, 163].map((x, i) => (
          <g key={x}>
            {i === 1 ? (
              <>
                <path d={`M${x} 162c-5 0 -5 -11 0 -12c5 1 5 12 0 12Z`} fill="#6f9a7e" {...ink} strokeWidth="0.8" />
                <circle cx={x} cy="149" r="1.8" fill={ROSE} stroke={INK} strokeWidth="0.5" />
              </>
            ) : (
              <>
                <path d={`M${x} 162V${152 - i}`} stroke={LEAF_DARK} strokeWidth="1.2" />
                <Leaf x={x} y={156} len={7} w={2.8} rot={-50} fill={LEAF} />
                <Leaf x={x} y={154} len={7} w={2.8} rot={50} fill={LEAF} />
                {i === 3 && <circle cx={x} cy="149" r="2.6" fill="#c79be0" {...ink} strokeWidth="0.7" />}
              </>
            )}
            <Pot x={x} y={172} w={10} h={8} fill={["#c27a4e", "#e6d6bd", "#c27a4e", "#e3a3a0"][i]} />
          </g>
        ))}
      </g>
    ),
  },

  baskets: {
    z: 5,
    art: () => (
      <g>
        {[[56, 72, 0], [144, 72, 1]].map(([x, y, k]) => (
          <g key={x}>
            <path d={`M${x} ${y}L${x - 11} ${y + 30}M${x} ${y}L${x + 11} ${y + 30}M${x} ${y}V${y + 30}`} {...thin} strokeOpacity="0.9" />
            {[-70, -40, -12, 12, 40, 70].map((rot, i) => (
              <Leaf key={rot} x={x} y={y + 32} len={12 + (i % 2) * 3} w={4} rot={rot} fill={i % 2 ? LEAF : LEAF_DARK} />
            ))}
            <path d={`M${x - 12} ${y + 30}h24q-2 12 -12 12q-10 0 -12 -12Z`} fill="#b08d61" {...ink} />
            <path d={`M${x - 9} ${y + 35}h18M${x - 6} ${y + 39}h12`} {...thin} />
            <path d={`M${x - 10} ${y + 32}q-5 12 -2 24M${x + 10} ${y + 32}q5 10 1 20`} fill="none" stroke={LEAF_DARK} strokeWidth="1.2" strokeLinecap="round" />
            <Leaf x={x - 12} y={y + 44} len={6} w={3} rot={-140} fill={LEAF} />
            <Leaf x={x - 12} y={y + 54} len={6} w={3} rot={140} fill={LEAF} />
            <Leaf x={x + 12} y={y + 46} len={6} w={3} rot={140} fill={LEAF} />
            <circle cx={x - 5} cy={y + 27} r="3" fill={k ? "#f7e08a" : ROSE} {...ink} strokeWidth="0.7" />
            <circle cx={x + 5} cy={y + 26} r="3" fill={k ? "#f4b8c4" : "#f7ecd8"} {...ink} strokeWidth="0.7" />
            <circle cx={x} cy={y + 24} r="2.6" fill={k ? "#f7ecd8" : "#c79be0"} {...ink} strokeWidth="0.7" />
          </g>
        ))}
      </g>
    ),
  },

  monstera: {
    z: 6,
    art: () => (
      <g>
        {[[26, 250, 30, -34], [40, 236, 34, -4], [54, 246, 30, 30], [30, 268, 24, -66], [58, 268, 22, 62]].map(([x, y, len, rot], i) => (
          <g key={i}>
            <path d={`M42 284Q${(42 + x) / 2} ${y + 14} ${x} ${y}`} fill="none" stroke={LEAF_DARK} strokeWidth="1.8" strokeLinecap="round" />
            <g transform={`translate(${x} ${y}) rotate(${rot})`}>
              <path d={`M0 0C${len * 0.5} ${-len * 0.15} ${len * 0.5} ${-len * 0.8} 0 ${-len}C${-len * 0.5} ${-len * 0.8} ${-len * 0.5} ${-len * 0.15} 0 0Z`} fill={i % 2 ? LEAF : "#6a8f52"} {...ink} />
              <path d={`M0 -1V${-len * 0.9}M0 ${-len * 0.3}L${len * 0.3} ${-len * 0.42}M0 ${-len * 0.3}L${-len * 0.3} ${-len * 0.42}M0 ${-len * 0.55}L${len * 0.28} ${-len * 0.68}M0 ${-len * 0.55}L${-len * 0.28} ${-len * 0.68}`} {...thin} />
            </g>
          </g>
        ))}
        <path d="M28 282L32 306H52L56 282Z" fill="#f4f1e6" {...ink} />
        <rect x="26" y="279" width="32" height="5" rx="1.5" fill="#f4f1e6" {...ink} />
        <path d="M31 292q11 4 22 0" stroke="#7d97b3" strokeWidth="2" fill="none" />
      </g>
    ),
  },

  roses: {
    z: 6,
    art: () => (
      <g>
        {/* Trellis */}
        <path d="M166 110V264M178 110V264M162 130H184M162 160H184M162 190H184M162 220H184M162 248H184" stroke="#b08d61" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M172 264C160 236 186 220 172 196C160 176 184 160 174 136C170 126 174 118 178 112" fill="none" stroke={LEAF_DARK} strokeWidth="2" strokeLinecap="round" />
        {[[166, 244, -60], [180, 226, 50], [164, 206, -50], [180, 186, 60], [166, 166, -40], [182, 146, 50], [170, 126, -30]].map(([x, y, rot], i) => (
          <Leaf key={i} x={x} y={y} len={9} w={3.6} rot={rot} fill={i % 2 ? LEAF : "#6a8f52"} />
        ))}
        <Rose x={176} y={238} r={4.6} />
        <Rose x={166} y={216} r={4} fill="#f4b8c4" />
        <Rose x={178} y={198} r={4.6} />
        <Rose x={168} y={178} r={4} fill="#f7ecd8" />
        <Rose x={178} y={158} r={4.4} fill="#f4b8c4" />
        <Rose x={172} y={138} r={4} />
        <Rose x={180} y={120} r={3.4} fill="#f7ecd8" />
        <path d="M160 264h24v-8h-24Z" fill="#c27a4e" {...ink} />
      </g>
    ),
  },

  chair: {
    z: 7,
    art: () => (
      <g>
        <path d="M110 238C110 216 152 216 152 238V270H110Z" fill="#f4f1e6" {...ink} />
        <path d="M118 226V268M126 222V268M136 222V268M144 226V268M110 240H152M110 254H152" {...thin} />
        <rect x="108" y="266" width="46" height="8" rx="3" fill="#e3a3a0" {...ink} />
        <path d="M114 274V304M148 274V304" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
        <rect x="117" y="246" width="18" height="18" rx="4" fill="#d9a441" {...ink} transform="rotate(6 126 255)" />
        {/* Open book left on the seat */}
        <path d="M130 263q5 -4 10 -1q5 -3 9 1v5q-4 -4 -9 -1q-5 -3 -10 1Z" fill="#fffaf0" {...ink} strokeWidth="0.8" />
        {/* Stool with a cup of tea */}
        <path d="M84 290V304M98 290V304" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        <rect x="80" y="286" width="22" height="5" rx="2" fill="#b08d61" {...ink} />
        <path d="M86 279h10v4q0 3 -5 3q-5 0 -5 -3Z" fill="#f7ecd8" {...ink} />
        <path d="M96 280q4 0 3 3q-1 2 -3 1" fill="none" {...ink} strokeWidth="0.9" />
        <path d="M89 276q-2 -3 0 -5M93 275q-2 -3 0 -5" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
    ),
  },

  can: {
    z: 8,
    art: () => (
      <g>
        <path d="M172 292L184 280" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M172 292L184 280" stroke="#5f8a86" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M158 284q-8 0 -7 9q1 7 7 7" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
        <path d="M158 284q-8 0 -7 9q1 7 7 7" fill="none" stroke="#5f8a86" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M157 282H175L173 306H159Z" fill="#5f8a86" {...ink} />
        <ellipse cx="166" cy="282" rx="9" ry="2.4" fill="#7aa5a1" {...ink} />
        <path d="M161 288v14" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M167 297c-3 -2 -3 -5 0 -5c3 0 3 3 0 5Z" fill="#f7ecd8" />
      </g>
    ),
  },

  butterflies: {
    z: 9,
    art: () => (
      <g>
        <Butterfly x={96} y={124} fill="#f7e08a" rot={-15} />
        <Butterfly x={128} y={198} s={0.8} fill="#c79be0" rot={20} />
        <Butterfly x={78} y={186} s={0.7} fill="#fbdbe1" rot={-25} />
        {/* Robin on the bench */}
        <g transform="translate(84 221)">
          <path d="M4 -2l7 -3l-1 4Z" fill="#8a6a5a" {...ink} strokeWidth="0.8" />
          <ellipse cx="0" cy="-1" rx="5.6" ry="5" fill="#8a6a5a" {...ink} />
          <path d="M-5 -1a5 5 0 0 0 7 4.600q1 -5 -3 -7Z" fill="#e0763c" />
          <circle cx="-3" cy="-6" r="3.4" fill="#8a6a5a" {...ink} />
          <circle cx="-4" cy="-6.500" r="0.7" fill={INK} />
          <path d="M-6.200 -6l-3 0.800l3 0.800Z" fill="#d9a441" stroke={INK} strokeWidth="0.5" />
          <path d="M-1 4v3M2 4v3" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />
        </g>
      </g>
    ),
  },

  tomato: {
    z: 3,
    art: () => (
      <g>
        <path d="M17 222V108" stroke="#b08d61" strokeWidth="1.4" />
        <path d="M18 222C14 190 24 170 18 140C14 124 20 116 18 108" fill="none" stroke={LEAF_DARK} strokeWidth="1.6" strokeLinecap="round" />
        {[[20, 208, 50], [16, 186, -50], [21, 162, 50], [16, 140, -50], [20, 120, 40]].map(([x, y, rot], i) => (
          <Leaf key={i} x={x} y={y} len={8} w={3.2} rot={rot} fill={LEAF} />
        ))}
        {[[22, 198], [15, 174], [23, 150], [16, 128]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={i === 3 ? "#e8a05a" : "#d9443a"} {...ink} strokeWidth="0.7" />
        ))}
      </g>
    ),
  },

  sunflowers: {
    z: 3.5,
    art: () => (
      <g>
        <path d="M80 228V166M91 228V184" stroke={LEAF_DARK} strokeWidth="1.8" strokeLinecap="round" />
        <Leaf x={80} y={200} len={10} w={4} rot={-60} fill={LEAF} />
        <Leaf x={91} y={208} len={9} w={3.6} rot={60} fill={LEAF} />
        {[[80, 160, 8], [91, 178, 7]].map(([x, y, r]) => (
          <g key={x}>
            {Array.from({ length: 10 }, (_, i) => (
              <ellipse key={i} cx={x} cy={y - r * 0.85} rx={r * 0.26} ry={r * 0.5} fill="#f2c230" stroke={INK} strokeWidth="0.5" transform={`rotate(${i * 36} ${x} ${y})`} />
            ))}
            <circle cx={x} cy={y} r={r * 0.5} fill="#7a5540" {...ink} strokeWidth="0.7" />
          </g>
        ))}
      </g>
    ),
  },

  wallcat: {
    z: 3.8,
    art: () => <Cat x={100} y={223} s={0.85} fill="#f1ece4" />,
  },

  birdhouse: {
    z: 5,
    art: () => (
      <g>
        <path d="M100 56V84" {...ink} />
        <path d="M93.500 92V103H106.500V92Z" fill="#f7ecd8" {...ink} />
        <path d="M91 93L100 83L109 93Z" fill="#e3a3a0" {...ink} />
        <circle cx="100" cy="96.500" r="2.200" fill={INK} />
        <path d="M100 100v3" {...ink} />
      </g>
    ),
  },

  hat: {
    z: 8,
    art: () => (
      <g transform="rotate(14 148 224)">
        <ellipse cx="148" cy="224" rx="10" ry="3" fill="#e9d08a" {...ink} />
        <path d="M142.500 223.500q5.500 -10 11 0Z" fill="#e9d08a" {...ink} />
        <path d="M143.500 221.500q4.500 2 9 0" stroke="#c8674f" strokeWidth="1.6" fill="none" />
      </g>
    ),
  },

  boots: {
    z: 8,
    art: () => (
      <g fill="#e9b949">
        <path d="M70 288h6v11h4q3 0 3 3.500v3.500h-13Z" {...ink} />
        <path d="M62 290h6v10h4q3 0 3 3v3h-13Z" {...ink} />
        <path d="M62 293h6M70 291h6" {...thin} />
      </g>
    ),
  },

  lantern: {
    z: 8,
    art: (c) => (
      <g>
        <Glow c={c} x={108} y={298} r={15} o={0.9} />
        <path d="M105 290q3.500 -6 7 0" fill="none" {...ink} />
        <path d="M103.500 292h10l-2 -3.500h-6Z" fill="#5f8a86" {...ink} />
        <rect x="104.500" y="292" width="8" height="12" fill={c.lit ? WARM : "#e6d6bd"} {...ink} />
        <rect x="103.500" y="303.500" width="10" height="2.500" fill="#5f8a86" {...ink} />
      </g>
    ),
  },

  snail: {
    z: 9,
    art: () => (
      <g>
        <path d="M127 306.500q0 -3 3.500 -3h9.500q0 3 -3 3Z" fill="#c9b08a" {...ink} strokeWidth="0.8" />
        <path d="M128.500 303.500l-1.500 -3.500M130.500 303.500l0.500 -3.500" {...ink} strokeWidth="0.7" />
        <circle cx="135.500" cy="301" r="4" fill="#d9a441" {...ink} strokeWidth="0.8" />
        <path d="M135.500 301q2 -1.500 1 1q-3 1.500 -3 -1.500q1 -3 4 -1.500" {...thin} strokeOpacity="0.8" />
      </g>
    ),
  },

  lights: {
    z: 10,
    art: (c) => (
      <g>
        {/* A string of bulbs along the roof */}
        <path d="M14 108Q36 96 56 82Q78 62 100 64Q122 62 144 82Q164 96 186 108" fill="none" stroke={INK} strokeWidth="0.8" />
        {[[22, 105], [36, 97], [50, 88], [64, 77], [80, 68], [100, 66], [120, 68], [136, 77], [150, 88], [164, 97], [178, 105]].map(([x, y], i) => (
          <g key={i}>
            <Glow c={c} x={x} y={y + 3} r={9} o={0.9} />
            <circle cx={x} cy={y + 3} r="2.2" fill={WARM} stroke={INK} strokeWidth="0.5" />
          </g>
        ))}
      </g>
    ),
  },
};
