import Link from "next/link";
import BookCover from "@/components/BookCover";
import type { SeriesReminder } from "@/lib/actions/reminders";

// "What's next" cards for series you've started
export default function SeriesReminders({ reminders }: { reminders: SeriesReminder[] }) {
  if (reminders.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
        gap: "14px",
      }}
    >
      {reminders.map((r) => {
        const of = r.totalBooks ? ` of ${r.totalBooks}` : "";
        const message =
          r.kind === "start"
            ? "You haven't started this one yet — it's waiting on your TBR."
            : r.kind === "wishlist"
              ? "It's on your wishlist, ready for when you get a copy."
              : "It isn't in your library yet.";
        const href =
          r.kind === "missing"
            ? `/add?q=${encodeURIComponent(`${r.seriesName} book ${r.position}`)}`
            : `/book/${r.bookId}`;
        const action = r.kind === "start" ? "Open book" : r.kind === "wishlist" ? "View on wishlist" : "Find it";

        return (
          <div
            key={r.seriesId}
            style={{
              display: "flex",
              gap: "14px",
              padding: "14px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              minWidth: 0,
            }}
          >
            {r.kind === "missing" ? (
              <div
                aria-hidden
                style={{
                  flex: "none",
                  width: "56px",
                  height: "84px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "8px",
                  border: "1.5px dashed var(--border)",
                  color: "var(--text-faint)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "20px",
                }}
              >
                {r.position}
              </div>
            ) : (
              <div style={{ flex: "none" }}>
                <BookCover cover={r.cover} title={r.title ?? ""} size="sm" />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  color: "var(--primary)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Book {r.position}
                {of} · {r.seriesName}
              </p>
              <p
                style={{
                  color: "var(--text)",
                  fontWeight: 600,
                  fontSize: "15px",
                  margin: "4px 0 2px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.title ?? `Book ${r.position}`}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0, lineHeight: 1.45 }}>{message}</p>
              <Link
                href={href}
                {...(r.kind === "missing" ? { "data-owner-only": true } : {})}
                style={{
                  alignSelf: "flex-start",
                  marginTop: "auto",
                  paddingTop: "8px",
                  color: "var(--primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {action} →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
