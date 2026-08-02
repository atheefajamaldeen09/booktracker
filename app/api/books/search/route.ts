import { NextRequest, NextResponse } from "next/server";

type GoogleBookItem = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    categories?: string[];
    pageCount?: number;
    publishedDate?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
    seriesInfo?: {
      shortSeriesBookTitle?: string;
      bookDisplayNumber?: string;
    };
    description?: string;
  };
};

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  subject?: string[];
  number_of_pages_median?: number;
  first_publish_year?: number;
  isbn?: string[];
  series?: string[];
  series_position?: string[];
};

type OpenLibraryISBNBook = {
  key?: string;
  title?: string;
  authors?: { name?: string }[];
  cover?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  subjects?: { name?: string }[];
  number_of_pages?: number;
  publish_date?: string;
  description?: { value?: string } | string;
};

function getBestCover(
  imageLinks: GoogleBookItem["volumeInfo"]["imageLinks"]
): string | null {
  if (!imageLinks) return null;
  const cover =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    null;
  if (!cover) return null;
  return cover.replace("zoom=1", "zoom=3").replace("http://", "https://");
}

function formatGoogleBook(item: GoogleBookItem) {
  const info = item.volumeInfo;
  const isbn =
    info.industryIdentifiers?.find((id) => id.type === "ISBN_13")
      ?.identifier ||
    info.industryIdentifiers?.find((id) => id.type === "ISBN_10")
      ?.identifier ||
    null;
  const publicationYear = info.publishedDate
    ? parseInt(info.publishedDate.slice(0, 4))
    : null;
  const seriesName = info.seriesInfo?.shortSeriesBookTitle || null;
  const seriesPosition = info.seriesInfo?.bookDisplayNumber
    ? parseFloat(info.seriesInfo.bookDisplayNumber)
    : null;

  return {
    key: item.id,
    title: info.title || "Unknown Title",
    author: info.authors?.[0] || "Unknown Author",
    cover: getBestCover(info.imageLinks),
    genres: info.categories?.slice(0, 5) || [],
    pageCount: info.pageCount || null,
    publicationYear,
    isbn,
    series: seriesName,
    seriesPosition,
    description: info.description || null,
  };
}

function formatOpenLibraryDoc(book: OpenLibraryDoc) {
  const coverId = book.cover_i;
  const cover = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  return {
    key: book.key || Math.random().toString(),
    title: book.title || "Unknown Title",
    author: book.author_name?.[0] || "Unknown Author",
    cover,
    genres: book.subject?.slice(0, 5) || [],
    pageCount: book.number_of_pages_median || null,
    publicationYear: book.first_publish_year || null,
    isbn: book.isbn?.[0] || null,
    series: book.series?.[0] || null,
    seriesPosition: book.series_position
      ? parseFloat(book.series_position[0])
      : null,
    description: null,
  };
}

function formatOpenLibraryISBN(
  book: OpenLibraryISBNBook,
  isbn: string
) {
  const cover =
    book.cover?.large ||
    book.cover?.medium ||
    book.cover?.small ||
    null;

  const publishYear = book.publish_date
    ? parseInt(book.publish_date.slice(-4))
    : null;

  return {
    key: book.key || isbn,
    title: book.title || "Unknown Title",
    author: book.authors?.[0]?.name || "Unknown Author",
    cover,
    genres:
      book.subjects?.slice(0, 5).map((s) => s.name || "").filter(Boolean) ||
      [],
    pageCount: book.number_of_pages || null,
    publicationYear: publishYear,
    isbn,
    series: null,
    seriesPosition: null,
    description: null,
  };
}

async function searchGoogleBooks(
  q: string,
  apiKey: string
): Promise<GoogleBookItem[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    q
  )}&maxResults=15&printType=books&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) return [];
  return data.items;
}

async function searchOpenLibraryByISBN(isbn: string) {
  try {
    // Try the books API first for exact ISBN match
    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;

    if (data[bookKey]) {
      return [formatOpenLibraryISBN(data[bookKey], isbn)];
    }

    // Fallback to search API
    const searchResponse = await fetch(
      `https://openlibrary.org/search.json?isbn=${isbn}&fields=key,title,author_name,cover_i,subject,number_of_pages_median,first_publish_year,isbn,series,series_position`
    );
    const searchData = await searchResponse.json();

    if (searchData.docs && searchData.docs.length > 0) {
      return searchData.docs
        .slice(0, 5)
        .map((doc: OpenLibraryDoc) => formatOpenLibraryDoc(doc));
    }

    return [];
  } catch {
    return [];
  }
}

async function searchOpenLibraryGeneral(
  query: string,
  type: "title" | "author"
) {
  try {
    const field = type === "title" ? "title" : "author";
    const response = await fetch(
      `https://openlibrary.org/search.json?${field}=${encodeURIComponent(
        query
      )}&limit=10&fields=key,title,author_name,cover_i,subject,number_of_pages_median,first_publish_year,isbn,series,series_position`
    );
    const data = await response.json();

    if (!data.docs || data.docs.length === 0) return [];
    return data.docs.map((doc: OpenLibraryDoc) => formatOpenLibraryDoc(doc));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "title";
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!query) {
    return NextResponse.json(
      { error: "No search query provided" },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Clean ISBN input
    const cleanQuery = query.replace(/[-\s]/g, "");

    if (type === "isbn") {
      // Try Google Books first
      const items = await searchGoogleBooks(`isbn:${cleanQuery}`, apiKey);

      if (items.length > 0) {
        return NextResponse.json({
          results: items.map(formatGoogleBook),
          source: "google",
        });
      }

      // Google found nothing — try Open Library which is better for ISBN
      const openLibResults = await searchOpenLibraryByISBN(cleanQuery);

      if (openLibResults.length > 0) {
        return NextResponse.json({
          results: openLibResults,
          source: "openlibrary",
        });
      }

      return NextResponse.json({ results: [] });
    }

    if (type === "title") {
      // Try Google Books first
      let items = await searchGoogleBooks(`intitle:${query}`, apiKey);

      if (items.length === 0) {
        items = await searchGoogleBooks(query, apiKey);
      }

      if (items.length > 0) {
        return NextResponse.json({
          results: items.map(formatGoogleBook),
          source: "google",
        });
      }

      // Fallback to Open Library
      const openLibResults = await searchOpenLibraryGeneral(query, "title");
      return NextResponse.json({
        results: openLibResults,
        source: "openlibrary",
      });
    }

    if (type === "author") {
      // Try Google Books first
      let items = await searchGoogleBooks(`inauthor:${query}`, apiKey);

      if (items.length === 0) {
        items = await searchGoogleBooks(query, apiKey);
      }

      if (items.length > 0) {
        return NextResponse.json({
          results: items.map(formatGoogleBook),
          source: "google",
        });
      }

      // Fallback to Open Library
      const openLibResults = await searchOpenLibraryGeneral(query, "author");
      return NextResponse.json({
        results: openLibResults,
        source: "openlibrary",
      });
    }

    return NextResponse.json({ results: [] });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Something went wrong with the search" },
      { status: 500 }
    );
  }
}