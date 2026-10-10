// The stickers in your achievement book. Whether each one is earned is
// worked out from your library in lib/actions/achievements.ts.

export type ChapterId = "milestones" | "habits" | "pages" | "heart" | "explorer" | "library";

export const CHAPTERS: { id: ChapterId; title: string; tab: string; subtitle: string; tape: string }[] = [
  { id: "milestones", title: "Milestones", tab: "Books", subtitle: "Books you've finished", tape: "#e3a3a0" },
  { id: "habits", title: "Little Habits", tab: "Habits", subtitle: "Showing up for your books", tape: "#d9a441" },
  { id: "pages", title: "Pages & Hours", tab: "Pages", subtitle: "Every page adds up", tape: "#8fa58a" },
  { id: "heart", title: "Heart & Thoughts", tab: "Heart", subtitle: "Books that stayed with you", tape: "#7d97b3" },
  { id: "explorer", title: "Adventures", tab: "Adventures", subtitle: "Wandering off the usual path", tape: "#b58aa5" },
  { id: "library", title: "Little Library", tab: "Library", subtitle: "The books around you", tape: "#c8674f" },
];

export type AchievementDef = {
  id: string;
  chapter: ChapterId;
  name: string;
  // What it's for, shown under the sticker
  description: string;
  // Printed around the top of the sticker, like a real badge
  label: string;
  // Count needed, for stickers that show progress ("7 / 10")
  target?: number;
  // What's being counted, for "3 more books"
  unit?: string;
  // Counted in minutes but shown in hours
  hours?: boolean;
  // Sticker background
  color: string;
};

// Sticker colours: warm and muted, like the paper they're stuck on
const BLUSH = "#e3a3a0";
const SAGE = "#8fa58a";
const MUSTARD = "#d9a441";
const TERRACOTTA = "#c8674f";
const DUSK = "#7d97b3";
const PLUM = "#9a6a8a";
const TEAL = "#5f8a86";
const NIGHT = "#4e5d82";
const PEACH = "#e8a87c";
const MOSS = "#7a8f5a";

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── Milestones ──
  { id: "shelf-starter", chapter: "milestones", name: "Shelf Starter", description: "Finish 25 books", label: "25 BOOKS", target: 25, unit: "book", color: PEACH },
  { id: "bookworm", chapter: "milestones", name: "Bookworm", description: "Finish 50 books", label: "50 BOOKS", target: 50, unit: "book", color: SAGE },
  { id: "book-stack", chapter: "milestones", name: "Book Stack", description: "Finish 100 books", label: "100 BOOKS", target: 100, unit: "book", color: MUSTARD },
  { id: "bibliophile", chapter: "milestones", name: "Bibliophile", description: "Finish 200 books", label: "200 BOOKS", target: 200, unit: "book", color: BLUSH },
  { id: "library-legend", chapter: "milestones", name: "Library Legend", description: "Finish 300 books", label: "300 BOOKS", target: 300, unit: "book", color: PLUM },
  { id: "book-dragon", chapter: "milestones", name: "Book Dragon", description: "Finish 500 books", label: "500 BOOKS", target: 500, unit: "book", color: TEAL },
  { id: "book-wizard", chapter: "milestones", name: "Book Wizard", description: "Finish 750 books", label: "750 BOOKS", target: 750, unit: "book", color: NIGHT },
  { id: "castle-of-tales", chapter: "milestones", name: "Castle of Tales", description: "Finish 1,000 books", label: "1,000 BOOKS", target: 1000, unit: "book", color: TERRACOTTA },

  // ── Habits ──
  { id: "cosy-week", chapter: "habits", name: "Cosy Week", description: "Read 7 days in a row", label: "7 DAY STREAK", target: 7, unit: "day", color: TERRACOTTA },
  { id: "moonlit-month", chapter: "habits", name: "Moonlit Month", description: "Read 30 days in a row", label: "30 DAY STREAK", target: 30, unit: "day", color: NIGHT },
  { id: "hundred-days", chapter: "habits", name: "Sunflower Season", description: "Read 100 days in a row", label: "100 DAYS", target: 100, unit: "day", color: MUSTARD },
  { id: "book-binge", chapter: "habits", name: "Book Binge", description: "Finish 8 books in one month", label: "8 IN A MONTH", target: 8, unit: "book", color: BLUSH },
  { id: "twelve-moons", chapter: "habits", name: "Twelve Moons", description: "Finish a book every month of a year", label: "EVERY MONTH", target: 12, unit: "month", color: DUSK },
  { id: "book-a-week", chapter: "habits", name: "Book a Week", description: "Finish 52 books in one year", label: "52 IN A YEAR", target: 52, unit: "book", color: PEACH },
  { id: "goal-getter", chapter: "habits", name: "Goal Getter", description: "Reach a yearly reading goal", label: "GOAL MET", color: SAGE },
  { id: "goal-crusher", chapter: "habits", name: "Overachiever", description: "Read more than your yearly goal", label: "ABOVE & BEYOND", color: PLUM },

  // ── Pages & hours ──
  { id: "page-turner", chapter: "pages", name: "Page Turner", description: "Read 10,000 pages", label: "10,000 PAGES", target: 10000, unit: "page", color: DUSK },
  { id: "paper-mountain", chapter: "pages", name: "Paper Mountain", description: "Read 50,000 pages", label: "50,000 PAGES", target: 50000, unit: "page", color: TERRACOTTA },
  { id: "ink-ocean", chapter: "pages", name: "Sea of Pages", description: "Read 100,000 pages", label: "100,000 PAGES", target: 100000, unit: "page", color: NIGHT },
  { id: "sunrise-sunset", chapter: "pages", name: "Sunrise to Sunset", description: "Read 150 pages in one day", label: "150 IN A DAY", target: 150, unit: "page", color: PEACH },
  { id: "tea-time", chapter: "pages", name: "Tea Time", description: "Time 25 hours of reading", label: "25 HOURS", target: 1500, unit: "hour", hours: true, color: SAGE },
  { id: "lost-in-time", chapter: "pages", name: "Lost in Time", description: "Time 100 hours of reading", label: "100 HOURS", target: 6000, unit: "hour", hours: true, color: PLUM },
  { id: "doorstopper", chapter: "pages", name: "Doorstopper", description: "Finish a book of 600+ pages", label: "600+ PAGES", color: TEAL },
  { id: "bite-sized", chapter: "pages", name: "Bite-Sized", description: "Finish a book under 150 pages", label: "QUICK READ", color: BLUSH },

  // ── Heart & thoughts ──
  { id: "heart-eyes", chapter: "heart", name: "Heart Eyes", description: "Give a book five stars", label: "FIVE STARS", color: BLUSH },
  { id: "rainy-review", chapter: "heart", name: "Rainy Review", description: "Rate a book 2 stars or less", label: "NOT FOR ME", color: DUSK },
  { id: "little-critic", chapter: "heart", name: "Little Critic", description: "Write 25 reviews", label: "25 REVIEWS", target: 25, unit: "review", color: TEAL },
  { id: "essayist", chapter: "heart", name: "The Essayist", description: "Write 100 reviews", label: "100 REVIEWS", target: 100, unit: "review", color: MOSS },
  { id: "quote-keeper", chapter: "heart", name: "Quote Keeper", description: "Save 25 quotes", label: "25 QUOTES", target: 25, unit: "quote", color: PLUM },
  { id: "quote-collector", chapter: "heart", name: "Treasure Hunter", description: "Save 100 quotes", label: "100 QUOTES", target: 100, unit: "quote", color: MUSTARD },
  { id: "sweetheart", chapter: "heart", name: "Sweetheart Shelf", description: "Mark 10 favourites", label: "10 FAVOURITES", target: 10, unit: "favourite", color: TERRACOTTA },
  { id: "mood-ring", chapter: "heart", name: "Mood Ring", description: "Tag moods on 25 books", label: "25 MOODS", target: 25, unit: "book", color: PEACH },

  // ── Adventures ──
  { id: "genre-hopper", chapter: "explorer", name: "Genre Hopper", description: "Read 10 different genres", label: "10 GENRES", target: 10, unit: "genre", color: SAGE },
  { id: "globetrotter", chapter: "explorer", name: "Globetrotter", description: "Read 25 different genres", label: "25 GENRES", target: 25, unit: "genre", color: DUSK },
  { id: "series-slayer", chapter: "explorer", name: "Series Slayer", description: "Finish a whole series", label: "SERIES DONE", color: MUSTARD },
  { id: "series-collector", chapter: "explorer", name: "Box Set", description: "Finish 5 whole series", label: "5 SERIES", target: 5, unit: "series", color: TERRACOTTA },
  { id: "author-fan", chapter: "explorer", name: "Number One Fan", description: "Read 10 books by one author", label: "10 BY ONE AUTHOR", target: 10, unit: "book", color: BLUSH },
  { id: "time-traveller", chapter: "explorer", name: "Time Traveller", description: "Read a book published before 1900", label: "PRE-1900", color: TEAL },
  { id: "fresh-ink", chapter: "explorer", name: "Fresh Ink", description: "Read a book the year it came out", label: "HOT OFF THE PRESS", color: NIGHT },
  { id: "letting-go", chapter: "explorer", name: "Letting Go", description: "Put down a book that wasn't for you", label: "LIFE'S TOO SHORT", color: PLUM },

  // ── Little library ──
  { id: "juggler", chapter: "library", name: "Juggler", description: "Read 3 books at the same time", label: "3 AT ONCE", target: 3, unit: "book", color: PEACH },
  { id: "wishful-thinking", chapter: "library", name: "Wishing Star", description: "Have 25 books on your wishlist", label: "25 WISHES", target: 25, unit: "book", color: NIGHT },
  { id: "tbr-mountain", chapter: "library", name: "TBR Mountain", description: "Have 100 books waiting on your TBR", label: "100 TO READ", target: 100, unit: "book", color: MOSS },
  { id: "curator", chapter: "library", name: "The Curator", description: "Keep 300 books in your library", label: "300 BOOKS OWNED", target: 300, unit: "book", color: TERRACOTTA },
];

export type AchievementStatus = {
  id: string;
  earned: boolean;
  // Progress toward the target, for stickers that have one
  current?: number;
  // "March 2024" — when it was earned, if we can tell
  earnedOn?: string | null;
  // "for The Stand" — the book that earned it, if there's one
  note?: string | null;
};
