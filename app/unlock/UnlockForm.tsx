"use client";

import { useActionState } from "react";
import { unlock, type UnlockState } from "@/lib/actions/auth";

export default function UnlockForm() {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlock, { error: null });

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
      <input
        name="passcode"
        type="password"
        autoComplete="current-password"
        placeholder="Passcode"
        required
        autoFocus
        style={{
          padding: "12px 14px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg)",
          color: "var(--text)",
          fontSize: "15px",
          outline: "none",
        }}
      />
      {state.error && <p style={{ color: "var(--danger)", fontSize: "13px", margin: 0 }}>{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "12px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "var(--primary)",
          color: "var(--on-primary)",
          fontSize: "15px",
          fontWeight: 600,
          cursor: pending ? "wait" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? "Checking…" : "Unlock"}
      </button>
    </form>
  );
}
