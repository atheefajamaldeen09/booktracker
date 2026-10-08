"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSeriesTotalBooks } from "@/lib/actions/books";
import Button from "@/components/Button";

type Props = {
  seriesId: number;
  seriesName: string;
  totalBooks: number | null;
};

export default function SeriesEditForm({
  seriesId,
  seriesName,
  totalBooks,
}: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newTotalBooks, setNewTotalBooks] = useState(
    totalBooks?.toString() || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!newTotalBooks || parseInt(newTotalBooks) < 1) {
      return;
    }

    setIsSaving(true);
    setSuccess(false);

    const result = await updateSeriesTotalBooks(
      seriesId,
      parseInt(newTotalBooks)
    );

    if (result.success) {
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 2000);
      router.refresh();
    }

    setIsSaving(false);
  };

  const hasChanged = newTotalBooks !== (totalBooks?.toString() || "");

  if (!isEditing) {
    return (
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              Total Books in Series
            </p>
            <p
              style={{
                color: "var(--text)",
                fontSize: "16px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              {totalBooks ? `${totalBooks} books` : "Not set"}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--raised)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              color: "var(--text)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {totalBooks ? "Edit" : "Set Total"}
          </button>
        </div>

        {success && (
          <p
            style={{
              color: "var(--success)",
              fontSize: "12px",
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            ✓ Total books updated successfully!
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "16px",
        marginBottom: "28px",
      }}
    >
      <label
        style={{
          color: "var(--text-muted)",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "block",
          marginBottom: "8px",
        }}
      >
        How many books are in {seriesName}?
      </label>

      <input
        type="number"
        value={newTotalBooks}
        onChange={(e) => setNewTotalBooks(e.target.value)}
        placeholder="e.g. 7"
        min="1"
        style={{
          width: "100%",
          padding: "10px 14px",
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          color: "var(--text)",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
          marginBottom: "12px",
        }}
      />

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanged || !newTotalBooks}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor:
              !hasChanged || !newTotalBooks ? "var(--raised)" : "var(--primary)",
            border: "none",
            borderRadius: "10px",
            color: "var(--text)",
            fontSize: "13px",
            fontWeight: "600",
            cursor:
              !hasChanged || !newTotalBooks ? "not-allowed" : "pointer",
            opacity: !hasChanged || !newTotalBooks ? 0.5 : 1,
          }}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={() => {
            setIsEditing(false);
            setNewTotalBooks(totalBooks?.toString() || "");
          }}
          disabled={isSaving}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text-muted)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}