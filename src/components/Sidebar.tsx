import { JSX } from "react";
import { Page } from "../App";

interface Props {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  containerCount: number;
  runningCount: number;
}

const NAV: { id: Page; label: string; icon: JSX.Element }[] = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    id: "containers", label: "Containers",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>,
  },
  {
    id: "images", label: "Images",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  },
  {
    id: "logs", label: "Logs",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    id: "terminal", label: "Terminal",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  },
];

export default function Sidebar({ currentPage, setCurrentPage, containerCount, runningCount }: Props) {
  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 12px",
    }}>
      {/* Logo */}
      <div style={{ padding: "4px 8px 20px", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 10px rgba(37,99,235,0.35)",
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="8" width="5" height="5" rx="1" fill="white"/>
              <rect x="9" y="8" width="5" height="5" rx="1" fill="white"/>
              <rect x="16" y="8" width="5" height="5" rx="1" fill="white" opacity="0.55"/>
              <rect x="2" y="15" width="5" height="5" rx="1" fill="white" opacity="0.45"/>
              <rect x="9" y="15" width="5" height="5" rx="1" fill="#93c5fd"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", lineHeight: 1.2 }}>ManojDocker</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-4)", marginTop: 1 }}>v0.1.0-alpha</div>
          </div>
        </div>
      </div>

      {/* Nav section */}
      <div className="mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-4)", padding: "0 8px", marginBottom: 6 }}>
        Menu
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(item => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "Syne, sans-serif",
                textAlign: "left",
                background: active ? "var(--blue-light)" : "transparent",
                color: active ? "var(--blue)" : "var(--text-2)",
                position: "relative",
                transition: "all 0.12s",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span style={{ color: active ? "var(--blue)" : "var(--text-4)", flexShrink: 0, display: "flex" }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === "containers" && (
                <span className="mono" style={{
                  fontSize: 10, fontWeight: 700,
                  padding: "1px 6px", borderRadius: 99,
                  background: active ? "var(--blue-muted)" : "var(--surface-2)",
                  color: active ? "var(--blue)" : "var(--text-4)",
                }}>
                  {containerCount}
                </span>
              )}
              {active && (
                <span style={{
                  position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                  width: 3, height: 18, borderRadius: "2px 0 0 2px",
                  background: "var(--blue)",
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer status */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 12, padding: "14px 8px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 6px rgba(34,197,94,0.7)",
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", fontFamily: "JetBrains Mono, monospace" }}>Engine running</span>
        </div>
        <div className="mono" style={{ fontSize: 10, color: "var(--text-4)", marginBottom: 4 }}>localhost:9000</div>
        <div className="mono" style={{
          fontSize: 10, color: "var(--blue)",
          background: "var(--blue-light)", padding: "3px 8px",
          borderRadius: 6, display: "inline-block",
          border: "1px solid var(--blue-muted)",
        }}>
          {runningCount}/{containerCount} up
        </div>
      </div>
    </aside>
  );
}