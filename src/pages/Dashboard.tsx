import { useApp } from "../store/AppContext";

export default function Dashboard() {
  const { containers, images, logs } = useApp();
  const running = containers.filter(c => c.status === "running").length;
  const stopped = containers.filter(c => c.status !== "running").length;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{fontFamily:'Syne,sans-serif'}}>Dashboard</h1>
        <p className="text-slate-500 font-mono text-xs mt-1">$ manoj-docker ps --format=overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Containers", value: containers.length, sub: `${running} running`,    top: "border-t-cyan-400"    },
          { label: "Running",          value: running,            sub: "All healthy",           top: "border-t-emerald-400" },
          { label: "Stopped",          value: stopped,            sub: "Check exited logs",     top: "border-t-red-400"     },
          { label: "Images",           value: images.length,      sub: "Local registry",        top: "border-t-violet-400"  },
        ].map((s) => {
          const vals: Record<string, string> = {
            "border-t-cyan-400":    "text-cyan-400",
            "border-t-emerald-400": "text-emerald-400",
            "border-t-red-400":     "text-red-400",
            "border-t-violet-400":  "text-violet-400",
          };
          return (
            <div key={s.label} className={`bg-[#111418] border border-[#232a36] border-t-2 ${s.top} rounded-xl p-5 hover:-translate-y-0.5 transition-transform`}>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">{s.label}</div>
              <div className={`text-4xl font-extrabold mb-1 ${vals[s.top]}`} style={{fontFamily:'Syne,sans-serif'}}>{s.value}</div>
              <div className="text-[11px] font-mono text-slate-500">{s.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Resources */}
        <div className="bg-[#111418] border border-[#232a36] rounded-xl p-5">
          <div className="text-sm font-bold text-white mb-4" style={{fontFamily:'Syne,sans-serif'}}>System Resources</div>
          {[
            { name: "CPU Usage",   pct: 34, display: "34%",               bar: "bg-cyan-400"   },
            { name: "Memory",      pct: 61, display: "4.9 / 8 GB",        bar: "bg-emerald-400"},
            { name: "Disk",        pct: 45, display: "22.5 / 50 GB",      bar: "bg-cyan-400"   },
            { name: "Network I/O", pct: 22, display: "↑1.2  ↓3.4 MB/s",  bar: "bg-violet-400" },
          ].map(r => (
            <div key={r.name} className="mb-3.5 last:mb-0">
              <div className="flex justify-between text-[11px] font-mono mb-1.5">
                <span className="text-slate-400">{r.name}</span>
                <span className="text-white">{r.display}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${r.bar} rounded-full`} style={{width:`${r.pct}%`}} />
              </div>
            </div>
          ))}
        </div>

        {/* Running containers */}
        <div className="bg-[#111418] border border-[#232a36] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#232a36] text-sm font-bold text-white" style={{fontFamily:'Syne,sans-serif'}}>Running Containers</div>
          <div>
            {containers.filter(c => c.status === "running").slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/30 border-b border-[#1a2030] last:border-0 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                <span className="text-white text-xs font-mono font-semibold flex-1 truncate">{c.name}</span>
                <span className="text-slate-500 text-[10px] font-mono">{c.image}</span>
                <span className="text-cyan-400 text-[10px] font-mono">{c.cpu}</span>
              </div>
            ))}
            {containers.filter(c => c.status === "running").length === 0 && (
              <div className="px-4 py-8 text-center text-slate-600 text-xs font-mono">No running containers</div>
            )}
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-[#111418] border border-[#232a36] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#232a36] flex items-center justify-between">
          <span className="text-sm font-bold text-white" style={{fontFamily:'Syne,sans-serif'}}>Activity Feed</span>
          <span className="text-[10px] font-mono bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-400/20">● Live</span>
        </div>
        <div className="max-h-52 overflow-y-auto">
          {logs.slice(0, 15).map((l, i) => {
            const colors: Record<string, string> = { info: "text-cyan-400", success: "text-emerald-400", warn: "text-yellow-400", error: "text-red-400" };
            return (
              <div key={i} className="flex gap-4 px-4 py-1.5 hover:bg-slate-800/20 border-b border-[#181e28] last:border-0 font-mono text-[11px]">
                <span className="text-slate-600 min-w-[60px]">{l.time}</span>
                <span className={`${colors[l.level]} min-w-[56px] text-[9px] uppercase tracking-wider`}>[{l.level}]</span>
                <span className="text-slate-400 truncate">{l.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}