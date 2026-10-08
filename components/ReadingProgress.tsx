"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateReadingProgress,
  completeBook,
  markDNF,
} from "@/lib/actions/books";
import ProgressBar from "@/components/ProgressBar";

type Session = {
  id: number;
  date: Date | null;
  pagesRead: number;
  currentPageAfter: number;
};

type Props = {
  book: {
    id: number;
    title: string;
    currentPage: number | null;
    pageCount: number | null;
    shelf: string;
  };
  sessions: Session[];
};

export default function ReadingProgress({ book, sessions }: Props) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(
    book.currentPage?.toString() || "0"
  );
  const [loading, setLoading] = useState(false);
  const [showDNFForm, setShowDNFForm] = useState(false);
  const [dnfReason, setDnfReason] = useState("");
  const [showComplete, setShowComplete] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pageCount = book.pageCount || 0;
  const currentPageNum = book.currentPage || 0;

  const handleUpdateProgress = async () => {
    const newPage = parseInt(currentPage);

    if (isNaN(newPage) || newPage < 0) {
      setError("Please enter a valid page number");
      return;
    }

    if (pageCount && newPage > pageCount) {
      setError(`This book only has ${pageCount} pages`);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await updateReadingProgress(
      book.id,
      newPage,
      currentPageNum
    );

    if (result.success) {
      setSuccessMessage(`Progress updated to page ${newPage}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      router.refresh();
    } else {
      setError("Failed to update progress");
    }

    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    const result = await completeBook(book.id, book.pageCount);
    if (result.success) {
      router.push(
        result.goalReached ? `/book/${book.id}?goalReached=1` : `/book/${book.id}`
      );
    } else {
      setError("Failed to mark as complete");
      setLoading(false);
    }
  };

  const handleDNF = async () => {
    setLoading(true);
    const result = await markDNF(
      book.id,
      currentPageNum,
      dnfReason || undefined
    );
    if (result.success) {
      router.push(`/book/${book.id}`);
    } else {
      setError("Failed to mark as DNF");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    width: "120px",
    boxSizing: "border-box",
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Section Header */}
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "16px",
        }}
      >
        Reading Progress
      </p>

      {/* Progress Bar */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "12px",
        }}
      >
        <ProgressBar
          current={currentPageNum}
          total={pageCount || 1}
          showLabel={true}
        />

        {/* Average pages per session */}
        {sessions.length > 0 && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              marginTop: "10px",
            }}
          >
            📊 {sessions.length} reading{" "}
            {sessions.length === 1 ? "session" : "sessions"} •{" "}
            {Math.round(
              sessions.reduce((sum, s) => sum + s.pagesRead, 0) /
                sessions.length
            )}{" "}
            avg pages per session
          </p>
        )}
      </div>

      {/* Update Progress Form */}
      <div
        data-owner-only
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "12px",
        }}
      >
        <p
          style={{
            color: "var(--text)",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "14px",
          }}
        >
          Update Progress
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Current page
            </span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              min={0}
              max={pageCount || undefined}
              style={inputStyle}
            />
            {pageCount > 0 && (
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                of {pageCount}
              </span>
            )}
          </div>

          <button
            onClick={handleUpdateProgress}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: loading ? "var(--raised)" : "var(--primary)",
              color: loading ? "var(--text-muted)" : "var(--on-primary)",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p
            style={{
              color: "var(--danger)",
              fontSize: "13px",
              marginTop: "10px",
            }}
          >
            {error}
          </p>
        )}

        {/* Success */}
        {successMessage && (
          <p
            style={{
              color: "var(--success)",
              fontSize: "13px",
              marginTop: "10px",
            }}
          >
            ✅ {successMessage}
          </p>
        )}
      </div>

      {/* Mark Complete Button */}
      {!showComplete && !showDNFForm && (
        <div data-owner-only style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
          <button
            onClick={() => setShowComplete(true)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "var(--success-bg)",
              border: "1px solid var(--success-border)",
              borderRadius: "12px",
              color: "var(--success)",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ✅ Mark as Complete
          </button>
          <button
            onClick={() => setShowDNFForm(true)}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "var(--danger-bg)",
              border: "1px solid var(--danger)",
              borderRadius: "12px",
              color: "var(--danger)",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            🚫 Did Not Finish
          </button>
        </div>
      )}

      {/* Complete Confirmation */}
      {showComplete && (
        <div
          style={{
            backgroundColor: "var(--success-bg)",
            border: "1px solid var(--success-border)",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "12px",
          }}
        >
          <p
            style={{
              color: "var(--text)",
              fontSize: "15px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            🎉 Finished {book.title}?
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            This will move the book to your Read shelf. You can then rate and
            review it.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleComplete}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "var(--success)",
                border: "none",
                borderRadius: "10px",
                color: "var(--on-primary)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Yes, I finished it!"}
            </button>
            <button
              onClick={() => setShowComplete(false)}
              style={{
                padding: "10px 16px",
                backgroundColor: "var(--raised)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text-muted)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DNF Form */}
      {showDNFForm && (
        <div
          style={{
            backgroundColor: "var(--danger-bg)",
            border: "1px solid var(--danger)",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "12px",
          }}
        >
          <p
            style={{
              color: "var(--text)",
              fontSize: "15px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            🚫 Did Not Finish
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            Stopped at page {currentPageNum}. Would you like to add a reason?
          </p>
          <textarea
            value={dnfReason}
            onChange={(e) => setDnfReason(e.target.value)}
            placeholder="Optional — why did you stop reading?"
            rows={3}
            style={{
              width: "100%",
              padding: "10px 14px",
              backgroundColor: "var(--bg)",
              border: "1px solid var(--danger-border)",
              borderRadius: "10px",
              color: "var(--text)",
              fontSize: "13px",
              outline: "none",
              resize: "vertical",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleDNF}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "var(--danger)",
                border: "none",
                borderRadius: "10px",
                color: "var(--on-danger)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Mark as DNF"}
            </button>
            <button
              onClick={() => setShowDNFForm(false)}
              style={{
                padding: "10px 16px",
                backgroundColor: "var(--raised)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text-muted)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reading Sessions History */}
      {sessions.length > 0 && (
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setShowSessions(!showSessions)}
            style={{
              width: "100%",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              📖 Reading Sessions ({sessions.length})
            </span>
            <span style={{ color: "var(--text-muted)" }}>
              {showSessions ? "−" : "+"}
            </span>
          </button>

          {showSessions && (
            <div style={{ borderTop: "1px solid var(--border)" }}>
              {[...sessions].reverse().map((session, index) => (
                <div
                  key={session.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 20px",
                    borderBottom:
                      index < sessions.length - 1
                        ? "1px solid var(--raised)"
                        : "none",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "var(--text)",
                        fontSize: "13px",
                        margin: 0,
                      }}
                    >
                      {session.pagesRead > 0
                        ? `Read ${session.pagesRead} pages`
                        : "Started reading"}
                    </p>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        margin: "2px 0 0 0",
                      }}
                    >
                      Up to page {session.currentPageAfter}
                    </p>
                  </div>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      margin: 0,
                    }}
                  >
                    {session.date
                      ? new Date(session.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}