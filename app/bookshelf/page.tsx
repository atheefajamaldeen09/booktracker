import { connection } from "next/server";
import { getShelfBooks, getShelfDecor } from "@/lib/actions/bookshelf";
import PageHeader from "@/components/PageHeader";
import Bookshelf from "@/components/bookshelf/Bookshelf";

export default async function BookshelfPage() {
  // Always read fresh data so newly added or finished books appear right away
  await connection();
  const [books, decor] = await Promise.all([getShelfBooks(), getShelfDecor()]);
  const read = books.filter((b) => b.shelf === "read").length;

  return (
    <div style={{ maxWidth: "1100px" }}>
      <PageHeader
        eyebrow="Your cosy corner"
        title="My Bookshelf"
        subtitle={
          books.length === 0
            ? "A visual shelf of everything you've read and want to read."
            : `${books.length} ${books.length === 1 ? "book" : "books"} on the shelf · ${read} read`
        }
      />
      <Bookshelf books={books} decor={decor} />
    </div>
  );
}
