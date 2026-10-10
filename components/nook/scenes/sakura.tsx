import { Cat, Glow, INK, Lantern, Pot, Street, WARM, Win, ink, thin, type Scene } from "../kit";

const ROOF = "#5f7f86";
const BLOSSOM = "#f4b8c4";
const BLOSSOM_PALE = "#fbdbe1";

// Clusters of blossom along the branch: x, y, radius
const BLOSSOMS: [number, number, number][] = [
  [22, 40, 9], [36, 34, 8], [50, 42, 9], [64, 36, 7], [78, 46, 8], [92, 40, 9], [106, 46, 7], [120, 40, 8],
  [134, 46, 7], [148, 40, 6], [30, 50, 7], [58, 52, 6], [86, 54, 6], [112, 54, 5], [44, 60, 5], [72, 62, 5],
];
const PETALS: [number, number, number][] = [
  [84, 84, 20], [112, 78, -30], [96, 130, 40], [120, 150, -10], [78, 176, 25], [108, 196, -40], [90, 240, 15], [126, 228, -20], [100, 270, 30],
];

// A lantern-lit lane at dusk
export const sakura: Scene = {
  sky: {
    z: 0,
    art: (c) => (
      <g>
        <defs>
          <linearGradient id={`${c.id}-dusk`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#a995c4" />
            <stop offset="0.45" stopColor="#eaa9a8" />
            <stop offset="0.75" stopColor="#f8cfa6" />
          </linearGradient>
        </defs>
        <rect x="12" y="26" width="176" height="282" fill={`url(#${c.id}-dusk)`} />
        <circle cx="100" cy="132" r="30" fill="#fde6b8" opacity="0.95" />
        <ellipse cx="60" cy="96" rx="22" ry="5" fill="#fff" opacity="0.45" />
        <ellipse cx="142" cy="112" rx="18" ry="4" fill="#fff" opacity="0.4" />
        <path d="M12 196Q52 160 100 184Q150 158 188 190V308H12Z" fill="#c59ab0" {...ink} />
        <path d="M12 214Q60 190 100 204Q146 190 188 210V308H12Z" fill="#a585a4" {...ink} />
      </g>
    ),
  },

  street: {
    z: 1,
    art: () => (
      <g>
        <Street fill="#cbb9a6" />
        {/* Tram rails */}
        <path d="M90 308L97 205M110 308L103 205" stroke={INK} strokeOpacity="0.55" strokeWidth="1" fill="none" />
        {[220, 240, 264, 290].map((y) => (
          <path key={y} d={`M${96.3 - (y - 205) * 0.068} ${y}H${103.7 + (y - 205) * 0.068}`} {...thin} />
        ))}
      </g>
    ),
  },

  pagoda: {
    z: 2,
    art: (c) => (
      <g>
        <Glow c={c} x={100} y={160} r={26} o={0.5} />
        <path d="M100 118V108" {...ink} />
        <circle cx="100" cy="107" r="1.8" fill="#d9a441" {...ink} />
        {[0, 1, 2].map((i) => {
          const y = 178 - i * 20;
          const w = 38 - i * 9;
          return (
            <g key={i}>
              <rect x={100 - w / 2 + 5} y={y} width={w - 10} height="12" fill="#f3e2c9" {...ink} />
              <rect x={98} y={y + 3} width="4" height="6" rx="0.8" fill={c.lit ? WARM : "#8a6a5a"} stroke={INK} strokeWidth="0.6" />
              <path d={`M${100 - w / 2 - 4} ${y + 1}Q100 ${y - 4} ${100 + w / 2 + 4} ${y + 1}L${100 + w / 2 - 3} ${y - 8}H${100 - w / 2 + 3}Z`} fill="#b5564a" {...ink} />
            </g>
          );
        })}
      </g>
    ),
  },

  houses: {
    z: 3,
    art: (c) => (
      <g>
        <rect x="64" y="142" width="24" height="72" fill="#ead0b2" {...ink} />
        <path d="M60 144L76 128L92 144Z" fill="#7d8fa6" {...ink} />
        <Win c={c} x={69} y={152} w={10} h={11} />
        <Win c={c} x={69} y={172} w={10} h={11} />
        <rect x="68" y="192" width="12" height="22" fill="#7a5540" {...ink} />
        <rect x="112" y="152" width="24" height="62" fill="#dfbba8" {...ink} />
        <path d="M108 154H140L135 144H113Z" fill="#8a6a5a" {...ink} />
        <Win c={c} x={121} y={162} w={10} h={11} />
        <rect x="119" y="186" width="14" height="5" fill="#8fa58a" {...ink} />
        <rect x="121" y="191" width="10" height="23" fill="#f4ead8" {...ink} />
      </g>
    ),
  },

  tram: {
    z: 3.5,
    art: (c) => (
      <g>
        <path d="M100 176V168M94 168H106" {...ink} />
        <rect x="88" y="176" width="24" height="30" rx="4" fill="#e9b949" {...ink} />
        <rect x="88" y="176" width="24" height="9" rx="4" fill="#f7ecd8" {...ink} />
        <Win c={c} x={91} y={187} w={8} h={8} bars={false} />
        <Win c={c} x={101} y={187} w={8} h={8} bars={false} />
        <circle cx="100" cy="200.5" r="2" fill={c.lit ? "#fff3c4" : "#f7ecd8"} {...ink} />
        <Glow c={c} x={100} y={200} r={9} o={0.8} />
        <rect x="90" y="205" width="5" height="3" rx="1" fill={INK} />
        <rect x="105" y="205" width="5" height="3" rx="1" fill={INK} />
      </g>
    ),
  },

  teahouse: {
    z: 4,
    art: (c) => (
      <g>
        {/* Upstairs */}
        <rect x="12" y="72" width="56" height="100" fill="#f1dfc4" {...ink} />
        <path d="M12 86H68M26 72V172M54 72V172" stroke="#7a5540" strokeWidth="2" />
        <circle cx="40" cy="118" r="15" fill={c.lit ? WARM : "#6a7180"} {...ink} />
        <path d="M40 103V133M25 118H55M30 108L50 128" {...thin} strokeOpacity="0.75" />
        <Glow c={c} x={40} y={118} r={26} o={0.55} />
        <rect x="22" y="144" width="36" height="14" rx="1.5" fill="#7a5540" {...ink} />
        <path d="M28 148v6M31 148h4v6h-4M39 148v6M39 151h4M47 148l4 6M51 148l-4 6" stroke="#f7ecd8" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M12 56H78L69 74H12Z" fill={ROOF} {...ink} />
        <path d="M22 56L20 74M34 56L32 74M46 56L45 74M58 56L58 74M68 56L66 74" {...thin} />
        {/* Downstairs */}
        <rect x="12" y="186" width="56" height="122" fill="#e6cfae" {...ink} />
        <rect x="20" y="206" width="40" height="102" fill={c.lit ? "#f2b866" : "#4b3a33"} {...ink} />
        <path d="M40 240V308" {...thin} />
        {[20, 33.5, 47].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 206h13v${30 + (i % 2) * 3}h-13Z`} fill="#3f5f80" {...ink} />
            <circle cx={x + 6.5} cy="220" r="3" fill="none" stroke="#f7ecd8" strokeWidth="1" />
          </g>
        ))}
        <path d="M12 168H80L70 188H12Z" fill={ROOF} {...ink} />
        <path d="M24 168L22 188M38 168L36 188M52 168L51 188M66 168L64 188" {...thin} />
        <Lantern c={c} x={72} y={188} s={0.95} />
      </g>
    ),
  },

  noodles: {
    z: 4,
    art: (c) => (
      <g>
        {/* Upstairs */}
        <rect x="132" y="84" width="56" height="88" fill="#ecd6c0" {...ink} />
        <Win c={c} x={142} y={98} w={36} h={26} />
        <path d="M138 98v26h4v-26ZM178 98v26h4v-26Z" fill="#8fa58a" {...ink} />
        <rect x="140" y="124" width="40" height="4" fill="#7a5540" {...ink} />
        <path d="M122 68H188V86H132Z" fill="#8a4f45" {...ink} />
        <path d="M136 68L141 86M150 68L153 86M164 68L165 86M178 68L178 86" {...thin} />
        <rect x="138" y="140" width="44" height="18" rx="2" fill="#f7ecd8" {...ink} />
        <circle cx="148" cy="149" r="5" fill="#d9534a" {...ink} />
        <path d="M158 145h18M158 149h14M158 153h18" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
        {/* Shop front */}
        <rect x="132" y="190" width="56" height="118" fill="#d9bfa0" {...ink} />
        <Win c={c} x={138} y={200} w={44} h={38} bars={false} />
        <path d="M146 222a6 4 0 0 0 12 0ZM164 222a6 4 0 0 0 12 0Z" fill="#f7ecd8" {...ink} />
        <path d="M149 218q-2 -4 0 -7M169 218q-2 -4 0 -7" stroke="#fff" strokeOpacity="0.8" strokeWidth="1" fill="none" strokeLinecap="round" />
        <Glow c={c} x={160} y={218} r={30} o={0.5} />
        <rect x="134" y="238" width="52" height="6" fill="#7a5540" {...ink} />
        <path d="M144 244V308M160 244V308M174 244V308" {...thin} />
        {[146, 168].map((x) => (
          <g key={x}>
            <path d={`M${x - 4} 284V306M${x + 4} 284V306`} {...ink} />
            <rect x={x - 6} y="279" width="12" height="5" rx="2" fill="#c8674f" {...ink} />
          </g>
        ))}
        {/* Striped awning */}
        <path d="M122 170H188V190H130Z" fill="#f7ecd8" {...ink} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${127 + i * 13} 170h6.5l1.5 20h-6.5Z`} fill="#d9534a" />
        ))}
        <path d="M122 170H188V190H130Z" fill="none" {...ink} />
        <Lantern c={c} x={127} y={190} s={1.1} fill="#f7ecd8" />
      </g>
    ),
  },

  cherry: {
    z: 6,
    art: () => (
      <g>
        <path d="M12 34C40 30 68 48 100 42C122 38 138 48 156 40" fill="none" stroke={INK} strokeWidth="4.6" strokeLinecap="round" />
        <path d="M12 34C40 30 68 48 100 42C122 38 138 48 156 40" fill="none" stroke="#7a5540" strokeWidth="3" strokeLinecap="round" />
        <path d="M40 38C46 48 44 56 46 62M84 46C88 52 86 58 88 62" fill="none" stroke="#7a5540" strokeWidth="2" strokeLinecap="round" />
        {BLOSSOMS.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={i % 3 === 0 ? BLOSSOM_PALE : BLOSSOM} {...ink} strokeWidth="0.8" />
            <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.28} fill="#fff" opacity="0.55" />
            <circle cx={x + r * 0.3} cy={y + r * 0.25} r="1" fill="#d9788c" />
          </g>
        ))}
      </g>
    ),
  },

  lanterns: {
    z: 7,
    art: (c) => (
      <g>
        <path d="M68 94Q100 118 132 98" fill="none" stroke={INK} strokeWidth="0.9" />
        <Lantern c={c} x={78} y={101} s={0.8} />
        <Lantern c={c} x={92} y={107} s={0.8} fill="#f7ecd8" />
        <Lantern c={c} x={108} y={107} s={0.8} />
        <Lantern c={c} x={122} y={102} s={0.8} fill="#f7ecd8" />
      </g>
    ),
  },

  bicycle: {
    z: 8,
    art: () => (
      <g>
        {/* Bicycle leaning by the noodle shop */}
        <circle cx="98" cy="290" r="11" fill="none" stroke={INK} strokeWidth="1.6" />
        <circle cx="126" cy="290" r="11" fill="none" stroke={INK} strokeWidth="1.6" />
        <path d="M98 290L108 272H122L126 290M108 272L114 290H98M122 272L119 265M104 266H112" fill="none" stroke="#5f8a86" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M116 264h8" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        <rect x="121" y="266" width="11" height="8" rx="1.5" fill="#d8b98a" {...ink} />
        <circle cx="124" cy="264.5" r="2.4" fill="#f4b8c4" {...ink} strokeWidth="0.7" />
        <circle cx="129" cy="264" r="2.4" fill="#f7e08a" {...ink} strokeWidth="0.7" />
        {/* Pots by the tea house door */}
        <circle cx="70" cy="286" r="7" fill="#7f9e5f" {...ink} />
        <circle cx="67" cy="283" r="1.4" fill="#f4b8c4" />
        <circle cx="73" cy="285" r="1.4" fill="#f4b8c4" />
        <Pot x={70} y={306} w={13} h={11} />
        <path d="M80 300C78 292 82 290 81 284M81 300C84 294 86 294 87 288" fill="none" stroke="#56743f" strokeWidth="1.4" strokeLinecap="round" />
        <Pot x={81} y={307} w={9} h={7} fill="#7d97b3" />
      </g>
    ),
  },

  cat: {
    z: 9,
    art: () => <Cat x={44} y={170} s={0.95} fill="#f1ece4" />,
  },

  birds: {
    z: 0.5,
    art: () => <path d="M140 54q4 -4 7 0q3 -4 7 0M160 66q3 -3 5 0q2 -3 5 0M128 70q2 -2 4 0q2 -2 4 0" {...ink} fill="none" />,
  },

  wires: {
    z: 5,
    art: () => (
      <g>
        <path d="M68 62Q100 78 132 72M68 68Q100 86 132 78" fill="none" stroke={INK} strokeWidth="0.7" />
        {[[90, 69.5], [97, 70.5], [114, 72]].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y - 2} rx="2.4" ry="2" fill={INK} />
            <circle cx={x + (i === 2 ? -1.6 : 1.6)} cy={y - 4.4} r="1.3" fill={INK} />
          </g>
        ))}
      </g>
    ),
  },

  tank: {
    z: 4.5,
    art: () => (
      <g>
        <path d="M146 68V44M140 48h12M142 53h8" {...ink} fill="none" />
        <path d="M163 64v5M175 64v5" {...ink} />
        <rect x="160" y="50" width="18" height="14" rx="2.5" fill="#8a9aa6" {...ink} />
        <path d="M160 55h18M160 60h18" {...thin} />
        <path d="M161 50q8 -5 16 0" fill="#a9b6c0" {...ink} />
      </g>
    ),
  },

  flowerbox: {
    z: 5,
    art: () => (
      <g>
        {[144, 150, 156, 162, 168, 174].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 124v-3`} stroke="#56743f" strokeWidth="1.2" />
            <circle cx={x} cy={119.5} r="2.6" fill={i % 2 ? "#f7e08a" : BLOSSOM} {...ink} strokeWidth="0.6" />
          </g>
        ))}
        <path d="M141 124q3 6 0 10M179 124q-3 6 0 10" fill="none" stroke="#56743f" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    ),
  },

  chime: {
    z: 5,
    art: () => (
      <g>
        <path d="M76 74v6M76 86v5" {...ink} />
        <path d="M72.500 86a3.500 5 0 0 1 7 0Z" fill="#9fc5d8" {...ink} strokeWidth="0.8" />
        <rect x="74.800" y="91" width="2.400" height="8" fill="#f7ecd8" stroke={INK} strokeWidth="0.5" />
      </g>
    ),
  },

  banner: {
    z: 5,
    art: () => (
      <g>
        <path d="M60 206h9" {...ink} />
        <rect x="61" y="207" width="7" height="32" fill="#f7ecd8" {...ink} strokeWidth="0.8" />
        <path d="M64.500 212v5M62.500 221h4M64.500 225v7M62.500 229h4" stroke="#d9534a" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    ),
  },

  parasol: {
    z: 5,
    art: () => (
      <g transform="rotate(-14 80 266)">
        <path d="M80 238V268" {...ink} />
        <path d="M66 250Q80 228 94 250Q87 246 80 250Q73 246 66 250Z" fill="#d9534a" {...ink} />
        <path d="M80 238Q76 244 73 248M80 238Q84 244 87 248M80 238V250" {...thin} />
        <circle cx="80" cy="237" r="1.2" fill={INK} />
      </g>
    ),
  },

  stonelantern: {
    z: 5,
    art: (c) => (
      <g>
        <Glow c={c} x={122} y={238} r={14} o={0.8} />
        <rect x="117.500" y="255" width="9" height="4" fill="#b9b3a8" {...ink} />
        <rect x="120.500" y="243" width="3" height="12" fill="#b9b3a8" {...ink} />
        <rect x="118" y="234" width="8" height="9" fill={c.lit ? WARM : "#8f8a80"} {...ink} />
        <path d="M122 234v9M118 238.500h8" {...thin} />
        <path d="M114.500 234L122 226L129.500 234Z" fill="#b9b3a8" {...ink} />
      </g>
    ),
  },

  lights: {
    z: 10,
    art: () => (
      <g>
        {PETALS.map(([x, y, rot], i) => (
          <ellipse key={i} cx={x} cy={y} rx="2.6" ry="1.5" fill={BLOSSOM_PALE} stroke="#d9788c" strokeWidth="0.4" transform={`rotate(${rot} ${x} ${y})`} />
        ))}
      </g>
    ),
  },
};
