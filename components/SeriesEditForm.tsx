"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteSeries, updateSeries } from "@/lib/actions/books";
import ConfirmDialog from "@/components/ConfirmDialog";
import styles from "./Series.module.css";

type Props = {
  seriesId: number;
  seriesName: string;
  totalBooks: number | null;
  bookCount: number;
};

// "Series length: 7 books" with a small edit button, at the foot of the
// series header. Editing opens the name and length, plus deleting the series
export default function SeriesEditForm({ seriesId, seriesName, totalBooks, bookCount }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(seriesName);
  const [newTotalBooks, setNewTotalBooks] = useState(totalBooks?.toString() || "");
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanged = name.trim() !== seriesName || newTotalBooks !== (totalBooks?.toString() || "");
  const canSave = !isSaving && hasChanged && name.trim() !== "";

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setError(null);

    const result = await updateSeries(seriesId, {
      name,
      totalBooks: newTotalBooks ? Number(newTotalBooks) : null,
    });

    if (result.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      setError(result.error ?? "Failed to update series");
    }
    setIsSaving(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setError(null);
    setName(seriesName);
    setNewTotalBooks(totalBooks?.toString() || "");
  };

  const handleDelete = async () => {
    setIsSaving(true);
    const result = await deleteSeries(seriesId);
    if (result.success) {
      router.push("/series");
      router.refresh();
      return;
    }
    setIsSaving(false);
    setConfirmDelete(false);
    setError(result.error ?? "Failed to delete series");
  };

  if (!isEditing) {
    return (
      <div className={styles.length}>
        <span>
          Series length: <strong>{totalBooks ? `${totalBooks} ${totalBooks === 1 ? "book" : "books"}` : "not set"}</strong>
        </span>
        <button type="button" className={styles.lengthButton} onClick={() => setIsEditing(true)}>
          <Pencil size={13} />
          Edit series
        </button>
      </div>
    );
  }

  return (
    <form
      className={styles.editForm}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div className={styles.editFields}>
        <label className={styles.editField} style={{ flex: 1 }}>
          <span>Series name</span>
          <input
            className={styles.lengthInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>
        <label className={styles.editField}>
          <span>Books in the series</span>
          <input
            className={styles.lengthInput}
            type="number"
            value={newTotalBooks}
            onChange={(e) => setNewTotalBooks(e.target.value)}
            placeholder="e.g. 7"
            min="1"
            step="1"
          />
        </label>
      </div>

      {error && (
        <p role="alert" className={styles.lengthError}>
          {error}
        </p>
      )}

      <div className={styles.editActions}>
        <button type="button" className={styles.deleteButton} onClick={() => setConfirmDelete(true)} disabled={isSaving}>
          <Trash2 size={13} />
          Delete series
        </button>
        <span style={{ flex: 1 }} />
        <button type="button" className={styles.lengthButton} onClick={cancel} disabled={isSaving}>
          Cancel
        </button>
        <button type="submit" className={styles.lengthSave} disabled={!canSave}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${seriesName}?`}
        message={
          bookCount > 0
            ? `Its ${bookCount === 1 ? "book stays" : `${bookCount} books stay`} in your library; they just won't be grouped as a series any more.`
            : "This series has no books in it."
        }
        confirmLabel="Delete series"
        danger
        busy={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </form>
  );
}
