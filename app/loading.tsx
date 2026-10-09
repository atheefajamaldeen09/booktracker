// Shown instantly while a page's data loads: a soft outline of a page
// (heading, then a grid of cards) so the layout doesn't jump when it arrives
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" style={{ maxWidth: "1040px" }}>
      <div className="skeleton" style={{ width: "110px", height: "12px", marginBottom: "14px" }} />
      <div className="skeleton" style={{ width: "min(320px, 70%)", height: "34px", marginBottom: "12px" }} />
      <div className="skeleton" style={{ width: "min(240px, 55%)", height: "14px", marginBottom: "36px" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
          gap: "16px",
        }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton" style={{ height: "150px", borderRadius: "18px" }} />
        ))}
      </div>
    </div>
  );
}
