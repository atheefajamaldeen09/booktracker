// Reading bingo: a 5 × 5 card of little reading prompts. You stamp a square
// with a book you finished after the card was dealt; each book stamps one square.

// What a prompt can look at to suggest books that fit
export type BingoBook = {
  id: number;
  title: string;
  author: string;
  cover: string | null;
  genres: string[];
  moods: string[];
  pageCount: number | null;
  publicationYear: number | null;
  rating: number | null;
  favorite: boolean;
  hasReview: boolean;
  hasQuote: boolean;
  // Place in a series, or null for a standalone
  seriesPosition: number | null;
  // Days from starting to finishing, when both dates are known
  daysToRead: number | null;
  // Days it sat in your library before you finished it
  daysWaited: number | null;
  // You'd already finished another book by this author
  authorReadBefore: boolean;
  finishedYear: number | null;
  finishedOn: string | null;
};

export type BingoPrompt = {
  id: string;
  emoji: string;
  text: string;
  // Books this is true for are suggested first. Any book can still be used:
  // you know better than the app whether the cover was blue.
  fits?: (book: BingoBook) => boolean;
};

const genre = (...words: string[]) => (b: BingoBook) =>
  b.genres.some((g) => words.some((w) => g.toLowerCase().includes(w)));
const mood = (...ids: string[]) => (b: BingoBook) => b.moods.some((m) => ids.includes(m));
const words = (title: string) => title.trim().split(/\s+/).filter(Boolean);
const COLOURS = /\b(red|blue|green|gold|golden|silver|black|white|pink|rose|violet|purple|scarlet|crimson|grey|gray|yellow|orange|emerald|ruby|ivory|amber)\b/i;
const NUMBERS = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|hundred|thousand|first|second|third)\b/i;

export const BINGO_PROMPTS: BingoPrompt[] = [
  // ── Things the app can spot ──
  { id: "chunky", emoji: "🧱", text: "A chunky book, 500+ pages", fits: (b) => (b.pageCount ?? 0) >= 500 },
  { id: "short", emoji: "🍪", text: "A little book under 200 pages", fits: (b) => !!b.pageCount && b.pageCount < 200 },
  { id: "middling", emoji: "📏", text: "Between 300 and 400 pages", fits: (b) => !!b.pageCount && b.pageCount >= 300 && b.pageCount <= 400 },
  { id: "five-star", emoji: "🌟", text: "A five-star read", fits: (b) => (b.rating ?? 0) >= 5 },
  { id: "new-favourite", emoji: "💖", text: "A new favourite", fits: (b) => b.favorite },
  { id: "it-was-fine", emoji: "🤷", text: "An “it was fine” three stars", fits: (b) => !!b.rating && b.rating >= 2.5 && b.rating <= 3.5 },
  { id: "series-start", emoji: "🚪", text: "First book in a series", fits: (b) => b.seriesPosition === 1 },
  { id: "sequel", emoji: "➡️", text: "The next book in a series", fits: (b) => (b.seriesPosition ?? 0) >= 2 },
  { id: "standalone", emoji: "🌳", text: "A standalone", fits: (b) => b.seriesPosition === null },
  { id: "before-2000", emoji: "📼", text: "Published before 2000", fits: (b) => !!b.publicationYear && b.publicationYear < 2000 },
  { id: "classic", emoji: "🕰️", text: "A classic from before 1950", fits: (b) => !!b.publicationYear && b.publicationYear < 1950 },
  { id: "new-release", emoji: "🗞️", text: "Read the year it came out", fits: (b) => !!b.publicationYear && b.publicationYear === b.finishedYear },
  { id: "recent", emoji: "🌱", text: "Published in the last 5 years", fits: (b) => !!b.publicationYear && !!b.finishedYear && b.finishedYear - b.publicationYear <= 5 },
  { id: "one-word", emoji: "☝️", text: "A one-word title", fits: (b) => words(b.title).length === 1 },
  { id: "long-title", emoji: "📜", text: "A title with 5 or more words", fits: (b) => words(b.title).length >= 5 },
  { id: "colour-title", emoji: "🎨", text: "A colour in the title", fits: (b) => COLOURS.test(b.title) },
  { id: "number-title", emoji: "🔢", text: "A number in the title", fits: (b) => NUMBERS.test(b.title) },
  { id: "the-title", emoji: "🎩", text: "A title starting with “The”", fits: (b) => /^the\s/i.test(b.title.trim()) },
  { id: "new-author", emoji: "👋", text: "An author who's new to you", fits: (b) => !b.authorReadBefore },
  { id: "old-friend", emoji: "🫶", text: "An author you've read before", fits: (b) => b.authorReadBefore },
  { id: "quick", emoji: "⚡", text: "Finished in 3 days or less", fits: (b) => b.daysToRead !== null && b.daysToRead <= 3 },
  { id: "slow", emoji: "🐌", text: "Took you over two weeks", fits: (b) => b.daysToRead !== null && b.daysToRead > 14 },
  { id: "dusty", emoji: "🕸️", text: "Waited on your shelf for a year", fits: (b) => b.daysWaited !== null && b.daysWaited >= 365 },
  { id: "impulse", emoji: "🛍️", text: "Read within a week of getting it", fits: (b) => b.daysWaited !== null && b.daysWaited <= 7 },
  { id: "reviewed", emoji: "✍️", text: "A book you wrote a review for", fits: (b) => b.hasReview },
  { id: "quoted", emoji: "🔖", text: "A book you saved a quote from", fits: (b) => b.hasQuote },
  { id: "fantasy", emoji: "🐉", text: "A fantasy", fits: genre("fantasy") },
  { id: "romance", emoji: "💌", text: "A romance", fits: genre("romance", "love") },
  { id: "mystery", emoji: "🔍", text: "A mystery or thriller", fits: genre("mystery", "thriller", "crime", "detective", "suspense") },
  { id: "sci-fi", emoji: "🚀", text: "Science fiction", fits: genre("science fiction", "sci-fi", "dystopia") },
  { id: "historical", emoji: "🏰", text: "Historical fiction", fits: genre("histor") },
  { id: "true-story", emoji: "🧾", text: "Non-fiction or a memoir", fits: genre("nonfiction", "non-fiction", "biograph", "memoir", "history", "science", "self-help", "essay") },
  { id: "young", emoji: "🎒", text: "A YA or children's book", fits: genre("young adult", "juvenile", "children", "ya ") },
  { id: "spooky", emoji: "👻", text: "Something spooky", fits: (b) => genre("horror", "ghost", "gothic")(b) || mood("spooky", "dark")(b) },
  { id: "cosy", emoji: "☕", text: "A cosy read", fits: mood("cosy", "wholesome") },
  { id: "tearjerker", emoji: "😭", text: "A book that made you cry", fits: mood("emotional", "heartbreaking", "bittersweet") },
  { id: "funny", emoji: "😂", text: "A book that made you laugh", fits: mood("funny") },
  { id: "twisty", emoji: "🌀", text: "A twist you didn't see coming", fits: mood("twisty", "whodunit", "mysterious") },
  { id: "magical", emoji: "🪄", text: "Magic on every page", fits: mood("magical", "whimsical") },
  { id: "adventure", emoji: "🗺️", text: "A grand adventure", fits: mood("adventurous", "epic") },

  // ── Your call ──
  { id: "blue-cover", emoji: "💙", text: "A blue cover" },
  { id: "pink-cover", emoji: "🌸", text: "A pink cover" },
  { id: "green-cover", emoji: "🌿", text: "A green cover" },
  { id: "pretty-cover", emoji: "😍", text: "Picked for its pretty cover" },
  { id: "animal-cover", emoji: "🦊", text: "An animal on the cover" },
  { id: "recommended", emoji: "💬", text: "Someone recommended it" },
  { id: "gift", emoji: "🎁", text: "A gift or a borrowed book" },
  { id: "re-read", emoji: "🔁", text: "A re-read" },
  { id: "one-sitting", emoji: "🛋️", text: "Read in one sitting" },
  { id: "late-night", emoji: "🌙", text: "Kept you up past bedtime" },
  { id: "outdoors", emoji: "🌤️", text: "Read outdoors" },
  { id: "rainy-day", emoji: "🌧️", text: "Read on a rainy day" },
  { id: "far-away", emoji: "✈️", text: "Set in a country you've never visited" },
  { id: "translated", emoji: "🌍", text: "A translated book" },
  { id: "debut", emoji: "🐣", text: "An author's first book" },
  { id: "has-a-map", emoji: "🧭", text: "A book with a map inside" },
  { id: "found-family", emoji: "🏡", text: "A found family" },
  { id: "bookish", emoji: "📚", text: "A book about books" },
  { id: "food", emoji: "🥐", text: "Made you hungry" },
  { id: "winter", emoji: "❄️", text: "Set in winter" },
  { id: "seaside", emoji: "🌊", text: "Set by the sea" },
  { id: "villain", emoji: "🦹", text: "A villain you secretly liked" },
  { id: "hyped", emoji: "📣", text: "Everyone was talking about it" },
  { id: "hidden-gem", emoji: "💎", text: "A hidden gem nobody mentions" },
  { id: "your-initial", emoji: "🔤", text: "Title starts with your initial" },
  { id: "screen", emoji: "🎬", text: "It's also a film or a show" },
];

export const promptById = (id: string) => BINGO_PROMPTS.find((p) => p.id === id);

// The middle square is free, as on a real bingo card
export const FREE_INDEX = 12;
export const SQUARES = 25;
export const FREE = "free";

export type BingoCard = {
  // Card number: 1 for your first, going up each time you deal a new one
  round: number;
  startedAt: string;
  // 25 prompt ids in reading order, with FREE in the middle
  squares: string[];
  // prompt id → the book stamped on it
  stamps: Record<string, number>;
};

const shuffle = <T,>(list: T[]) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// Deals 24 prompts. A new card keeps a handful from the last one (never more
// than a quarter), so every card feels fresh without being a total stranger.
export function dealSquares(previous: string[] = []): string[] {
  const old = previous.filter((id) => id !== FREE && promptById(id));
  const fresh = BINGO_PROMPTS.map((p) => p.id).filter((id) => !old.includes(id));
  const keep = old.length > 0 ? 2 + Math.floor(Math.random() * 5) : 0; // 2 to 6 repeats
  const picked = shuffle([...shuffle(old).slice(0, keep), ...shuffle(fresh).slice(0, SQUARES - 1 - keep)]);
  return [...picked.slice(0, FREE_INDEX), FREE, ...picked.slice(FREE_INDEX)];
}

// The 12 lines that make a bingo: 5 rows, 5 columns and 2 diagonals
export const BINGO_LINES: number[][] = [
  ...Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => r * 5 + c)),
  ...Array.from({ length: 5 }, (_, c) => Array.from({ length: 5 }, (_, r) => r * 5 + c)),
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export const isStamped = (card: BingoCard, index: number) =>
  index === FREE_INDEX || card.stamps[card.squares[index]] !== undefined;

export const completedLines = (card: BingoCard) =>
  BINGO_LINES.filter((line) => line.every((i) => isStamped(card, i)));
