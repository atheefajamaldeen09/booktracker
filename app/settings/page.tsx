import { headers } from "next/headers";
import { Download } from "lucide-react";
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

const exports = [
  {
    format: "csv",
    icon: "📊",
    title: "Spreadsheet (CSV)",
    detail: "One row per book — opens in Excel, Numbers or Google Sheets.",
  },
  {
    format: "json",
    icon: "🗄️",
    title: "Full backup (JSON)",
    detail: "Everything, including reading sessions — keep it somewhere safe.",
  },
];

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

      {isOwner && (
        <section style={{ marginTop: "44px" }}>
          <h2 className="section-title">Your data</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "-6px 0 18px" }}>
            Download a copy of your whole library — every book, rating, review, series, tag, goal and reading
            session.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
              gap: "14px",
            }}
          >
            {exports.map((item) => (
              <a
                key={item.format}
                href={`/api/export?format=${item.format}`}
                download
                className="hover-lift"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "18px 20px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  color: "var(--text)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "26px" }} aria-hidden>
                  {item.icon}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 600, fontSize: "14px" }}>{item.title}</span>
                  <span style={{ display: "block", color: "var(--text-faint)", fontSize: "13px", marginTop: "2px" }}>
                    {item.detail}
                  </span>
                </span>
                <Download size={18} style={{ color: "var(--primary)", flex: "none" }} aria-hidden />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
