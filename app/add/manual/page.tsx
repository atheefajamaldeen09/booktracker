"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, X } from "lucide-react";
import { addBook, getAllSeries } from "@/lib/actions/books";
import FinishDateSelect from "@/components/FinishDateSelect";
import DnfFields, { parsePage } from "@/components/DnfFields";
import { todayPick, type FinishPick } from "@/lib/finishDate";
import BookCover from "@/components/BookCover";
import Button from "@/components/Button";
import SeriesSelector from "@/components/SeriesSelector";


export default function ManualEntryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [genres, setGenres] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [isSeries, setIsSeries] = useState(false);
  const [seriesName, setSeriesName] = useState("");
  const [seriesPosition, setSeriesPosition] = useState("");
  const [seriesTotalBooks, setSeriesTotalBooks] = useState("");
  const [shelf, setShelf] = useState<"tbr" | "wishlist" | "read" | "dnf">("tbr");
  const [finished, setFinished] = useState<FinishPick>(todayPick);
  const [dnfPage, setDnfPage] = useState("");
  const [dnfReason, setDnfReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingSeries, setExistingSeries] = useState<
    { id: number; name: string; totalBooks: number | null }[]
  >([]);

  useEffect(() => {
    getAllSeries().then((result) => {
      if (result.success) {
        setExistingSeries(result.series);
      }
    });
  }, []);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 300;
        const maxHeight = 450;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        setCover(compressed);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      setError("Title and author are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await addBook({
        title: title.trim(),
        author: author.trim(),
        cover: cover || null,
        genres: genres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
        pageCount: pageCount ? parseInt(pageCount) : null,
        publicationYear: publicationYear ? parseInt(publicationYear) : null,
        isbn: isbn || null,
        shelf,
        finished: shelf === "read" ? finished : undefined,
        dnfPage: shelf === "dnf" ? parsePage(dnfPage) : null,
        dnfReason: shelf === "dnf" ? dnfReason : null,
        seriesName: isSeries && seriesName ? seriesName.trim() : null,
        seriesPosition:
          isSeries && seriesPosition ? parseFloat(seriesPosition) : null,
        seriesTotalBooks:
          isSeries && seriesTotalBooks ? parseInt(seriesTotalBooks) : null,
      });

      if (result.success) {
        setShowSuccess(true);
      } else {
        setError("Failed to save book. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "var(--surface)",
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

  if (showSuccess) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "64px" }}>🎉</div>
        <h1 style={{ color: "var(--primary)", fontSize: "24px", fontWeight: "bold" }}>
          Book Added!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "300px" }}>
          <strong style={{ color: "var(--text)" }}>{title}</strong> has been added
          to your{" "}
          {shelf === "tbr"
            ? "TBR"
            : shelf === "read"
            ? "Read shelf"
            : shelf === "dnf"
            ? "Did Not Finish shelf"
            : "Wishlist"}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "300px",
            marginTop: "8px",
          }}
        >
          <button
            onClick={() => router.push("/library")}
            style={{
              padding: "12px",
              backgroundColor: "var(--primary)",
              color: "var(--on-primary)",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Go to Library
          </button>
          <button
            onClick={() => router.push("/add")}
            style={{
              padding: "12px",
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Add Another Book
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "var(--text-muted)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "24px",
          padding: 0,
        }}
      >
        <ChevronLeft size={16} />
        Back to search
      </button>

      <h1
        style={{
          color: "var(--primary)",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "6px",
        }}
      >
        Add Book Manually
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px" }}>
        Fill in the details for your book
      </p>

      {/* Cover + Title Section */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "28px",
          alignItems: "flex-start",
        }}
      >
        {/* Cover Upload */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <BookCover
            cover={cover}
            title={title || "Cover"}
            size="lg"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "6px 10px",
              backgroundColor: "var(--raised)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-muted)",
              fontSize: "11px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <Upload size={12} />
            {cover ? "Change" : "Upload Cover"}
          </button>
          {cover && (
            <button
              onClick={() => setCover(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "6px 10px",
                backgroundColor: "var(--danger-bg)",
                border: "1px solid var(--danger-border)",
                borderRadius: "8px",
                color: "var(--text-muted)",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              <X size={12} />
              Remove
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* Title and Author */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
            />
          </div>
          <div>
            <label style={labelStyle}>Author *</label>
            <input
              style={inputStyle}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>
          <div>
            <label style={labelStyle}>ISBN</label>
            <input
              style={inputStyle}
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="ISBN number"
            />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label style={labelStyle}>Page Count</label>
          <input
            style={inputStyle}
            type="number"
            value={pageCount}
            onChange={(e) => setPageCount(e.target.value)}
            placeholder="e.g. 350"
          />
        </div>
        <div>
          <label style={labelStyle}>Publication Year</label>
          <input
            style={inputStyle}
            type="number"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
            placeholder="e.g. 2023"
          />
        </div>
      </div>

      {/* Genres */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Genres (comma separated)</label>
        <input
          style={inputStyle}
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          placeholder="e.g. Fantasy, Romance, Adventure"
        />
      </div>

      {/* Series Section */}
      <div style={{ marginBottom: "20px" }}>
        <SeriesSelector
          isSeries={isSeries}
          seriesName={seriesName}
          seriesPosition={seriesPosition}
          seriesTotalBooks={seriesTotalBooks}
          existingSeries={existingSeries}
          onIsSeriesChange={setIsSeries}
          onSeriesNameChange={setSeriesName}
          onSeriesPositionChange={setSeriesPosition}
          onSeriesTotalBooksChange={setSeriesTotalBooks}
        />
      </div>

      {/* Shelf Selection */}
      <div style={{ marginBottom: "28px" }}>
        <label style={labelStyle}>Add To Shelf</label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { value: "tbr", label: "📚 TBR", desc: "I own it, haven't read it" },
            { value: "read", label: "✅ Already Read", desc: "I own it and have read it" },
            { value: "wishlist", label: "💛 Wishlist", desc: "I want this book" },
            { value: "dnf", label: "🚫 Did Not Finish", desc: "I started it, but it wasn't for me" },
          ].map((option) => (
            <div
              key={option.value}
              onClick={() => setShelf(option.value as "tbr" | "wishlist" | "read" | "dnf")}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "14px",
                backgroundColor: shelf === option.value ? "var(--raised)" : "var(--surface)",
                border: `2px solid ${shelf === option.value ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: shelf === option.value ? "var(--primary)" : "var(--text)",
                  fontWeight: "600",
                  fontSize: "14px",
                  margin: "0 0 4px 0",
                }}
              >
                {option.label}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: 0 }}>
                {option.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {shelf === "read" && (
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>When did you finish it?</label>
          <FinishDateSelect value={finished} onChange={setFinished} />
        </div>
      )}

      {shelf === "dnf" && (
        <div style={{ marginBottom: "28px" }}>
          <DnfFields
            page={dnfPage}
            reason={dnfReason}
            pageCount={pageCount ? parseInt(pageCount) : null}
            onPageChange={setDnfPage}
            onReasonChange={setDnfReason}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            backgroundColor: "var(--danger-bg)",
            border: "1px solid var(--danger)",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "var(--text)",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Save Button */}
      <Button
        fullWidth
        onClick={handleSave}
        disabled={saving || !title.trim() || !author.trim()}
      >
        {saving
          ? "Adding Book..."
          : shelf === "tbr"
          ? "Add to TBR"
          : shelf === "read"
          ? "Add to Read Shelf"
          : shelf === "dnf"
          ? "Add to Did Not Finish"
          : "Add to Wishlist"}
      </Button>
    </div>
  );
}