import { connection } from "next/server";
import { getAllSeriesWithStats } from "@/lib/actions/books";
import SeriesListView from "@/components/SeriesListView";
import SeriesReminders from "@/components/SeriesReminders";
import { getSeriesReminders } from "@/lib/actions/reminders";

export default async function SeriesListPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const [{ series: allSeries }, reminders] = await Promise.all([getAllSeriesWithStats(), getSeriesReminders()]);

  return (
    <div style={{ maxWidth: "800px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              color: "var(--primary)",
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            📚 My Series
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {allSeries.length} {allSeries.length === 1 ? "series" : "series"}{" "}
            in your collection
          </p>
        </div>
      </div>

      {reminders.length > 0 && (
        <section style={{ marginBottom: "32px" }}>
          <h2 className="section-title">What&apos;s next</h2>
          <SeriesReminders reminders={reminders} />
        </section>
      )}

      <SeriesListView series={allSeries} />
    </div>
  );
}