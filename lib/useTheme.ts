"use client";

import { useSyncExternalStore } from "react";
import { THEMES, THEME_STORAGE_KEY, THEME_CHANGE_EVENT, DEFAULT_THEME, type ThemeId } from "./themes";

const isTheme = (value: string | null): value is ThemeId => THEMES.some((t) => t.id === value);

function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  // Cross-fade colors for a moment instead of snapping
  root.classList.add("theme-switching");
  root.setAttribute("data-theme", id);
  window.setTimeout(() => root.classList.remove("theme-switching"), 400);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEMES.find((t) => t.id === id)!.colors.bg);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function readTheme(): ThemeId {
  const current = document.documentElement.getAttribute("data-theme");
  return isTheme(current) ? current : DEFAULT_THEME;
}

function subscribe(onChange: () => void) {
  // Keep other open tabs in sync too
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY && isTheme(e.newValue)) applyTheme(e.newValue);
  };
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function setTheme(id: ThemeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // Storage blocked — the theme still applies for this visit
  }
  applyTheme(id);
}

export function useTheme(): ThemeId {
  return useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
}
