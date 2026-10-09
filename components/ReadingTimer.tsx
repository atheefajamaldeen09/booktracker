"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play, Square } from "lucide-react";
import { updateReadingProgress } from "@/lib/actions/books";

// A stopwatch for a reading session. It keeps running if you leave the page
// or close the app (the start time is saved on this device), and when you
// stop it asks which page you reached and logs pages and minutes together.

type Timer = { startedAt: number | null; elapsed: number }; // elapsed in ms, not counting the running stretch

const TIMER_EVENT = "booktracker-timer";
const keyFor = (bookId: number) => `booktracker-timer-${bookId}`;

function readRaw(bookId: number) {
  try {
    return localStorage.getItem(keyFor(bookId));
  } catch {
    return null;
  }
}

function write(bookId: number, timer: Timer | null) {
  try {
    if (timer) localStorage.setItem(keyFor(bookId), JSON.stringify(timer));
    else localStorage.removeItem(keyFor(bookId));
  } catch {
    // Storage blocked: the timer just won't survive a reload
  }
  window.dispatchEvent(new Event(TIMER_EVENT));
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(TIMER_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(TIMER_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

const clock = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

export default function ReadingTimer({
  bookId,
  currentPage,
  pageCount,
}: {
  bookId: number;
  currentPage: number;
  pageCount: number | null;
}) {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, () => readRaw(bookId), () => null);
  const timer: Timer | null = raw ? JSON.parse(raw) : null;
  const running = Boolean(timer?.startedAt);

  const [now, setNow] = useState(() => Date.now());
  const [finishing, setFinishing] = useState(false);
  const [page, setPage] = useState(String(currentPage));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tick once a second while running
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsed = timer ? timer.elapsed + (timer.startedAt ? now - timer.startedAt : 0) : 0;

  const start = () => {
    setNow(Date.now());
    write(bookId, { startedAt: Date.now(), elapsed: timer?.elapsed ?? 0 });
  };
  const pause = () => {
    if (!timer?.startedAt) return;
    write(bookId, { startedAt: null, elapsed: timer.elapsed + Date.now() - timer.startedAt });
  };
  const stop = () => {
    pause();
    setPage(String(currentPage));
    setError(null);
    setFinishing(true);
  };
  const discard = () => {
    write(bookId, null);
    setFinishing(false);
  };

  const save = async () => {
    const newPage = parseInt(page);
    if (isNaN(newPage) || newPage < currentPage) {
      setError(`Enter the page you reached (at least ${currentPage})`);
      return;
    }
    if (pageCount && newPage > pageCount) {
      setError(`This book only has ${pageCount} pages`);
      return;
    }
    setSaving(true);
    const minutes = Math.max(1, Math.round(elapsed / 60000));
    const result = await updateReadingProgress(bookId, newPage, currentPage, minutes);
    setSaving(false);
    if (!result.success) {
      setError("Couldn't save the session — try again");
      return;
    }
    write(bookId, null);
    setFinishing(false);
    router.refresh();
  };

  const button = (primary: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 16px",
    border: primary ? "none" : "1px solid var(--border)",
    borderRadius: "10px",
    backgroundColor: primary ? "var(--primary)" : "var(--raised)",
    color: primary ? "var(--on-primary)" : "var(--text)",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  });

  return (
    <div
      data-owner-only
      style={{
        backgroundColor: "var(--surface)",
        border: `1px solid ${running ? "var(--primary)" : "var(--border)"}`,
        borderRadius: "16px",
        padding: "18px 20px",
        marginBottom: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "140px" }}>
          <p style={{ color: "var(--text)", fontSize: "14px", fontWeight: 600, margin: 0 }}>⏱️ Reading timer</p>
          <p
            aria-live="off"
            style={{
              fontFamily: "var(--font-heading)",
              fontVariantNumeric: "tabular-nums",
              fontSize: "30px",
              fontWeight: 600,
              color: running ? "var(--primary)" : timer ? "var(--text)" : "var(--text-faint)",
              margin: "4px 0 0",
              lineHeight: 1.1,
            }}
          >
            {clock(elapsed)}
          </p>
          {timer && !running && !finishing && (
            <p style={{ color: "var(--text-faint)", fontSize: "12px", margin: "4px 0 0" }}>Paused</p>
          )}
        </div>

        {!finishing && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {running ? (
              <button type="button" onClick={pause} style={button(false)}>
                <Pause size={16} /> Pause
              </button>
            ) : (
              <button type="button" onClick={start} style={button(true)}>
                <Play size={16} /> {timer ? "Resume" : "Start reading"}
              </button>
            )}
            {timer && (
              <button type="button" onClick={stop} style={button(false)}>
                <Square size={14} /> Finish
              </button>
            )}
          </div>
        )}
      </div>

      {finishing && (
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          <p style={{ color: "var(--text)", fontSize: "14px", margin: "0 0 10px" }}>
            Nice session — {Math.max(1, Math.round(elapsed / 60000))} min. What page are you on now?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <input
              type="number"
              value={page}
              min={currentPage}
              max={pageCount || undefined}
              onChange={(e) => setPage(e.target.value)}
              aria-label="Page you reached"
              style={{
                width: "110px",
                padding: "9px 12px",
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text)",
                fontSize: "14px",
              }}
            />
            {pageCount ? <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>of {pageCount}</span> : null}
            <button type="button" onClick={save} disabled={saving} style={button(true)}>
              {saving ? "Saving…" : "Save session"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFinishing(false);
                start();
              }}
              disabled={saving}
              style={button(false)}
            >
              Keep reading
            </button>
            <button
              type="button"
              onClick={discard}
              disabled={saving}
              style={{ ...button(false), backgroundColor: "transparent", border: "none", color: "var(--text-faint)" }}
            >
              Discard
            </button>
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: "13px", margin: "10px 0 0" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}
