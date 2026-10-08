"use client";

import { useEffect, useState } from "react";

export type SpineColor = {
  spine: string; // cloth color of the spine
  dark: string; // back cover / shading
  text: string; // title ink
  foil: string; // decorative bands
  hue: number; // used for the rainbow sort
};

const CACHE_KEY = "bookshelf-spine-colors-v1";

// Muted bookcloth colors for books without a usable cover
const CLOTH = ["#7a3b2e", "#2f4a3a", "#2c3e5c", "#8a6a2f", "#5a2f4a", "#3f3a36", "#9b5b3b", "#46607a", "#6b7a3a", "#7d2f3f"];

export function hashString(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (Math.imul(hash, 31) + text.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return [h, s, l];
}

const hsl = (h: number, s: number, l: number) =>
  `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;

// Turn any picked color into something that looks like a cloth-bound spine
function toSpine(h: number, s: number, l: number): SpineColor {
  const sat = Math.min(s, 0.62);
  const light = Math.min(Math.max(l, 0.2), 0.6);
  return {
    spine: hsl(h, sat, light),
    dark: hsl(h, sat, light * 0.6),
    text: light > 0.5 ? "#1e130b" : "#f6ecdc",
    foil: light > 0.5 ? "rgba(30,19,11,0.55)" : "rgba(240,205,140,0.85)",
    hue: sat < 0.12 ? 400 + light : h, // greys sort after the rainbow
  };
}

export function fallbackColor(title: string): SpineColor {
  const hex = CLOTH[hashString(title) % CLOTH.length];
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return toSpine(...rgbToHsl(r, g, b));
}

// Most prominent color of an image: bucket pixels by hue, weighted by
// saturation, so a bold title band beats a big flat background
function dominantColor(img: HTMLImageElement): SpineColor | null {
  const canvas = document.createElement("canvas");
  canvas.width = 24;
  canvas.height = 36;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const buckets = Array.from({ length: 12 }, () => ({ w: 0, r: 0, g: 0, b: 0 }));
  let total = { n: 0, r: 0, g: 0, b: 0 };

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    total = { n: total.n + 1, r: total.r + r, g: total.g + g, b: total.b + b };
    const [h, s, l] = rgbToHsl(r, g, b);
    if (l < 0.08 || l > 0.92 || s < 0.18) continue;
    const bucket = buckets[Math.floor(h / 30) % 12];
    const weight = s * (1 - Math.abs(l - 0.5));
    bucket.w += weight;
    bucket.r += r * weight;
    bucket.g += g * weight;
    bucket.b += b * weight;
  }

  if (total.n === 0) return null;
  const best = buckets.reduce((a, b) => (b.w > a.w ? b : a));

  // Mostly black-and-white covers keep their overall tone instead
  if (best.w < total.n * 0.04) {
    return toSpine(...rgbToHsl(total.r / total.n, total.g / total.n, total.b / total.n));
  }
  return toSpine(...rgbToHsl(best.r / best.w, best.g / best.w, best.b / best.w));
}

function readCache(): Record<string, SpineColor> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, SpineColor>) {
  try {
    // Uploaded covers are huge data: URLs — cheap to re-read, too big to store as keys
    const small = Object.fromEntries(Object.entries(cache).filter(([url]) => !url.startsWith("data:")));
    localStorage.setItem(CACHE_KEY, JSON.stringify(small));
  } catch {
    // Storage full or blocked — colors are just recalculated next visit
  }
}

function loadColor(url: string): Promise<SpineColor | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      try {
        resolve(dominantColor(img));
      } catch {
        // The image host didn't allow reading pixels
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// Spine colors keyed by cover URL. Starts with whatever is cached and fills in
// the rest in the background; books show their fallback color until then.
export function useSpineColors(covers: (string | null)[]) {
  const [colors, setColors] = useState<Record<string, SpineColor>>(() =>
    typeof window === "undefined" ? {} : readCache()
  );
  const key = covers.filter(Boolean).join("|");

  useEffect(() => {
    let cancelled = false;
    const cache = readCache();
    const pending = Array.from(new Set(key.split("|").filter((url) => url && !cache[url])));
    if (pending.length === 0) return;

    let index = 0;
    const worker = async () => {
      while (!cancelled && index < pending.length) {
        const url = pending[index++];
        const color = await loadColor(url);
        if (cancelled) return;
        if (color) {
          cache[url] = color;
          setColors((prev) => ({ ...prev, [url]: color }));
        }
      }
    };

    // A few covers at a time so a big library doesn't flood the network
    Promise.all(Array.from({ length: 4 }, worker)).then(() => {
      if (!cancelled) writeCache(cache);
    });

    return () => {
      cancelled = true;
      writeCache(cache);
    };
  }, [key]);

  return colors;
}
