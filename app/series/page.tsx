import { connection } from "next/server";
import { getAllSeriesWithStats } from "@/lib/actions/books";
import PageHeader from "@/components/PageHeader";
import SeriesListView from "@/components/SeriesListView";
import SeriesReminders from "@/components/SeriesReminders";
import { getSeriesReminders } from "@/lib/actions/reminders";

export default async function SeriesListPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const [{ series: allSeries }, reminders] = await Promise.all([getAllSeriesWithStats(), getSeriesReminders()]);

  const books = allSeries.reduce((sum, s) => sum + s.totalOwned, 0);
  const read = allSeries.reduce((sum, s) => sum + s.totalRead, 0);

  return (
    <div style={{ maxWidth: "1000px" }}>
      <PageHeader
        eyebrow="Your collections"
        title="My Series"
        subtitle={
          allSeries.length === 0
            ? "Every series you're collecting, and how far along you are."
            : `${allSeries.length} series · ${books} ${books === 1 ? "book" : "books"} on your shelf · ${read} read`
        }
      />

      {reminders.length > 0 && (
        <section style={{ marginBottom: "36px" }}>
          <h2 className="section-title">What&apos;s next</h2>
          <SeriesReminders reminders={reminders} />
        </section>
      )}

      {allSeries.length > 0 && <h2 className="section-title">All series</h2>}
      <SeriesListView series={allSeries} />
    </div>
  );
}
