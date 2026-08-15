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
          backgroundColor: "#2A1C0F",
          border: "1px solid #4A3020",
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
                color: "#A89070",
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
                color: "#F5ECD7",
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
              backgroundColor: "#3D2B18",
              border: "1px solid #4A3020",
              borderRadius: "10px",
              color: "#F5ECD7",
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
              color: "#7A9E7E",
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
        backgroundColor: "#2A1C0F",
        border: "1px solid #4A3020",
        borderRadius: "14px",
        padding: "16px",
        marginBottom: "28px",
      }}
    >
      <label
        style={{
          color: "#A89070",
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
          backgroundColor: "#1C1009",
          border: "1px solid #4A3020",
          borderRadius: "10px",
          color: "#F5ECD7",
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
              !hasChanged || !newTotalBooks ? "#3D2B18" : "#C8813A",
            border: "none",
            borderRadius: "10px",
            color: "#F5ECD7",
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
            border: "1px solid #4A3020",
            borderRadius: "10px",
            color: "#A89070",
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