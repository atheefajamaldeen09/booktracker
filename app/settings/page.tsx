import PageHeader from "@/components/PageHeader";
import { ThemeGallery } from "@/components/ThemePicker";

export default function SettingsPage() {
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

      <section style={{ marginTop: "44px" }}>
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
