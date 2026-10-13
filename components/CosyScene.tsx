"use client";

import { useEffect, useRef } from "react";

// The reading timer's little room: a rainy window at night, a candle that
// burns down once an hour, a steaming mug and a sleeping cat. The candle is
// lit while the timer runs. Drawn on a 480 × 150 canvas; narrow screens see
// the middle of it, so the window, candle and mug sit near the centre.
const W = 480;
const H = 150;
const TABLE = 114;
const INK = "#2e211c";
const HOUR = 60 * 60 * 1000;

const CANDLE_X = 270;
const CANDLE_FULL = 54;
const CANDLE_STUB = 10;

const line = { stroke: INK, strokeWidth: 1.4, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const thin = { stroke: INK, strokeWidth: 1, strokeLinecap: "round", fill: "none" } as const;

// Rain streaks on the glass: where each starts and how fast it falls
const RAIN = Array.from({ length: 20 }, (_, i) => ({
  x: 98 + ((i * 37) % 132),
  offset: (i * 173) % 1300,
  duration: 850 + ((i * 97) % 450),
  length: 7 + (i % 3) * 2,
}));

const LIGHTS = ["#f7c6d3", "#f6e7a8", "#c9e3f2", "#cfe8c8", "#fbd5b8", "#ddd0f0"];

export default function CosyScene({ lit, elapsed, paused }: { lit: boolean; elapsed: number; paused: boolean }) {
  const rainRefs = useRef<(SVGLineElement | null)[]>([]);
  const flameRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const steamRefs = useRef<(SVGPathElement | null)[]>([]);
  const catRef = useRef<SVGGElement>(null);
  const bulbRefs = useRef<(SVGCircleElement | null)[]>([]);

  // It rains the whole time, and the cat sleeps through all of it
  useEffect(() => {
    const animations = [
      ...rainRefs.current.map((el, i) =>
        el?.animate([{ transform: "translate(8px, -24px)" }, { transform: "translate(-6px, 96px)" }], {
          duration: RAIN[i].duration,
          delay: -RAIN[i].offset,
          iterations: Infinity,
        })
      ),
      catRef.current?.animate([{ transform: "scale(1, 1)" }, { transform: "scale(1.015, 1.05)" }, { transform: "scale(1, 1)" }], {
        duration: 3600,
        easing: "ease-in-out",
        iterations: Infinity,
      }),
    ];
    return () => animations.forEach((a) => a?.cancel());
  }, []);

  // The flame flickers, the mug steams and the fairy lights twinkle while you read
  useEffect(() => {
    if (!lit) return;
    const animations = [
      flameRef.current?.animate(
        [
          { transform: "scale(1, 1) rotate(-2deg)" },
          { transform: "scale(0.92, 1.1) rotate(3deg)" },
          { transform: "scale(1.05, 0.95) rotate(-1deg)" },
          { transform: "scale(0.96, 1.06) rotate(2deg)" },
          { transform: "scale(1, 1) rotate(-2deg)" },
        ],
        { duration: 1500, easing: "ease-in-out", iterations: Infinity }
      ),
      glowRef.current?.animate([{ opacity: 0.75 }, { opacity: 1 }, { opacity: 0.8 }, { opacity: 0.95 }, { opacity: 0.75 }], {
        duration: 2300,
        iterations: Infinity,
      }),
      ...steamRefs.current.map((el, i) =>
        el?.animate(
          [
            { transform: "translateY(4px)", opacity: 0 },
            { transform: "translateY(-3px)", opacity: 0.7, offset: 0.4 },
            { transform: "translateY(-12px)", opacity: 0 },
          ],
          { duration: 2600, delay: i * 700, iterations: Infinity }
        )
      ),
      ...bulbRefs.current.map((el, i) =>
        el?.animate([{ opacity: 0.55 }, { opacity: 1 }, { opacity: 0.55 }], { duration: 1800 + (i % 4) * 400, delay: i * 230, iterations: Infinity })
      ),
    ];
    return () => animations.forEach((a) => a?.cancel());
  }, [lit]);

  // One candle lasts an hour; the stubs of the ones before it stay on the sill
  const burnt = (elapsed % HOUR) / HOUR;
  const height = CANDLE_FULL - (CANDLE_FULL - CANDLE_STUB) * burnt;
  const top = TABLE + 4 - height;
  const stubs = Math.min(3, Math.floor(elapsed / HOUR));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={lit ? "A candle burning by a rainy window while you read" : "A rainy window with an unlit candle"}
      style={{ display: "block", width: "100%", height: "clamp(150px, 30vw, 210px)" }}
    >
      <defs>
        <linearGradient id="cosy-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2440" />
          <stop offset="1" stopColor="#3a4873" />
        </linearGradient>
        <radialGradient id="cosy-glow">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffb347" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <clipPath id="cosy-glass">
          <rect x="92" y="18" width="136" height="88" />
        </clipPath>
      </defs>

      {/* wall */}
      <rect width={W} height={TABLE} fill="#4b3a4c" />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={`M${20 + i * 40} ${i % 2 ? 40 : 76} l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 Z`}
          fill="#5a475b"
        />
      ))}

      {/* fairy lights */}
      <path d="M252 4 Q300 26 350 12 T480 16" {...thin} strokeOpacity="0.7" />
      {[
        [268, 11],
        [290, 17],
        [314, 18],
        [338, 15],
        [362, 12],
        [386, 13],
        [410, 16],
        [434, 18],
        [458, 17],
      ].map(([x, y], i) => (
        <circle
          key={x}
          ref={(el) => {
            bulbRefs.current[i] = el;
          }}
          cx={x}
          cy={y + 4}
          r="3.4"
          fill={lit ? LIGHTS[i % LIGHTS.length] : "#8d7f8f"}
          {...line}
          strokeWidth={1}
        />
      ))}

      {/* window: night sky, rooftops, rain */}
      <rect x="84" y="10" width="152" height="104" rx="3" fill="#a8744f" {...line} />
      <rect x="92" y="18" width="136" height="88" fill="url(#cosy-sky)" {...line} />
      <g clipPath="url(#cosy-glass)">
        <circle cx="206" cy="36" r="9" fill="#f3ecd2" opacity="0.5" />
        <circle cx="206" cy="36" r="16" fill="#f3ecd2" opacity="0.12" />
        <path d="M92 106 L92 82 L108 82 L108 72 L124 62 L140 72 L140 86 L156 86 L156 76 L176 76 L176 90 L192 90 L192 70 L204 64 L216 70 L216 84 L228 84 L228 106 Z" fill="#141b31" />
        {[
          [112, 86],
          [128, 76],
          [128, 88],
          [164, 86],
          [198, 78],
          [208, 90],
          [220, 92],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="5" height="6" fill="#ffd98a" opacity="0.85" />
        ))}
        {[
          [104, 30, 0.9],
          [150, 44, 1.2],
          [186, 26, 0.8],
          [132, 58, 1],
          [214, 56, 1.1],
          [170, 64, 0.9],
        ].map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r * 1.6} fill="#dbe8fa" opacity="0.45" />
        ))}
        {RAIN.map((drop, i) => (
          <line
            key={i}
            ref={(el) => {
              rainRefs.current[i] = el;
            }}
            x1={drop.x}
            y1={18}
            x2={drop.x - 1.5}
            y2={18 + drop.length}
            stroke="#dbe8fa"
            strokeOpacity="0.6"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </g>
      <path d="M160 18 L160 106 M92 60 L228 60" stroke="#a8744f" strokeWidth="5" />
      <path d="M157.5 18 L157.5 106 M162.5 18 L162.5 106 M92 57.5 L228 57.5 M92 62.5 L228 62.5" {...thin} strokeOpacity="0.6" />

      {/* curtains */}
      <path d="M70 6 L250 6" {...line} strokeWidth={3} />
      <circle cx="68" cy="6" r="3" fill="#d9b25f" {...line} />
      <circle cx="252" cy="6" r="3" fill="#d9b25f" {...line} />
      <path d="M76 6 L114 6 C110 40 102 72 98 112 L76 112 Z" fill="#e8b4b0" {...line} />
      <path d="M86 8 C86 50 84 80 82 110 M100 8 C98 40 94 70 90 110" {...thin} strokeOpacity="0.4" />
      <path d="M244 6 L206 6 C210 40 218 72 222 112 L244 112 Z" fill="#e8b4b0" {...line} />
      <path d="M234 8 C234 50 236 80 238 110 M220 8 C222 40 226 70 230 110" {...thin} strokeOpacity="0.4" />

      {/* table */}
      <rect y={TABLE} width={W} height={H - TABLE} fill="#9c6a47" />
      <rect y={TABLE} width={W} height="5" fill="#b9835c" />
      <path d={`M0 ${TABLE} L${W} ${TABLE}`} {...line} />
      <path d="M30 130 L120 130 M170 138 L300 138 M340 128 L450 128 M90 144 L180 144" {...thin} strokeOpacity="0.25" />

      {/* a plant in the corner */}
      <path d="M40 96 C30 84 28 70 36 60 C42 72 44 84 40 96 Z M40 96 C44 80 54 72 62 70 C60 82 52 92 40 96 Z M40 96 C34 88 24 86 16 88 C22 96 32 98 40 96 Z" fill="#8fae7c" {...line} />
      <path d="M28 96 L52 96 L49 118 L31 118 Z" fill="#d98f6c" {...line} />

      {/* the book you put down */}
      <path d="M100 121 C110 118 120 119 128 124 C136 119 146 118 156 121 L156 124 C146 121 136 122 128 127 C120 122 110 121 100 124 Z" fill="#c8674f" {...line} />
      <path d="M128 123 C120 117 110 117 102 119 L102 106 C110 104 120 104 128 110 Z" fill="#fffaf0" {...line} />
      <path d="M128 123 C136 117 146 117 154 119 L154 106 C146 104 136 104 128 110 Z" fill="#fffaf0" {...line} />
      <path d="M107 110 C113 109 119 110 123 112 M107 114 C113 113 119 114 123 116 M149 110 C143 109 137 110 133 112 M149 114 C143 113 137 114 133 116" {...thin} strokeOpacity="0.4" />

      {/* stubs of the candles you've already read through */}
      {Array.from({ length: stubs }, (_, i) => (
        <g key={i} transform={`translate(${246 - i * 14} ${TABLE + 6})`}>
          <ellipse cx="0" cy="1" rx="8" ry="2.4" fill="#f6ead6" {...line} strokeWidth={1} />
          <rect x="-4" y="-5" width="8" height="6" rx="1.5" fill="#f6ead6" {...line} strokeWidth={1} />
          <path d="M0 -5 L0 -8" {...thin} />
        </g>
      ))}

      {/* the candle */}
      {lit && <circle ref={glowRef} cx={CANDLE_X} cy={top - 10} r="78" fill="url(#cosy-glow)" />}
      <ellipse cx={CANDLE_X} cy={TABLE + 6} rx="19" ry="4.6" fill="#e6d6bd" {...line} />
      <rect x={CANDLE_X - 9} y={top} width="18" height={height} rx="2" fill="#f6ead6" {...line} />
      <path
        d={`M${CANDLE_X - 9} ${top + 2} q2 6 4 1 q2 8 5 2 q3 5 5 0 q2 4 4 -1`}
        {...thin}
        strokeOpacity="0.5"
      />
      <path d={`M${CANDLE_X} ${top} L${CANDLE_X} ${top - 4}`} {...line} />
      {lit ? (
        <g transform={`translate(${CANDLE_X} ${top - 3})`}>
          <g ref={flameRef} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
            <path d="M0 -17 C7 -10 7.5 -3 0 0 C-7.5 -3 -6 -10 0 -17 Z" fill="#ffb347" {...line} strokeWidth={1.2} />
            <path d="M0 -9 C3.4 -5.5 3.4 -2 0 -0.6 C-3.4 -2 -3 -5.5 0 -9 Z" fill="#fff1b8" />
          </g>
        </g>
      ) : (
        paused && <path d={`M${CANDLE_X} ${top - 6} q-4 -5 0 -9 q4 -4 0 -9`} {...thin} stroke="#e9dfe6" strokeOpacity="0.6" />
      )}

      {/* a mug of something warm */}
      <path d="M326 100 C335 100 335 113 325 113" fill="none" {...line} strokeWidth={2.4} />
      <path d="M301 94 L327 94 L325 118 Q314 122 303 118 Z" fill="#c9d8b6" {...line} />
      <path d="M314 111 C307 106 309 101 314 104.5 C319 101 321 106 314 111 Z" fill="#fffaf0" {...line} strokeWidth={1} />
      {[306, 314, 322].map((x, i) => (
        <path
          key={x}
          ref={(el) => {
            steamRefs.current[i] = el;
          }}
          d={`M${x} 90 q-3 -4 0 -8 q3 -4 0 -8`}
          {...thin}
          stroke="#fffaf0"
          strokeWidth={1.6}
          opacity="0"
        />
      ))}

      {/* the cat, fast asleep */}
      <g ref={catRef} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        <path d="M398 120 C408 118 410 108 402 106" fill="none" {...line} strokeWidth={7.6} />
        <path d="M398 120 C408 118 410 108 402 106" fill="none" {...line} stroke="#edc99b" strokeWidth={5} />
        <path d="M348 120 C344 104 360 95 376 97 C394 99 404 110 400 120 Z" fill="#edc99b" {...line} />
        <path d="M372 99 q2 5 0 9 M381 100 q2 5 0 9 M390 104 q2 4 0 8" {...thin} stroke="#c98f58" strokeWidth={1.6} />
        <path d="M349 107 L350 97 L357 103 M363 103 L370 97 L371 107" fill="#edc99b" {...line} />
        <ellipse cx="360" cy="111" rx="12" ry="9.5" fill="#edc99b" {...line} />
        <path d="M353 111 q2.5 2.4 5 0 M362 111 q2.5 2.4 5 0" {...thin} strokeWidth={1.3} />
        <path d="M359 115 l1 1 l1 -1" {...thin} />
        <ellipse cx="352.5" cy="115" rx="2" ry="1.2" fill="#e58f8a" opacity="0.7" />
        <ellipse cx="367.5" cy="115" rx="2" ry="1.2" fill="#e58f8a" opacity="0.7" />
      </g>

      {/* the room is dim until the candle is lit */}
      {!lit && <rect width={W} height={H} fill="#140e1c" opacity="0.36" />}
    </svg>
  );
}
