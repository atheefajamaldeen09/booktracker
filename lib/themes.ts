// Shared by the server layout (pre-paint script) and client theme pickers

export const THEMES = [
  {
    id: "cafe",
    name: "Café au Lait",
    mood: "Cosy & warm",
    emoji: "☕",
    colors: { bg: "#17100b", surface: "#2f2117", primary: "#d08c4f", accent: "#e2bb76", text: "#f4e9da" },
  },
  {
    id: "enchanted",
    name: "Enchanted Library",
    mood: "Magical & moody",
    emoji: "🕯️",
    colors: { bg: "#130f1c", surface: "#271e36", primary: "#c9a45c", accent: "#b58cd9", text: "#efe7f7" },
  },
  {
    id: "ocean",
    name: "Midnight Ocean",
    mood: "Calm & dreamy",
    emoji: "🌙",
    colors: { bg: "#0a1220", surface: "#17263d", primary: "#5cc2c7", accent: "#a9c7ee", text: "#e6eef8" },
  },
  {
    id: "botanical",
    name: "Botanical",
    mood: "Fresh & airy",
    emoji: "🌿",
    colors: { bg: "#f3efe4", surface: "#fbf8f0", primary: "#4f7a4a", accent: "#c27a4e", text: "#26301f" },
  },
  {
    id: "sugar",
    name: "Sugar & Ink",
    mood: "Sweet & playful",
    emoji: "🧁",
    colors: { bg: "#fbf1f3", surface: "#fffafb", primary: "#c2577a", accent: "#2e2a4a", text: "#231f33" },
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const THEME_STORAGE_KEY = "booktracker-theme";
export const DEFAULT_THEME: ThemeId = "cafe";
export const THEME_CHANGE_EVENT = "booktracker-themechange";

// Runs in <head> before first paint so the saved theme never flashes
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(${JSON.stringify(THEMES.map((t) => t.id))}.indexOf(t)>-1){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;
