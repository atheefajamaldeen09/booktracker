import { connection } from "next/server";
import { getNookProgress } from "@/lib/actions/nooks";
import PageHeader from "@/components/PageHeader";
import NookBuilder from "@/components/nook/NookBuilder";

export default async function NookPage() {
  // Always read fresh data so a book you just finished gives you its pieces right away
  await connection();
  const progress = await getNookProgress();

  return (
    <div style={{ maxWidth: "960px" }}>
      <PageHeader
        eyebrow="Your workbench"
        title="Book Nooks"
        subtitle="Build a tiny world piece by piece. Every book you finish earns more pieces."
      />
      <NookBuilder progress={progress} />
    </div>
  );
}
