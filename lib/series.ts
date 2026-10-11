// The rules for a book's spot in a series, shared by the add-book form and
// the server so both say the same thing

export type SeriesSummary = {
  id: number;
  name: string;
  totalBooks: number | null;
  // Book numbers already in your library, lowest first
  takenPositions: number[];
  // The ones among them that are only on your wishlist, not yet yours
  wishlistPositions?: number[];
};

// Series names match whatever the capitals
export function findSeries<T extends { name: string }>(list: T[], name: string) {
  const wanted = name.trim().toLowerCase();
  return wanted ? list.find((s) => s.name.toLowerCase() === wanted) : undefined;
}

// Whole numbers are the books the series is counted in. In-between numbers
// like 1.5 are novellas and extras: they sit in order but don't count
// towards the series length
export const isMainBook = (position: number) => Number.isInteger(position);

// The numbered books you actually have; wishlist ones don't count yet
export const ownedCount = (series: { takenPositions: number[]; wishlistPositions?: number[] }) =>
  series.takenPositions.filter((p) => isMainBook(p) && !series.wishlistPositions?.includes(p)).length;

// You have every numbered book of the series
export const isComplete = (series: { totalBooks: number | null; takenPositions: number[]; wishlistPositions?: number[] }) =>
  !!series.totalBooks && ownedCount(series) >= series.totalBooks;

// Why a book can't take this spot in a series, or null when it can: numbers
// are whole or halves, never used twice, and never past the series total
export function seriesProblem(name: string, position: number, totalBooks: number | null, taken: number[]) {
  if (!(position > 0) || !Number.isInteger(position * 2)) {
    return "The book number has to be a whole number, or a half like 1.5 for a novella.";
  }
  if (taken.includes(position)) {
    return `Book ${position} of ${name} is already in your library.`;
  }
  if (!totalBooks) return null;
  if (!isMainBook(position)) {
    return position > totalBooks + 0.5 ? `${name} only has ${totalBooks} books, so there's no book ${position}.` : null;
  }
  if (taken.filter(isMainBook).length >= totalBooks) {
    return `You already have all ${totalBooks} books of ${name}.`;
  }
  if (position > totalBooks) {
    return `${name} only has ${totalBooks} books, so there's no book ${position}.`;
  }
  return null;
}

// Why a series can't be this long, or null when it can: never shorter than
// the books already in it
export function totalProblem(totalBooks: number, taken: number[]) {
  if (!Number.isInteger(totalBooks) || totalBooks < 1) {
    return "The total has to be a whole number, at least 1.";
  }
  const mains = taken.filter(isMainBook);
  const highest = Math.max(0, ...taken.map(Math.floor));
  if (totalBooks < mains.length) {
    return `You already have ${mains.length} books in this series, so the total can't be less than that.`;
  }
  if (totalBooks < highest) {
    return `You have book ${Math.max(...taken)} of this series, so the total can't be less than ${highest}.`;
  }
  return null;
}

// The same check for the add-book form, where everything is still text
export function seriesFormProblem(list: SeriesSummary[], name: string, position: string, totalBooks: string) {
  if (!name.trim()) return null;
  const match = findSeries(list, name);
  const label = match?.name ?? name.trim();
  const taken = match?.takenPositions ?? [];
  const typedTotal = totalBooks ? parseInt(totalBooks) : null;
  const total = match?.totalBooks ?? typedTotal;
  const number = position ? Number(position) : null;
  const wished = match?.wishlistPositions ?? [];
  if (number !== null && wished.includes(number)) {
    return `Book ${number} of ${label} is already on your wishlist. Once you have it, move it to a shelf from its own page instead of adding it again.`;
  }
  // With every number used, a series only has room for in-between numbers
  if (total && taken.filter(isMainBook).length >= total && (number === null || isMainBook(number))) {
    return wished.some(isMainBook)
      ? `Every book of ${label} is already in your library or on your wishlist.`
      : `You already have all ${total} books of ${label}.`;
  }
  if (!match?.totalBooks && typedTotal) {
    const withThis = number !== null && isMainBook(number) ? [...taken, number] : taken;
    const problem = totalProblem(typedTotal, withThis);
    if (problem) return `The total can't be ${typedTotal}: you'd have more books of ${label} than that.`;
  }
  if (number === null) return null;
  return seriesProblem(label, number, total, taken);
}

// One slot per book number: the book you have there, or null for a gap.
// Novellas slot in between. Without a known total there are no gaps, just
// your books in order
export function seriesSlots<T extends { position: number }>(books: T[], totalBooks: number | null) {
  const sorted = [...books].sort((a, b) => a.position - b.position);
  if (!totalBooks) return sorted.map((book) => ({ position: book.position, book: book as T | null }));
  const placed = new Set<T>();
  const slots = Array.from({ length: totalBooks }, (_, i) => {
    const book = sorted.find((b) => b.position === i + 1 && !placed.has(b)) ?? null;
    if (book) placed.add(book);
    return { position: i + 1, book };
  });
  // Novellas, plus anything numbered twice or past the total, so nothing is hidden
  const extras = sorted.filter((b) => !placed.has(b)).map((book) => ({ position: book.position, book: book as T | null }));
  return [...slots, ...extras].sort((a, b) => a.position - b.position);
}
