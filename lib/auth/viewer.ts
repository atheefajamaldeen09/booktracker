// Who is looking at the library: the owner, a guest with the share link, or
// nobody we recognise. Used by proxy.ts, layouts and Server Actions.

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appSettings } from "@/lib/db/schema";
import { authStatus, fingerprint, verifySession, type Role } from "./session";

const GUEST_TOKEN_KEY = "guest_token";

// The secret part of the guest link, created the first time it's needed
export async function getGuestToken() {
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, GUEST_TOKEN_KEY)).limit(1);
  if (row) return row.value;
  const token = crypto.randomUUID();
  await db.insert(appSettings).values({ key: GUEST_TOKEN_KEY, value: token }).onConflictDoNothing();
  // Re-read in case two requests raced to create it
  const [saved] = await db.select().from(appSettings).where(eq(appSettings.key, GUEST_TOKEN_KEY)).limit(1);
  return saved.value;
}

// New token: every previously shared link and guest session stops working
export async function rotateGuestToken() {
  const token = crypto.randomUUID();
  await db
    .insert(appSettings)
    .values({ key: GUEST_TOKEN_KEY, value: token })
    .onConflictDoUpdate({ target: appSettings.key, set: { value: token } });
  return token;
}

export async function resolveRole(cookie: string | undefined): Promise<Role | null> {
  const status = authStatus();
  if (status === "open-dev") return "owner";
  if (status === "misconfigured") return null;

  const session = await verifySession(cookie);
  if (!session) return null;
  if (session.r === "owner") {
    return session.f === (await fingerprint(process.env.OWNER_PASSCODE!)) ? "owner" : null;
  }
  return session.f === (await fingerprint(await getGuestToken())) ? "guest" : null;
}
