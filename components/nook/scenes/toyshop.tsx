import { Bear, Bunting, Glow, INK, Sparkle, WARM, ink, thin, type Ctx, type Scene } from "../kit";

const RED = "#c8473c";
const GOLD = "#e9b949";
const NAVY = "#2f3f6e";
const WOOD = "#8a5a3c";
const CREAM = "#f7ecd8";

const STARS: [number, number, number][] = [
  [24, 150, 2], [112, 82, 2.4], [108, 186, 1.8], [20, 200, 1.6], [116, 130, 1.6], [44, 92, 1.8], [100, 64, 1.6], [16, 66, 2],
];

function Pendant({ c, x, drop }: { c: Ctx; x: number; drop: number }) {
  return (
    <g>
      <path d={`M${x} 56V${56 + drop}`} {...ink} />
      <Glow c={c} x={x} y={56 + drop + 10} r={22} o={0.75} />
      <path d={`M${x - 3} ${56 + drop}h6l5 8h-16Z`} fill={GOLD} {...ink} />
      <ellipse cx={x} cy={56 + drop + 9} rx="3.6" ry="2.2" fill={c.lit ? "#fff3c4" : "#e6d3b6"} {...ink} strokeWidth="0.8" />
    </g>
  );
}

// A toy shop window at closing time
export const toyshop: Scene = {
  walls: {
    z: 0,
    art: () => (
      <g>
        <rect x="12" y="26" width="176" height="266" fill={NAVY} />
        {STARS.map(([x, y, s], i) => (
          <Sparkle key={i} x={x} y={y} s={s} fill="#fde6a0" />
        ))}
        <path d="M12 232H188" stroke="#fff" strokeOpacity="0.15" strokeWidth="1" />
      </g>
    ),
  },

  floor: {
    z: 1,
    art: () => (
      <g>
        <rect x="12" y="290" width="176" height="18" fill={CREAM} {...ink} />
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={12 + (i % 11) * 16} y={i < 11 ? 290 : 299} width="16" height="9" fill={RED} opacity={(i + (i < 11 ? 0 : 1)) % 2 ? 0.85 : 0} />
        ))}
        <path d="M12 290H188" {...ink} />
      </g>
    ),
  },

  ferris: {
    z: 2,
    art: (c) => (
      <g>
        <path d="M70 134L48 238M70 134L92 238" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M70 134L48 238M70 134L92 238" stroke="#7d97b3" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="70" cy="134" r="34" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="70" cy="134" r="34" fill="none" stroke={GOLD} strokeWidth="2.4" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (Math.PI / 4) * i + 0.3;
          const x = Math.round((70 + Math.cos(a) * 34) * 10) / 10;
          const y = Math.round((134 + Math.sin(a) * 34) * 10) / 10;
          return (
            <g key={i}>
              <path d={`M70 134L${x} ${y}`} stroke={GOLD} strokeWidth="1" opacity="0.8" />
              <path d={`M${x - 4} ${y + 1}h8v5q0 2.500 -4 2.500q-4 0 -4 -2.500Z`} fill={[RED, "#7d97b3", CREAM, "#8fa58a"][i % 4]} {...ink} strokeWidth="0.8" />
              <circle cx={x} cy={y} r="1.4" fill={c.lit ? WARM : CREAM} stroke={INK} strokeWidth="0.4" />
            </g>
          );
        })}
        <circle cx="70" cy="134" r="5" fill={RED} {...ink} />
        <rect x="45" y="127" width="50" height="14" rx="3" fill={RED} {...ink} />
        <text x="70" y="137.500" textAnchor="middle" fontSize="7.500" fontWeight="700" letterSpacing="0.6" fill={CREAM} fontFamily="Georgia, serif">
          TOYLAND
        </text>
      </g>
    ),
  },

  shelves: {
    z: 2,
    art: () => (
      <g>
        <rect x="124" y="60" width="64" height="160" fill={WOOD} {...ink} />
        <rect x="127" y="63" width="58" height="154" fill="#5d3f2b" />
        {[98, 138, 178].map((y) => (
          <rect key={y} x="126" y={y} width="60" height="3.500" fill={WOOD} stroke={INK} strokeWidth="0.6" />
        ))}
        {/* Bottom shelf: balls and stacking rings */}
        <circle cx="139" cy="208" r="8.500" fill={GOLD} {...ink} />
        <path d="M131 206q8 -5 16.500 0M139 199.500v17" stroke={RED} strokeWidth="1.6" fill="none" />
        <circle cx="158" cy="210.500" r="6" fill="#7d97b3" {...ink} />
        <path d="M174 199v18" {...ink} />
        <ellipse cx="174" cy="214" rx="8" ry="2.800" fill={RED} {...ink} />
        <ellipse cx="174" cy="209" rx="6.500" ry="2.600" fill={GOLD} {...ink} />
        <ellipse cx="174" cy="204.500" rx="5" ry="2.400" fill="#8fa58a" {...ink} />
      </g>
    ),
  },

  counter: {
    z: 4,
    art: () => (
      <g>
        <rect x="14" y="240" width="92" height="50" fill={RED} {...ink} />
        {[20, 49, 78].map((x) => (
          <rect key={x} x={x} y="250" width="22" height="32" rx="2" fill="none" stroke={GOLD} strokeWidth="1.2" />
        ))}
        <rect x="12" y="236" width="96" height="6" rx="1.500" fill={GOLD} {...ink} />
      </g>
    ),
  },

  marquee: {
    z: 6,
    art: (c) => (
      <g>
        <path d="M30 58V44Q100 22 170 44V58Z" fill={RED} {...ink} />
        <path d="M36 54V47Q100 28 164 47V54Z" fill="none" stroke={GOLD} strokeWidth="1" />
        <text x="100" y="52" textAnchor="middle" fontSize="12" fontWeight="700" letterSpacing="3" fill={CREAM} fontFamily="Georgia, serif">
          TOYS
        </text>
        {Array.from({ length: 11 }, (_, i) => {
          const t = (i + 0.5) / 11;
          const x = Math.round((30 + 140 * t) * 10) / 10;
          const y = Math.round((44 - 44 * t * (1 - t) + 1.500) * 10) / 10;
          return (
            <g key={i}>
              <Glow c={c} x={x} y={y} r={5} o={0.9} />
              <circle cx={x} cy={y} r="1.700" fill={c.lit ? WARM : CREAM} stroke={INK} strokeWidth="0.4" />
            </g>
          );
        })}
      </g>
    ),
  },

  bigbear: {
    z: 5,
    art: () => (
      <g>
        <Bear x={76} y={237} s={1.5} />
        <path d="M76 209l-7 -3.500v7ZM76 209l7 -3.500v7Z" fill={RED} {...ink} strokeWidth="0.8" />
        <circle cx="76" cy="209" r="1.800" fill={RED} {...ink} strokeWidth="0.8" />
        <rect x="66" y="187" width="20" height="3" rx="1" fill="#2c2738" {...ink} />
        <rect x="69.500" y="172" width="13" height="15" fill="#2c2738" {...ink} />
        <rect x="69.500" y="182" width="13" height="3" fill={RED} />
      </g>
    ),
  },

  carousel: {
    z: 5,
    art: () => (
      <g>
        <path d="M34 232V200M22 212V231M46 212V231" {...ink} />
        <rect x="19" y="230" width="30" height="6" rx="1.500" fill={GOLD} {...ink} />
        <ellipse cx="34" cy="223" rx="5.500" ry="3" fill={CREAM} {...ink} strokeWidth="0.8" />
        <path d="M38 222l3 -5l2.500 1l-1.500 3" fill={CREAM} {...ink} strokeWidth="0.8" />
        <path d="M31 225v4M37 225v4" {...ink} strokeWidth="0.8" />
        <path d="M17 211L34 196L51 211Z" fill={RED} {...ink} />
        <path d="M17 211q4.250 4.500 8.500 0q4.250 4.500 8.500 0q4.250 4.500 8.500 0q4.250 4.500 8.500 0Z" fill={CREAM} {...ink} strokeWidth="0.8" />
        <path d="M34 196v-6l5 2l-5 2" fill={GOLD} {...ink} strokeWidth="0.8" />
      </g>
    ),
  },

  drum: {
    z: 5,
    art: () => (
      <g>
        <path d="M92 218l8 6M104 217l-7 7" {...ink} />
        <rect x="90" y="224" width="15" height="13" fill={RED} {...ink} />
        <path d="M90 226l3.750 9l3.750 -9l3.750 9l3.750 -9" fill="none" stroke={GOLD} strokeWidth="1" />
        <ellipse cx="97.500" cy="224" rx="7.500" ry="2.200" fill={CREAM} {...ink} />
      </g>
    ),
  },

  robot: {
    z: 3,
    art: () => (
      <g>
        {/* Tin robot */}
        <path d="M137 91v7M143 91v7M132 80v7M148 80v7M140 69v-4" {...ink} />
        <circle cx="140" cy="64" r="1.500" fill={RED} {...ink} strokeWidth="0.6" />
        <rect x="134" y="78" width="12" height="13" rx="1.500" fill="#9fb4c4" {...ink} />
        <rect x="135.500" y="69" width="9" height="8" rx="1.500" fill="#9fb4c4" {...ink} />
        <circle cx="138" cy="72.500" r="1.200" fill={GOLD} stroke={INK} strokeWidth="0.4" />
        <circle cx="142" cy="72.500" r="1.200" fill={GOLD} stroke={INK} strokeWidth="0.4" />
        <rect x="137" y="81" width="6" height="4" fill={RED} stroke={INK} strokeWidth="0.4" />
        {/* Rocket */}
        <path d="M162 92l-5 6v-9ZM174 92l5 6v-9Z" fill={RED} {...ink} strokeWidth="0.8" />
        <path d="M168 66Q175 78 174 94H162Q161 78 168 66Z" fill={CREAM} {...ink} />
        <path d="M164.500 74Q168 66 171.500 74Z" fill={RED} />
        <circle cx="168" cy="82" r="2.600" fill="#7d97b3" {...ink} strokeWidth="0.7" />
        <path d="M165 94l3 4l3 -4" fill={GOLD} {...ink} strokeWidth="0.7" />
      </g>
    ),
  },

  blocks: {
    z: 3,
    art: () => (
      <g>
        <rect x="130" y="126" width="12" height="12" fill={RED} {...ink} />
        <rect x="143" y="126" width="12" height="12" fill={GOLD} {...ink} />
        <rect x="136" y="114" width="12" height="12" fill="#7d97b3" {...ink} />
        <path d="M134 135l2 -6l2 6M134.800 133h2.400M147 129v6h3q2 -1.500 0 -3q2 -1.500 0 -3ZM144.500 117.500q-4 2.500 0 5" stroke={CREAM} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sailing boat */}
        <path d="M170 132V110" {...ink} />
        <path d="M171.500 112L182 129H171.500Z" fill={CREAM} {...ink} strokeWidth="0.8" />
        <path d="M168.500 116L162 129H168.500Z" fill="#e3a3a0" {...ink} strokeWidth="0.8" />
        <path d="M158 131h25l-4 7h-17Z" fill="#5f8a86" {...ink} />
      </g>
    ),
  },

  dollhouse: {
    z: 3,
    art: (c) => (
      <g>
        <rect x="131" y="159" width="26" height="19" fill="#f4b8c4" {...ink} />
        <path d="M128 160L144 146L160 160Z" fill={RED} {...ink} />
        <rect x="134.500" y="163" width="6" height="6" fill={c.lit ? WARM : "#8fa3ad"} {...ink} strokeWidth="0.7" />
        <rect x="147.500" y="163" width="6" height="6" fill={c.lit ? WARM : "#8fa3ad"} {...ink} strokeWidth="0.7" />
        <rect x="141.500" y="170" width="5" height="8" fill={WOOD} {...ink} strokeWidth="0.7" />
        {/* Jack-in-the-box */}
        <path d="M172 166l-3 -2.500l6 -2l-6 -2l6 -2l-3 -2" fill="none" {...ink} strokeWidth="0.9" />
        <rect x="165" y="166" width="14" height="12" fill={GOLD} {...ink} />
        <Sparkle x={172} y={172} s={3} fill={RED} />
        <circle cx="172" cy="152" r="4.600" fill={CREAM} {...ink} />
        <path d="M167.800 150L172 141L176.200 150Z" fill="#7d97b3" {...ink} strokeWidth="0.8" />
        <circle cx="170.500" cy="152" r="0.600" fill={INK} />
        <circle cx="173.500" cy="152" r="0.600" fill={INK} />
        <path d="M170.500 154q1.500 1.200 3 0" {...thin} strokeOpacity="0.9" />
      </g>
    ),
  },

  horse: {
    z: 6,
    art: () => (
      <g>
        <path d="M141 266L137 283M163 266L167 283" {...ink} strokeWidth="2" />
        <path d="M128 280Q152 292 176 280" fill="none" stroke={INK} strokeWidth="4.400" strokeLinecap="round" />
        <path d="M128 280Q152 292 176 280" fill="none" stroke="#c99a52" strokeWidth="2.800" strokeLinecap="round" />
        <path d="M139 260q-7 2 -6 11" fill="none" stroke={INK} strokeWidth="3.600" strokeLinecap="round" />
        <path d="M139 260q-7 2 -6 11" fill="none" stroke={GOLD} strokeWidth="2.200" strokeLinecap="round" />
        <ellipse cx="152" cy="261" rx="14" ry="7.500" fill={CREAM} {...ink} />
        <path d="M160 258L166 242L175 245L173 252L167 253L166 262Z" fill={CREAM} {...ink} />
        <path d="M165 242l-2 -4l4 2" fill={CREAM} {...ink} strokeWidth="0.8" />
        <path d="M163 244q-5 5 -4 13" fill="none" stroke={RED} strokeWidth="2.400" strokeLinecap="round" />
        <circle cx="169.500" cy="246.500" r="0.900" fill={INK} />
        <path d="M145 254.500h11v8h-11Z" fill={RED} {...ink} strokeWidth="0.8" />
        <path d="M147 262.500v5" stroke={GOLD} strokeWidth="1.400" />
      </g>
    ),
  },

  train: {
    z: 7,
    art: () => (
      <g>
        <path d="M124 300h28" {...ink} />
        <rect x="110" y="294" width="14" height="8" rx="1" fill="#9a6a8a" {...ink} />
        <rect x="128" y="294" width="16" height="8" rx="1" fill={GOLD} {...ink} />
        <rect x="150" y="292" width="18" height="10" rx="1.500" fill="#5f8a86" {...ink} />
        <rect x="164" y="285" width="11" height="17" rx="1.500" fill={RED} {...ink} />
        <rect x="166.500" y="288" width="6" height="5" fill={CREAM} stroke={INK} strokeWidth="0.5" />
        <rect x="153" y="286" width="4.500" height="6" fill="#2c2738" {...ink} strokeWidth="0.8" />
        {[114, 120, 132, 140, 155, 163, 171].map((x) => (
          <circle key={x} cx={x} cy="303.500" r="2.800" fill={x > 148 ? GOLD : RED} {...ink} strokeWidth="0.8" />
        ))}
      </g>
    ),
  },

  smallbear: {
    z: 6.5,
    art: () => (
      <g>
        <path d="M106 290V264h14V290M107 290v14M119 290v14" fill="none" {...ink} strokeWidth="1.400" />
        <path d="M106 270h14M106 277h14" {...thin} strokeOpacity="0.9" />
        <rect x="104" y="287" width="18" height="3.500" rx="1" fill="#c99a52" {...ink} />
        <Bear x={113} y={288} s={0.62} fill="#e0b98a" />
      </g>
    ),
  },

  balloons: {
    z: 3,
    art: () => (
      <g>
        <path d="M20 240C18 200 22 160 19 128M22 240C26 190 30 150 33 114M24 240C32 200 40 170 42 134" {...thin} strokeOpacity="0.8" />
        {[[19, 119, RED], [33, 105, GOLD], [42, 125, "#7d97b3"]].map(([x, y, fill], i) => (
          <g key={i}>
            <ellipse cx={x as number} cy={y as number} rx="7.500" ry="9" fill={fill as string} {...ink} />
            <path d={`M${(x as number) - 1.500} ${(y as number) + 9}h3l-1.500 2.500Z`} fill={fill as string} {...ink} strokeWidth="0.6" />
            <path d={`M${(x as number) - 3.500} ${(y as number) - 4}q1 -2.500 3 -3`} stroke="#fff" strokeOpacity="0.7" strokeWidth="1.200" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    ),
  },

  kite: {
    z: 3,
    art: () => (
      <g>
        <path d="M30 88q5 3 0 7q-5 4 1 8" fill="none" {...ink} strokeWidth="0.8" />
        <path d="M30 62L39 74L30 88L21 74Z" fill="#8fa58a" {...ink} />
        <path d="M30 62V88M21 74H39" {...thin} strokeOpacity="0.9" />
        <path d="M27 95l6 2l-6 2ZM33 100l-6 2l6 2Z" fill={RED} stroke={INK} strokeWidth="0.5" />
      </g>
    ),
  },

  bunting: {
    z: 3.5,
    art: () => <Bunting x1={12} y1={64} x2={124} y2={64} sag={6} count={9} />,
  },

  lamps: {
    z: 8,
    art: (c) => (
      <g>
        <Pendant c={c} x={52} drop={12} />
        <Pendant c={c} x={112} drop={20} />
      </g>
    ),
  },

  lights: {
    z: 10,
    art: () => (
      <g>
        <ellipse cx="100" cy="298" rx="70" ry="9" fill="#ffd98a" opacity="0.2" />
        {[[40, 176, 2.4], [104, 106, 2.2], [118, 232, 2], [14, 258, 1.800]].map(([x, y, s], i) => (
          <Sparkle key={i} x={x} y={y} s={s} fill="#ffe9a8" />
        ))}
      </g>
    ),
  },
};
