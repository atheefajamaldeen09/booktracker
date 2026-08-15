import { getAllSeriesWithStats } from "@/lib/actions/books";
import SeriesListView from "@/components/SeriesListView";

export default async function SeriesListPage() {
  const { series: allSeries } = await getAllSeriesWithStats();

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
              color: "#C8813A",
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            📚 My Series
          </h1>
          <p style={{ color: "#A89070", fontSize: "14px" }}>
            {allSeries.length} {allSeries.length === 1 ? "series" : "series"}{" "}
            in your collection
          </p>
        </div>
      </div>

      <SeriesListView series={allSeries} />
    </div>
  );
}