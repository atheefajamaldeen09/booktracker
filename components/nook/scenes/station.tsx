import { Glow, INK, WARM, Win, ink, thin, type Ctx, type Scene } from "../kit";

const RED = "#c8473c";
const GOLD = "#e9b949";
const IRON = "#2c2a33";
const STONE = "#f1e6cc";

function HangingLantern({ c, x }: { c: Ctx; x: number }) {
  return (
    <g>
      <path d={`M${x} 60V76`} {...ink} />
      <Glow c={c} x={x} y={84} r={20} o={0.8} />
      <path d={`M${x - 4.5} 78h9l2 12h-13Z`} fill={c.lit ? WARM : "#8f8a80"} {...ink} />
      <path d={`M${x - 6} 78h12M${x - 6.5} 90h13`} {...ink} />
    </g>
  );
}

// A steam engine pulling into an old station
export const station: Scene = {
  wall: {
    z: 0,
    art: () => (
      <g>
        <rect x="12" y="26" width="176" height="282" fill="#e6d2a8" />
        {Array.from({ length: 16 }, (_, r) => (
          <g key={r}>
            <path d={`M12 ${70 + r * 14}H188`} {...thin} strokeOpacity="0.25" />
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M${28 + i * 26 + (r % 2) * 13} ${70 + r * 14}v14`} {...thin} strokeOpacity="0.25" />
            ))}
          </g>
        ))}
      </g>
    ),
  },

  platform: {
    z: 1,
    art: () => (
      <g>
        <rect x="12" y="286" width="176" height="22" fill="#9a8f86" {...ink} />
        <path d="M12 290H188" stroke={GOLD} strokeWidth="1.600" />
        <path d="M70 296h60M66 303h68" stroke="#6a5a4a" strokeWidth="2.400" />
        <path d="M80 286L74 308M120 286L126 308" stroke={INK} strokeWidth="1.600" />
      </g>
    ),
  },

  tunnel: {
    z: 2,
    art: () => (
      <g>
        <path d="M46 292V190a54 54 0 0 1 108 0V292Z" fill={IRON} />
        <path d="M46 292V190a54 54 0 0 1 108 0V292" fill="none" stroke={INK} strokeWidth="9" />
        <path d="M46 292V190a54 54 0 0 1 108 0V292" fill="none" stroke="#cdb991" strokeWidth="6.600" />
        <path d="M42 230h8M42 260h8M150 230h8M150 260h8M52 168l7 4M148 168l-7 4M74 142l4 6M126 142l-4 6M100 132v8" {...thin} strokeOpacity="0.8" />
      </g>
    ),
  },

  girders: {
    z: 2,
    art: () => (
      <g fill="none" stroke="#4a5568" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 44H188M12 60H188" strokeWidth="3.200" />
        <path d="M12 60L28 44L44 60L60 44L76 60L92 44L108 60L124 44L140 60L156 44L172 60L188 44" strokeWidth="1.600" />
      </g>
    ),
  },

  cab: {
    z: 3,
    art: (c) => (
      <g>
        <rect x="62" y="174" width="76" height="60" rx="4" fill={RED} {...ink} />
        <Win c={c} x={67} y={184} w={14} h={15} bars={false} />
        <Win c={c} x={119} y={184} w={14} h={15} bars={false} />
        <path d="M58 176Q100 160 142 176V181H58Z" fill={IRON} {...ink} />
      </g>
    ),
  },

  boiler: {
    z: 4,
    art: () => (
      <g>
        <circle cx="100" cy="230" r="35" fill={IRON} {...ink} />
        <circle cx="100" cy="230" r="31.500" fill="none" stroke={RED} strokeWidth="3.600" />
        <circle cx="100" cy="230" r="24" fill="#3a3842" {...ink} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (Math.PI / 6) * i;
          return <circle key={i} cx={Math.round((100 + Math.cos(a) * 27.500) * 10) / 10} cy={Math.round((230 + Math.sin(a) * 27.500) * 10) / 10} r="0.900" fill={GOLD} />;
        })}
        <rect x="88" y="214" width="24" height="9" rx="2" fill={GOLD} {...ink} />
        <path d="M92 220v-3M96 217q3 0 0 3q-3 0 0 -3M101 220q3 0 0 -3M105 217h3l-2 3" stroke={INK} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="234" r="3.400" fill={GOLD} {...ink} />
        <path d="M100 234l8 8" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
        <path d="M78 220q4 -12 14 -16" stroke="#fff" strokeOpacity="0.25" strokeWidth="2.400" fill="none" strokeLinecap="round" />
      </g>
    ),
  },

  chimney: {
    z: 4.5,
    art: () => (
      <g>
        <path d="M92 198L90 172H110L108 198Z" fill={IRON} {...ink} />
        <rect x="87" y="167" width="26" height="6.500" rx="2" fill={RED} {...ink} />
        <path d="M94 178v16" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.800" strokeLinecap="round" />
      </g>
    ),
  },

  wheels: {
    z: 4.2,
    art: () => (
      <g>
        {[74, 126].map((x) => (
          <g key={x}>
            <circle cx={x} cy="288" r="11" fill={IRON} {...ink} />
            <circle cx={x} cy="288" r="7" fill="none" stroke={RED} strokeWidth="2" />
            <circle cx={x} cy="288" r="2" fill={GOLD} />
          </g>
        ))}
        <path d="M70 276H130L140 300H60Z" fill={RED} {...ink} />
        <path d="M78 276l-6 24M86 276l-3 24M94 276l-1.500 24M100 276v24M106 276l1.500 24M114 276l3 24M122 276l6 24" {...thin} strokeOpacity="0.8" />
      </g>
    ),
  },

  buffer: {
    z: 5,
    art: (c) => (
      <g>
        <rect x="56" y="263" width="88" height="13" rx="2" fill={RED} {...ink} />
        <path d="M60 266h80" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.400" />
        {[68, 132].map((x) => (
          <g key={x}>
            <circle cx={x} cy="269.500" r="6" fill="#b9b3a8" {...ink} />
            <circle cx={x} cy="269.500" r="2.400" fill="#8f8a80" />
          </g>
        ))}
        <path d="M100 270v6q0 3 -3 3" fill="none" {...ink} strokeWidth="1.600" />
        {[76, 124].map((x) => (
          <g key={x}>
            <Glow c={c} x={x} y={256} r={17} o={0.9} />
            <rect x={x - 3} y="259" width="6" height="4" fill={IRON} />
            <circle cx={x} cy="256" r="5.400" fill={c.lit ? "#fff3c4" : "#e6d3b6"} stroke={INK} strokeWidth="1.800" />
            <circle cx={x} cy="256" r="5.400" fill="none" stroke={GOLD} strokeWidth="0.9" />
          </g>
        ))}
      </g>
    ),
  },

  steam: {
    z: 5.5,
    art: () => (
      <g fill="#fff" stroke={INK} strokeOpacity="0.3" strokeWidth="0.7">
        <circle cx="100" cy="160" r="7" opacity="0.9" />
        <circle cx="111" cy="152" r="6" opacity="0.85" />
        <circle cx="90" cy="150" r="5.500" opacity="0.85" />
        <circle cx="120" cy="142" r="4" opacity="0.7" />
        <circle cx="82" cy="142" r="3.400" opacity="0.7" />
      </g>
    ),
  },

  clock: {
    z: 5,
    art: (c) => (
      <g>
        <path d="M100 60V72" {...ink} strokeWidth="1.600" />
        <Glow c={c} x={100} y={96} r={36} o={0.45} />
        <path d="M90 76q10 -10 20 0" fill="none" stroke={INK} strokeWidth="3" />
        <path d="M90 76q10 -10 20 0" fill="none" stroke={GOLD} strokeWidth="1.600" />
        <circle cx="100" cy="96" r="23" fill={GOLD} {...ink} />
        <circle cx="100" cy="96" r="19" fill={c.lit ? "#fff8e0" : "#fffaf0"} {...ink} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (Math.PI / 6) * i;
          const r1 = i % 3 === 0 ? 14 : 16;
          return (
            <path
              key={i}
              d={`M${Math.round((100 + Math.sin(a) * r1) * 10) / 10} ${Math.round((96 - Math.cos(a) * r1) * 10) / 10}L${Math.round((100 + Math.sin(a) * 17.500) * 10) / 10} ${Math.round((96 - Math.cos(a) * 17.500) * 10) / 10}`}
              stroke={INK}
              strokeWidth={i % 3 === 0 ? 1.4 : 0.8}
              strokeLinecap="round"
            />
          );
        })}
        <path d="M100 96V83M100 96L109 101" stroke={INK} strokeWidth="1.800" strokeLinecap="round" />
        <circle cx="100" cy="96" r="1.800" fill={RED} />
      </g>
    ),
  },

  sign: {
    z: 5,
    art: () => (
      <g>
        <path d="M70 120V126M130 120V126" {...ink} />
        <rect x="58" y="126" width="84" height="13" rx="2" fill="#2f3a45" {...ink} />
        <text x="100" y="135.500" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing="1" fill={GOLD} fontFamily="Georgia, serif">
          TIME STATION
        </text>
      </g>
    ),
  },

  pillars: {
    z: 6,
    art: () => (
      <g>
        {[12, 168].map((x) => (
          <g key={x}>
            <rect x={x} y="70" width="20" height="230" fill={STONE} {...ink} />
            <path d={`M${x + 5} 78V296M${x + 10} 78V296M${x + 15} 78V296`} {...thin} strokeOpacity="0.35" />
            <rect x={x - 2} y="64" width="24" height="8" rx="1" fill={STONE} {...ink} />
            <rect x={x - 2} y="296" width="24" height="12" rx="1" fill="#d8c9a4" {...ink} />
          </g>
        ))}
      </g>
    ),
  },

  arch: {
    z: 7,
    art: () => (
      <g>
        <path d="M12 26H188V66H170Q166 40 100 40Q34 40 30 66H12Z" fill="#d8c9a4" {...ink} />
        <path d="M30 66Q34 40 100 40Q166 40 170 66" fill="none" stroke={STONE} strokeWidth="3" />
        <path d="M30 66Q34 40 100 40Q166 40 170 66" fill="none" {...ink} />
        <path d="M20 26v14M44 26v10M70 26v12M130 26v12M156 26v10M180 26v14M12 46h16M172 46h16" {...thin} strokeOpacity="0.6" />
        <path d="M93 28h14l-2.500 15h-9Z" fill={STONE} {...ink} />
      </g>
    ),
  },

  lamps: {
    z: 6,
    art: (c) => (
      <g>
        <HangingLantern c={c} x={52} />
        <HangingLantern c={c} x={148} />
      </g>
    ),
  },

  signal: {
    z: 6.5,
    art: (c) => (
      <g>
        <path d="M160 302V150" stroke={INK} strokeWidth="3.400" strokeLinecap="round" />
        <path d="M160 302V150" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" />
        <rect x="140" y="152" width="22" height="7" rx="1" fill={RED} {...ink} />
        <rect x="144" y="152" width="4" height="7" fill="#fffaf0" />
        <rect x="154.500" y="164" width="11" height="20" rx="2" fill={IRON} {...ink} />
        <Glow c={c} x={160} y={178} r={9} o={0.8} />
        <circle cx="160" cy="169.500" r="2.800" fill={c.lit ? "#a8463c" : "#8a4f45"} stroke={INK} strokeWidth="0.5" />
        <circle cx="160" cy="178" r="2.800" fill={c.lit ? "#9df09d" : "#4f6b4f"} stroke={INK} strokeWidth="0.5" />
        <rect x="155" y="300" width="10" height="4" fill={IRON} />
      </g>
    ),
  },

  luggage: {
    z: 8,
    art: () => (
      <g>
        <rect x="34" y="288" width="32" height="16" rx="2" fill="#8a5a3c" {...ink} />
        <path d="M42 288v16M58 288v16" stroke={GOLD} strokeWidth="1.600" />
        <rect x="38" y="274" width="25" height="14" rx="2" fill="#5f8a86" {...ink} />
        <path d="M46 274q4.500 -5 9 0" fill="none" {...ink} />
        <rect x="47" y="279" width="7" height="4" rx="0.800" fill="#f7ecd8" stroke={INK} strokeWidth="0.5" />
        <rect x="42" y="263" width="17" height="11" rx="4" fill="#e3a3a0" {...ink} />
        <path d="M42 268h17" stroke={RED} strokeWidth="1.400" />
      </g>
    ),
  },

  bench: {
    z: 8,
    art: () => (
      <g>
        <path d="M139 290V304M163 290V304" stroke={INK} strokeWidth="2.600" strokeLinecap="round" />
        <rect x="136" y="266" width="30" height="16" rx="4" fill={RED} {...ink} />
        <circle cx="145" cy="274" r="1.200" fill={GOLD} />
        <circle cx="157" cy="274" r="1.200" fill={GOLD} />
        <rect x="134" y="282" width="34" height="8" rx="3" fill="#d95a4e" {...ink} />
      </g>
    ),
  },

  pigeons: {
    z: 6,
    art: () => (
      <g>
        {[[76, 1], [86, -1], [126, 1]].map(([x, dir]) => (
          <g key={x}>
            <ellipse cx={x} cy="55" rx="4.400" ry="3.200" fill="#9aa3b0" {...ink} strokeWidth="0.8" />
            <circle cx={x + dir * 3.500} cy="51" r="2.200" fill="#9aa3b0" {...ink} strokeWidth="0.8" />
            <path d={`M${x + dir * 5.500} 51l${dir * 2.500} 0.800l${-dir * 2.500} 0.800Z`} fill={GOLD} stroke={INK} strokeWidth="0.4" />
            <circle cx={x + dir * 4} cy="50.500" r="0.500" fill={INK} />
          </g>
        ))}
      </g>
    ),
  },

  lights: {
    z: 10,
    art: () => (
      <g>
        <ellipse cx="100" cy="298" rx="62" ry="9" fill="#ffd98a" opacity="0.28" />
        <path d="M76 256L44 308H86ZM124 256L114 308H156Z" fill="#ffe9a8" opacity="0.12" />
      </g>
    ),
  },
};
