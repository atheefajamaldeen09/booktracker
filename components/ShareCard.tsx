"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Copy, Check, RefreshCw, Lock } from "lucide-react";
import { lock, resetGuestLink } from "@/lib/actions/auth";

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "9px 14px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--raised)",
  color: "var(--text)",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
};

export default function ShareCard({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [resetting, startReset] = useTransition();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the link is selectable in the box instead
    }
  };

  const reset = () => {
    setConfirming(false);
    startReset(() => resetGuestLink());
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
      }}
    >
      <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "14px", margin: "0 0 4px" }}>👀 Guest link</p>
      <p style={{ color: "var(--text-faint)", fontSize: "13px", margin: "0 0 14px" }}>
        Friends with this link can browse your library, shelf and stats, but can&apos;t change anything.
      </p>

      <input
        readOnly
        value={link}
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Guest link"
        style={{
          width: "100%",
          padding: "11px 12px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg)",
          color: "var(--text-muted)",
          fontSize: "13px",
          fontFamily: "ui-monospace, monospace",
          marginBottom: "12px",
          opacity: resetting ? 0.5 : 1,
        }}
      />

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={copy}
          style={{ ...buttonStyle, backgroundColor: "var(--primary)", color: "var(--on-primary)", border: "none" }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button onClick={() => setConfirming(true)} disabled={resetting} style={buttonStyle}>
          <RefreshCw size={14} />
          {resetting ? "Resetting…" : "Reset link"}
        </button>
        <form action={lock} style={{ marginLeft: "auto" }}>
          <button type="submit" style={{ ...buttonStyle, backgroundColor: "transparent" }}>
            <Lock size={14} /> Lock this device
          </button>
        </form>
      </div>
      <ConfirmDialog
        open={confirming}
        title="Reset the guest link?"
        message="Anyone using the current link will lose access. You'll get a new link to share."
        confirmLabel="Reset link"
        danger
        onConfirm={reset}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
