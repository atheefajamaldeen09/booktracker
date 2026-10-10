"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { GENRES, tidyGenre } from "@/lib/genres";

// Genres as chips, with a search box that suggests from the full list.
// Type to filter, pick one, or press Enter / comma to add your own.
export default function GenrePicker({
  value,
  onChange,
  background = "var(--surface)",
}: {
  value: string[];
  onChange: (genres: string[]) => void;
  // Matches the other inputs of the form it sits in
  background?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);

  const chosen = new Set(value.map((g) => g.toLowerCase()));
  const q = query.trim().toLowerCase();

  // Genres that start with what you typed come before ones that only contain it
  const matches = GENRES.filter((g) => !chosen.has(g.toLowerCase()) && g.toLowerCase().includes(q)).sort(
    (a, b) => Number(b.toLowerCase().startsWith(q)) - Number(a.toLowerCase().startsWith(q))
  );
  const custom = q && !chosen.has(q) && !GENRES.some((g) => g.toLowerCase() === q) ? tidyGenre(query) : null;
  const options = custom ? [...matches, custom] : matches;

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  // Adds genres, skipping blanks and ones already there
  const add = (raw: string[]) => {
    const next = [...value];
    raw.map(tidyGenre).forEach((g) => {
      if (g && !next.some((n) => n.toLowerCase() === g.toLowerCase())) next.push(g);
    });
    if (next.length !== value.length) onChange(next);
  };

  const pick = (genre: string) => {
    add([genre]);
    setQuery("");
    setActive(0);
    inputRef.current?.focus();
  };

  const remove = (genre: string) => onChange(value.filter((g) => g !== genre));

  const type = (text: string) => {
    setOpen(true);
    setActive(0);
    // A comma finishes a genre, so typing or pasting "Fantasy, Romance" just works
    if (text.includes(",")) {
      const parts = text.split(",");
      add(parts.slice(0, -1));
      setQuery(parts[parts.length - 1].trimStart());
    } else {
      setQuery(text);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && options[active]) pick(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && !query && value.length > 0) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          alignItems: "center",
          padding: "7px 10px",
          backgroundColor: background,
          border: `1px solid ${open ? "var(--primary)" : "var(--border)"}`,
          borderRadius: "10px",
          cursor: "text",
        }}
      >
        {value.map((genre) => (
          <span
            key={genre}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 6px 4px 10px",
              backgroundColor: "var(--raised)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              color: "var(--text)",
              fontSize: "13px",
            }}
          >
            {genre}
            <button
              type="button"
              aria-label={`Remove ${genre}`}
              onClick={(e) => {
                e.stopPropagation();
                remove(genre);
              }}
              style={{
                display: "grid",
                placeItems: "center",
                padding: "2px",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          role="combobox"
          aria-label="Search genres"
          aria-expanded={open}
          aria-controls="genre-options"
          aria-autocomplete="list"
          value={query}
          onChange={(e) => type(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Don't lose a genre you typed but never confirmed
            add([query]);
            setQuery("");
            setOpen(false);
          }}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? "Search genres, e.g. Fantasy" : "Add another…"}
          style={{
            flex: "1 1 140px",
            minWidth: 0,
            padding: "4px",
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--text)",
            fontSize: "14px",
          }}
        />
      </div>

      {open && options.length > 0 && (
        <ul
          id="genre-options"
          role="listbox"
          // Keep focus in the search box while you click or scroll the list
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            maxHeight: "240px",
            overflowY: "auto",
            margin: 0,
            padding: "6px",
            listStyle: "none",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {options.map((genre, i) => (
            <li
              key={genre}
              ref={i === active ? activeRef : undefined}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(genre)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                backgroundColor: i === active ? "var(--raised)" : "transparent",
                color: "var(--text)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {genre === custom ? (
                <>
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>+ Add</span> “{genre}”
                </>
              ) : (
                genre
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
