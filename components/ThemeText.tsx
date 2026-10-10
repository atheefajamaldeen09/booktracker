import { THEMES } from "@/lib/themes";
import { COPY, type CopyId } from "@/lib/themeCopy";

// Wording that follows the theme. Every theme's line is in the page and CSS
// (globals.css, "Theme wording") shows the current one, so it's right from
// the first paint with no flash — and it works in server components too.
export default function ThemeText({ id, n = 0 }: { id: CopyId; n?: number }) {
  const lines = COPY[id];
  return (
    <span className="theme-text">
      {THEMES.map((t) => {
        const line = lines[t.id];
        return (
          <span key={t.id} data-theme-line={t.id}>
            {typeof line === "function" ? line(n) : line}
          </span>
        );
      })}
    </span>
  );
}
