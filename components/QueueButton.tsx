"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pin } from "lucide-react";
import { queueBook, unqueueBook } from "@/lib/actions/books";
import { useCanEdit } from "@/components/Viewer";

// "I want to read this next": adds a TBR book to the Up Next list on the home
// page without starting it. Click again to take it back off. Guests just see
// whether the book is up next.
export default function QueueButton({ bookId, initial }: { bookId: number; initial: boolean }) {
  const router = useRouter();
  const canEdit = useCanEdit();
  const [queued, setQueued] = useState(initial);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !queued;
    setQueued(next);
    startTransition(async () => {
      const result = next ? await queueBook(bookId) : await unqueueBook(bookId);
      if (!result.success) {
        setQueued(!next);
        return;
      }
      router.refresh();
    });
  };

  if (!canEdit && !queued) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending || !canEdit}
      aria-pressed={queued}
      title={queued ? "Click to remove from Up Next" : "Show this on the home page as your next read"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "999px",
        border: `1px solid ${queued ? "var(--primary)" : "var(--border)"}`,
        backgroundColor: queued ? "rgb(var(--primary-rgb) / 0.15)" : "var(--surface)",
        color: queued ? "var(--primary)" : "var(--text-muted)",
        fontSize: "12px",
        fontWeight: 600,
        cursor: canEdit ? "pointer" : "default",
        marginLeft: "8px",
        verticalAlign: "top",
      }}
    >
      <Pin size={13} fill={queued ? "currentColor" : "none"} />
      {queued ? "Up next" : "Add to Up Next"}
    </button>
  );
}