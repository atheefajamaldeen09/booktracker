import { connection } from "next/server";
import { Caveat } from "next/font/google";
import { getBingo } from "@/lib/actions/bingo";
import PageHeader from "@/components/PageHeader";
import BingoCard from "@/components/bingo/BingoCard";

// Handwriting for the card
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });

export default async function BingoPage() {
  // Always read fresh data so a book you just finished can be stamped right away
  await connection();
  const { card, books } = await getBingo();

  return (
    <div className={hand.variable} style={{ maxWidth: "960px" }}>
      <PageHeader
        eyebrow="A little challenge"
        title="Reading Bingo"
        subtitle="Stamp a square for every book you finish. Five in a row is a bingo."
      />
      {/* A new card starts with a clean slate */}
      <BingoCard key={card?.round ?? 0} card={card} books={books} />
    </div>
  );
}
