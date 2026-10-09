"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { setFavorite } from "@/lib/actions/bookshelf";
import { useCanEdit } from "@/components/Viewer";

// Mark a book as a favourite; favourites get their own filter on the
// bookshelf and in the library. Guests just see whether it's a favourite.
export default function FavoriteButton({ bookId, initial }: { bookId: number; initial: boolean }) {
  const canEdit = useCanEdit();
  const [favorite, setFavoriteState] = useState(initial);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !favorite;
    setFavoriteState(next);
    startTransition(async () => {
      const result = await setFavorite(bookId, next);
      if (!result.success) setFavoriteState(!next);
    });
  };

  if (!canEdit && !favorite) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending || !canEdit}
      aria-pressed={favorite}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "999px",
        border: `1px solid ${favorite ? "#e0607e" : "var(--border)"}`,
        backgroundColor: favorite ? "rgb(224 96 126 / 0.15)" : "var(--surface)",
        color: favorite ? "#e8738f" : "var(--text-muted)",
        fontSize: "12px",
        fontWeight: 600,
        cursor: canEdit ? "pointer" : "default",
        marginLeft: "8px",
        verticalAlign: "top",
      }}
    >
      <Heart size={13} fill={favorite ? "currentColor" : "none"} />
      {favorite ? "Favourite" : "Mark as favourite"}
    </button>
  );
}
