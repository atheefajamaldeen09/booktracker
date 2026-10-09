import { NextRequest } from "next/server";

// Cover hosts that don't let the browser read their pixels. The bookshelf
// reads each cover's color through here; only these hosts are fetched.
const ALLOWED_HOSTS = ["books.google.com", "books.googleusercontent.com", "covers.openlibrary.org"];
const MAX_BYTES = 5 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  let url: URL;
  try {
    url = new URL(raw ?? "");
  } catch {
    return new Response("Bad cover URL", { status: 400 });
  }
  if (!["https:", "http:"].includes(url.protocol) || !ALLOWED_HOSTS.includes(url.hostname)) {
    return new Response("Cover host not allowed", { status: 400 });
  }
  url.protocol = "https:";

  const upstream = await fetch(url, { redirect: "follow" }).catch(() => null);
  const type = upstream?.headers.get("content-type") ?? "";
  if (!upstream?.ok || !type.startsWith("image/")) {
    return new Response("Cover not found", { status: 502 });
  }
  const body = await upstream.arrayBuffer();
  if (body.byteLength > MAX_BYTES) {
    return new Response("Cover too large", { status: 502 });
  }

  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "private, max-age=604800",
    },
  });
}
