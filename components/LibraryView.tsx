"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import BookCard from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

type Tag = {
  id: number;
  name: string | null;
  color: string | null;
};

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  genres: string[] | null;
  pageCount: number | null;
  rating: number | null;
  shelf: string;
  dateAdded: Date | null;
  publicationYear: number | null;
  dateCompleted: Date | null;
  bookTags?: Tag[];
  bookSeries?: {
    id: number;
    name: string;
    position: number;
  } | null;
};

type Props = {
  books: Book[];
  initialShelf?: string;
};

type SortOption =
  | "date_added_desc"
  | "date_added_asc"
  | "title_asc"
  | "title_desc"
  | "author_asc"
  | "rating_desc"
  | "rating_asc"
  | "year_desc"
  | "year_asc";

export default function LibraryView({ books, initialShelf = "all" }: Props) {
  const [search, setSearch] = useState("");
  const [selectedShelf, setSelectedShelf] = useState(initialShelf);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("date_added_desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedSeries, setSelectedSeries] = useState("all");

  // Get all unique genres from all books
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    books.forEach((book) => {
      book.genres?.forEach((genre) => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, [books]);

  const allTagsList = useMemo(() => {
    const tagMap = new Map<number, Tag>();
    books.forEach((book) => {
      book.bookTags?.forEach((tag) => {
        tagMap.set(tag.id, tag);
      });
    });
    console.log("All books bookTags:", books.map(b => ({ title: b.title, tags: b.bookTags })));
    console.log("All tags list:", Array.from(tagMap.values()));
    return Array.from(tagMap.values());
  }, [books]);

  const allSeriesList = useMemo(() => {
    const seriesMap = new Map<number, { id: number; name: string }>();
    books.forEach((book) => {
      if (book.bookSeries) {
        seriesMap.set(book.bookSeries.id, {
          id: book.bookSeries.id,
          name: book.bookSeries.name,
        });
      }
    });
    return Array.from(seriesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [books]);

  // Get all unique years from books that have been read
  const allYears = useMemo(() => {
    const years = new Set<number>();
    books.forEach((book) => {
      if (book.dateCompleted) {
        years.add(new Date(book.dateCompleted).getFullYear());
      }
      if (book.publicationYear) {
        years.add(book.publicationYear);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [books]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let filtered = [...books];

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author?.toLowerCase().includes(searchLower) ||
          book.genres?.some((g) => g.toLowerCase().includes(searchLower))
      );
    }

    // Shelf filter
    if (selectedShelf !== "all") {
      filtered = filtered.filter((book) => book.shelf === selectedShelf);
    }

    // Genre filter
    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) =>
        book.genres?.includes(selectedGenre)
      );
    }

    // Rating filter
    if (selectedRating !== "all") {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(
        (book) => book.rating !== null && book.rating >= minRating
      );
    }

    // Year filter
    if (selectedYear !== "all") {
      const year = parseInt(selectedYear);
      filtered = filtered.filter((book) => {
        if (book.dateCompleted) {
          return new Date(book.dateCompleted).getFullYear() === year;
        }
        return book.publicationYear === year;
      });
    }

    // Tag filter
    if (selectedTag !== "all") {
      filtered = filtered.filter((book) =>
        book.bookTags?.some((tag) => tag.id === parseInt(selectedTag))
      );
    }

    // Series filter 
    if (selectedSeries !== "all") {
      filtered = filtered.filter(
        (book) => book.bookSeries?.id === parseInt(selectedSeries)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "author_asc":
          return (a.author || "").localeCompare(b.author || "");
        case "rating_desc":
          return (b.rating || 0) - (a.rating || 0);
        case "rating_asc":
          return (a.rating || 0) - (b.rating || 0);
        case "year_desc":
          return (b.publicationYear || 0) - (a.publicationYear || 0);
        case "year_asc":
          return (a.publicationYear || 0) - (b.publicationYear || 0);
        case "date_added_asc":
          return (
            new Date(a.dateAdded || 0).getTime() -
            new Date(b.dateAdded || 0).getTime()
          );
        case "date_added_desc":
        default:
          return (
            new Date(b.dateAdded || 0).getTime() -
            new Date(a.dateAdded || 0).getTime()
          );
      }
    });

    return filtered;
  }, [
    books,
    search,
    selectedShelf,
    selectedGenre,
    selectedRating,
    selectedYear,
    selectedTag,
    selectedSeries,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedShelf !== "all" ||
    selectedGenre !== "all" ||
    selectedRating !== "all" ||
    selectedYear !== "all" ||
    selectedTag !== "all" ||
    selectedSeries !== "all" ||
    search.trim() !== "";

  const clearFilters = () => {
    setSearch("");
    setSelectedShelf("all");
    setSelectedGenre("all");
    setSelectedRating("all");
    setSelectedYear("all");
    setSelectedTag("all");
    setSelectedSeries("all");
    setSortBy("date_added_desc");
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div>
      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your library..."
            style={{
              width: "100%",
              padding: "10px 12px 10px 38px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--text)",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 0,
                display: "flex",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 14px",
            backgroundColor: showFilters ? "var(--primary)" : "var(--surface)",
            border: `1px solid ${showFilters ? "var(--primary)" : "var(--border)"}`,
            borderRadius: "12px",
            color: showFilters ? "var(--on-primary)" : "var(--text-muted)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span
              style={{
                backgroundColor: "var(--text)",
                color: "var(--primary)",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: "700",
                padding: "1px 6px",
              }}
            >
              !
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Row 1 — Shelf and Genre */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Shelf
              </label>
              <select
                value={selectedShelf}
                onChange={(e) => setSelectedShelf(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All Shelves</option>
                <option value="tbr">📚 TBR</option>
                <option value="reading">📖 Currently Reading</option>
                <option value="read">✅ Read</option>
                <option value="dnf">🚫 DNF</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All Genres</option>
                {allGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 — Rating and Year */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Min Rating
              </label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                style={selectStyle}
              >
                <option value="all">Any Rating</option>
                <option value="5">★★★★★ 5 stars</option>
                <option value="4">★★★★ 4+ stars</option>
                <option value="3">★★★ 3+ stars</option>
                <option value="2">★★ 2+ stars</option>
                <option value="1">★ 1+ stars</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All Years</option>
                {allYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tag Filter */}
          {allTagsList.length > 0 && (
            <div>
              <label
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All Tags</option>
                {allTagsList.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Series Filter */}
          {allSeriesList.length > 0 && (
            <div>
              <label
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Series
              </label>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                style={selectStyle}
              >
                <option value="all">All Series</option>
                {allSeriesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    📚 {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Row 3 — Sort */}
          <div>
            <label
              style={{
                color: "var(--text-muted)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{ ...selectStyle, width: "100%" }}
            >
              <option value="date_added_desc">Date Added — Newest First</option>
              <option value="date_added_asc">Date Added — Oldest First</option>
              <option value="title_asc">Title — A to Z</option>
              <option value="title_desc">Title — Z to A</option>
              <option value="author_asc">Author — A to Z</option>
              <option value="rating_desc">Rating — Highest First</option>
              <option value="rating_asc">Rating — Lowest First</option>
              <option value="year_desc">Year — Newest First</option>
              <option value="year_asc">Year — Oldest First</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px",
                backgroundColor: "transparent",
                border: "1px solid var(--danger)",
                borderRadius: "10px",
                color: "var(--danger)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <X size={14} />
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          {filteredBooks.length}{" "}
          {filteredBooks.length === 1 ? "book" : "books"}
          {hasActiveFilters ? " matching filters" : " in your library"}
        </p>

        {/* Quick shelf links */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            href="/wishlist"
            style={{
              padding: "4px 12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              color: "var(--text-muted)",
              fontSize: "12px",
              textDecoration: "none",
            }}
          >
            💛 Wishlist
          </Link>
          <Link
            href="/dnf"
            style={{
              padding: "4px 12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              color: "var(--text-muted)",
              fontSize: "12px",
              textDecoration: "none",
            }}
          >
            🚫 DNF
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && books.length === 0 && (
        <EmptyState
          icon="📚"
          title="Your library is empty"
          message="Start by adding your first book using the Add Book button"
        />
      )}

      {filteredBooks.length === 0 && books.length > 0 && (
        <EmptyState
          icon="🔍"
          title="No books match your filters"
          message="Try adjusting your search or filters"
          action={
            <button
              onClick={clearFilters}
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--primary)",
                color: "var(--on-primary)",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
          }
        />
      )}

      {/* Books Grid */}
      {filteredBooks.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}