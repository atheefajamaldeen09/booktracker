import { getSeriesById } from "@/lib/actions/books";
import { notFound } from "next/navigation";
import SeriesDetail from "@/components/SeriesDetail";

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seriesId = parseInt(id);
  const { series: seriesData, books: booksInSeries } = await getSeriesById(seriesId);

  if (!seriesData) return notFound();

  return <SeriesDetail series={seriesData} books={booksInSeries} />;
}
