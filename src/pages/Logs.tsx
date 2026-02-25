import { useEffect, useState } from "react";
import { useApp } from "../store/AppContext";

export default function Logs() {
  const { logs, containers, streamLogs } = useApp();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (selected) streamLogs(selected);
  }, [selected]);

  const selectedName = containers.find(c => c.id === selected)?.name;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#f0fdf4", color: "#16a34a" }}
            >
              LIVE STREAM
            </span>
            {selected && selectedName && (
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#eff6ff", color: "#2563eb" }}
              >
                {selectedName}
              </span>
            )}
          </div>
          <h1
            className="text-[28px] font-black text-black tracking-tight leading-none"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Logs
          </h1>
          <p className="text-[12px] font-mono mt-1.5" style={{ color: "#93c5fd" }}>
            {selected ? `Streaming from ${selectedName}` : "Select a container to stream logs"}
          </p>
        </div>

        {/* Container selector */}
        <select
          onChange={e => setSelected(e.target.value)}
          value={selected}
          className="rounded-xl px-4 py-2.5 text-black font-mono text-[12px] focus:outline-none transition-all"
          style={{
            background: "white",
            border: "1.5px solid #dbeafe",
            color: selected ? "#0f172a" : "#93c5fd",
          }}
          onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "#2563eb"}
          onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "#dbeafe"}
        >
          <option value="">Select container…</option>
          {containers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.status}
            </option>
          ))}
        </select>
      </div>

      {/* Log panel */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: "1px solid #e8f0fe",
          boxShadow: "0 1px 20px rgba(37,99,235,0.05)",
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ background: "#0f172a", borderBottom: "1px solid #1e293b" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#fbbf24" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
            </div>
            <span className="font-mono text-[11px] ml-2" style={{ color: "#475569" }}>
              {selectedName ? `${selectedName} — stdout/stderr` : "No container selected"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: selected ? "#22c55e" : "#475569", boxShadow: selected ? "0 0 6px rgba(34,197,94,0.7)" : "none" }} />
            <span className="font-mono text-[10px]" style={{ color: selected ? "#22c55e" : "#475569" }}>
              {selected ? "streaming" : "idle"}
            </span>
          </div>
        </div>

        {/* Log body */}
        <div
          className="p-5 font-mono text-[12px] h-[500px] overflow-y-auto"
          style={{ background: "#0f172a" }}
        >
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <p className="text-[12px] font-mono" style={{ color: "#334155" }}>
                {selected ? "Waiting for log output…" : "Select a container above to start streaming"}
              </p>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-3 mb-1 leading-relaxed group">
                <span
                  className="flex-shrink-0 text-[10px] pt-0.5"
                  style={{ color: "#2563eb", minWidth: "72px" }}
                >
                  {log.time}
                </span>
                <span style={{ color: "#cbd5e1" }}>{log.message}</span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-2"
          style={{ background: "#0a1020", borderTop: "1px solid #1e293b" }}
        >
          <span className="font-mono text-[10px]" style={{ color: "#334155" }}>
            {logs.length} line{logs.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setSelected(selected)}
            disabled={!selected}
            className="font-mono text-[10px] px-2.5 py-1 rounded-lg transition-all disabled:opacity-30"
            style={{ border: "1px solid #1e293b", color: "#475569" }}
            onMouseEnter={e => selected && ((e.currentTarget as HTMLButtonElement).style.borderColor = "#2563eb", (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b", (e.currentTarget as HTMLButtonElement).style.color = "#475569")}
          >
            ↺ Refresh
          </button>
        </div>
      </div>
    </div>
  );
}