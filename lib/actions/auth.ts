"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  SESSION_COOKIE,
  OWNER_SESSION_DAYS,
  authStatus,
  cookieOptions,
  fingerprint,
  signSession,
} from "@/lib/auth/session";
import { rotateGuestToken } from "@/lib/auth/viewer";
import { requireOwner } from "@/lib/auth/server";

export type UnlockState = { error: string | null };

export async function unlock(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  if (authStatus() !== "enabled") {
    return { error: "Editing can't be unlocked until OWNER_PASSCODE and SESSION_SECRET are set." };
  }

  const attempt = String(formData.get("passcode") ?? "");
  // Compare fixed-length fingerprints so timing doesn't leak the passcode
  const matches = (await fingerprint(attempt)) === (await fingerprint(process.env.OWNER_PASSCODE!));
  if (!matches) {
    // Slow down guessing a little
    await new Promise((r) => setTimeout(r, 600));
    return { error: "That passcode isn't right." };
  }

  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    await signSession("owner", process.env.OWNER_PASSCODE!, OWNER_SESSION_DAYS),
    cookieOptions(OWNER_SESSION_DAYS)
  );
  redirect("/");
}

// Forget this device; it goes back to needing the passcode or a guest link
export async function lock() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/private");
}

export async function resetGuestLink() {
  await requireOwner();
  await rotateGuestToken();
  revalidatePath("/settings");
}
