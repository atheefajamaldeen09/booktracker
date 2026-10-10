"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { moveBookToShelf, deleteBook, markDNF } from "@/lib/actions/books";
import DnfFields, { parsePage } from "@/components/DnfFields";

type Props = {
  book: {
    id: number;
    shelf: string;
    title: string;
    currentPage?: number | null;
    pageCount?: number | null;
  };
};

type Shelf = "tbr" | "reading" | "read" | "wishlist" | "dnf";

export default function BookActions({ book }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Moving to Did Not Finish asks where you stopped and why first
  const [dnfOpen, setDnfOpen] = useState(false);
  const [dnfPage, setDnfPage] = useState(book.currentPage ? String(book.currentPage) : "");
  const [dnfReason, setDnfReason] = useState("");

  const handleDnf = async () => {
    setLoading(true);
    await markDNF(book.id, parsePage(dnfPage), dnfReason);
    setDnfOpen(false);
    router.refresh();
    setLoading(false);
  };

  const handleMove = async (shelf: Shelf) => {
    setLoading(true);
    await moveBookToShelf(book.id, shelf);
    router.refresh();
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteBook(book.id);
    router.push("/library");
  };

  const allShelfOptions: { shelf: Shelf; label: string; color: string }[] = [
    { shelf: "tbr", label: "📚 Move to TBR", color: "var(--primary)" },
    { shelf: "reading", label: "📖 Start Reading", color: "var(--accent)" },
    { shelf: "read", label: "✅ Mark as Read", color: "var(--success)" },
    { shelf: "wishlist", label: "💛 Move to Wishlist", color: "var(--text-muted)" },
    { shelf: "dnf", label: "🚫 Did Not Finish", color: "var(--danger)" },
  ];

  const shelfOptions = allShelfOptions.filter(
    (option) => option.shelf !== book.shelf
  );

  return (
    <div>
      {/* Move Shelf Section */}
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "12px",
          }}
        >
          Move to shelf
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {shelfOptions.map((option) => (
            <button
              key={option.shelf}
              onClick={() => (option.shelf === "dnf" ? setDnfOpen(true) : handleMove(option.shelf))}
              disabled={loading}
              style={{
                padding: "12px 16px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: option.color,
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = option.color;
                e.currentTarget.style.backgroundColor = "var(--raised)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.backgroundColor = "var(--surface)";
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {dnfOpen && (
          <div
            style={{
              marginTop: "12px",
              padding: "16px",
              backgroundColor: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
              borderRadius: "14px",
            }}
          >
            <p style={{ color: "var(--text)", fontSize: "15px", fontWeight: 600, margin: "0 0 4px 0" }}>
              Not for you? That&apos;s okay.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 14px 0" }}>
              Life&apos;s too short for books that don&apos;t grab you. Add a note for future you, if you like.
            </p>
            <DnfFields
              page={dnfPage}
              reason={dnfReason}
              pageCount={book.pageCount}
              onPageChange={setDnfPage}
              onReasonChange={setDnfReason}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <button
                onClick={handleDnf}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "var(--danger)",
                  border: "none",
                  borderRadius: "10px",
                  color: "var(--on-danger)",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Saving..." : "Move to Did Not Finish"}
              </button>
              <button
                onClick={() => setDnfOpen(false)}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "var(--raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--text-muted)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid var(--border)", marginBottom: "24px" }} />

      {/* Delete Section */}
      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          style={{
            padding: "12px 16px",
            backgroundColor: "transparent",
            border: "1px solid var(--danger)",
            borderRadius: "12px",
            color: "var(--danger)",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          🗑️ Remove from library
        </button>
      ) : (
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--danger)",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <p
            style={{
              color: "var(--text)",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            Are you sure you want to remove{" "}
            <strong>{book.title}</strong> from your library? This cannot be
            undone.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "var(--danger)",
                border: "none",
                borderRadius: "10px",
                color: "var(--on-danger)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Yes, remove it
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "var(--raised)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text-muted)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}