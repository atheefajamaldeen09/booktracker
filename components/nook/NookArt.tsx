import { useId } from "react";
import { nookById, type NookId } from "@/lib/nooks";
import { INK, type Scene } from "./kit";
import { sakura } from "./scenes/sakura";
import { wizard } from "./scenes/wizard";
import { bookshop } from "./scenes/bookshop";
import { greenhouse } from "./scenes/greenhouse";
import { toyshop } from "./scenes/toyshop";
import { bakery } from "./scenes/bakery";
import { station } from "./scenes/station";
import { clocktower } from "./scenes/clocktower";
import { study } from "./scenes/study";
import { garden } from "./scenes/garden";
import { pond } from "./scenes/pond";

const SCENES: Record<NookId, Scene> = { sakura, wizard, bookshop, greenhouse, toyshop, bakery, station, clocktower, study, garden, pond };

// A book nook in its wooden case. `placed` is how many pieces are in (in
// building order); the rest show as faint outlines of what's still to come.
export default function NookArt({ nook, placed = "all" }: { nook: NookId; placed?: number | "all" }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const def = nookById(nook);
  if (!def) return null;
  const scene = SCENES[nook];
  const count = placed === "all" ? def.pieces.length : placed;
  const inPlace = new Set(def.pieces.slice(0, count).map((p) => p.id));
  const lit = inPlace.has("lights");
  const pieces = def.pieces.filter((p) => scene[p.id]).sort((a, b) => scene[a.id].z - scene[b.id].z);

  return (
    <svg viewBox="0 0 200 320" width="100%" height="100%" role="img" aria-label={`${def.name} book nook`} style={{ display: "block" }}>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#ffcf6b" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffcf6b" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-open`}>
          <rect x="12" y="26" width="176" height="282" />
        </clipPath>
      </defs>

      {/* Bare card backing, until the scenery goes in */}
      <rect x="12" y="26" width="176" height="282" fill="#e9dcc3" />
      <g clipPath={`url(#${id}-open)`}>
        {pieces.map((p) =>
          inPlace.has(p.id) ? (
            <g key={p.id} data-piece={p.id}>
              {scene[p.id].art({ lit, id })}
            </g>
          ) : (
            <g key={p.id} opacity="0.1" style={{ filter: "grayscale(1)" }}>
              {scene[p.id].art({ lit: false, id: `${id}-g` })}
            </g>
          )
        )}
        {/* Everything warms up a little once the lights are on */}
        {lit && <rect x="12" y="26" width="176" height="282" fill="#ffb347" opacity="0.07" />}
        {/* The case casts a shadow on what's inside */}
        <path d="M12 26H188V308H12Z M20 32V308H180V32Z" fillRule="evenodd" fill="#000" opacity="0.1" />
      </g>

      {/* The case, with its name plate */}
      <path d="M7 1H193Q199 1 199 7V313Q199 319 193 319H7Q1 319 1 313V7Q1 1 7 1Z M12 26V308H188V26Z" fillRule="evenodd" fill={def.wood} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 8V312" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
      <path d="M195.5 8V312" stroke="#000" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" />
      <rect x="12" y="26" width="176" height="282" fill="none" stroke={INK} strokeWidth="1.2" />
      <rect x="22" y="6" width="156" height="15" rx="3" fill="#f7ecd8" stroke={INK} strokeWidth="1" />
      <text x="100" y="16.5" textAnchor="middle" fontSize="8" fontWeight="700" letterSpacing="0.9" fill={INK} fontFamily="Georgia, 'Times New Roman', serif">
        {def.name.toUpperCase()}
      </text>
    </svg>
  );
}
