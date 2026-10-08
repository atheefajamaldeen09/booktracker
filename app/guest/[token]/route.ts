import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, GUEST_SESSION_DAYS, authStatus, cookieOptions, fingerprint, signSession } from "@/lib/auth/session";
import { getGuestToken, resolveRole } from "@/lib/auth/viewer";

// A shared guest link: check the secret token, then hand the visitor a
// view-only session cookie and send them into the library
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const home = new URL("/", request.url);

  if (authStatus() !== "enabled") return NextResponse.redirect(home);

  // The owner opening their own link keeps full access
  if ((await resolveRole(request.cookies.get(SESSION_COOKIE)?.value)) === "owner") {
    return NextResponse.redirect(home);
  }

  const current = await getGuestToken();
  if ((await fingerprint(token)) !== (await fingerprint(current))) {
    return NextResponse.redirect(new URL("/private?link=expired", request.url));
  }

  const response = NextResponse.redirect(home);
  response.cookies.set(
    SESSION_COOKIE,
    await signSession("guest", current, GUEST_SESSION_DAYS),
    cookieOptions(GUEST_SESSION_DAYS)
  );
  return response;
}
