import Link from "next/link";
import { authStatus } from "@/lib/auth/session";

export default async function PrivatePage({
  searchParams,
}: {
  searchParams: Promise<{ link?: string; locked?: string }>;
}) {
  const { link, locked } = await searchParams;
  const misconfigured = authStatus() === "misconfigured";

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-emoji">
          <span className="hero-emoji" />
        </div>
        <p className="auth-eyebrow">BookTracker</p>
        <h1>{locked ? "This device is locked" : "This library is private"}</h1>
        <p className="auth-text">
          {locked
            ? "You're signed out here. Anyone using this device now needs your passcode or a guest link to get in."
            : link === "expired"
              ? "That guest link has been reset and no longer works. Ask the owner for a fresh one."
              : "If a friend shared their library with you, open the guest link they sent."}
        </p>
        {misconfigured && (
          <p className="auth-note">
            Owner: set <code>OWNER_PASSCODE</code> and <code>SESSION_SECRET</code> in your Vercel environment
            variables, then redeploy.
          </p>
        )}
        <Link href="/unlock" className="auth-link">
          I&apos;m the owner →
        </Link>
      </div>
    </div>
  );
}
