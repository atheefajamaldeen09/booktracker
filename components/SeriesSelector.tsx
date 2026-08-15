"use client";

import { useState, useEffect, useRef } from "react";

type Series = {
  id: number;
  name: string;
  totalBooks: number | null;
};

type Props = {
  isSeries: boolean;
  seriesName: string;
  seriesPosition: string;
  seriesTotalBooks: string;
  existingSeries: Series[];
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
  onIsSeriesChange,
  onSeriesNameChange,
  onSeriesPositionChange,
  onSeriesTotalBooksChange,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter series based on search input
  useEffect(() => {
    if (seriesName.trim() === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredSeries(existingSeries);
    } else {
      setFilteredSeries(
        existingSeries.filter((s) =>
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "#1C1009",
    border: "1px solid #4A3020",
    borderRadius: "10px",
    color: "#F5ECD7",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    color: "#A89070",
    fontSize: "12px",
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div
      style={{
        backgroundColor: "#2A1C0F",
        border: "1px solid #4A3020",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      {/* Series Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: isSeries ? "16px" : "0",
        }}
      >
        <div>
          <p
            style={{
              color: "#F5ECD7",
              fontSize: "14px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Part of a series?
          </p>
          <p
            style={{
              color: "#A89070",
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
            backgroundColor: isSeries ? "#C8813A" : "#4A3020",
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
              backgroundColor: "#F5ECD7",
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
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "#2A1C0F",
                  border: "1px solid #4A3020",
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
                        color: "#6B5040",
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
                          borderBottom: "1px solid #3D2B18",
                          cursor: "pointer",
                          textAlign: "left",
                          color: "#F5ECD7",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#3D2B18";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>📚</span>
                          <span>{s.name}</span>
                        </div>
                        {s.totalBooks && (
                          <span style={{ color: "#A89070", fontSize: "11px" }}>
                            {s.totalBooks} books
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Create new option */}
                {seriesName.trim() !== "" &&
                  !existingSeries.find(
                    (s) => s.name.toLowerCase() === seriesName.toLowerCase()
                  ) && (
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
                        color: "#C8813A",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#3D2B18";
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
                      color: "#A89070",
                      fontSize: "13px",
                      padding: "12px",
                      margin: 0,
                    }}
                  >
                    No existing series yet. Type to create one.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Book Number and Total Books in one row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Book Number</label>
              <input
                style={inputStyle}
                type="number"
                value={seriesPosition}
                onChange={(e) => onSeriesPositionChange(e.target.value)}
                placeholder="e.g. 1"
                step="0.5"
                min="0"
              />
            </div>

            <div>
              <label style={labelStyle}>Total Books (Optional)</label>
              <input
                style={inputStyle}
                type="number"
                value={seriesTotalBooks}
                onChange={(e) => onSeriesTotalBooksChange(e.target.value)}
                placeholder="e.g. 7"
                min="1"
              />
            </div>
          </div>

          {/* Helper text */}
          <p style={{ color: "#6B5040", fontSize: "11px", margin: "0", lineHeight: "1.4" }}>
            💡 Total books helps track series completion (e.g. &quot;Read 3 of 7 books&quot;). You can update it later.
          </p>
        </div>
      )}
    </div>
  );
}