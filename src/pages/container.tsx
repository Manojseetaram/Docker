import { useState } from "react";
import { useApp } from "../store/AppContext";
import { ContainerStatus } from "../store/mockData";
import NewContainerModal from "../components/NewContainerModal";

type FilterTab = "all" | "running" | "stopped";

const STATUS_CONFIG: Record<ContainerStatus, { label: string; dot: string; text: string }> = {
  running: { label: "running", dot: "bg-emerald-400 animate-pulse", text: "text-emerald-400" },
  stopped: { label: "stopped", dot: "bg-slate-500",                 text: "text-slate-400"   },
  paused:  { label: "paused",  dot: "bg-yellow-400",                text: "text-yellow-400"  },
  exited:  { label: "exited",  dot: "bg-red-400",                   text: "text-red-400"     },
};

export default function Containers() {
  const { containers, updateContainerStatus, removeContainer } = useApp();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const visible = containers.filter(c => {
    if (filter === "running" && c.status !== "running") return false;
    if (filter === "stopped" && c.status === "running") return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.image.toLowerCase().includes(q) && !c.id.includes(q)) return false;
    }
    return true;
  });

  const handleRemove = async (id: string) => {
    setRemoving(id);
    await new Promise(r => setTimeout(r, 600));
    removeContainer(id);
    setRemoving(null);
  };

  const handleToggle = (id: string, status: ContainerStatus) => {
    if (status === "running") {
      updateContainerStatus(id, "stopped");
    } else {
      updateContainerStatus(id, "running");
    }
  };

  const counts = {
    all: containers.length,
    running: containers.filter(c => c.status === "running").length,
    stopped: containers.filter(c => c.status !== "running").length,
  };

  return (
    <>
      {showModal && <NewContainerModal onClose={() => setShowModal(false)} />}

      <div>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{fontFamily:'Syne,sans-serif'}}>Containers</h1>
            <p className="text-slate-500 font-mono text-xs mt-1">$ manoj-docker ps --all</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 text-black text-sm font-bold rounded-lg hover:bg-cyan-300 transition-all"
            style={{fontFamily:'Syne,sans-serif'}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Container
          </button>
        </div>

        {/* Filters + Search */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex gap-1.5">
            {(["all", "running", "stopped"] as FilterTab[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                  filter === f
                    ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                    : "border-[#232a36] text-slate-500 hover:border-[#2e3a4e] hover:text-slate-300"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="ml-1.5 text-[10px] opacity-70">{counts[f]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#0d1017] border border-[#232a36] rounded-lg px-3 py-2 focus-within:border-cyan-400 transition-colors min-w-[220px]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#445060" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, image, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-white text-xs font-mono flex-1 outline-none placeholder-slate-600"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-600 hover:text-white transition-colors text-sm">✕</button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#111418] border border-[#232a36] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0d1017] border-b border-[#232a36]">
                {["ID","Name","Image","Status","CPU","Memory","Ports","Uptime","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-mono text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(c => {
                const cfg = STATUS_CONFIG[c.status];
                const isRemoving = removing === c.id;
                return (
                  <tr key={c.id} className={`border-b border-[#181e28] hover:bg-slate-800/20 transition-colors last:border-0 ${isRemoving ? "opacity-40" : ""}`}>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{c.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-white font-semibold">{c.name}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{c.image}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{c.cpu}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{c.memory}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{c.ports}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{c.uptime}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {/* Start/Stop */}
                        <button
                          onClick={() => handleToggle(c.id, c.status)}
                          title={c.status === "running" ? "Stop" : "Start"}
                          className={`p-1.5 rounded-lg text-[11px] font-mono border transition-colors ${
                            c.status === "running"
                              ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                              : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {c.status === "running" ? "■" : "▶"}
                        </button>
                        {/* Logs */}
                        <button
                          title="View logs"
                          className="p-1.5 rounded-lg text-[11px] font-mono border border-[#232a36] text-slate-500 hover:border-[#2e3a4e] hover:text-slate-200 transition-colors"
                        >
                          ≡
                        </button>
                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(c.id)}
                          disabled={isRemoving}
                          title="Remove"
                          className="p-1.5 rounded-lg text-[11px] font-mono border border-[#232a36] text-slate-500 hover:border-red-500/40 hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          {isRemoving ? "…" : "✕"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600 font-mono text-sm gap-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              {search ? `No containers matching "${search}"` : "No containers found"}
              {!search && (
                <button onClick={() => setShowModal(true)} className="text-cyan-400 text-xs hover:underline">+ Create one</button>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 text-[11px] font-mono text-slate-600">
          Showing {visible.length} of {containers.length} containers
        </div>
      </div>
    </>
  );
}