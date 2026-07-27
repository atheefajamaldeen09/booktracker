"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, User, Barcode, PenLine } from "lucide-react";
import BookCover from "@/components/BookCover";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

type SearchResult = {
  key: string;
  title: string;
  author: string;
  cover: string | null;
  genres: string[];
  pageCount: number | null;
  publicationYear: number | null;
  isbn: string | null;
  series: string | null;
  seriesPosition: number | null;
  description: string | null;
};

type SearchType = "title" | "author" | "isbn";

export default function AddBookPage() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch(
        `/api/books/search?q=${encodeURIComponent(query)}&type=${searchType}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results || []);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleBookClick = (book: SearchResult) => {
    const params = new URLSearchParams({
      key: book.key,
      title: book.title,
      author: book.author,
      cover: book.cover || "",
      genres: book.genres.join(","),
      pageCount: book.pageCount?.toString() || "",
      publicationYear: book.publicationYear?.toString() || "",
      isbn: book.isbn || "",
      series: book.series || "",
      seriesPosition: book.seriesPosition?.toString() || "",
    });
    router.push(`/add/confirm?${params.toString()}`);
  };

  const searchTypes: {
    type: SearchType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { type: "title", label: "Title", icon: <BookOpen size={15} /> },
    { type: "author", label: "Author", icon: <User size={15} /> },
    { type: "isbn", label: "ISBN", icon: <Barcode size={15} /> },
  ];

  return (
    <div style={{ maxWidth: "680px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            color: "#C8813A",
            fontSize: "26px",
            fontWeight: "bold",
            marginBottom: "6px",
          }}
        >
          Add a Book
        </h1>
        <p style={{ color: "#A89070", fontSize: "14px" }}>
          Search by title, author, or ISBN to add a book to your shelves
        </p>
      </div>

      {/* Search Type Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          backgroundColor: "#2A1C0F",
          padding: "6px",
          borderRadius: "14px",
          border: "1px solid #4A3020",
          width: "fit-content",
        }}
      >
        {searchTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => {
              setSearchType(type);
              setResults([]);
              setSearched(false);
              setQuery("");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              backgroundColor: searchType === type ? "#C8813A" : "transparent",
              color: searchType === type ? "#F5ECD7" : "#A89070",
              transition: "all 0.2s",
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#A89070",
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              searchType === "title"
                ? "Search by book title..."
                : searchType === "author"
                ? "Search by author name..."
                : "Enter ISBN number..."
            }
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              backgroundColor: "#2A1C0F",
              border: "1px solid #4A3020",
              borderRadius: "12px",
              color: "#F5ECD7",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          style={{
            padding: "12px 20px",
            backgroundColor:
              !query.trim() || loading ? "#3D2B18" : "#C8813A",
            color: "#F5ECD7",
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: !query.trim() || loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          Search
        </button>
      </div>

      {/* Manual Entry Link */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => router.push("/add/manual")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#A89070",
            fontSize: "13px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <PenLine size={14} />
          Can&apos;t find your book? Add it manually
        </button>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {error && !loading && (
        <div
          style={{
            backgroundColor: "#3D1A1A",
            border: "1px solid #8B3A3A",
            borderRadius: "12px",
            padding: "16px",
            color: "#F5ECD7",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Empty State */}
      {searched && !loading && !error && results.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No books found"
          message={`We couldn't find any books matching "${query}". Try a different search or add it manually.`}
        />
      )}

      {/* Results List */}
      {results.length > 0 && !loading && (
        <div>
          <p
            style={{
              color: "#A89070",
              fontSize: "12px",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {results.length} results found
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {results.map((book) => (
              <div
                key={book.key}
                onClick={() => handleBookClick(book)}
                style={{
                  display: "flex",
                  gap: "16px",
                  backgroundColor: "#2A1C0F",
                  border: "1px solid #4A3020",
                  borderRadius: "16px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C8813A";
                  e.currentTarget.style.backgroundColor = "#3D2B18";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#4A3020";
                  e.currentTarget.style.backgroundColor = "#2A1C0F";
                }}
              >
                {/* Book Cover */}
                <BookCover
                  cover={book.cover}
                  title={book.title}
                  author={book.author}
                  size="md"
                />

                {/* Book Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      color: "#F5ECD7",
                      fontSize: "15px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                      lineHeight: "1.3",
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    style={{
                      color: "#C8813A",
                      fontSize: "13px",
                      marginBottom: "8px",
                    }}
                  >
                    {book.author}
                  </p>

                  {/* Meta info */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    {book.publicationYear && (
                      <span style={{ color: "#A89070", fontSize: "12px" }}>
                        📅 {book.publicationYear}
                      </span>
                    )}
                    {book.pageCount && (
                      <span style={{ color: "#A89070", fontSize: "12px" }}>
                        📄 {book.pageCount} pages
                      </span>
                    )}
                    {book.series && (
                      <span style={{ color: "#D4A853", fontSize: "12px" }}>
                        📚 {book.series}
                        {book.seriesPosition
                          ? ` #${book.seriesPosition}`
                          : ""}
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  {book.genres.length > 0 && (
                    <div
                      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                    >
                      {book.genres.slice(0, 3).map((genre) => (
                        <span
                          key={genre}
                          style={{
                            backgroundColor: "#3D2B18",
                            border: "1px solid #4A3020",
                            color: "#A89070",
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "999px",
                          }}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow indicator */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#A89070",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  ›
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}