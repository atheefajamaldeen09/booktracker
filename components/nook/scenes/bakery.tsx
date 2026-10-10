import { Bear, Cat, Glow, INK, Sparkle, WARM, ink, thin, type Scene } from "../kit";

const MUSTARD = "#e2a93b";
const CREAM = "#f7ecd8";
const WOOD = "#b08d61";
const CRUST = "#d9a25a";

// A little bakery with its window full of bread
export const bakery: Scene = {
  wall: {
    z: 0,
    art: () => (
      <g>
        <rect x="12" y="26" width="176" height="258" fill="#f3ead6" />
        {[110, 124, 138, 152, 166, 180, 194, 208, 222, 236, 250, 264].map((y, r) => (
          <g key={y}>
            <path d={`M12 ${y}H188`} {...thin} strokeOpacity="0.2" />
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i} d={`M${24 + i * 24 + (r % 2) * 12} ${y}v14`} {...thin} strokeOpacity="0.2" />
            ))}
          </g>
        ))}
      </g>
    ),
  },

  floor: {
    z: 1,
    art: () => (
      <g>
        <rect x="12" y="282" width="176" height="26" fill="#c9b8a6" {...ink} />
        <path d="M12 295H188M40 282v13M84 282v13M128 282v13M172 282v13M62 295v13M106 295v13M150 295v13" {...thin} />
      </g>
    ),
  },

  window: {
    z: 2,
    art: (c) => (
      <g>
        <rect x="86" y="96" width="100" height="138" rx="2" fill={CREAM} {...ink} />
        <rect x="91" y="101" width="90" height="128" fill={c.lit ? "#ffe9b8" : "#9fb0b8"} {...ink} />
        <path d="M96 106l14 20M104 104l8 12" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.800" strokeLinecap="round" />
        <Glow c={c} x={136} y={160} r={60} o={0.35} />
      </g>
    ),
  },

  door: {
    z: 3,
    art: (c) => (
      <g>
        <rect x="18" y="278" width="62" height="6" fill="#b9a58e" {...ink} />
        <rect x="20" y="110" width="58" height="170" fill="#b8862f" {...ink} />
        <rect x="24" y="114" width="50" height="166" fill={MUSTARD} {...ink} />
        <rect x="31" y="122" width="36" height="74" rx="2" fill={c.lit ? "#ffe2a0" : "#8fa3ad"} {...ink} />
        <path d="M35 128l8 12" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.600" strokeLinecap="round" />
        <rect x="31" y="206" width="36" height="62" rx="2" {...thin} strokeOpacity="0.7" />
        <circle cx="69" cy="201" r="2.200" fill="#c99a52" {...ink} strokeWidth="0.8" />
      </g>
    ),
  },

  ledge: {
    z: 3,
    art: () => (
      <g>
        <rect x="86" y="234" width="100" height="48" fill={MUSTARD} {...ink} />
        <rect x="92" y="241" width="88" height="34" rx="2" {...thin} strokeOpacity="0.7" />
        <rect x="84" y="230" width="104" height="6" rx="1" fill={CREAM} {...ink} />
      </g>
    ),
  },

  shelves: {
    z: 3,
    art: () => (
      <g>
        <rect x="91" y="142" width="90" height="3.500" fill={WOOD} {...ink} strokeWidth="0.8" />
        <rect x="91" y="186" width="90" height="3.500" fill={WOOD} {...ink} strokeWidth="0.8" />
        <path d="M96 145.500l4 5M176 145.500l-4 5M96 189.500l4 5M176 189.500l-4 5" {...ink} strokeWidth="0.8" />
      </g>
    ),
  },

  loaves: {
    z: 4,
    art: () => (
      <g>
        <path d="M95 142q0 -13 11 -13q11 0 11 13Z" fill={CRUST} {...ink} />
        <path d="M100 134l4 4M105 132l4 4M110 133l3 4" {...thin} strokeOpacity="0.8" />
        {[[128, 108, 130], [135, 105, 135], [143, 109, 140]].map(([x1, y1, x2], i) => (
          <g key={i}>
            <path d={`M${x2} 134L${x1} ${y1}`} stroke={INK} strokeWidth="6.600" strokeLinecap="round" />
            <path d={`M${x2} 134L${x1} ${y1}`} stroke="#e0b06a" strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}
        <path d="M123 142l2 -13h20l2 13Z" fill="#c9a37a" {...ink} />
        <path d="M125 133h20M124 138h22M130 129v13M135 129v13M140 129v13" {...thin} />
        <path d="M152 142v-8q0 -7 6 -7h12q6 0 6 7v8Z" fill="#c98f4a" {...ink} />
        <path d="M152 136h24" {...thin} />
      </g>
    ),
  },

  buns: {
    z: 4,
    art: () => (
      <g>
        {[95, 115].map((x) => (
          <g key={x}>
            <path d={`M${x} 185q9 -16 18 0q-4 -4 -9 -4q-5 0 -9 4Z`} fill="#e0a850" {...ink} />
            <path d={`M${x + 5} 177l1 4M${x + 9} 175.500v5M${x + 13} 177l-1 4`} {...thin} strokeOpacity="0.8" />
          </g>
        ))}
        <path d="M136 186a6.500 6.500 0 0 1 13 0Z" fill="#d99a4a" {...ink} />
        <path d="M138.500 182.500q4 -4.500 8 0q-4 1.500 -8 0Z" fill="#f4b8c4" />
      </g>
    ),
  },

  cake: {
    z: 4,
    art: () => (
      <g>
        <path d="M95 229a9 5.500 0 0 1 18 0Z" fill={CRUST} {...ink} />
        <path d="M99 226l2 -2M104 225v-2.500M109 226l-2 -2" {...thin} strokeOpacity="0.9" />
        <path d="M132 229V219M124 229h16" {...ink} />
        <ellipse cx="132" cy="219" rx="14" ry="2.600" fill={CREAM} {...ink} />
        <rect x="121" y="207" width="22" height="11" rx="2" fill="#f4b8c4" {...ink} />
        <path d="M121 210q2.750 3.500 5.500 0q2.750 3.500 5.500 0q2.750 3.500 5.500 0q2.750 3.500 5.500 0" fill="none" stroke="#fffaf0" strokeWidth="1.400" />
        <rect x="125" y="198" width="14" height="9" rx="2" fill="#fffaf0" {...ink} />
        <circle cx="132" cy="196" r="2.200" fill="#d9443a" {...ink} strokeWidth="0.7" />
      </g>
    ),
  },

  baker: {
    z: 4.5,
    art: () => (
      <g>
        <Bear x={163} y={230} s={1.2} fill="#e0b060" />
        <path d="M157 214h12v12h-12Z" fill="#fffaf0" {...ink} strokeWidth="0.8" />
        <path d="M156.500 191.500v-6q-3.500 -5 2.500 -7q4 -5 8.500 0q6 2 2.500 7v6Z" fill="#fffaf0" {...ink} />
        <path d="M156.500 188h13.500" {...thin} strokeOpacity="0.8" />
      </g>
    ),
  },

  awning: {
    z: 6,
    art: () => (
      <g>
        <path d="M14 72H186L188 96H12Z" fill={CREAM} {...ink} />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${19 + i * 25} 72h12.500l0.500 24h-13Z`} fill={MUSTARD} />
        ))}
        <path d="M14 72H186L188 96H12Z" fill="none" {...ink} />
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${12 + i * 16} 96a8 6 0 0 0 16 0Z`} fill={i % 2 ? CREAM : MUSTARD} {...ink} strokeWidth="0.9" />
        ))}
      </g>
    ),
  },

  sign: {
    z: 7,
    art: () => (
      <g>
        <path d="M34 68V46Q100 24 166 46V68Z" fill="#c98f4a" {...ink} />
        <path d="M39 64V49Q100 30 161 49V64Z" fill="none" stroke="#fffaf0" strokeOpacity="0.7" strokeWidth="0.9" />
        <text x="100" y="60" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="1.500" fill="#fffaf0" fontFamily="Georgia, serif">
          BAKERY
        </text>
        <path d="M100 40q-5 -3 -5 -7q5 0 5 7q0 -7 5 -7q0 4 -5 7" fill="#fffaf0" opacity="0.9" />
      </g>
    ),
  },

  lamp: {
    z: 5,
    art: (c) => (
      <g>
        <path d="M118 101V111" {...ink} />
        <Glow c={c} x={118} y={122} r={24} o={0.8} />
        <path d="M111 119l4 -8h6l4 8Z" fill="#fffaf0" {...ink} />
        <ellipse cx="118" cy="119.500" rx="3.400" ry="1.800" fill={c.lit ? "#fff3c4" : "#e6d3b6"} stroke={INK} strokeWidth="0.6" />
      </g>
    ),
  },

  opensign: {
    z: 5,
    art: () => (
      <g>
        <path d="M41 134L49 126L57 134" fill="none" {...ink} strokeWidth="0.8" />
        <rect x="36" y="134" width="26" height="13" rx="2" fill="#7a5540" {...ink} />
        <text x="49" y="143.500" textAnchor="middle" fontSize="6.500" fontWeight="700" letterSpacing="0.6" fill={CREAM} fontFamily="Georgia, serif">
          OPEN
        </text>
      </g>
    ),
  },

  lantern: {
    z: 5,
    art: (c) => (
      <g>
        <path d="M79 122h5v6" fill="none" {...ink} />
        <Glow c={c} x={84} y={134} r={13} o={0.85} />
        <path d="M80.500 128h7l1 10h-9Z" fill={c.lit ? WARM : "#8f8a80"} {...ink} />
        <path d="M79.500 128h9" {...ink} />
      </g>
    ),
  },

  sacks: {
    z: 6,
    art: () => (
      <g>
        <path d="M95 282L88 250" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M95 282L88 250" stroke="#c9a37a" strokeWidth="3.400" strokeLinecap="round" />
        <path d="M72 284c-4 -13 0 -23 9 -23s13 10 9 23Z" fill="#e9dcc3" {...ink} />
        <path d="M76 262q5 3 10 0" {...thin} strokeOpacity="0.9" />
        <path d="M81 268v9M81 271l-3 -2M81 271l3 -2M81 274l-3 -2M81 274l3 -2" {...thin} strokeOpacity="0.8" />
      </g>
    ),
  },

  planters: {
    z: 5,
    art: () => (
      <g>
        {[108, 118, 128, 138, 148, 158, 168].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={266} r="5" fill={i % 2 ? "#7f9e5f" : "#6a8f52"} />
            <circle cx={x} cy={262} r="2.600" fill={["#f4b8c4", "#fffaf0", "#f7e08a"][i % 3]} {...ink} strokeWidth="0.6" />
          </g>
        ))}
        <rect x="102" y="268" width="72" height="11" rx="1.500" fill="#7a5540" {...ink} />
      </g>
    ),
  },

  easel: {
    z: 7,
    art: () => (
      <g>
        <path d="M19 306L25 264H39L45 306Z" fill="#3f4a45" {...ink} />
        <path d="M19 306L25 264H39L45 306" fill="none" stroke={WOOD} strokeWidth="2" strokeLinejoin="round" />
        <path d="M27 274h10M26 282h12M25 290h9" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.100" strokeLinecap="round" />
        <path d="M38 296c-3 -2 -3 -5 -1 -5q1 0 1 1q0 -1 1 -1c2 0 2 3 -1 5Z" fill="#f4b8c4" />
      </g>
    ),
  },

  cat: {
    z: 8,
    art: () => <Cat x={150} y={305} s={1} fill="#e8a05a" flip />,
  },

  lights: {
    z: 10,
    art: () => (
      <g>
        <ellipse cx="124" cy="294" rx="60" ry="9" fill="#ffd98a" opacity="0.25" />
        {[[72, 104, 2.200], [182, 250, 2], [16, 120, 1.800]].map(([x, y, s], i) => (
          <Sparkle key={i} x={x} y={y} s={s} fill="#ffe9a8" />
        ))}
      </g>
    ),
  },
};
