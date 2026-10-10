import { Glow, INK, Lantern, WARM, ink, thin, type Scene } from "../kit";

const PINK = "#f4b8c4";
const PALE = "#fbdbe1";
const TRUNK = "#8a6a5a";
const MOSS = "#cfe0a8";

// A cloud of blossom: x, y, radius
function Blossoms({ list }: { list: [number, number, number][] }) {
  return (
    <>
      {list.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={i % 3 === 0 ? PALE : PINK} {...ink} strokeWidth="0.8" />
          <circle cx={x - r * 0.3} cy={y - r * 0.25} r={r * 0.28} fill="#fff" opacity="0.55" />
        </g>
      ))}
    </>
  );
}

function Koi({ x, y, rot, fill }: { x: number; y: number; rot: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M-8 0q4 -4.500 10 -2l5 -3v10l-5 -3q-6 2.500 -10 -2Z" fill={fill} {...ink} strokeWidth="0.7" />
      <path d="M-3 -2.500q2 2.500 0 5" fill="#fffaf0" />
      <circle cx="-5.500" cy="-0.500" r="0.600" fill={INK} />
    </g>
  );
}

// A quiet pond in blossom season
export const pond: Scene = {
  sky: {
    z: 0,
    art: (c) => (
      <g>
        <defs>
          <linearGradient id={`${c.id}-spring`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f8e6c8" />
            <stop offset="0.6" stopColor="#f6f0d2" />
          </linearGradient>
        </defs>
        <rect x="12" y="26" width="176" height="282" fill={`url(#${c.id}-spring)`} />
        <circle cx="104" cy="84" r="18" fill="#fff6dc" />
        <ellipse cx="66" cy="110" rx="26" ry="5" fill="#fff" opacity="0.6" />
        <ellipse cx="146" cy="96" rx="20" ry="4" fill="#fff" opacity="0.5" />
      </g>
    ),
  },

  hills: {
    z: 0.5,
    art: () => (
      <g>
        <path d="M12 150Q50 112 92 142Q132 110 188 146V200H12Z" fill="#c9dcb0" {...ink} />
        <path d="M12 164Q60 140 104 158Q150 140 188 160V200H12Z" fill="#b5cfa6" {...ink} />
      </g>
    ),
  },

  ground: {
    z: 0.8,
    art: () => (
      <g>
        <path d="M12 172Q100 154 188 172V308H12Z" fill={MOSS} {...ink} />
        <path d="M24 200q4 -4 8 0M160 194q4 -4 8 0M30 250q4 -4 8 0M70 290q4 -4 8 0M176 244q3 -3 6 0" {...thin} />
      </g>
    ),
  },

  pond: {
    z: 1,
    art: () => (
      <g>
        <path d="M94 164Q80 196 100 222Q128 250 70 308H188V262Q150 240 132 206Q118 180 108 164Z" fill="#bfe0dc" {...ink} />
        <path d="M100 182h8M104 196h12M116 232h14M112 272h16M146 286h18M130 252h10" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.200" strokeLinecap="round" />
      </g>
    ),
  },

  pagoda: {
    z: 2,
    art: (c) => (
      <g>
        <path d="M128 118V110" {...ink} />
        {[0, 1, 2].map((i) => {
          const y = 158 - i * 15;
          const w = 30 - i * 7;
          return (
            <g key={i}>
              <rect x={128 - w / 2 + 4} y={y} width={w - 8} height="9" fill="#f3e2c9" {...ink} />
              <rect x={126.500} y={y + 2} width="3" height="5" fill={c.lit ? WARM : "#8a6a5a"} stroke={INK} strokeWidth="0.5" />
              <path d={`M${128 - w / 2 - 3} ${y + 1}Q128 ${y - 3} ${128 + w / 2 + 3} ${y + 1}L${128 + w / 2 - 2} ${y - 6}H${128 - w / 2 + 2}Z`} fill="#c98a8a" {...ink} />
            </g>
          );
        })}
      </g>
    ),
  },

  pavilion: {
    z: 3,
    art: (c) => (
      <g>
        <path d="M24 196V214M40 196V216M56 196V214M68 196V212" {...ink} strokeWidth="1.600" />
        <rect x="18" y="190" width="56" height="6" fill="#b08d61" {...ink} />
        <rect x="24" y="154" width="44" height="36" fill="#f3e2c9" {...ink} />
        <rect x="30" y="160" width="12" height="22" fill={c.lit ? WARM : "#8fa3ad"} {...ink} strokeWidth="0.8" />
        <rect x="50" y="160" width="12" height="22" fill={c.lit ? WARM : "#8fa3ad"} {...ink} strokeWidth="0.8" />
        <path d="M36 160v22M30 171h12M56 160v22M50 171h12" {...thin} strokeOpacity="0.7" />
        <Glow c={c} x={46} y={172} r={26} o={0.45} />
        <path d="M18 182H74M22 182v8M34 182v8M46 182v8M58 182v8M70 182v8" fill="none" stroke="#a8463c" strokeWidth="1.400" />
        <path d="M12 156Q46 146 80 156L70 136H22Z" fill="#c98a8a" {...ink} />
        <path d="M28 138h36l-6 -10h-24Z" fill="#b97a7a" {...ink} />
        <path d="M30 140l-3 14M46 138v14M62 140l3 14" {...thin} />
      </g>
    ),
  },

  bridge: {
    z: 3.5,
    art: () => (
      <g>
        <path d="M82 218Q112 194 142 214" fill="none" stroke={INK} strokeWidth="6.400" strokeLinecap="round" />
        <path d="M82 218Q112 194 142 214" fill="none" stroke="#c8674f" strokeWidth="4.800" strokeLinecap="round" />
        <path d="M82 208Q112 184 142 204" fill="none" stroke={INK} strokeWidth="2.800" strokeLinecap="round" />
        <path d="M82 208Q112 184 142 204" fill="none" stroke="#c8674f" strokeWidth="1.600" strokeLinecap="round" />
        {[[82, 208], [97, 200], [112, 196.500], [127, 198], [142, 204]].map(([x, y]) => (
          <path key={x} d={`M${x} ${y}v10`} stroke={INK} strokeWidth="1.400" />
        ))}
      </g>
    ),
  },

  stones: {
    z: 2,
    art: () => (
      <g fill="#b9b3a8">
        {[[118, 246, 6], [132, 254, 6.500], [148, 258, 7], [164, 266, 7.500]].map(([x, y, r]) => (
          <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.42} {...ink} strokeWidth="0.9" />
        ))}
      </g>
    ),
  },

  lilies: {
    z: 2.6,
    art: () => (
      <g>
        {[[112, 282, 1], [128, 234, 0.8], [176, 284, 0.9]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M0 0L7 -1.500A7 3.200 0 1 1 6 -2.600Z" fill="#8fb87a" {...ink} strokeWidth="0.7" />
            <path d="M-2 -1q-2 -4 0 -5q2 1 2 5q0 -4 2.500 -5q2 1 0 5Z" fill={PINK} {...ink} strokeWidth="0.6" />
          </g>
        ))}
      </g>
    ),
  },

  koi: {
    z: 2.5,
    art: () => (
      <g>
        <Koi x={136} y={296} rot={-12} fill="#e8853c" />
        <Koi x={158} y={300} rot={170} fill="#f7ecd8" />
        <Koi x={98} y={298} rot={30} fill="#e8a05a" />
      </g>
    ),
  },

  boat: {
    z: 3,
    art: () => (
      <g>
        <path d="M146 272l6 -8M178 272l-8 -6" {...ink} strokeWidth="0.9" />
        <path d="M144 270h34l-6 8h-22Z" fill="#b08d61" {...ink} />
        <path d="M148 273h26" {...thin} strokeOpacity="0.8" />
      </g>
    ),
  },

  lefttree: {
    z: 5,
    art: () => (
      <g>
        <path d="M22 308C30 270 20 240 34 206C40 190 36 176 44 160" fill="none" stroke={INK} strokeWidth="8.400" strokeLinecap="round" />
        <path d="M22 308C30 270 20 240 34 206C40 190 36 176 44 160" fill="none" stroke={TRUNK} strokeWidth="6.600" strokeLinecap="round" />
        <path d="M34 206Q52 194 62 174M40 176Q26 160 22 140M44 160Q56 138 72 126M44 160Q40 130 44 108" fill="none" stroke={TRUNK} strokeWidth="2.800" strokeLinecap="round" />
        <Blossoms
          list={[
            [22, 132, 11], [40, 104, 12], [58, 118, 10], [74, 120, 9], [30, 114, 9], [52, 98, 8], [64, 168, 9], [18, 152, 8],
            [70, 104, 7], [34, 90, 8], [84, 132, 7], [50, 136, 8], [76, 152, 6],
          ]}
        />
      </g>
    ),
  },

  righttree: {
    z: 5,
    art: () => (
      <g>
        <path d="M176 262C170 236 178 214 166 190" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M176 262C170 236 178 214 166 190" fill="none" stroke={TRUNK} strokeWidth="4.400" strokeLinecap="round" />
        <path d="M168 198Q154 184 150 166M166 190Q176 170 174 150" fill="none" stroke={TRUNK} strokeWidth="2.400" strokeLinecap="round" />
        <Blossoms list={[[150, 158, 10], [166, 146, 11], [180, 158, 9], [158, 176, 8], [176, 176, 8], [146, 142, 7], [182, 138, 7], [164, 128, 8]]} />
      </g>
    ),
  },

  stonelantern: {
    z: 4,
    art: (c) => (
      <g>
        <Glow c={c} x={160} y={222} r={15} o={0.85} />
        <rect x="154.500" y="240" width="11" height="4.500" fill="#b9b3a8" {...ink} />
        <rect x="158.500" y="227" width="3" height="13" fill="#b9b3a8" {...ink} />
        <rect x="155.500" y="217" width="9" height="10" fill={c.lit ? WARM : "#8f8a80"} {...ink} />
        <path d="M160 217v10M155.500 222h9" {...thin} />
        <path d="M151.500 217L160 208L168.500 217Z" fill="#b9b3a8" {...ink} />
      </g>
    ),
  },

  crane: {
    z: 6,
    art: () => (
      <g>
        <path d="M62 276V292M68 276V292M62 292h-3M68 292h3" fill="none" {...ink} strokeWidth="0.9" />
        <path d="M54 270q2 -9 12 -8q9 1 10 8q-5 6 -12 5q-7 0 -10 -5Z" fill="#fffaf0" {...ink} />
        <path d="M76 270q4 2 5 7q-5 -1 -8 -3" fill="#3f4a45" {...ink} strokeWidth="0.8" />
        <path d="M58 264q-6 -10 0 -18" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M58 264q-6 -10 0 -18" fill="none" stroke="#fffaf0" strokeWidth="2.400" strokeLinecap="round" />
        <circle cx="58.500" cy="244" r="3" fill="#fffaf0" {...ink} strokeWidth="0.8" />
        <path d="M56.500 242q2 -2 4 0" fill="none" stroke="#d9443a" strokeWidth="1.600" strokeLinecap="round" />
        <path d="M61 244.500l7 1.500l-7 0.800Z" fill="#d9a441" stroke={INK} strokeWidth="0.5" />
        <circle cx="59.500" cy="244" r="0.600" fill={INK} />
      </g>
    ),
  },

  lanterns: {
    z: 6,
    art: (c) => (
      <g>
        <Lantern c={c} x={62} y={176} s={0.850} />
        <Lantern c={c} x={74} y={128} s={0.800} fill="#f7ecd8" />
      </g>
    ),
  },

  bushes: {
    z: 4,
    art: () => (
      <g>
        <path d="M34 308q-4 -18 10 -18q4 -10 14 -4q12 -2 10 14q4 4 2 8Z" fill="#8fb87a" {...ink} />
        {[[44, 296], [54, 290], [62, 300], [48, 304]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.200" fill={i % 2 ? PALE : "#e58f8a"} stroke={INK} strokeWidth="0.5" />
        ))}
        <path d="M168 250q-2 -12 8 -12q8 -6 12 2V250Z" fill="#8fb87a" {...ink} />
        <circle cx="176" cy="244" r="2" fill="#e58f8a" stroke={INK} strokeWidth="0.5" />
        <circle cx="184" cy="242" r="2" fill={PALE} stroke={INK} strokeWidth="0.5" />
      </g>
    ),
  },

  gate: {
    z: 8,
    art: () => (
      <g>
        <path d="M12 26H188V96Q186 42 100 42Q14 42 12 96Z" fill="#eef0c4" {...ink} />
        <path d="M17 88Q22 47 100 47Q178 47 183 88" fill="none" stroke="#c9cf8f" strokeWidth="1.400" />
        <path d="M18 32h14v14h-14ZM22 36h6v6h-6ZM168 32h14v14h-14ZM172 36h6v6h-6Z" fill="none" stroke="#b5bb7a" strokeWidth="1.200" />
        <path d="M84 34q16 -8 32 0" fill="none" stroke="#b5bb7a" strokeWidth="1.200" strokeLinecap="round" />
      </g>
    ),
  },

  petals: {
    z: 9,
    art: () => (
      <g>
        {[[96, 124, 20], [116, 150, -30], [88, 178, 40], [138, 190, -10], [104, 238, 25], [150, 232, -40], [84, 262, 15], [128, 276, -20], [170, 300, 30], [110, 100, 10], [142, 112, -25]].map(
          ([x, y, rot], i) => (
            <ellipse key={i} cx={x} cy={y} rx="2.800" ry="1.600" fill={PALE} stroke="#d9788c" strokeWidth="0.4" transform={`rotate(${rot} ${x} ${y})`} />
          )
        )}
      </g>
    ),
  },

  lights: {
    z: 10,
    art: () => (
      <g>
        <ellipse cx="130" cy="276" rx="50" ry="14" fill="#fff6dc" opacity="0.25" />
        <circle cx="104" cy="84" r="26" fill="#fff6dc" opacity="0.35" />
      </g>
    ),
  },
};
