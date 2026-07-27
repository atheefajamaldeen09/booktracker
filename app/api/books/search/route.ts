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

function getBestCover(imageLinks: GoogleBookItem["volumeInfo"]["imageLinks"]): string | null {
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

function formatBook(item: GoogleBookItem) {
  const info = item.volumeInfo;
  const isbn =
    info.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier ||
    info.industryIdentifiers?.find((id) => id.type === "ISBN_10")?.identifier ||
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

  try {
    let googleQuery = "";
    if (type === "isbn") {
      googleQuery = `isbn:${query}`;
    } else if (type === "title") {
      googleQuery = `intitle:${query}`;
    } else if (type === "author") {
      googleQuery = `inauthor:${query}`;
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      googleQuery
    )}&maxResults=15&printType=books&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const results = data.items.map((item: GoogleBookItem) => formatBook(item));
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Something went wrong with the search" },
      { status: 500 }
    );
  }
}