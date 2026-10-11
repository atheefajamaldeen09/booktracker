"use client";

import { useState, useEffect, useRef } from "react";
import { findSeries, isComplete, isMainBook, seriesFormProblem, type SeriesSummary as Series } from "@/lib/series";

// Past this many, the book numbers are listed as text instead of buttons
const MAX_NUMBER_CHIPS = 40;

type Props = {
  isSeries: boolean;
  seriesName: string;
  seriesPosition: string;
  seriesTotalBooks: string;
  existingSeries: Series[];
  // Leave out the "Part of a series?" switch, when the form is only about the series
  hideToggle?: boolean;
  onIsSeriesChange: (value: boolean) => void;
  onSeriesNameChange: (value: string) => void;
  onSeriesPositionChange: (value: string) => void;
  onSeriesTotalBooksChange: (value: string) => void;
};

export default function SeriesSelector({
  isSeries,
  seriesName,
  seriesPosition,
  seriesTotalBooks,
  existingSeries,
  hideToggle = false,
  onIsSeriesChange,
  onSeriesNameChange,
  onSeriesPositionChange,
  onSeriesTotalBooksChange,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter series based on search input. Series you already have every book
  // of are left out: there's nothing left to add to them
  useEffect(() => {
    const open = existingSeries.filter((s) => !isComplete(s));
    if (seriesName.trim() === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredSeries(open);
    } else {
      setFilteredSeries(
        open.filter((s) =>
          s.name.toLowerCase().includes(seriesName.toLowerCase())
        )
      );
    }
  }, [seriesName, existingSeries]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // The series you're adding to, once the name matches one you already have
  const match = findSeries(existingSeries, seriesName);
  const taken = match?.takenPositions ?? [];
  const total = match?.totalBooks ?? null;
  // Every numbered book is already here; only a novella (1.5) could still join
  const complete = !!total && taken.filter(isMainBook).length >= total;
  const problem = seriesFormProblem(existingSeries, seriesName, seriesPosition, seriesTotalBooks);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    color: "var(--text-muted)",
    fontSize: "12px",
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      {/* Series Toggle */}
      <div
        hidden={hideToggle}
        style={hideToggle ? undefined : {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: isSeries ? "16px" : "0",
        }}
      >
        <div>
          <p
            style={{
              color: "var(--text)",
              fontSize: "14px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Part of a series?
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              margin: "2px 0 0 0",
            }}
          >
            Toggle if this book belongs to a series
          </p>
        </div>

        {/* Toggle Switch */}
        <div
          onClick={() => onIsSeriesChange(!isSeries)}
          style={{
            width: "44px",
            height: "24px",
            backgroundColor: isSeries ? "var(--primary)" : "var(--border)",
            borderRadius: "999px",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.2s",
            flexShrink: 0,
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
              left: isSeries ? "23px" : "3px",
              transition: "all 0.2s",
            }}
          />
        </div>
      </div>

      {/* Series Fields */}
      {isSeries && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Series Name with dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <label style={labelStyle}>Series Name</label>
            <input
              style={inputStyle}
              value={seriesName}
              onChange={(e) => {
                onSeriesNameChange(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="e.g. Harry Potter"
            />

            {/* Dropdown */}
            {showDropdown && (filteredSeries.length > 0 || !match) && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  zIndex: 50,
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginTop: "4px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                {/* Existing series that match */}
                {filteredSeries.length > 0 && (
                  <div>
                    <p
                      style={{
                        color: "var(--text-faint)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "8px 12px 4px",
                        margin: 0,
                      }}
                    >
                      Existing Series
                    </p>
                    {filteredSeries.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSeriesNameChange(s.name);
                          // Auto-fill total books if it exists
                          if (s.totalBooks) {
                            onSeriesTotalBooksChange(s.totalBooks.toString());
                          }
                          setShowDropdown(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--raised)",
                          cursor: "pointer",
                          textAlign: "left",
                          color: "var(--text)",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--raised)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>📚</span>
                          <span>{s.name}</span>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontSize: "11px", flexShrink: 0 }}>
                          {s.totalBooks
                            ? `${s.takenPositions.filter(isMainBook).length} of ${s.totalBooks}`
                            : `${s.takenPositions.length} added`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Create new option */}
                {seriesName.trim() !== "" &&
                  !match && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        color: "var(--primary)",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--raised)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span>✨</span>
                      <span>Create new series &quot;{seriesName}&quot;</span>
                    </button>
                  )}

                {/* No results */}
                {filteredSeries.length === 0 && seriesName.trim() === "" && (
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "13px",
                      padding: "12px",
                      margin: 0,
                    }}
                  >
                    {existingSeries.length > 0
                      ? "Every series you have is complete. Type to start a new one."
                      : "No existing series yet. Type to create one."}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* The numbers you already have: tap a free one to pick it */}
          {match && (total ? total <= MAX_NUMBER_CHIPS : taken.length > 0) && (
            <div>
              <label style={labelStyle}>
                {total ? `Your books in ${match.name}` : `You already have`}
              </label>
              {total ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
                    const have = taken.includes(n);
                    const picked = !have && seriesPosition === String(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        disabled={have || complete}
                        onClick={() => onSeriesPositionChange(String(n))}
                        aria-label={have ? `Book ${n}, already in your library` : `Book ${n}`}
                        aria-pressed={picked}
                        style={{
                          minWidth: "34px",
                          height: "34px",
                          padding: "0 8px",
                          borderRadius: "10px",
                          border: picked
                            ? "2px solid var(--primary)"
                            : have
                            ? "1px solid var(--success)"
                            : "1px dashed var(--border)",
                          backgroundColor: picked ? "var(--primary)" : have ? "var(--raised)" : "var(--bg)",
                          color: picked ? "var(--on-primary)" : have ? "var(--success)" : "var(--text)",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: have || complete ? "default" : "pointer",
                        }}
                      >
                        {have ? `✓ ${n}` : n}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: "var(--text)", fontSize: "13px", margin: 0 }}>
                  Book {taken.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* Book Number and Total Books in one row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Book Number</label>
              <input
                style={inputStyle}
                type="number"
                value={seriesPosition}
                onChange={(e) => onSeriesPositionChange(e.target.value)}
                placeholder={complete ? "e.g. 1.5" : "e.g. 1"}
                step="0.5"
                min="0.5"
              />
            </div>

            <div>
              <label style={labelStyle}>{total ? "Total Books" : "Total Books (Optional)"}</label>
              <input
                style={{ ...inputStyle, opacity: total ? 0.6 : 1 }}
                type="number"
                value={total ?? seriesTotalBooks}
                onChange={(e) => onSeriesTotalBooksChange(e.target.value)}
                placeholder="e.g. 7"
                min="1"
                // Set already; change it from the series page
                disabled={!!total}
              />
            </div>
          </div>

          {problem ? (
            <p
              role="alert"
              style={{
                backgroundColor: "var(--danger-bg)",
                border: "1px solid var(--danger)",
                borderRadius: "10px",
                padding: "10px 12px",
                color: "var(--text)",
                fontSize: "13px",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              {problem}
              {complete && " A novella can still go in between, with a number like 1.5."}
            </p>
          ) : (
            <p style={{ color: "var(--text-faint)", fontSize: "11px", margin: "0", lineHeight: "1.4" }}>
              💡 Total books helps track series completion (e.g. &quot;Read 3 of 7 books&quot;). You can update it later. For a novella between two books, use a half number like 1.5.
            </p>
          )}
        </div>
      )}
    </div>
  );
}