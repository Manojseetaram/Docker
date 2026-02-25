import { JSX, useMemo } from "react";
import { useApp } from "../store/AppContext";

function StatCard({ label, value, sub, color, icon }: {
  label: string; value: number; sub: string; color: string; icon: JSX.Element;
}) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="stat-label">{label}</span>
        <span style={{ color, opacity: 0.7 }}>{icon}</span>
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const { containers: raw, images: rawImg, refreshContainers, refreshImages } = useApp();
  const containers = raw ?? [];
  const images = rawImg ?? [];

  const stats = useMemo(() => {
    const running = containers.filter(c => c.status === "running").length;
    return { total: containers.length, running, stopped: containers.length - running, images: images.length };
  }, [containers, images]);

  const runningList = containers.filter(c => c.status === "running").slice(0, 6);

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
         
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => { refreshContainers(); refreshImages(); }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total" value={stats.total} sub={`${stats.running} active`} color="var(--blue)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
        />
        <StatCard label="Running" value={stats.running} sub="Active" color="var(--blue)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard label="Stopped" value={stats.stopped} sub="Idle" color="var(--blue)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>}
        />
        <StatCard label="Images" value={stats.images} sub="Locally cached" color="var(--blue)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
        />
      </div>

      {/* Running containers */}
      <div className="card">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-2)",
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)", display: "inline-block" }} />
            <span style={{ fontWeight: 700, fontSize: 13 }}>Running Containers</span>
            <span className="badge badge-blue">{runningList.length}</span>
          </div>
          <span className="mono" style={{ fontSize: 10, color: "var(--text-4)" }}>Auto-refresh · 5s</span>
        </div>

        {runningList.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" style={{ margin: "0 auto 10px" }}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            <p>No running containers</p>
            <p style={{ marginTop: 4 }}>Start a container to see it here</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                <th className="mono" style={{ padding: "10px 18px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", textAlign: "left" }}>Container</th>
                <th className="mono" style={{ padding: "10px 18px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", textAlign: "left" }}>Image</th>
                <th className="mono" style={{ padding: "10px 18px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", textAlign: "left" }}>Status</th>
                <th className="mono" style={{ padding: "10px 18px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", textAlign: "left" }}>ID</th>
              </tr>
            </thead>
            <tbody>
              {runningList.map((c, i) => (
                <tr key={c.id ?? i} style={{ borderTop: "1px solid var(--border)", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fafbff"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                >
                  <td style={{ padding: "13px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px rgba(34,197,94,0.6)", flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{c.name ?? "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{c.image ?? "—"}</span>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <span className="badge badge-green">● {c.status ?? "unknown"}</span>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <span className="mono" style={{ fontSize: 11, color: "var(--text-4)", background: "var(--surface-2)", padding: "2px 7px", borderRadius: 6 }}>
                      {(c.id ?? "").slice(0, 12) || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}