"use client";

import { useEffect, useRef } from "react";
import styles from "./ConfirmDialog.module.css";

type Props = {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  // Red confirm button, for deleting things
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// An "are you sure?" pop-up in the app's own style, instead of the browser's
// grey one. Escape and clicking outside both cancel
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(e) => {
        // The dialog element itself is the dimmed area around the card
        if (e.target === ref.current && !busy) onCancel();
      }}
    >
      <div className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel} disabled={busy} autoFocus>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={styles.confirm}
            data-danger={danger || undefined}
            onClick={onConfirm}
            disabled={busy}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
