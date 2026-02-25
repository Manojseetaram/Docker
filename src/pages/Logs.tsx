import { useEffect, useRef, useState } from "react";
import { useApp } from "../store/AppContext";

export default function Logs() {
  const { logs: rawLogs, containers: rawContainers, streamLogs } = useApp();
  const logs = rawLogs ?? [];
  const containers = rawContainers ?? [];
  const [selected, setSelected] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) streamLogs(selected);
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const selectedName = containers.find(c => c.id === selected)?.name;

  return (
    <div style={{ maxWidth: 900, height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Logs</h1>
          <p className="page-sub">
            {selected && selectedName ? `Streaming · ${selectedName}` : "Select a container to stream logs"}
          </p>
        </div>
        <select
          className="input"
          style={{ width: "auto", minWidth: 200 }}
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">Select container…</option>
          {containers.map(c => (
            <option key={c.id} value={c.id ?? ""}>
              {c.name ?? "unnamed"} · {c.status}
            </option>
          ))}
        </select>
      </div>

      {/* Terminal window */}
      <div style={{
        flex: 1,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}>
        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px",
          background: "#1e293b",
          borderBottom: "1px solid #334155",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map(c => (
                <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.8 }} />
              ))}
            </div>
            <span className="mono" style={{ fontSize: 11, color: "#64748b" }}>
              {selectedName ? `${selectedName} — stdout/stderr` : "no container selected"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: selected ? "#22c55e" : "#475569",
              boxShadow: selected ? "0 0 6px rgba(34,197,94,0.8)" : "none",
            }} />
            <span className="mono" style={{ fontSize: 10, color: selected ? "#22c55e" : "#475569" }}>
              {selected ? "streaming" : "idle"}
            </span>
          </div>
        </div>

        {/* Log body */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "14px 18px",
          background: "#0f172a", minHeight: 0,
        }}>
          {logs.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span className="mono" style={{ fontSize: 12, color: "#334155" }}>
                {selected ? "Waiting for output…" : "Select a container above"}
              </span>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mono" style={{ display: "flex", gap: 14, marginBottom: 2, lineHeight: 1.7, fontSize: 12 }}>
                <span style={{ color: "#3b82f6", flexShrink: 0, minWidth: 76, userSelect: "none" }}>{log.time}</span>
                <span style={{ color: "#cbd5e1" }}>{log.message}</span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 16px",
          background: "#0a1020",
          borderTop: "1px solid #1e293b",
        }}>
          <span className="mono" style={{ fontSize: 10, color: "#334155" }}>
            {logs.length} line{logs.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => selected && streamLogs(selected)}
            disabled={!selected}
            className="mono"
            style={{
              background: "none", border: "1px solid #1e293b",
              borderRadius: 6, padding: "3px 10px",
              fontSize: 10, color: "#475569", cursor: selected ? "pointer" : "not-allowed",
              opacity: selected ? 1 : 0.4, transition: "all 0.1s",
            }}
            onMouseEnter={e => { if (selected) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
          >
            ↺ Refresh
          </button>
        </div>
      </div>
    </div>
  );
}