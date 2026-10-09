"use client";

// Last resort when even the app's frame fails to render. It replaces the root
// layout, so it brings its own page and styles.
export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#17100b",
          color: "#f4e9da",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          textAlign: "center",
        }}
      >
        <title>Something went wrong · BookTracker</title>
        <main style={{ maxWidth: "380px", background: "#2f2117", borderRadius: "22px", padding: "36px 28px" }}>
          <div style={{ fontSize: "44px" }} aria-hidden>
            📚
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "24px", margin: "14px 0 8px" }}>
            BookTracker couldn&apos;t open
          </h1>
          <p style={{ color: "#b8a58f", fontSize: "15px", lineHeight: 1.55, margin: "0 0 22px" }}>
            Something went wrong while loading the app. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              border: 0,
              borderRadius: "12px",
              padding: "11px 22px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              background: "#d08c4f",
              color: "#1b120b",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
