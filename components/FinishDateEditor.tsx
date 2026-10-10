"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FinishDateSelect from "@/components/FinishDateSelect";
import { setFinishDate } from "@/lib/actions/books";
import { dateToPick, formatFinish } from "@/lib/finishDate";

// "Finished March 2023", with a way to change it for books you read long ago
export default function FinishDateEditor({
  bookId,
  dateCompleted,
  precision,
}: {
  bookId: number;
  dateCompleted: Date | null;
  precision: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pick, setPick] = useState(() => dateToPick(dateCompleted, precision));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = formatFinish(dateCompleted, precision);

  const save = async () => {
    setSaving(true);
    setError(null);
    const result = await setFinishDate(bookId, pick);
    setSaving(false);
    if (result.success) {
      setEditing(false);
      router.refresh();
    } else {
      setError("Couldn't save that date");
    }
  };

  const linkButton: React.CSSProperties = {
    background: "none",
    border: "none",
    padding: 0,
    color: "var(--primary)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  };

  if (!editing) {
    return (
      <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
        🏁 {label ? `Finished ${label}` : "Finish date unknown"}{" "}
        <button
          data-owner-only
          onClick={() => {
            setPick(dateToPick(dateCompleted, precision));
            setEditing(true);
          }}
          style={{ ...linkButton, marginLeft: "6px" }}
        >
          {label ? "Change" : "Add date"}
        </button>
      </p>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "12px",
        margin: "4px 0",
      }}
    >
      <p style={{ color: "var(--text)", fontSize: "13px", fontWeight: 600, margin: "0 0 10px 0" }}>
        When did you finish it?
      </p>
      <FinishDateSelect value={pick} onChange={setPick} />
      {error && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "8px 0 0 0" }}>{error}</p>}
      <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--primary)",
            color: "var(--on-primary)",
            border: "none",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setEditing(false)}
          style={{
            padding: "8px 14px",
            backgroundColor: "var(--raised)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text-muted)",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <Link
          href="/finish-dates"
          style={{ marginLeft: "auto", alignSelf: "center", color: "var(--text-muted)", fontSize: "12px" }}
        >
          Date all your old reads →
        </Link>
      </div>
    </div>
  );
}
