"use client";

import { useMemo, useSyncExternalStore } from "react";

// Spine text is sized by arithmetic on canvas text measurements rather than by
// measuring the DOM, which is unreliable for vertical text in 3D transforms.
// The title stays on one line and the author sits on a second, smaller line;
// long titles shrink rather than wrap.

const MIN_SIZE = 6;
const MAX_SIZE = 19;
const AUTHOR_SHARE = 0.6; // author size as a share of the title size
const LINE_HEIGHT = 1.1; // matches .title and .author
const AUTHOR_GAP = 0.2; // em, matches .author margin
// Matches the weight and letter spacing of .title and .author
const TITLE_FONT = { variable: "--font-heading", weight: 600, spacing: 0.02 };
const AUTHOR_FONT = { variable: "--font-body", weight: 500, spacing: 0.03 };

let context: CanvasRenderingContext2D | null = null;
const families = new Map<string, string>();

// The real font stack behind a font variable
function family(variable: string) {
  let found = families.get(variable);
  if (!found) {
    const probe = document.createElement("span");
    probe.style.fontFamily = `var(${variable})`;
    document.body.appendChild(probe);
    found = getComputedStyle(probe).fontFamily || "serif";
    probe.remove();
    families.set(variable, found);
  }
  return found;
}

// Width of a line of text set at 1px
function lineWidth(text: string, font: typeof TITLE_FONT) {
  context ??= document.createElement("canvas").getContext("2d");
  if (!context) return text.length * 0.6;
  context.font = `${font.weight} 100px ${family(font.variable)}`;
  return (context.measureText(text).width + text.length * font.spacing * 100) / 100;
}

// Largest sizes at which both lines fit a spine area `across` px wide and
// `along` px long
export function spineFontSizes(title: string, author: string, across: number, along: number) {
  const titleWidth = lineWidth(title, TITLE_FONT);
  const authorWidth = author ? lineWidth(author, AUTHOR_FONT) : 0;
  // Both lines together across the spine
  const stack = author ? LINE_HEIGHT + AUTHOR_SHARE * (LINE_HEIGHT + AUTHOR_GAP) : LINE_HEIGHT;
  const titleSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, across / stack, along / titleWidth));
  const authorSize = authorWidth
    ? Math.max(MIN_SIZE * 0.8, Math.min(titleSize * AUTHOR_SHARE, along / authorWidth))
    : 0;
  return { title: Math.floor(titleSize * 10) / 10, author: Math.floor(authorSize * 10) / 10 };
}

const subscribeFonts = (onChange: () => void) => {
  document.fonts?.addEventListener("loadingdone", onChange);
  return () => document.fonts?.removeEventListener("loadingdone", onChange);
};

export function useSpineFontSizes(title: string, author: string, across: number, along: number) {
  // Re-measure once web fonts finish loading
  const fontsReady = useSyncExternalStore(
    subscribeFonts,
    () => document.fonts?.status ?? "loaded",
    () => "loading"
  );
  return useMemo(() => {
    void fontsReady;
    return spineFontSizes(title, author, across, along);
  }, [title, author, across, along, fontsReady]);
}
