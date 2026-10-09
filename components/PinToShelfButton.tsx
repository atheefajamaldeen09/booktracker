"use client";

import { useState, useTransition } from "react";
import { Pin, PinOff } from "lucide-react";
import { setPinned } from "@/lib/actions/bookshelf";

// Puts a favourite on the top shelf of the visual bookshelf
export default function PinToShelfButton({ bookId, initial }: { bookId: number; initial: boolean }) {
  const [pinned, setPinnedState] = useState(initial);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !pinned;
    setPinnedState(next);
    startTransition(async () => {
      const result = await setPinned(bookId, next);
      if (!result.success) setPinnedState(!next);
    });
  };

  return (
    <button
      type="button"
      data-owner-only
      onClick={toggle}
      disabled={pending}
      aria-pressed={pinned}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "999px",
        border: `1px solid ${pinned ? "var(--primary)" : "var(--border)"}`,
        backgroundColor: pinned ? "rgb(var(--primary-rgb) / 0.16)" : "var(--surface)",
        color: pinned ? "var(--text)" : "var(--text-muted)",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        marginLeft: "8px",
        verticalAlign: "top",
      }}
    >
      {pinned ? <PinOff size={13} /> : <Pin size={13} />}
      {pinned ? "On top shelf" : "Pin to top shelf"}
    </button>
  );
}
