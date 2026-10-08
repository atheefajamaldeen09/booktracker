"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getEligibleTBRBooks,
  getAllBooksWithTags,
  getAllSeriesInTBR,
} from "@/lib/actions/books";
import SpinningWheel from "@/components/pickers/SpinningWheel";
import SlotMachine from "@/components/pickers/SlotMachine";
import CardFlip from "@/components/pickers/CardFlip";
import FilterPanel from "@/components/pickers/FilterPanel";
import WinnerPopup from "@/components/pickers/WinnerPopup";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  genres: string[] | null;
  pageCount: number | null;
  series?: {
    seriesId: number;
    seriesName: string;
    position: number;
  } | null;
};

type PickerMode = "wheel" | "slots" | "cards";

const modes: { id: PickerMode; icon: string; label: string }[] = [
  { id: "wheel", icon: "🎡", label: "Wheel" },
  { id: "slots", icon: "🎰", label: "Slots" },
  { id: "cards", icon: "🃏", label: "Cards" },
];

function parseMode(value: string | null): PickerMode {
  return value === "slots" || value === "cards" ? value : "wheel";
}

export default function RandomPickerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<PickerMode>(parseMode(searchParams.get("mode")));
  const [books, setBooks] = useState<Book[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [allSeries, setAllSeries] = useState<
    { seriesId: number; seriesName: string }[]
  >([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [spinSignal, setSpinSignal] = useState(0);

  const [filters, setFilters] = useState({
    genres: [] as string[],
    seriesId: null as number | null,
    minPages: null as number | null,
    maxPages: null as number | null,
    onlyStandalone: false,
  });

  // Filter options only need to be loaded once
  useEffect(() => {
    const loadOptions = async () => {
      const [{ books: allBooks }, { series: seriesInTBR }] = await Promise.all([
        getAllBooksWithTags(),
        getAllSeriesInTBR(),
      ]);
      const genres = new Set<string>();
      allBooks
        .filter((b) => b.shelf === "tbr")
        .forEach((book) => book.genres?.forEach((g) => genres.add(g)));
      setAllGenres(Array.from(genres).sort());
      setAllSeries(seriesInTBR);
    };
    loadOptions();
  }, []);

  // Eligible books reload whenever filters change
  useEffect(() => {
    let cancelled = false;
    const fetchBooks = async () => {
      setRefreshing(true);

      const activeFilters: {
        genres?: string[];
        seriesId?: number;
        minPages?: number;
        maxPages?: number;
        onlyStandalone?: boolean;
      } = {};

      if (filters.genres.length > 0) activeFilters.genres = filters.genres;
      if (filters.seriesId) activeFilters.seriesId = filters.seriesId;
      if (filters.minPages) activeFilters.minPages = filters.minPages;
      if (filters.maxPages) activeFilters.maxPages = filters.maxPages;
      if (filters.onlyStandalone) activeFilters.onlyStandalone = true;

      const { books: eligibleBooks } = await getEligibleTBRBooks(
        Object.keys(activeFilters).length > 0 ? activeFilters : undefined
      );
      if (cancelled) return;
      setBooks(eligibleBooks);
      setRefreshing(false);
      setInitialLoading(false);
    };

    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const changeMode = (next: PickerMode) => {
    setMode(next);
    setSelectedBook(null);
    setSpinSignal(0); // don't auto-spin the newly shown picker
    router.replace(`/random-picker?mode=${next}`, { scroll: false });
  };

  const handleRespin = () => {
    setSelectedBook(null);
    // Give the popup a moment to close before the next spin starts
    setTimeout(() => setSpinSignal((n) => n + 1), 250);
  };

  const hasFilters =
    filters.genres.length > 0 ||
    filters.seriesId !== null ||
    filters.minPages !== null ||
    filters.maxPages !== null ||
    filters.onlyStandalone;

  if (initialLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
      <PageHeader
        eyebrow="Random book picker"
        title="What should I read next?"
        subtitle={
          <>
            {books.length} eligible {books.length === 1 ? "book" : "books"} in your TBR
            <span style={{ color: "var(--text-faint)" }}>
              {" "}· series books only appear when they&apos;re next in line
            </span>
          </>
        }
        action={
          <FilterPanel
            allGenres={allGenres}
            allSeries={allSeries}
            filters={filters}
            onFilterChange={setFilters}
          />
        }
      />

      {/* Mode switcher */}
      <div
        role="tablist"
        style={{
          display: "inline-flex",
          gap: "4px",
          padding: "4px",
          marginBottom: "32px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
        }}
      >
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={active}
              onClick={() => changeMode(m.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 16px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: active ? "var(--primary)" : "transparent",
                color: active ? "var(--on-primary)" : "var(--text-muted)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.15s, color 0.15s",
              }}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          );
        })}
      </div>

      <div style={{ opacity: refreshing ? 0.5 : 1, transition: "opacity 0.2s" }}>
        {books.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "var(--surface)",
              border: "1px dashed var(--border)",
              borderRadius: "18px",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
            <h2 style={{ color: "var(--text)", fontSize: "20px", marginBottom: "8px" }}>
              No books available
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
              {hasFilters
                ? "No books match your current filters. Try adjusting them."
                : "Add some books to your TBR to use the random picker!"}
            </p>
            {!hasFilters && (
              <button
                onClick={() => router.push("/add")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "var(--primary)",
                  color: "var(--on-primary)",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                + Add Books
              </button>
            )}
          </div>
        ) : (
          <>
            {mode === "wheel" && (
              <SpinningWheel books={books} onSelect={setSelectedBook} spinSignal={spinSignal} />
            )}
            {mode === "slots" && (
              <SlotMachine books={books} onSelect={setSelectedBook} spinSignal={spinSignal} />
            )}
            {mode === "cards" && (
              <CardFlip
                // New deck whenever the eligible books change (e.g. filters)
                key={books.map((b) => b.id).join(",")}
                books={books}
                onSelect={setSelectedBook}
                spinSignal={spinSignal}
              />
            )}
          </>
        )}
      </div>

      {selectedBook && (
        <WinnerPopup
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onRespin={books.length > 1 ? handleRespin : undefined}
        />
      )}
    </div>
  );
}
