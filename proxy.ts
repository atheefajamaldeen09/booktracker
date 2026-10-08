import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { resolveRole } from "@/lib/auth/viewer";

// Pages anyone may open: the "private library" notice, the owner unlock form,
// and guest links (which check their own token)
const PUBLIC_PATHS = ["/private", "/unlock"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/guest/")) {
    return NextResponse.next();
  }

  const role = await resolveRole(request.cookies.get(SESSION_COOKIE)?.value);

  if (role === "owner") return NextResponse.next();

  if (role === "guest") {
    // Adding books is owner-only; send guests somewhere useful instead
    if (pathname === "/add" || pathname.startsWith("/add/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Not signed in. Data requests get a plain refusal; pages get the notice.
  if (pathname.startsWith("/api/") || request.headers.has("next-action")) {
    return new NextResponse("This library is private.", { status: 401 });
  }
  const response = NextResponse.redirect(new URL("/private", request.url));
  // Drop a stale cookie (e.g. after the guest link was reset)
  if (request.cookies.has(SESSION_COOKIE)) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  // Everything except static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml|webmanifest)$).*)"],
};
