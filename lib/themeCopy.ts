import type { ThemeId } from "@/lib/themes";

// Little bits of wording that follow the theme: the café brews, the
// enchanted library casts spells, the ocean drifts, the garden grows and the
// bakery bakes. Rendered with <ThemeText>, which shows the current theme's line.

type Line = string | ((n: number) => string);
export type CopyId = keyof typeof COPY;

export const COPY = {
  tagline: {
    cafe: "brewed for readers",
    enchanted: "conjured for readers",
    ocean: "drifting through pages",
    botanical: "grown for readers",
    sugar: "baked for readers",
  },
  heroEyebrow: {
    cafe: "Your reading café",
    enchanted: "Your enchanted library",
    ocean: "Your moonlit harbour",
    botanical: "Your reading garden",
    sugar: "Your sweet little bookshop",
  },
  heroTitle: {
    cafe: "Welcome back, grab a cup & a chapter.",
    enchanted: "Welcome back, light a candle & open a spellbook.",
    ocean: "Welcome back, drift away with a chapter.",
    botanical: "Welcome back, find a sunny spot & a chapter.",
    sugar: "Welcome back, grab a treat & a chapter.",
  },
  heroEmpty: {
    cafe: "Add your first book to start brewing your library.",
    enchanted: "Add your first book to start filling your spellbook shelves.",
    ocean: "Add your first book and set sail on your library.",
    botanical: "Add your first book to plant the first seed of your library.",
    sugar: "Add your first book to start baking your library.",
  },
  statsSubtitle: {
    cafe: "Every page, every month, every favourite — brewed into charts.",
    enchanted: "Every page, every month, every favourite — conjured into charts.",
    ocean: "Every page, every month, every favourite — charted like the stars.",
    botanical: "Every page, every month, every favourite — grown into charts.",
    sugar: "Every page, every month, every favourite — whipped into charts.",
  },
  statsEmpty: {
    cafe: "Add a few books and your stats will start brewing.",
    enchanted: "Add a few books and your stats will start to shimmer.",
    ocean: "Add a few books and your stats will start to surface.",
    botanical: "Add a few books and your stats will start to sprout.",
    sugar: "Add a few books and your stats will start rising.",
  },
  goalsSubtitle: {
    cafe: "Set a yearly target and watch your cup fill up as you finish books.",
    enchanted: "Set a yearly target and watch your candle burn brighter as you finish books.",
    ocean: "Set a yearly target and watch the tide rise as you finish books.",
    botanical: "Set a yearly target and watch your garden grow as you finish books.",
    sugar: "Set a yearly target and watch your sweet jar fill up as you finish books.",
  },
  goalTreat: {
    cafe: "Time for a celebratory latte ☕",
    enchanted: "Time to light every candle 🕯️",
    ocean: "Time for a toast under the moon 🌙",
    botanical: "Time to pick yourself a bouquet 💐",
    sugar: "Time for a celebratory cupcake 🧁",
  },
  goalBanner: {
    cafe: "That calls for a celebratory latte.",
    enchanted: "That calls for a little magic.",
    ocean: "That calls for a moonlit toast.",
    botanical: "That calls for fresh flowers.",
    sugar: "That calls for cake.",
  },
  ahead: {
    cafe: (n: number) => `☕ You're ${n} ${n === 1 ? "book" : "books"} ahead of schedule.`,
    enchanted: (n: number) => `🕯️ You're ${n} ${n === 1 ? "book" : "books"} ahead of schedule.`,
    ocean: (n: number) => `🌙 You're ${n} ${n === 1 ? "book" : "books"} ahead of schedule.`,
    botanical: (n: number) => `🌿 You're ${n} ${n === 1 ? "book" : "books"} ahead of schedule.`,
    sugar: (n: number) => `🧁 You're ${n} ${n === 1 ? "book" : "books"} ahead of schedule.`,
  },
  onSchedule: {
    cafe: "Right on schedule — keep brewing!",
    enchanted: "Right on schedule — keep the candle lit!",
    ocean: "Right on schedule — keep sailing!",
    botanical: "Right on schedule — keep growing!",
    sugar: "Right on schedule — keep baking!",
  },
  winnerTitle: {
    cafe: "☕ Your next read ☕",
    enchanted: "🕯️ Your next read 🕯️",
    ocean: "🌙 Your next read 🌙",
    botanical: "🌿 Your next read 🌿",
    sugar: "🧁 Your next read 🧁",
  },
  winnerSubtitle: {
    cafe: "Fresh from the pot — fate has chosen!",
    enchanted: "The spell is cast — fate has chosen!",
    ocean: "Washed ashore — fate has chosen!",
    botanical: "Freshly picked — fate has chosen!",
    sugar: "Fresh out of the oven — fate has chosen!",
  },
} satisfies Record<string, Record<ThemeId, Line>>;
