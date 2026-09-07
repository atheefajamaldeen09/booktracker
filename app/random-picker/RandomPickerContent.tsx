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

export default function RandomPickerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as PickerMode) || "wheel";

  const [mode] = useState<PickerMode>(initialMode);
  const [books, setBooks] = useState<Book[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [allSeries, setAllSeries] = useState<
    { seriesId: number; seriesName: string }[]
  >([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    genres: [] as string[],
    seriesId: null as number | null,
    minPages: null as number | null,
    maxPages: null as number | null,
    onlyStandalone: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

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
      setBooks(eligibleBooks);

      const { books: allBooks } = await getAllBooksWithTags();
      const tbrBooks = allBooks.filter((b) => b.shelf === "tbr");
      const genres = new Set<string>();
      tbrBooks.forEach((book) => {
        book.genres?.forEach((g) => genres.add(g));
      });
      setAllGenres(Array.from(genres).sort());

      const { series: seriesInTBR } = await getAllSeriesInTBR();
      setAllSeries(seriesInTBR);

      setLoading(false);
    };

    fetchData();
  }, [filters]);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  const handleClosePopup = () => {
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <p style={{ color: "#A89070", fontSize: "16px" }}>
          Loading your books...
        </p>
      </div>
    );
  }

  const modeTitle = {
    wheel: "🎡 Spinning Wheel",
    slots: "🎰 Slot Machine",
    cards: "🃏 Card Draw",
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
      {/* Header with Filters */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "24px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Title and Description */}
        <div style={{ flex: "1 1 300px" }}>
          <h1
            style={{
              color: "#C8813A",
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {modeTitle[mode]}
          </h1>
          <p style={{ color: "#A89070", fontSize: "14px", marginBottom: "4px" }}>
            Can&apos;t decide what to read next? Let fate choose for you!
          </p>
          <p style={{ color: "#6B5040", fontSize: "13px" }}>
            {books.length} eligible {books.length === 1 ? "book" : "books"} in
            your TBR
          </p>
        </div>

        {/* Filters on the right */}
        <div style={{ flex: "0 0 auto" }}>
          <FilterPanel
            allGenres={allGenres}
            allSeries={allSeries}
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
      </div>

      {/* Picker Display */}
      {books.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#2A1C0F",
            border: "1px solid #4A3020",
            borderRadius: "14px",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📚</div>
          <h2
            style={{
              color: "#F5ECD7",
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            No books available
          </h2>
          <p
            style={{
              color: "#A89070",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {filters.genres.length > 0 ||
            filters.seriesId ||
            filters.onlyStandalone
              ? "No books match your current filters. Try adjusting them."
              : "Add some books to your TBR to use the random picker!"}
          </p>
          <button
            onClick={() => router.push("/add")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#C8813A",
              color: "#F5ECD7",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            + Add Books
          </button>
        </div>
      ) : (
        <>
          {mode === "wheel" && (
            <SpinningWheel books={books} onSelect={handleBookSelect} />
          )}
          {mode === "slots" && (
            <SlotMachine books={books} onSelect={handleBookSelect} />
          )}
          {mode === "cards" && (
            <CardFlip books={books} onSelect={handleBookSelect} />
          )}
        </>
      )}

      {selectedBook && (
        <WinnerPopup book={selectedBook} onClose={handleClosePopup} />
      )}
    </div>
  );
}