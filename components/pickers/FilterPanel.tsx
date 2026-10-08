"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

type Series = {
  seriesId: number;
  seriesName: string;
};

type Filters = {
  genres: string[];
  seriesId: number | null;
  minPages: number | null;
  maxPages: number | null;
  onlyStandalone: boolean;
};

type Props = {
  allGenres: string[];
  allSeries: Series[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
};

export default function FilterPanel({
  allGenres,
  allSeries,
  filters,
  onFilterChange,
}: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    filters.genres
  );
  const [selectedSeries, setSelectedSeries] = useState<number | null>(
    filters.seriesId
  );
  const [minPages, setMinPages] = useState(filters.minPages?.toString() || "");
  const [maxPages, setMaxPages] = useState(filters.maxPages?.toString() || "");
  const [onlyStandalone, setOnlyStandalone] = useState(filters.onlyStandalone);

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    selectedSeries !== null ||
    minPages !== "" ||
    maxPages !== "" ||
    onlyStandalone;

  const applyFilters = () => {
    onFilterChange({
      genres: selectedGenres,
      seriesId: selectedSeries,
      minPages: minPages ? parseInt(minPages) : null,
      maxPages: maxPages ? parseInt(maxPages) : null,
      onlyStandalone,
    });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedSeries(null);
    setMinPages("");
    setMaxPages("");
    setOnlyStandalone(false);
    onFilterChange({
      genres: [],
      seriesId: null,
      minPages: null,
      maxPages: null,
      onlyStandalone: false,
    });
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    color: "var(--text-muted)",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          backgroundColor: showFilters ? "var(--primary)" : "var(--surface)",
          border: `1px solid ${showFilters ? "var(--primary)" : "var(--border)"}`,
          borderRadius: "12px",
          color: showFilters ? "var(--on-primary)" : "var(--text-muted)",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        <SlidersHorizontal size={16} />
        Filters
        {hasActiveFilters && (
          <span
            style={{
              backgroundColor: "var(--text)",
              color: "var(--primary)",
              borderRadius: "999px",
              fontSize: "10px",
              fontWeight: "700",
              padding: "2px 6px",
            }}
          >
            {selectedGenres.length +
              (selectedSeries ? 1 : 0) +
              (minPages ? 1 : 0) +
              (maxPages ? 1 : 0) +
              (onlyStandalone ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filter Popup Overlay */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowFilters(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 999,
              animation: "fadeIn 0.2s ease-out",
            }}
          />

          {/* Filter Panel Popup */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "var(--surface)",
              border: "2px solid var(--primary)",
              borderRadius: "14px",
              padding: "24px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
              animation: "popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  color: "var(--primary)",
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                🎯 Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Genres */}
            {allGenres.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Genres</label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {allGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: selectedGenres.includes(genre)
                          ? "var(--primary)"
                          : "var(--bg)",
                        border: `1px solid ${
                          selectedGenres.includes(genre) ? "var(--primary)" : "var(--border)"
                        }`,
                        borderRadius: "999px",
                        color: selectedGenres.includes(genre)
                          ? "var(--on-primary)"
                          : "var(--text-muted)",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Series */}
            {allSeries.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Series</label>
                <select
                  value={selectedSeries || ""}
                  onChange={(e) =>
                    setSelectedSeries(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  style={selectStyle}
                >
                  <option value="">All Books</option>
                  {allSeries.map((s) => (
                    <option key={s.seriesId} value={s.seriesId}>
                      📚 {s.seriesName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Page Count Range */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Page Count</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <input
                  type="number"
                  value={minPages}
                  onChange={(e) => setMinPages(e.target.value)}
                  placeholder="Min pages"
                  style={selectStyle}
                />
                <input
                  type="number"
                  value={maxPages}
                  onChange={(e) => setMaxPages(e.target.value)}
                  placeholder="Max pages"
                  style={selectStyle}
                />
              </div>
            </div>

            {/* Only Standalone */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                padding: "12px",
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "var(--text)",
                    fontSize: "13px",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  Only standalone books
                </p>
                <p
                  style={{
                    color: "var(--text-faint)",
                    fontSize: "11px",
                    margin: "2px 0 0 0",
                  }}
                >
                  Exclude all series books
                </p>
              </div>

              <div
                onClick={() => setOnlyStandalone(!onlyStandalone)}
                style={{
                  width: "44px",
                  height: "24px",
                  backgroundColor: onlyStandalone ? "var(--primary)" : "var(--border)",
                  borderRadius: "999px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    backgroundColor: "var(--text)",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "3px",
                    left: onlyStandalone ? "23px" : "3px",
                    transition: "all 0.2s",
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={applyFilters}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "var(--primary)",
                  border: "none",
                  borderRadius: "10px",
                  color: "var(--on-primary)",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Apply Filters
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "transparent",
                    border: "1px solid var(--danger)",
                    borderRadius: "10px",
                    color: "var(--danger)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes popIn {
              0% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
              }
              100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}