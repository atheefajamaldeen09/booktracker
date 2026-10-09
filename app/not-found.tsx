import Link from "next/link";

export default function NotFound() {
  return (
    <div className="status-card">
      <span className="status-card-icon" aria-hidden>
        🔖
      </span>
      <h1>This page wandered off the shelf</h1>
      <p>We couldn&apos;t find what you were looking for. The book may have been removed, or the link is mistyped.</p>
      <div className="status-card-actions">
        <Link href="/library" className="status-card-primary">
          Browse your library
        </Link>
        <Link href="/" className="status-card-secondary">
          Go home
        </Link>
      </div>
    </div>
  );
}
