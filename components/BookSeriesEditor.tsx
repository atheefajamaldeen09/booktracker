"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil } from "lucide-react";
import { getAllSeries, removeBookFromSeries, setBookSeries } from "@/lib/actions/books";
import { useCanEdit } from "@/components/Viewer";
import ConfirmDialog from "@/components/ConfirmDialog";
import SeriesSelector from "@/components/SeriesSelector";
import { seriesFormProblem, type SeriesSummary } from "@/lib/series";

type Props = {
  bookId: number;
  bookTitle: string;
  current: { seriesId: number; seriesName: string; position: number; totalBooks: number | null } | null;
};

const labelStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "10px",
};

const smallButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "7px 12px",
  backgroundColor: "var(--raised)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--text)",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
};

// The book's series on its page: which one, which number, and (for the
// owner) changing the number, moving it to another series or taking it out
export default function BookSeriesEditor({ bookId, bookTitle, current }: Props) {
  const router = useRouter();
  const canEdit = useCanEdit();
  const [editing, setEditing] = useState(false);
  const [seriesName, setSeriesName] = useState(current?.seriesName ?? "");
  const [position, setPosition] = useState(current?.position.toString() ?? "");
  const [totalBooks, setTotalBooks] = useState("");
  const [allSeries, setAllSeries] = useState<SeriesSummary[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loaded when you start editing. This book's own number is left out, so
  // keeping it where it is doesn't count as a clash
  useEffect(() => {
    if (!editing) return;
    getAllSeries().then((result) => {
      if (!result.success) return;
      setAllSeries(
        result.series.map((s) =>
          current && s.id === current.seriesId
            ? {
                ...s,
                takenPositions: s.takenPositions.filter((p) => p !== current.position),
                wishlistPositions: s.wishlistPositions.filter((p) => p !== current.position),
              }
            : s
        )
      );
    });
  }, [editing, current]);

  const problem = seriesFormProblem(allSeries, seriesName, position, totalBooks);
  const canSave = !saving && !problem && seriesName.trim() !== "" && position !== "";

  const open = () => {
    setSeriesName(current?.seriesName ?? "");
    setPosition(current?.position.toString() ?? "");
    setTotalBooks("");
    setError(null);
    setEditing(true);
  };

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const result = await setBookSeries(bookId, {
      seriesName,
      position: Number(position),
      totalBooks: totalBooks ? parseInt(totalBooks) : null,
    });
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to save the series");
      return;
    }
    setEditing(false);
    router.refresh();
  };

  const remove = async () => {
    setSaving(true);
    const result = await removeBookFromSeries(bookId);
    setSaving(false);
    setConfirmRemove(false);
    if (!result.success) {
      setError(result.error ?? "Failed to remove the book from its series");
      return;
    }
    setEditing(false);
    router.refresh();
  };

  // Guests only see the series, and nothing at all for a standalone book
  if (!current && !canEdit) return null;

  if (editing) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <p style={labelStyle}>Series</p>
        <SeriesSelector
          isSeries
          hideToggle
          seriesName={seriesName}
          seriesPosition={position}
          seriesTotalBooks={totalBooks}
          existingSeries={allSeries}
          onIsSeriesChange={() => {}}
          onSeriesNameChange={setSeriesName}
          onSeriesPositionChange={setPosition}
          onSeriesTotalBooksChange={setTotalBooks}
        />
        {error && (
          <p role="alert" style={{ color: "var(--danger)", fontSize: "13px", margin: "10px 0 0" }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
          {current && (
            <button
              type="button"
              onClick={() => setConfirmRemove(true)}
              disabled={saving}
              style={{ ...smallButton, backgroundColor: "transparent", color: "var(--danger)", borderColor: "var(--danger-border)" }}
            >
              Remove from series
            </button>
          )}
          <span style={{ flex: 1 }} />
          <button type="button" onClick={() => setEditing(false)} disabled={saving} style={smallButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            style={{
              ...smallButton,
              backgroundColor: "var(--primary)",
              borderColor: "var(--primary)",
              color: "var(--on-primary)",
              opacity: canSave ? 1 : 0.5,
              cursor: canSave ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <ConfirmDialog
          open={confirmRemove}
          title="Remove from this series?"
          message={`${bookTitle} stays in your library; it just won't be part of ${current?.seriesName} any more.`}
          confirmLabel="Remove"
          danger
          busy={saving}
          onConfirm={remove}
          onCancel={() => setConfirmRemove(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "28px" }}>
      <p style={labelStyle}>Series</p>
      {current ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "12px 16px",
          }}
        >
          <Link
            href={`/series/${current.seriesId}`}
            style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          >
            <span style={{ fontSize: "20px" }}>📚</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "var(--text)", fontSize: "14px", fontWeight: "600", margin: 0 }}>{current.seriesName}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "2px 0 0 0" }}>
                {Number.isInteger(current.position) ? "Book" : "Novella"} {current.position}
                {current.totalBooks ? ` of ${current.totalBooks}` : " in the series"}
              </p>
            </div>
            <ChevronRight size={16} style={{ color: "var(--text-faint)", flex: "none" }} />
          </Link>
          {canEdit && (
            <button type="button" onClick={open} style={smallButton}>
              <Pencil size={13} />
              Change
            </button>
          )}
        </div>
      ) : (
        <button type="button" onClick={open} style={smallButton}>
          + Add to a series
        </button>
      )}
    </div>
  );
}
