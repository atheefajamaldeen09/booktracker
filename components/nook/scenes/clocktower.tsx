import { Bunting, Cat, Glow, INK, Pot, Sparkle, Spines, Street, WARM, Win, ink, thin, type Scene } from "../kit";

const SAGE = "#8fa58a";
const CREAM = "#f7ecd8";
const WOOD = "#7a5540";
const PINE = "#6f9a5f";

// A sunny lane under an old clock tower
export const clocktower: Scene = {
  sky: {
    z: 0,
    art: (c) => (
      <g>
        <defs>
          <linearGradient id={`${c.id}-noon`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#bfe0e8" />
            <stop offset="0.7" stopColor="#fdf0cf" />
          </linearGradient>
        </defs>
        <rect x="12" y="26" width="176" height="282" fill={`url(#${c.id}-noon)`} />
        <path d="M70 46a7 5 0 0 1 12 -3a8 6 0 0 1 14 3ZM146 54a6 4 0 0 1 10 -3a7 5 0 0 1 12 3Z" fill="#fff" opacity="0.9" />
      </g>
    ),
  },

  lane: {
    z: 1,
    art: () => <Street fill="#d8c7a8" far={210} />,
  },

  tower: {
    z: 2,
    art: (c) => (
      <g>
        <rect x="80" y="58" width="60" height="154" fill="#e9d9b8" {...ink} />
        <path d="M80 126H140M80 132H140" {...thin} strokeOpacity="0.7" />
        <path d="M72 60L110 30L148 60Z" fill={SAGE} {...ink} />
        <path d="M92 212V178a18 18 0 0 1 36 0V212Z" fill="#b9a58e" {...ink} />
        <path d="M98 212V180a12 12 0 0 1 24 0V212Z" fill="#fdf0cf" opacity="0.8" />
        <rect x="104" y="140" width="12" height="16" rx="6" fill={c.lit ? WARM : "#8fa3ad"} {...ink} />
        {/* The clock */}
        <circle cx="110" cy="92" r="25" fill="#b08d61" {...ink} />
        <circle cx="110" cy="92" r="21" fill="#fffaf0" {...ink} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (Math.PI / 6) * i;
          const r1 = i % 3 === 0 ? 15 : 17.500;
          return (
            <path
              key={i}
              d={`M${Math.round((110 + Math.sin(a) * r1) * 10) / 10} ${Math.round((92 - Math.cos(a) * r1) * 10) / 10}L${Math.round((110 + Math.sin(a) * 19.500) * 10) / 10} ${Math.round((92 - Math.cos(a) * 19.500) * 10) / 10}`}
              stroke={INK}
              strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
              strokeLinecap="round"
            />
          );
        })}
        <path d="M110 92V77M110 92L121 87" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx="110" cy="92" r="2" fill="#c8674f" />
      </g>
    ),
  },

  houses: {
    z: 3,
    art: (c) => (
      <g>
        <rect x="62" y="150" width="20" height="62" fill="#f1dfc4" {...ink} />
        <path d="M58 152L72 136L86 152Z" fill="#c8674f" {...ink} />
        <Win c={c} x={67} y={160} w={9} h={10} />
        <rect x="67" y="186" width="9" height="26" fill={WOOD} {...ink} />
        <rect x="76" y="126" width="4" height="14" fill="#b9a58e" {...ink} />
      </g>
    ),
  },

  cafe: {
    z: 4,
    art: (c) => (
      <g>
        <rect x="12" y="58" width="52" height="250" fill="#f6ead0" {...ink} />
        <rect x="12" y="52" width="56" height="7" fill="#b9a58e" {...ink} />
        <Win c={c} x={22} y={84} w={28} h={34} />
        <path d="M17 84v34h5v-34ZM50 84v34h5v-34Z" fill={SAGE} {...ink} />
        <Win c={c} x={18} y={196} w={36} h={28} />
        <Glow c={c} x={36} y={210} r={28} o={0.5} />
        <rect x="20" y="232" width="28" height="52" fill={WOOD} {...ink} />
        <rect x="24" y="237" width="20" height="22" rx="1.500" fill={c.lit ? WARM : "#8fa3ad"} {...ink} strokeWidth="0.8" />
        <circle cx="44.500" cy="264" r="1.400" fill="#e9b949" />
        <path d="M12 170H72L65 190H12Z" fill={SAGE} {...ink} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${18 + i * 15} 170h7l-1.500 20h-7Z`} fill={CREAM} opacity="0.9" />
        ))}
        <path d="M12 170H72L65 190H12Z" fill="none" {...ink} />
      </g>
    ),
  },

  bookshop: {
    z: 4,
    art: (c) => (
      <g>
        <rect x="134" y="68" width="54" height="240" fill="#c9925a" {...ink} />
        <rect x="130" y="62" width="58" height="7" fill={WOOD} {...ink} />
        <rect x="150" y="78" width="28" height="40" fill={c.lit ? WARM : "#8fa3ad"} {...ink} />
        <path d="M164 78v40M150 96h28" {...thin} strokeOpacity="0.8" />
        <rect x="134" y="172" width="54" height="15" fill={WOOD} {...ink} />
        <text x="161" y="183" textAnchor="middle" fontSize="8" fontWeight="700" letterSpacing="1.200" fill="#e9b949" fontFamily="Georgia, serif">
          BOOKS
        </text>
        <rect x="138" y="192" width="46" height="52" fill={c.lit ? "#ffe2a0" : "#8fa3ad"} {...ink} />
        <Spines x={140} y={200} w={42} h={16} seed={2} />
        <Spines x={140} y={224} w={42} h={17} seed={6} />
        <path d="M138 218H184M161 192V244" stroke={WOOD} strokeWidth="1.800" />
        <Glow c={c} x={161} y={218} r={32} o={0.5} />
        <rect x="136" y="244" width="50" height="5" fill={WOOD} {...ink} />
        <rect x="140" y="254" width="42" height="54" rx="1.500" fill="#b07a45" {...ink} />
        <path d="M146 260h30v40h-30Z" {...thin} strokeOpacity="0.7" />
      </g>
    ),
  },

  pine: {
    z: 5,
    art: () => (
      <g>
        <path d="M52 172C68 152 62 122 82 104" fill="none" stroke={INK} strokeWidth="6.400" strokeLinecap="round" />
        <path d="M52 172C68 152 62 122 82 104" fill="none" stroke="#8a5a3c" strokeWidth="4.600" strokeLinecap="round" />
        <path d="M64 136Q56 126 50 124M72 114Q70 96 64 86M80 106Q92 96 96 80" fill="none" stroke="#8a5a3c" strokeWidth="2.400" strokeLinecap="round" />
        {[[48, 120, 20, 9], [84, 98, 21, 10], [62, 82, 17, 8], [98, 74, 14, 7]].map(([x, y, rx, ry], i) => (
          <g key={i}>
            <path
              d={`M${x - rx} ${y + ry * 0.4}q${-rx * 0.1} ${-ry} ${rx * 0.5} ${-ry * 1.1}q${rx * 0.5} ${-ry * 0.7} ${rx} 0q${rx * 0.6} ${ry * 0.1} ${rx * 0.5} ${ry * 1.1}q${-rx} ${ry * 0.9} ${-rx * 2} 0Z`}
              fill={i % 2 ? "#7fae6c" : PINE}
              {...ink}
            />
            <path d={`M${x - rx * 0.5} ${y - ry * 0.2}q${rx * 0.2} ${-ry * 0.4} ${rx * 0.5} ${-ry * 0.3}`} stroke="#fff" strokeOpacity="0.4" strokeWidth="1.400" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    ),
  },

  balcony: {
    z: 5,
    art: () => (
      <g>
        {[152, 163, 175].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={96} r="5" fill="#6a8f52" />
            <circle cx={x - 2} cy={93} r="2.200" fill="#d9443a" stroke={INK} strokeWidth="0.5" />
            <circle cx={x + 2.500} cy={95} r="2" fill={i % 2 ? "#f7e08a" : "#d9443a"} stroke={INK} strokeWidth="0.5" />
          </g>
        ))}
        <rect x="144" y="116" width="44" height="4" fill="#3a3a3a" />
        <path d="M144 100H188" stroke="#3a3a3a" strokeWidth="1.800" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${146 + i * 5.200} 100V116`} stroke="#3a3a3a" strokeWidth="1.100" />
        ))}
        <path d="M144 108q5 -5 10 0q5 5 10 0q5 -5 10 0q5 5 10 0" fill="none" stroke="#3a3a3a" strokeWidth="0.800" />
      </g>
    ),
  },

  windowbox: {
    z: 5,
    art: () => (
      <g>
        {[24, 30, 36, 42, 48].map((x, i) => (
          <circle key={x} cx={x} cy={115} r="2.800" fill={i % 2 ? "#fffaf0" : "#f4b8c4"} stroke={INK} strokeWidth="0.5" />
        ))}
        <rect x="19" y="117" width="34" height="6.500" rx="1" fill={WOOD} {...ink} />
        <path d="M22 123.500q-2 6 1 9M50 123.500q2 5 -1 8" fill="none" stroke="#56743f" strokeWidth="1.200" strokeLinecap="round" />
      </g>
    ),
  },

  cafesign: {
    z: 6,
    art: () => (
      <g>
        <path d="M64 144H86M64 153L76 144M80 144V150" fill="none" {...ink} />
        <circle cx="80" cy="159" r="9.500" fill={WOOD} {...ink} />
        <path d="M75.500 157h8v3q0 3.500 -4 3.500q-4 0 -4 -3.500Z" fill={CREAM} />
        <path d="M83.500 158q3 0 2.500 2.500q-0.500 1.500 -2.500 1" fill="none" stroke={CREAM} strokeWidth="1" />
        <path d="M78 155q-1.500 -2 0 -3.500M81.500 155q-1.500 -2 0 -3.500" stroke={CREAM} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </g>
    ),
  },

  booksign: {
    z: 6,
    art: () => (
      <g>
        <path d="M134 148H112M134 157L122 148M116 148V153M128 148V153" fill="none" {...ink} />
        <rect x="109" y="153" width="24" height="17" rx="2" fill={CREAM} {...ink} />
        <path d="M113 166q4 -3 8 0q4 -3 8 0v-7q-4 -3 -8 0q-4 -3 -8 0Z" fill="#c8674f" {...ink} strokeWidth="0.8" />
        <path d="M121 159v7" {...thin} strokeOpacity="0.9" />
      </g>
    ),
  },

  lamp: {
    z: 5.5,
    art: (c) => (
      <g>
        <path d="M94 266V204" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M94 266V204" stroke="#3f4a45" strokeWidth="1.600" strokeLinecap="round" />
        <path d="M89 267h10" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <Glow c={c} x={94} y={196} r={20} o={0.85} />
        <path d="M89.500 190h9l1.500 12h-12Z" fill={c.lit ? WARM : "#e6d6bd"} {...ink} />
        <path d="M88 190h12L94 184Z" fill="#3f4a45" {...ink} />
      </g>
    ),
  },

  steps: {
    z: 5,
    art: () => (
      <g fill="#d8cbb0">
        <rect x="12" y="282" width="40" height="9" {...ink} />
        <rect x="12" y="290" width="48" height="10" {...ink} />
        <rect x="12" y="299" width="56" height="9" {...ink} />
      </g>
    ),
  },

  postbox: {
    z: 7,
    art: () => (
      <g>
        <rect x="141" y="299" width="19" height="6" rx="1" fill="#a8332b" {...ink} />
        <rect x="143" y="264" width="15" height="36" fill="#d9443a" {...ink} />
        <path d="M141 265q9.500 -11 19 0Z" fill="#d9443a" {...ink} />
        <rect x="146" y="271" width="9" height="2.600" rx="1" fill={INK} />
        <rect x="146" y="278" width="9" height="8" fill={CREAM} stroke={INK} strokeWidth="0.5" />
        <path d="M148 281h5M148 283.500h5" {...thin} strokeOpacity="0.8" />
        <path d="M145 268v28" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.400" strokeLinecap="round" />
      </g>
    ),
  },

  table: {
    z: 6,
    art: () => (
      <g>
        <path d="M114 262V288M108 289h12" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="114" cy="260" rx="13" ry="3.600" fill={CREAM} {...ink} />
        {[109, 119].map((x) => (
          <g key={x}>
            <path d={`M${x - 2.500} 254h5v2.500q0 2 -2.500 2q-2.500 0 -2.500 -2Z`} fill="#fffaf0" {...ink} strokeWidth="0.7" />
            <path d={`M${x} 252q-1.500 -2 0 -3.500`} stroke="#fff" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          </g>
        ))}
        <path d="M128 290V272h9V290M128 280h9" fill="none" {...ink} strokeWidth="1.400" />
      </g>
    ),
  },

  menu: {
    z: 7,
    art: () => (
      <g>
        <path d="M60 304L63 268H75L78 304Z" fill="#2f3a35" {...ink} />
        <path d="M60 304L63 268H75L78 304" fill="none" stroke="#b08d61" strokeWidth="1.800" strokeLinejoin="round" />
        <path d="M65.500 276h7M65 283h8M64.500 290h6" stroke="#fff" strokeOpacity="0.85" strokeWidth="1" strokeLinecap="round" />
      </g>
    ),
  },

  flowers: {
    z: 7,
    art: () => (
      <g>
        <circle cx="90" cy="286" r="9" fill="#7f9e5f" {...ink} />
        {[[86, 281], [93, 280], [90, 287], [84, 288], [96, 287]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#f7e08a" stroke={INK} strokeWidth="0.5" />
        ))}
        <Pot x={90} y={306} w={14} h={11} fill="#9a6a8a" />
      </g>
    ),
  },

  bunting: {
    z: 6.5,
    art: () => <Bunting x1={64} y1={196} x2={134} y2={190} sag={7} count={7} />,
  },

  cat: {
    z: 8,
    art: () => <Cat x={126} y={306} s={0.9} fill="#e9b949" />,
  },

  lights: {
    z: 10,
    art: () => (
      <g>
        <ellipse cx="100" cy="296" rx="60" ry="9" fill="#ffd98a" opacity="0.25" />
        {[[74, 60, 2.4], [150, 140, 2], [100, 236, 2.2], [124, 62, 1.8]].map(([x, y, r], i) => (
          <Sparkle key={i} x={x} y={y} s={r} fill="#fff8d8" />
        ))}
      </g>
    ),
  },
};
