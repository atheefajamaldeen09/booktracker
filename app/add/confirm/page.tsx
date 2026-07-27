"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Upload, X, ChevronLeft } from "lucide-react";
import BookCover from "@/components/BookCover";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { addBook } from "@/lib/actions/books";

function ConfirmBookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse book data from URL params
  const initialData = {
    key: searchParams.get("key") || "",
    title: searchParams.get("title") || "",
    author: searchParams.get("author") || "",
    cover: searchParams.get("cover") || null,
    genres: searchParams.get("genres")?.split(",").filter(Boolean) || [],
    pageCount: searchParams.get("pageCount")
      ? parseInt(searchParams.get("pageCount")!)
      : null,
    publicationYear: searchParams.get("publicationYear")
      ? parseInt(searchParams.get("publicationYear")!)
      : null,
    isbn: searchParams.get("isbn") || null,
    series: searchParams.get("series") || null,
    seriesPosition: searchParams.get("seriesPosition")
      ? parseFloat(searchParams.get("seriesPosition")!)
      : null,
  };

  // Editable fields
  const [title, setTitle] = useState(initialData.title);
  const [author, setAuthor] = useState(initialData.author);
  const [cover, setCover] = useState<string | null>(initialData.cover);
  const [genres, setGenres] = useState(initialData.genres.join(", "));
  const [pageCount, setPageCount] = useState(
    initialData.pageCount?.toString() || ""
  );
  const [publicationYear, setPublicationYear] = useState(
    initialData.publicationYear?.toString() || ""
  );
  const [isbn, setIsbn] = useState(initialData.isbn || "");
  const [isSeries, setIsSeries] = useState(!!initialData.series);
  const [seriesName, setSeriesName] = useState(initialData.series || "");
  const [seriesPosition, setSeriesPosition] = useState(
    initialData.seriesPosition?.toString() || ""
  );
  const [shelf, setShelf] = useState<"tbr" | "wishlist" | "read">("tbr");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle cover image upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress and convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Max dimensions for cover
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

        // Compress to JPEG at 80% quality
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
        seriesName: isSeries && seriesName ? seriesName.trim() : null,
        seriesPosition:
          isSeries && seriesPosition ? parseFloat(seriesPosition) : null,
      });

      if (result.success) {
            router.push("/library");
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
    backgroundColor: "#2A1C0F",
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
    <div style={{ maxWidth: "640px" }}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "#A89070",
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
          color: "#C8813A",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "6px",
        }}
      >
        Confirm Book Details
      </h1>
      <p style={{ color: "#A89070", fontSize: "14px", marginBottom: "28px" }}>
        Review and edit any details before adding to your shelf
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
        {/* Cover Image */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <BookCover cover={cover} title={title} author={author} size="lg" />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "6px 10px",
              backgroundColor: "#3D2B18",
              border: "1px solid #4A3020",
              borderRadius: "8px",
              color: "#A89070",
              fontSize: "11px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <Upload size={12} />
            {cover ? "Change" : "Upload"}
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
                backgroundColor: "#3D1A1A",
                border: "1px solid #6B3A3A",
                borderRadius: "8px",
                color: "#A89070",
                fontSize: "11px",
                cursor: "pointer",
                width: "100%",
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
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
      <div
        style={{
          backgroundColor: "#2A1C0F",
          border: "1px solid #4A3020",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "20px",
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
            <p style={{ color: "#F5ECD7", fontSize: "14px", fontWeight: "600", margin: 0 }}>
              Part of a series?
            </p>
            <p style={{ color: "#A89070", fontSize: "12px", margin: "2px 0 0 0" }}>
              Toggle if this book belongs to a series
            </p>
          </div>
          {/* Toggle Switch */}
          <div
            onClick={() => setIsSeries(!isSeries)}
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
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Series Name</label>
              <input
                style={inputStyle}
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                placeholder="e.g. Harry Potter"
              />
            </div>
            <div>
              <label style={labelStyle}>Book Number</label>
              <input
                style={inputStyle}
                type="number"
                value={seriesPosition}
                onChange={(e) => setSeriesPosition(e.target.value)}
                placeholder="e.g. 1"
                step="0.5"
              />
            </div>
          </div>
        )}
      </div>

      {/* Shelf Selection */}
    <div style={{ marginBottom: "28px" }}>
    <label style={labelStyle}>Add To Shelf</label>
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {[
        {
            value: "tbr",
            label: "📚 TBR",
            desc: "I own it, haven't read it",
        },
        {
            value: "read",
            label: "✅ Already Read",
            desc: "I own it and have read it",
        },
        {
            value: "wishlist",
            label: "💛 Wishlist",
            desc: "I want this book",
        },
        ].map((option) => (
        <div
            key={option.value}
            onClick={() => setShelf(option.value as "tbr" | "wishlist" | "read")}
            style={{
            flex: 1,
            minWidth: "140px",
            padding: "14px",
            backgroundColor:
                shelf === option.value ? "#3D2B18" : "#2A1C0F",
            border: `2px solid ${
                shelf === option.value ? "#C8813A" : "#4A3020"
            }`,
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.2s",
            textAlign: "center",
            }}
        >
            <p
            style={{
                color: shelf === option.value ? "#C8813A" : "#F5ECD7",
                fontWeight: "600",
                fontSize: "14px",
                margin: "0 0 4px 0",
            }}
            >
            {option.label}
            </p>
            <p style={{ color: "#A89070", fontSize: "12px", margin: 0 }}>
            {option.desc}
            </p>
        </div>
        ))}
    </div>
    </div>

      {/* Error */}
      {error && (
        <div
          style={{
            backgroundColor: "#3D1A1A",
            border: "1px solid #8B3A3A",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "#F5ECD7",
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
            : "Add to Wishlist"}
      </Button>
    </div>
  );
}

export default function ConfirmBookPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ConfirmBookContent />
    </Suspense>
  );
}