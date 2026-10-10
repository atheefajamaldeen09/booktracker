// Moods you can tag a book with; the random picker can choose by them
export const MOODS = [
  { id: "cosy", label: "Cosy", emoji: "☕" },
  { id: "funny", label: "Funny", emoji: "😂" },
  { id: "romantic", label: "Romantic", emoji: "💕" },
  { id: "hopeful", label: "Hopeful", emoji: "🌱" },
  { id: "emotional", label: "Emotional", emoji: "💧" },
  { id: "reflective", label: "Reflective", emoji: "🌙" },
  { id: "adventurous", label: "Adventurous", emoji: "🗺️" },
  { id: "fast-paced", label: "Fast-paced", emoji: "⚡" },
  { id: "mysterious", label: "Mysterious", emoji: "🔍" },
  { id: "tense", label: "Tense", emoji: "😰" },
  { id: "dark", label: "Dark", emoji: "🌑" },
  { id: "whimsical", label: "Whimsical", emoji: "✨" },
  { id: "whodunit", label: "Whodunit", emoji: "🕵️" },
  { id: "thrilling", label: "Thrilling", emoji: "🔪" },
  { id: "twisty", label: "Twisty", emoji: "🌀" },
  { id: "spooky", label: "Spooky", emoji: "👻" },
  { id: "gritty", label: "Gritty", emoji: "🪨" },
  { id: "heartbreaking", label: "Heartbreaking", emoji: "💔" },
  { id: "wholesome", label: "Wholesome", emoji: "🧸" },
  { id: "spicy", label: "Spicy", emoji: "🌶️" },
  { id: "slow-burn", label: "Slow burn", emoji: "🕯️" },
  { id: "epic", label: "Epic", emoji: "⚔️" },
  { id: "magical", label: "Magical", emoji: "🪄" },
  { id: "thought-provoking", label: "Thought-provoking", emoji: "🧠" },
  { id: "inspiring", label: "Inspiring", emoji: "🌟" },
  { id: "nostalgic", label: "Nostalgic", emoji: "📻" },
  { id: "bittersweet", label: "Bittersweet", emoji: "🍂" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

export const moodById = (id: string) => MOODS.find((m) => m.id === id);
