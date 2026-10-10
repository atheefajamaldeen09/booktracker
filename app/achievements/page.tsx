import { connection } from "next/server";
import { Caveat } from "next/font/google";
import { getAchievements } from "@/lib/actions/achievements";
import PageHeader from "@/components/PageHeader";
import StickerBook from "@/components/achievements/StickerBook";

// Handwriting for the sticker book
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });

export default async function AchievementsPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  const statuses = await getAchievements();
  const earned = statuses.filter((s) => s.earned).length;

  return (
    <div className={hand.variable} style={{ maxWidth: "960px" }}>
      <PageHeader
        eyebrow="Achievements"
        title="Sticker Book"
        subtitle={`${earned} of ${statuses.length} stickers collected. Every little reading win earns one.`}
      />
      <StickerBook statuses={statuses} />
    </div>
  );
}
