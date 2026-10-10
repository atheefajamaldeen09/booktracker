import { Bear, Glow, INK, Leaf, SleepingCat, Spines, ink, thin, type Ctx, type Scene } from "../kit";

const WOOD = "#8a5a3c";
const WOOD_DARK = "#5d3f2b";
const GREEN = "#5f8f6c";
const GOLD = "#d9a441";
const CREAM = "#f7ecd8";

function BellLamp({ c, x }: { c: Ctx; x: number }) {
  return (
    <g>
      <path d={`M${x} 68V82`} {...ink} />
      <Glow c={c} x={x} y={96} r={24} o={0.75} />
      <path d={`M${x - 8} 96q0 -14 8 -14q8 0 8 14q-4 2 -8 0q-4 2 -8 0Z`} fill={c.lit ? "#fff3c4" : CREAM} {...ink} />
      <path d={`M${x - 3} 84q-2 5 -2 11M${x + 3} 84q2 5 2 11`} {...thin} />
    </g>
  );
}

// A snug wood-panelled study
export const study: Scene = {
  walls: {
    z: 0,
    art: () => (
      <g>
        <rect x="12" y="26" width="176" height="258" fill="#7a5540" />
        <rect x="12" y="26" width="176" height="150" fill="#3f5f55" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${19 + i * 15} 26V176`} stroke="#fff" strokeOpacity="0.07" strokeWidth="5" />
        ))}
        <rect x="12" y="174" width="176" height="5" fill={WOOD_DARK} {...ink} />
        {[18, 62].map((x) => (
          <rect key={x} x={x} y="188" width="38" height="86" rx="2" fill="none" stroke={WOOD_DARK} strokeWidth="1.4" />
        ))}
      </g>
    ),
  },

  floor: {
    z: 1,
    art: () => (
      <g>
        <rect x="12" y="282" width="176" height="26" fill="#a8714b" {...ink} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${12 + i * 16} 282l8 13l-8 13M${20 + i * 16} 295l8 -13`} {...thin} strokeOpacity="0.4" />
        ))}
      </g>
    ),
  },

  rug: {
    z: 1.5,
    art: () => (
      <g>
        <ellipse cx="92" cy="298" rx="62" ry="8" fill="#a8463c" {...ink} />
        <ellipse cx="92" cy="298" rx="52" ry="6" fill="none" stroke={GOLD} strokeWidth="1.2" strokeDasharray="4 3" />
        <ellipse cx="92" cy="298" rx="30" ry="3.4" fill="#3f5f55" stroke={INK} strokeWidth="0.6" />
      </g>
    ),
  },

  bookcase: {
    z: 2,
    art: () => (
      <g>
        <rect x="108" y="60" width="80" height="170" fill={WOOD} {...ink} />
        <rect x="111" y="63" width="74" height="165" fill={WOOD_DARK} />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <Spines x={112} y={68 + r * 40} w={72} h={30} seed={r * 2 + 7} />
            <rect x="110" y={98 + r * 40} width="76" height="3" fill={WOOD} stroke={INK} strokeWidth="0.6" />
          </g>
        ))}
      </g>
    ),
  },

  mirror: {
    z: 2,
    art: () => (
      <g>
        <ellipse cx="38" cy="150" rx="15" ry="20" fill={GOLD} {...ink} />
        <ellipse cx="38" cy="150" rx="11" ry="16" fill="#cfe0e0" {...ink} />
        <path d="M32 142q3 -7 8 -8M31 150q1 -3 2 -4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M33 131q5 -7 10 0" fill={GOLD} {...ink} />
      </g>
    ),
  },

  pictures: {
    z: 2,
    art: () => (
      <g>
        <rect x="62" y="100" width="27" height="31" fill={GOLD} {...ink} />
        <rect x="65.500" y="103.500" width="20" height="24" fill={CREAM} stroke={INK} strokeWidth="0.5" />
        <path d="M75.500 125V112M75.500 118q-5 -1 -5 -6M75.500 115q5 -1 5 -6" fill="none" stroke="#56743f" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="75.500" cy="110" r="2.600" fill="#e3a3a0" stroke={INK} strokeWidth="0.5" />
        <rect x="22" y="94" width="22" height="20" fill={WOOD} {...ink} />
        <rect x="25" y="97" width="16" height="14" fill="#b9c7a8" stroke={INK} strokeWidth="0.5" />
        <path d="M25 108q4 -6 8 -2q3 -4 8 0v3h-16Z" fill="#6f9a7e" />
      </g>
    ),
  },

  bust: {
    z: 3,
    art: () => (
      <g>
        <path d="M72 172l4 6M92 172l-4 6" {...ink} />
        <rect x="68" y="169" width="28" height="3.500" fill={WOOD} {...ink} />
        <path d="M73 169q0 -9 9 -9q9 0 9 9Z" fill="#efe9dc" {...ink} />
        <rect x="80" y="156" width="4" height="5" fill="#efe9dc" />
        <circle cx="82" cy="152" r="6" fill="#efe9dc" {...ink} />
        <path d="M76.500 150q5.500 -8 11 0" {...thin} strokeOpacity="0.8" />
      </g>
    ),
  },

  desk: {
    z: 4,
    art: () => (
      <g>
        <rect x="102" y="234" width="84" height="50" fill={WOOD} {...ink} />
        <rect x="108" y="240" width="34" height="16" rx="1.500" fill="none" stroke={INK} strokeWidth="0.9" />
        <rect x="146" y="240" width="34" height="16" rx="1.500" fill="none" stroke={INK} strokeWidth="0.9" />
        <rect x="108" y="260" width="72" height="18" rx="1.500" fill="none" stroke={INK} strokeWidth="0.9" />
        <circle cx="125" cy="248" r="1.600" fill={GOLD} />
        <circle cx="163" cy="248" r="1.600" fill={GOLD} />
        <circle cx="144" cy="269" r="1.600" fill={GOLD} />
        <rect x="98" y="228" width="90" height="6.500" rx="1.500" fill="#a8714b" {...ink} />
      </g>
    ),
  },

  lamp: {
    z: 5,
    art: (c) => (
      <g>
        <path d="M134 228V206M127 228h14" stroke={INK} strokeWidth="2.600" strokeLinecap="round" />
        <path d="M134 226V206" stroke={GOLD} strokeWidth="1.200" strokeLinecap="round" />
        <Glow c={c} x={134} y={206} r={34} o={0.7} />
        <path d="M116 206L124 186H144L152 206Z" fill={GOLD} {...ink} />
        <path d="M122 206L128 186H134V206Z" fill="#c8674f" />
        <path d="M140 206L138 186H144L152 206Z" fill="#8fa58a" />
        <path d="M116 206L124 186H144L152 206Z" fill="none" {...ink} />
        <path d="M122 206L128 186M134 206V186M140 206L138 186M146 206L141 186" {...thin} strokeOpacity="0.8" />
        {c.lit && <path d="M116 206L124 186H144L152 206Z" fill="#fff3c4" opacity="0.35" />}
      </g>
    ),
  },

  typewriter: {
    z: 5,
    art: () => (
      <g>
        <rect x="162" y="200" width="13" height="16" fill="#fffaf0" {...ink} strokeWidth="0.8" />
        <path d="M164.500 204h8M164.500 207h8M164.500 210h5" {...thin} />
        <rect x="156" y="213" width="26" height="4.500" rx="2" fill="#4a4852" {...ink} />
        <path d="M155 228l2 -11h23l2 11Z" fill="#2c2a33" {...ink} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={160 + i * 3.600} cy={223 + (i % 2) * 2} r="1.100" fill={CREAM} />
        ))}
      </g>
    ),
  },

  flowers: {
    z: 6,
    art: () => (
      <g>
        <path d="M107 216V206M105 216q-3 -6 -3 -8M109 216q3 -5 4 -8" fill="none" stroke="#56743f" strokeWidth="1.200" strokeLinecap="round" />
        <circle cx="102" cy="206" r="3.200" fill="#e58f8a" {...ink} strokeWidth="0.7" />
        <circle cx="107" cy="203" r="3.400" fill="#f4b8c4" {...ink} strokeWidth="0.7" />
        <circle cx="112.500" cy="207" r="3" fill="#fffaf0" {...ink} strokeWidth="0.7" />
        <path d="M104 228q-4 -7 0 -12h6q4 5 0 12Z" fill={CREAM} {...ink} />
        <path d="M103.500 222h7" stroke="#7d97b3" strokeWidth="1.400" />
      </g>
    ),
  },

  plant: {
    z: 4,
    art: () => (
      <g>
        {[[-34, 46], [-12, 54], [10, 50], [30, 40], [-52, 34]].map(([rot, len], i) => (
          <g key={i}>
            <Leaf x={22} y={238} len={len} w={8} rot={rot} fill={i % 2 ? "#6f9a5f" : "#4f7a48"} />
          </g>
        ))}
      </g>
    ),
  },

  armchair: {
    z: 5,
    art: () => (
      <g>
        <path d="M24 288v8M68 288v8" stroke={INK} strokeWidth="2.800" strokeLinecap="round" />
        <path d="M24 286V228q0 -16 22 -16q22 0 22 16V286Z" fill="#5f8a86" {...ink} />
        <path d="M24 232q-7 2 -6 14l6 6ZM68 232q7 2 6 14l-6 6Z" fill="#4f7a76" {...ink} />
        <circle cx="38" cy="232" r="1.200" fill={GOLD} />
        <circle cx="54" cy="232" r="1.200" fill={GOLD} />
        <circle cx="46" cy="244" r="1.200" fill={GOLD} />
        <rect x="24" y="266" width="44" height="12" rx="5" fill="#74a09b" {...ink} />
        <path d="M18 258a6 6 0 0 1 12 0V290H18ZM62 258a6 6 0 0 1 12 0V290H62Z" fill="#5f8a86" {...ink} />
        <rect x="18" y="280" width="56" height="10" rx="2" fill="#4f7a76" {...ink} />
      </g>
    ),
  },

  bear: {
    z: 6,
    art: () => (
      <g>
        <Bear x={46} y={270} s={0.95} />
        <path d="M37 258q4.500 -3 9 0q4.500 -3 9 0v7q-4.500 -3 -9 0q-4.500 -3 -9 0Z" fill="#c8674f" {...ink} strokeWidth="0.8" />
        <path d="M46 258v7" {...thin} strokeOpacity="0.9" />
      </g>
    ),
  },

  teatable: {
    z: 6,
    art: () => (
      <g>
        <path d="M88 262V292M82 293h12" stroke={INK} strokeWidth="2.200" strokeLinecap="round" />
        <ellipse cx="88" cy="260" rx="12" ry="3.200" fill={WOOD} {...ink} />
        <path d="M82 257c-1.500 -7 11 -7 9.500 0Z" fill={CREAM} {...ink} strokeWidth="0.9" />
        <path d="M91.500 254q4 -1 4 -4M82 254q-3 0 -2.500 3" fill="none" {...ink} strokeWidth="0.9" />
        <path d="M94 253h5v2.500q0 2 -2.500 2q-2.500 0 -2.500 -2Z" fill="#fffaf0" {...ink} strokeWidth="0.7" />
        <path d="M86 249q-1.500 -2.500 0 -5" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
    ),
  },

  papers: {
    z: 6,
    art: () => (
      <g>
        <rect x="104" y="299" width="24" height="5.500" rx="0.800" fill="#7d97b3" {...ink} />
        <rect x="106" y="293.500" width="21" height="5.500" rx="0.800" fill="#c8674f" {...ink} />
        <rect x="105" y="288.500" width="19" height="5" rx="0.800" fill="#efe3cf" {...ink} />
        <path d="M130 302l12 -4l3 6l-12 3Z" fill="#fffaf0" {...ink} strokeWidth="0.8" />
        <path d="M134 302l6 -2M135 304.500l6 -2" {...thin} />
      </g>
    ),
  },

  cat: {
    z: 8,
    art: () => <SleepingCat x={166} y={304} s={1.050} fill="#e8a05a" />,
  },

  valance: {
    z: 7,
    art: () => (
      <g>
        <path d="M12 26H188V70Q166 42 144 70Q122 42 100 70Q78 42 56 70Q34 42 12 70Z" fill={GREEN} {...ink} />
        <path d="M12 64Q34 36 56 64Q78 36 100 64Q122 36 144 64Q166 36 188 64" fill="none" stroke={GOLD} strokeWidth="1" />
        <rect x="12" y="26" width="176" height="8" fill="#4f7a5c" {...ink} />
        {[34, 78, 122, 166].map((x) => (
          <circle key={x} cx={x} cy="45" r="2.400" fill={GOLD} stroke={INK} strokeWidth="0.6" />
        ))}
      </g>
    ),
  },

  belllamps: {
    z: 7.5,
    art: (c) => (
      <g>
        <BellLamp c={c} x={56} />
        <BellLamp c={c} x={144} />
      </g>
    ),
  },

  lights: {
    z: 10,
    art: () => (
      <g>
        <ellipse cx="134" cy="232" rx="44" ry="7" fill="#ffd98a" opacity="0.3" />
        <ellipse cx="80" cy="296" rx="64" ry="9" fill="#ffd98a" opacity="0.16" />
      </g>
    ),
  },
};
