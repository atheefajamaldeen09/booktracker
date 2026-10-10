import { connection } from "next/server";
import Link from "next/link";
import { getGoalsOverview } from "@/lib/actions/goals";
import GoalCard from "@/components/GoalCard";
import PageHeader from "@/components/PageHeader";
import BookCover from "@/components/BookCover";
import ThemeText from "@/components/ThemeText";

export default async function GoalsPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const { currentYear, history, currentYearBooks } = await getGoalsOverview();

  const current = history.find((h) => h.year === currentYear) ?? {
    year: currentYear,
    target: null,
    booksRead: 0,
    pagesRead: 0,
  };
  const pastYears = history.filter((h) => h.year !== currentYear);

  return (
    <div style={{ maxWidth: "960px" }}>
      <PageHeader
        eyebrow="Annual targets"
        title="Reading Goals"
        subtitle={<ThemeText id="goalsSubtitle" />}
      />

      <GoalCard
        // Remount when the saved goal changes so the form resets cleanly
        key={`${current.year}-${current.target}`}
        year={current.year}
        target={current.target}
        booksRead={current.booksRead}
      />

      {/* Finished this year */}
      <section style={{ marginTop: "40px" }}>
        <h2 className="section-title">Finished in {currentYear}</h2>
        <p data-owner-only style={{ color: "var(--text-muted)", fontSize: "13px", margin: "-6px 0 16px 0" }}>
          Read some of these before {currentYear}?{" "}
          <Link href="/finish-dates" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Fix their finish dates →
          </Link>
        </p>
        {currentYearBooks.length === 0 ? (
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px dashed var(--border)",
              borderRadius: "16px",
              padding: "28px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            No books finished yet this year — your first one is waiting on the{" "}
            <Link href="/library?shelf=tbr" style={{ color: "var(--primary)" }}>
              TBR shelf
            </Link>
            .
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
              gap: "18px",
            }}
          >
            {currentYearBooks.map((book, i) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="hover-lift"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 6px",
                  borderRadius: "12px",
                  border: "1px solid transparent",
                }}
              >
                <div style={{ position: "relative" }}>
                  <BookCover
                    cover={book.cover}
                    title={book.title}
                    author={book.author}
                    size="md"
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      left: "-8px",
                      minWidth: "24px",
                      height: "24px",
                      padding: "0 6px",
                      borderRadius: "999px",
                      backgroundColor: "var(--primary)",
                      color: "var(--on-primary)",
                      fontSize: "11px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {currentYearBooks.length - i}
                  </span>
                </div>
                <span
                  style={{
                    color: "var(--text)",
                    fontSize: "12px",
                    textAlign: "center",
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {book.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Previous years */}
      <section style={{ marginTop: "40px" }}>
        <h2 className="section-title">Previous Years</h2>
        {pastYears.length === 0 ? (
          <p style={{ color: "var(--text-faint)", fontSize: "14px" }}>
            Your past goals and results will show up here.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pastYears.map((h) => {
              const reached = h.target !== null && h.booksRead >= h.target;
              const pct = h.target ? Math.min((h.booksRead / h.target) * 100, 100) : 0;
              return (
                <div
                  key={h.year}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "18px 20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--text)",
                      fontSize: "26px",
                      fontWeight: 600,
                      width: "70px",
                    }}
                  >
                    {h.year}
                  </span>

                  <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px",
                        marginBottom: "8px",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "var(--text)" }}>
                        {h.booksRead} {h.booksRead === 1 ? "book" : "books"} read
                        {h.target !== null && (
                          <span style={{ color: "var(--text-muted)" }}> of {h.target}</span>
                        )}
                      </span>
                      <span style={{ color: "var(--text-faint)" }}>
                        {h.pagesRead.toLocaleString()} pages
                      </span>
                    </div>
                    {h.target !== null && (
                      <div
                        style={{
                          height: "6px",
                          backgroundColor: "var(--bg)",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            backgroundColor: reached ? "var(--success)" : "var(--primary)",
                            borderRadius: "999px",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      border: "1px solid",
                      borderColor:
                        h.target === null
                          ? "var(--border)"
                          : reached
                          ? "var(--success)"
                          : "var(--text-faint)",
                      color:
                        h.target === null
                          ? "var(--text-faint)"
                          : reached
                          ? "var(--success)"
                          : "var(--text-muted)",
                    }}
                  >
                    {h.target === null ? "No goal set" : reached ? "🏆 Achieved" : "Not reached"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
