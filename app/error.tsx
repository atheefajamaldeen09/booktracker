"use client";

import Link from "next/link";
import { useEffect } from "react";

// Catches anything that goes wrong while showing a page, so you get a way
// back instead of a blank screen
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const viewOnly = error.message === "This library is view-only.";

  return (
    <div className="status-card" role="alert">
      <span className="status-card-icon" aria-hidden>
        {viewOnly ? "👀" : "📚"}
      </span>
      <h1>{viewOnly ? "This library is view-only" : "Something slipped off the shelf"}</h1>
      <p>
        {viewOnly
          ? "You're visiting with a guest link, so you can look around but not change anything."
          : "This page didn't load properly. It's usually a hiccup with the connection, so trying again often fixes it."}
      </p>
      <div className="status-card-actions">
        {!viewOnly && (
          <button type="button" className="status-card-primary" onClick={() => unstable_retry()}>
            Try again
          </button>
        )}
        <Link href="/" className="status-card-secondary">
          Go home
        </Link>
      </div>
      {error.digest && <small>Error reference: {error.digest}</small>}
    </div>
  );
}
