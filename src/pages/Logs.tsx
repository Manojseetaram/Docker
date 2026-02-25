import { useState } from "react";
import { useApp } from "../store/AppContext";

type Level = "all" | "info" | "success" | "warn" | "error";

const LEVEL_COLORS: Record<string, string> = {
  info:    "text-cyan-400",
  success: "text-emerald-400",
  warn:    "text-yellow-400",
  error:   "text-red-400",
};

export default function Logs() {
  const { logs, containers } = useApp();
  const [containerFilter, setContainerFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState<Level>("all");
  const [search, setSearch] = useState("");

  const allContainerNames = ["all", ...Array.from(new Set(logs.map(l => l.container)))];

  const visible = logs.filter(l => {
    if (containerFilter !== "all" && l.container !== containerFilter) return false;
    if (levelFilter !== "all" && l.level !== levelFilter) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase()) && !l.container.includes(search)) return false;
    return true;
  });

  const levels: Level[] = ["all", "info", "success", "warn", "error"];
  const levelCounts: Record<Level, number> = {
    all:     logs.length,
    info:    logs.filter(l => l.level === "info").length,
    success: logs.filter(l => l.level === "success").length,
    warn:    logs.filter(l => l.level === "warn").length,
    error:   logs.filter(l => l.level === "error").length,
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{fontFamily:'Syne,sans-serif'}}>Logs</h1>
          <p className="text-slate-500 font-mono text-xs mt-1">
            $ manoj-docker logs {containerFilter !== "all" ? containerFilter : "<all>"} --follow --timestamps
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-emerald-400/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-400/20">● Streaming</span>
          <button
            onClick={() => {}}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#232a36] text-slate-400 hover:text-white hover:border-[#2e3a4e] transition-colors"
          >
            ↓ Export
          </button>
        </div>
      </div>

      {/* Container tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {allContainerNames.map(name => (
          <button
            key={name}
            onClick={() => setContainerFilter(name)}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
              containerFilter === name
                ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                : "border-[#232a36] text-slate-500 hover:border-[#2e3a4e] hover:text-slate-300"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Level filter + search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-1.5">
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`text-[11px] font-mono px-2.5 py-1.5 rounded-lg border transition-colors ${
                levelFilter === l
                  ? l === "all"
                    ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                    : `border-current ${LEVEL_COLORS[l]} bg-current/10`
                  : "border-[#232a36] text-slate-600 hover:border-[#2e3a4e] hover:text-slate-400"
              }`}
            >
              <span className={levelFilter === l && l !== "all" ? LEVEL_COLORS[l] : ""}>
                {l} ({levelCounts[l]})
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-[#0d1017] border border-[#232a36] rounded-lg px-3 py-1.5 focus-within:border-cyan-400 transition-colors flex-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#445060" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search log messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-white text-[11px] font-mono flex-1 outline-none placeholder-slate-600"
          />
          {search && <button onClick={() => setSearch("")} className="text-slate-600 hover:text-white text-xs">✕</button>}
        </div>
      </div>

      {/* Log viewer */}
      <div className="bg-[#060810] border border-[#232a36] rounded-xl overflow-hidden" style={{minHeight: 400}}>
        <div className="px-4 py-2 border-b border-[#1a2030] flex items-center gap-2 bg-[#0a0c12]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="font-mono text-[11px] text-slate-600 ml-2">
            {containerFilter === "all" ? "all containers" : containerFilter} — {visible.length} entries
          </span>
        </div>

        <div className="p-4 max-h-[calc(100vh-360px)] overflow-y-auto font-mono text-[12px] leading-6">
          {visible.length === 0 ? (
            <div className="text-center text-slate-700 py-12">No log entries match your filter.</div>
          ) : (
            visible.map((l, i) => (
              <div key={i} className="flex gap-3 hover:bg-slate-800/20 px-1 rounded group">
                <span className="text-slate-700 min-w-[62px] select-none">{l.time}</span>
                <span className={`${LEVEL_COLORS[l.level]} min-w-[60px] text-[10px] uppercase tracking-wider flex items-center`}>
                  [{l.level}]
                </span>
                <span className="text-violet-300/80 min-w-[120px] truncate">{l.container}</span>
                <span className="text-slate-300 flex-1">{l.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}