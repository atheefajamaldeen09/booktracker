"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DnfFields, { parsePage } from "@/components/DnfFields";
import { markDNF } from "@/lib/actions/books";

// On a Did Not Finish book: where you stopped and why, with a way to change it
export default function DnfNote({
  bookId,
  page,
  reason,
  pageCount,
}: {
  bookId: number;
  page: number | null;
  reason: string | null;
  pageCount: number | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pageInput, setPageInput] = useState(page !== null ? String(page) : "");
  const [reasonInput, setReasonInput] = useState(reason ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await markDNF(bookId, parsePage(pageInput), reasonInput);
    setSaving(false);
    setEditing(false);
    router.refresh();
  };

  const stopped =
    page !== null && page > 0
      ? `Stopped at page ${page}${pageCount ? ` of ${pageCount} (${Math.round((page / pageCount) * 100)}%)` : ""}`
      : "Didn't finish";

  return (
    <section
      style={{
        marginBottom: "28px",
        padding: "16px 18px",
        backgroundColor: "var(--danger-bg)",
        border: "1px solid var(--danger-border)",
        borderRadius: "14px",
      }}
    >
      {!editing ? (
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "22px", lineHeight: 1 }}>🚫</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "var(--text)", fontSize: "14px", fontWeight: 600, margin: 0 }}>{stopped}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0 0", whiteSpace: "pre-wrap" }}>
              {reason || "No reason noted."}
            </p>
          </div>
          <button
            data-owner-only
            onClick={() => setEditing(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "var(--primary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>
      ) : (
        <>
          <DnfFields
            page={pageInput}
            reason={reasonInput}
            pageCount={pageCount}
            onPageChange={setPageInput}
            onReasonChange={setReasonInput}
          />
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
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
          </div>
        </>
      )}
    </section>
  );
}
