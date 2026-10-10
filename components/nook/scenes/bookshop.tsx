import { Bunting, Glow, INK, Leaf, Pot, SleepingCat, Sparkle, Spines, WARM, ink, thin, type Ctx, type Scene } from "../kit";

const WOOD = "#9a6a45";
const WOOD_DARK = "#7a5540";

// A bookcase: frame, back panel and rows of spines
function Bookcase({ x, y, w, h, rows, seed }: { x: number; y: number; w: number; h: number; rows: number; seed: number }) {
  const gap = (h - 4) / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={WOOD} {...ink} />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 5} fill="#5d3f2b" />
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          <Spines x={x + 3} y={y + 4 + r * gap} w={w - 6} h={gap - 4.5} seed={seed + r * 3} />
          <rect x={x + 2} y={y + r * gap + gap - 0.5} width={w - 4} height="2.6" fill={WOOD} stroke={INK} strokeWidth="0.6" />
        </g>
      ))}
      <rect x={x - 2} y={y - 3} width={w + 4} height="4" rx="1" fill={WOOD_DARK} {...ink} />
    </g>
  );
}

// A hanging lamp with a shade, its flex starting at (x, y)
function Pendant({ c, x, y, drop, fill = "#d9a441" }: { c: Ctx; x: number; y: number; drop: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x} ${y}V${y + drop}`} {...ink} />
      <Glow c={c} x={x} y={y + drop + 12} r={26} o={0.75} />
      <path d={`M${x - 3} ${y + drop}H${x + 3}L${x + 9} ${y + drop + 9}H${x - 9}Z`} fill={fill} {...ink} />
      <ellipse cx={x} cy={y + drop + 10} rx="4" ry="2.4" fill={c.lit ? "#fff3c4" : "#e6d3b6"} {...ink} strokeWidth="0.8" />
    </g>
  );
}

// Two floors of a snug little bookshop
export const bookshop: Scene = {
  walls: {
    z: 0,
    art: () => (
      <g>
        {/* Upstairs wallpaper */}
        <rect x="12" y="26" width="176" height="126" fill="#b9c7a8" />
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${20 + i * 16} 26V152`} stroke="#fff" strokeOpacity="0.22" strokeWidth="4" />
        ))}
        {/* Downstairs wall with panelling */}
        <rect x="12" y="160" width="176" height="132" fill="#e9c9b8" />
        <rect x="12" y="250" width="176" height="42" fill="#d7ab97" />
        <path d="M12 250H188" {...ink} />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${22 + i * 20} 250V292`} {...thin} />
        ))}
        {/* Floors */}
        <rect x="12" y="290" width="176" height="18" fill="#b98a5e" {...ink} />
        <path d="M12 299H188M50 290V299M110 290V299M160 290V299M80 299V308M140 299V308" {...thin} />
        <rect x="12" y="150" width="176" height="10" fill={WOOD_DARK} {...ink} />
        <path d="M12 153H188" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />
        {/* Balcony rail */}
        <path d="M98 128H188" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
        <path d="M98 128H188" stroke={WOOD} strokeWidth="2.2" strokeLinecap="round" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${102 + i * 10.5} 129V150`} stroke={WOOD_DARK} strokeWidth="1.8" />
        ))}
      </g>
    ),
  },

  upstairs: {
    z: 2,
    art: () => <Bookcase x={18} y={44} w={72} h={106} rows={5} seed={1} />,
  },

  downstairs: {
    z: 2,
    art: () => <Bookcase x={18} y={176} w={70} h={114} rows={5} seed={4} />,
  },

  window: {
    z: 1,
    art: (c) => (
      <g>
        <defs>
          <linearGradient id={`${c.id}-pane`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3c4a78" />
            <stop offset="1" stopColor="#8e86b8" />
          </linearGradient>
        </defs>
        <path d="M112 124V70a32 32 0 0 1 64 0V124Z" fill={`url(#${c.id}-pane)`} {...ink} />
        <circle cx="158" cy="64" r="7" fill="#fbeec4" />
        <circle cx="155" cy="62" r="6" fill="#414e7d" />
        {[[124, 62], [136, 50], [146, 78], [128, 88], [166, 90]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.9" fill="#fff" />
        ))}
        <path d="M112 112Q124 96 136 110Q150 92 176 108V124H112Z" fill="#2f3a5e" opacity="0.7" />
        <path d="M144 38V124M112 84H176" stroke="#f7ecd8" strokeWidth="2.4" />
        <path d="M112 124V70a32 32 0 0 1 64 0V124Z" fill="none" stroke="#f7ecd8" strokeWidth="3" />
        <path d="M110.500 124V70a33.500 33.500 0 0 1 67 0V124" fill="none" {...ink} />
        <rect x="108" y="122" width="72" height="5" rx="1" fill="#f7ecd8" {...ink} />
        {/* Curtains tied back */}
        <path d="M110 40Q124 60 112 96Q108 110 110 122H104V40Z" fill="#e3a3a0" {...ink} />
        <path d="M178 40Q164 60 176 96Q180 110 178 122H184V40Z" fill="#e3a3a0" {...ink} />
        <path d="M104 37H184" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M104 37H184" stroke="#d9a441" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    ),
  },

  ladder: {
    z: 4,
    art: () => (
      <g>
        <path d="M92 290L106 156M106 290L120 156" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M92 290L106 156M106 290L120 156" stroke="#c99a52" strokeWidth="2.4" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const y = 276 - i * 18;
          const x = 92 + ((290 - y) / 134) * 14;
          return <path key={i} d={`M${Math.round(x * 10) / 10} ${y}h14`} stroke={INK} strokeWidth="2.2" strokeLinecap="round" />;
        })}
      </g>
    ),
  },

  rug: {
    z: 1.5,
    art: () => (
      <g>
        <ellipse cx="136" cy="299" rx="46" ry="7" fill="#c8674f" {...ink} />
        <ellipse cx="136" cy="299" rx="37" ry="5" fill="none" stroke="#f7ecd8" strokeWidth="1.2" strokeDasharray="3 2.5" />
        <ellipse cx="136" cy="299" rx="24" ry="3" fill="#d9a441" stroke={INK} strokeWidth="0.6" />
      </g>
    ),
  },

  armchair: {
    z: 5,
    art: () => (
      <g>
        <path d="M134 296v6M176 296v6" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M138 250C138 232 172 232 172 250V282H138Z" fill="#d9a441" {...ink} />
        <path d="M146 246q9 -5 18 0M155 240V262" {...thin} />
        <rect x="134" y="274" width="42" height="14" rx="5" fill="#e3b85a" {...ink} />
        <path d="M128 268a6 6 0 0 1 12 0V296H128ZM170 268a6 6 0 0 1 12 0V296H170Z" fill="#d9a441" {...ink} />
        <rect x="128" y="286" width="54" height="10" rx="2" fill="#c8922f" {...ink} />
        {/* Cushion and an open book */}
        <rect x="143" y="256" width="16" height="15" rx="4" fill="#7d97b3" {...ink} transform="rotate(-8 151 263)" />
        <path d="M156 276q5 -4 10 -1q5 -3 9 1v5q-4 -4 -9 -1q-5 -3 -10 1Z" fill="#fffaf0" {...ink} strokeWidth="0.8" />
        <path d="M166 275v5" {...thin} />
      </g>
    ),
  },

  table: {
    z: 6,
    art: () => (
      <g>
        {/* Round side table with a teapot */}
        <path d="M112 270V302M106 304h12" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="112" cy="270" rx="12" ry="3" fill={WOOD} {...ink} />
        <path d="M105 266c-2 -8 14 -8 12 0Z" fill="#f7ecd8" {...ink} />
        <path d="M117 262q5 -2 5 -5M105 262q-4 0 -3 4" {...ink} fill="none" />
        <circle cx="111" cy="258.500" r="1.2" fill="#c8674f" stroke={INK} strokeWidth="0.5" />
        <path d="M108 263h6" stroke="#c8674f" strokeWidth="1.4" />
        <path d="M110 254q-2 -3 0 -6M114 253q-2 -3 0 -5" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Books that never made it back to the shelves */}
        <rect x="160" y="145" width="20" height="5" rx="0.8" fill="#7d97b3" {...ink} />
        <rect x="162" y="140" width="16" height="5" rx="0.8" fill="#c8674f" {...ink} />
        <rect x="161" y="135.500" width="18" height="4.500" rx="0.8" fill="#efe3cf" {...ink} />
        <rect x="18" y="301" width="20" height="5" rx="0.8" fill="#8fa58a" {...ink} />
        <rect x="20" y="296" width="17" height="5" rx="0.8" fill="#9a6a8a" {...ink} />
        <rect x="19" y="291.500" width="15" height="4.500" rx="0.8" fill="#e8a87c" {...ink} />
      </g>
    ),
  },

  plants: {
    z: 6,
    art: () => (
      <g>
        {/* Pothos trailing from under the balcony */}
        {[[124, 160, 34], [130, 160, 50], [136, 160, 26]].map(([x, y, len], i) => (
          <g key={i}>
            <path d={`M${x} ${y}q${i % 2 ? 4 : -4} ${len / 2} 0 ${len}`} fill="none" stroke="#56743f" strokeWidth="1.2" />
            {Array.from({ length: Math.floor(len / 8) }, (_, j) => (
              <Leaf key={j} x={x + (j % 2 ? 2.5 : -2.5)} y={y + 8 + j * 8} len={7} w={3.6} rot={j % 2 ? 130 : -130} fill={j % 3 ? "#7f9e5f" : "#9bb87f"} />
            ))}
          </g>
        ))}
        <path d="M119 160h22l-3 9h-16Z" fill="#f7ecd8" {...ink} />
        {/* Fern on top of the upstairs shelves */}
        {[-60, -30, 0, 30, 60].map((rot) => (
          <Leaf key={rot} x={34} y={32} len={13} w={4} rot={rot} fill="#6f9a7e" />
        ))}
        <Pot x={34} y={41} w={12} h={7} />
        {/* A leafy plant in the corner upstairs */}
        {[-40, -12, 16, 42].map((rot, i) => (
          <Leaf key={rot} x={150} y={136} len={18 + (i % 2) * 6} w={6} rot={rot} fill={i % 2 ? "#7f9e5f" : "#56743f"} />
        ))}
        <Pot x={150} y={150} w={13} h={12} fill="#7d97b3" />
      </g>
    ),
  },

  lamps: {
    z: 7,
    art: (c) => (
      <g>
        <Pendant c={c} x={100} y={26} drop={16} />
        <Pendant c={c} x={156} y={160} drop={12} fill="#e3a3a0" />
        {/* Brass reading lamp by the chair */}
        <path d="M186 302V226" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M186 302V226" stroke="#c99a52" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M180 304h8" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
        <Glow c={c} x={180} y={236} r={24} o={0.8} />
        <path d="M176 222H188L186 236H172Z" fill="#8fa58a" {...ink} />
        <ellipse cx="179" cy="236.500" rx="5" ry="1.8" fill={c.lit ? "#fff3c4" : "#e6d3b6"} stroke={INK} strokeWidth="0.6" />
        {/* Fairy lights along the balcony */}
        <path d="M98 134Q120 142 142 134Q164 142 188 134" fill="none" stroke={INK} strokeWidth="0.7" />
        {[104, 114, 124, 134, 146, 156, 166, 176].map((x, i) => (
          <g key={x}>
            <Glow c={c} x={x} y={i % 2 ? 139 : 137} r={5} o={0.9} />
            <circle cx={x} cy={i % 2 ? 139 : 137} r="1.5" fill={c.lit ? WARM : "#f7ecd8"} stroke={INK} strokeWidth="0.4" />
          </g>
        ))}
      </g>
    ),
  },

  cat: {
    z: 8,
    art: () => <SleepingCat x={78} y={300} s={1.1} fill="#3f3a3a" />,
  },

  frames: {
    z: 1.2,
    art: () => (
      <g>
        <rect x="146" y="194" width="16" height="20" fill="#c99a52" {...ink} />
        <rect x="148.500" y="196.500" width="11" height="15" fill="#b9c7a8" stroke={INK} strokeWidth="0.5" />
        <path d="M150 210q4 -9 8 0" fill="#7f9e5f" />
        <rect x="167" y="200" width="14" height="14" fill="#7a5540" {...ink} />
        <rect x="169.500" y="202.500" width="9" height="9" fill="#f7ecd8" stroke={INK} strokeWidth="0.5" />
        <path d="M174 210c-4 -3 -3 -6 -1 -6q1 0 1 1q0 -1 1 -1c2 0 3 3 -1 6Z" fill="#c8674f" />
      </g>
    ),
  },

  clock: {
    z: 1.2,
    art: () => (
      <g>
        <circle cx="97" cy="74" r="6.500" fill="#f7ecd8" stroke={INK} strokeWidth="1.8" />
        <circle cx="97" cy="74" r="6.500" fill="none" stroke="#c99a52" strokeWidth="0.9" />
        <path d="M97 74V70M97 74h3" {...ink} strokeWidth="0.9" />
      </g>
    ),
  },

  stars: {
    z: 1.3,
    art: () => (
      <g>
        {[[128, 62], [138, 78], [158, 96]].map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x} 40V${y - 4}`} stroke={INK} strokeWidth="0.5" />
            <Sparkle x={x} y={y} s={4} fill="#fde6a0" />
          </g>
        ))}
      </g>
    ),
  },

  bunting: {
    z: 1.1,
    art: () => <Bunting x1={46} y1={30} x2={188} y2={30} sag={5} count={10} />,
  },

  globe: {
    z: 3,
    art: () => (
      <g>
        <path d="M122 150v-5M117 150h10" {...ink} />
        <circle cx="122" cy="138" r="7.500" fill="#7d97b3" {...ink} />
        <path d="M118 134q3 -3 5 0q1 3 -2 4q-3 0 -3 -4ZM124 140q3 -1 3 2q-2 2 -3 -2Z" fill="#8fa58a" />
        <path d="M114 133A9.500 9.500 0 0 0 124 147" fill="none" stroke="#c99a52" strokeWidth="1.2" />
      </g>
    ),
  },

  stool: {
    z: 5,
    art: () => (
      <g>
        <path d="M46 295l-2 11M58 295l2 11M45 301h14" {...ink} fill="none" />
        <rect x="43" y="291.500" width="18" height="3.500" rx="1" fill="#c99a52" {...ink} />
      </g>
    ),
  },

  blanket: {
    z: 6,
    art: () => (
      <g>
        <path d="M127 266q7 -3 14 0V290h-14Z" fill="#e3a3a0" {...ink} />
        <path d="M127 272h14M127 278h14M127 284h14" stroke="#f7ecd8" strokeWidth="1.4" />
        <path d="M128.500 290v3M131.500 290v3M134.500 290v3M137.500 290v3M140 290v3" {...thin} strokeOpacity="0.9" />
      </g>
    ),
  },

  mouse: {
    z: 8,
    art: () => (
      <g>
        <path d="M105 148q-5 0 -6 -4" fill="none" {...ink} strokeWidth="0.8" />
        <ellipse cx="110" cy="146" rx="5" ry="3.600" fill="#b9b3a8" {...ink} strokeWidth="0.8" />
        <circle cx="113" cy="142.500" r="2" fill="#e3a3a0" {...ink} strokeWidth="0.7" />
        <circle cx="113.800" cy="145.500" r="0.600" fill={INK} />
        <rect x="113.500" y="147" width="6" height="2.600" fill="#c8674f" stroke={INK} strokeWidth="0.5" />
      </g>
    ),
  },

  lights: {
    z: 9,
    art: () => (
      <g>
        {/* Warm lamplight pooling on the floor and wall */}
        <ellipse cx="150" cy="292" rx="40" ry="8" fill="#ffd98a" opacity="0.22" />
        <ellipse cx="100" cy="120" rx="46" ry="26" fill="#ffd98a" opacity="0.12" />
      </g>
    ),
  },
};
