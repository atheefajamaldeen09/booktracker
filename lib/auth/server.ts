// Helpers for Server Components and Server Actions (they read next/headers)

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./session";
import { resolveRole } from "./viewer";

export async function getRole() {
  const store = await cookies();
  return resolveRole(store.get(SESSION_COOKIE)?.value);
}

// Every action that changes data calls this first. Hidden buttons are only
// cosmetic — this is what actually keeps guests from editing.
export async function requireOwner() {
  if ((await getRole()) !== "owner") {
    throw new Error("This library is view-only.");
  }
}

// Reads are allowed for the owner and for guests with a valid share link
export async function requireViewer() {
  if ((await getRole()) === null) {
    throw new Error("This library is private.");
  }
}
