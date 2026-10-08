"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ChevronDown, ChevronUp } from "lucide-react";
import BookCover from "@/components/BookCover";
import { updateBook } from "@/lib/actions/books";

type Props = {
  book: {
    id: number;
    title: string;
    author: string | null;
    cover: string | null;
    genres: string[] | null;
    pageCount: number | null;
    publicationYear: number | null;
    isbn: string | null;
  };
};

export default function EditBookForm({ book }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author || "");
  const [cover, setCover] = useState<string | null>(book.cover);
  const [genres, setGenres] = useState(book.genres?.join(", ") || "");
  const [pageCount, setPageCount] = useState(
    book.pageCount?.toString() || ""
  );
  const [publicationYear, setPublicationYear] = useState(
    book.publicationYear?.toString() || ""
  );
  const [isbn, setIsbn] = useState(book.isbn || "");

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
      const result = await updateBook(book.id, {
        title: title.trim(),
        author: author.trim(),
        cover,
        genres: genres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
        pageCount: pageCount ? parseInt(pageCount) : null,
        publicationYear: publicationYear ? parseInt(publicationYear) : null,
        isbn: isbn || null,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      } else {
        setError("Failed to save changes");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

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
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--text)",
        }}
      >
        <span style={{ fontWeight: "600", fontSize: "14px" }}>
          ✏️ Edit Book Details
        </span>
        {isOpen ? (
          <ChevronUp size={16} color="var(--text-muted)" />
        ) : (
          <ChevronDown size={16} color="var(--text-muted)" />
        )}
      </button>

      {/* Edit Form */}
      {isOpen && (
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
          {/* Cover + Title Row */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "16px",
              alignItems: "flex-start",
            }}
          >
            {/* Cover */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <BookCover
                cover={cover}
                title={title}
                author={author}
                size="md"
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
                {cover ? "Change" : "Upload"}
              </button>
              {cover && cover !== book.cover && (
                <button
                  onClick={() => setCover(book.cover)}
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
                  Reset
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
                gap: "12px",
              }}
            >
              <div>
                <label style={labelStyle}>Title *</label>
                <input
                  style={inputStyle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Author *</label>
                <input
                  style={inputStyle}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
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

          {/* ISBN */}
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>ISBN</label>
            <input
              style={inputStyle}
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="ISBN number"
            />
          </div>

          {/* Genres */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Genres (comma separated)</label>
            <input
              style={inputStyle}
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="e.g. Fantasy, Romance"
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                backgroundColor: "var(--danger-bg)",
                border: "1px solid var(--danger)",
                borderRadius: "10px",
                padding: "10px 14px",
                color: "var(--text)",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              style={{
                backgroundColor: "var(--success-bg)",
                border: "1px solid var(--success-border)",
                borderRadius: "10px",
                padding: "10px 14px",
                color: "var(--text)",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              ✅ Changes saved successfully
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: saving ? "var(--raised)" : "var(--primary)",
              color: saving ? "var(--text-muted)" : "var(--on-primary)",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}