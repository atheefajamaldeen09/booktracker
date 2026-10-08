import { headers } from "next/headers";
import PageHeader from "@/components/PageHeader";
import { ThemeGallery } from "@/components/ThemePicker";
import ShareCard from "@/components/ShareCard";
import { getRole } from "@/lib/auth/server";
import { authStatus } from "@/lib/auth/session";
import { getGuestToken } from "@/lib/auth/viewer";

// The guest link, built from whatever address the site is being served on
async function guestLink() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}/guest/${await getGuestToken()}`;
}

export default async function SettingsPage() {
  const isOwner = (await getRole()) === "owner";
  const sharing = isOwner && authStatus() === "enabled";
  const link = sharing ? await guestLink() : null;

  return (
    <div style={{ maxWidth: "1040px" }}>
      <PageHeader eyebrow="Preferences" title="Settings" subtitle="Make BookTracker feel like yours." />

      <section>
        <h2 className="section-title">Theme</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "-6px 0 18px" }}>
          Pick one to match your mood. It changes the whole app, the bookshelf included, and is remembered on this
          device.
        </p>
        <ThemeGallery />
      </section>

      {isOwner && (
        <section style={{ marginTop: "44px" }}>
          <h2 className="section-title">Share</h2>
          {link ? (
            <ShareCard link={link} />
          ) : (
            <p style={{ color: "var(--text-faint)", fontSize: "13px", margin: 0 }}>
              Sharing switches on once <code>OWNER_PASSCODE</code> and <code>SESSION_SECRET</code> are set (in{" "}
              <code>.env.local</code> locally, or in Vercel&apos;s environment variables).
            </p>
          )}
        </section>
      )}

      <section data-owner-only style={{ marginTop: "44px" }}>
        <h2 className="section-title">Your data</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "18px 20px",
            backgroundColor: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: "16px",
          }}
        >
          <span style={{ fontSize: "26px" }}>📦</span>
          <div>
            <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "14px", margin: 0 }}>Export & backup</p>
            <p style={{ color: "var(--text-faint)", fontSize: "13px", margin: "2px 0 0" }}>
              Download your library as CSV or JSON — coming soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
