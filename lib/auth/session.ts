// Signed session cookies, built on Web Crypto so the same code runs in
// proxy.ts and in Server Actions. No secrets ever reach the browser.

export type Role = "owner" | "guest";

type Payload = {
  r: Role;
  // Fingerprint of what granted access (passcode or guest link). Changing the
  // passcode or resetting the guest link makes old cookies stop working.
  f: string;
  e: number; // expiry, ms since epoch
};

export const SESSION_COOKIE = "bt_session";
export const OWNER_SESSION_DAYS = 180;
export const GUEST_SESSION_DAYS = 30;

const encoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (text: string) =>
  Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

// Auth is switched on once both secrets are configured. Without them, local
// development stays open and production stays locked.
export function authStatus(): "enabled" | "open-dev" | "misconfigured" {
  if (process.env.OWNER_PASSCODE && process.env.SESSION_SECRET) return "enabled";
  return process.env.NODE_ENV === "development" ? "open-dev" : "misconfigured";
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.SESSION_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function fingerprint(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`booktracker:${value}`));
  return toBase64Url(new Uint8Array(digest)).slice(0, 22);
}

export async function signSession(role: Role, grant: string, days: number) {
  const payload: Payload = { r: role, f: await fingerprint(grant), e: Date.now() + days * 86_400_000 };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(body)));
  return `${body}.${toBase64Url(signature)}`;
}

// Returns the payload only if the signature is valid and it hasn't expired
export async function verifySession(cookie: string | undefined): Promise<Payload | null> {
  if (!cookie || authStatus() !== "enabled") return null;
  const [body, signature] = cookie.split(".");
  if (!body || !signature) return null;
  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      fromBase64Url(signature),
      encoder.encode(body)
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as Payload;
    return payload.e > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export const cookieOptions = (days: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: days * 86_400,
});
