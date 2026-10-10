import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getRole } from "@/lib/auth/server";
import { getFinishDateList } from "@/lib/actions/books";
import PageHeader from "@/components/PageHeader";
import FinishDatesList from "@/components/FinishDatesList";

export default async function FinishDatesPage() {
  // Always read fresh data from the database instead of a build-time snapshot
  await connection();
  // Only the owner can change dates
  if ((await getRole()) !== "owner") redirect("/goals");
  const books = await getFinishDateList();

  return (
    <div style={{ maxWidth: "760px" }}>
      <PageHeader
        eyebrow="Your reading history"
        title="When did you read these?"
        subtitle="Give each book the year you finished it — add the month or day only if you remember. Changes save as you go."
      />
      <FinishDatesList books={books} currentYear={new Date().getFullYear()} />
    </div>
  );
}
