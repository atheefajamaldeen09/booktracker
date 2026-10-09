"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { addQuote, deleteQuote } from "@/lib/actions/quotes";

type Quote = { id: number; text: string; page: number | null; note: string | null };

// Favourite lines from a book, each with an optional page number and note
export default function BookQuotes({ bookId, quotes }: { bookId: number; quotes: Quote[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [page, setPage] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    const result = await addQuote(bookId, { text, page: page ? parseInt(page) : null, note: note || null });
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Couldn't save the quote");
      return;
    }
    setText("");
    setPage("");
    setNote("");
    setOpen(false);
    router.refresh();
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this quote?")) return;
    await deleteQuote(id, bookId);
    router.refresh();
  };

  const field: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "14px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <section style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          Quotes & notes {quotes.length > 0 && `(${quotes.length})`}
        </p>
        {!open && (
          <button
            type="button"
            data-owner-only
            onClick={() => setOpen(true)}
            style={{
              padding: "6px 12px",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              backgroundColor: "var(--surface)",
              color: "var(--primary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add a quote
          </button>
        )}
      </div>

      {open && (
        <div
          data-owner-only
          style={{
            display: "grid",
            gap: "10px",
            padding: "16px",
            marginBottom: "14px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="The line you loved…"
            rows={3}
            autoFocus
            style={{ ...field, resize: "vertical", fontFamily: "var(--font-heading)", fontSize: "15px" }}
          />
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="number"
              min={1}
              value={page}
              onChange={(e) => setPage(e.target.value)}
              placeholder="Page"
              aria-label="Page"
              style={{ ...field, width: "100px" }}
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A note to yourself (optional)"
              aria-label="Note"
              style={{ ...field, flex: 1, width: "auto", minWidth: "180px" }}
            />
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: "13px", margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={save}
              disabled={saving || !text.trim()}
              style={{
                padding: "9px 18px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "var(--primary)",
                color: "var(--on-primary)",
                fontWeight: 600,
                fontSize: "14px",
                cursor: saving || !text.trim() ? "not-allowed" : "pointer",
                opacity: !text.trim() ? 0.6 : 1,
              }}
            >
              {saving ? "Saving…" : "Save quote"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                padding: "9px 16px",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                backgroundColor: "var(--raised)",
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

      {quotes.length === 0 && !open ? (
        <p style={{ color: "var(--text-faint)", fontSize: "13px", margin: 0 }}>
          No quotes saved yet. Keep the lines that stay with you.
        </p>
      ) : (
        <div style={{ display: "grid", gap: "10px" }}>
          {quotes.map((q) => (
            <figure
              key={q.id}
              style={{
                position: "relative",
                margin: 0,
                padding: "16px 44px 14px 20px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--primary)",
                borderRadius: "12px",
              }}
            >
              <blockquote
                style={{
                  margin: 0,
                  color: "var(--text)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "16px",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                “{q.text}”
              </blockquote>
              {(q.page || q.note) && (
                <figcaption style={{ marginTop: "8px", color: "var(--text-muted)", fontSize: "13px" }}>
                  {q.page && <span style={{ color: "var(--primary)", fontWeight: 600 }}>p. {q.page}</span>}
                  {q.page && q.note && " · "}
                  {q.note}
                </figcaption>
              )}
              <button
                type="button"
                data-owner-only
                onClick={() => remove(q.id)}
                aria-label="Delete quote"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  padding: "4px",
                  border: "none",
                  background: "none",
                  color: "var(--text-faint)",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={15} />
              </button>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
