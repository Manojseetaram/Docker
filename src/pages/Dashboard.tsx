import { useMemo } from "react";
import { useApp } from "../store/AppContext";

export default function Dashboard() {
  const { containers, images, refreshContainers, refreshImages } = useApp();

  const stats = useMemo(() => {
    const running = containers.filter(c => c.status === "running").length;
    const stopped = containers.length - running;
    return { total: containers.length, running, stopped, images: images.length };
  }, [containers, images]);

  const runningContainers = useMemo(
    () => containers.filter(c => c.status === "running").slice(0, 5),
    [containers]
  );

  const handleRefresh = () => {
    refreshContainers();
    refreshImages();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{fontFamily:'monospace'}}>Dashboard</h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">$ manoj-docker overview</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 text-xs font-mono transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} accent="#ef4444" sub={`${stats.running} running`} />
        <StatCard label="Running" value={stats.running} accent="#22c55e" sub="Active" />
        <StatCard label="Stopped" value={stats.stopped} accent="#eab308" sub="Idle" />
        <StatCard label="Images" value={stats.images} accent="#ef4444" sub="Local" />
      </div>

      {/* Running Containers */}
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1f1f1f] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" style={{boxShadow:'0 0 6px rgba(239,68,68,0.6)'}} />
          <span className="text-white font-semibold text-sm font-mono">Running Containers</span>
        </div>

        {runningContainers.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm font-mono">
            No running containers
          </div>
        ) : (
          runningContainers.map(c => (
            <div
              key={c.id}
              className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] last:border-0 hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-mono text-sm">{c.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-zinc-500 text-xs font-mono">{c.image}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  {c.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, sub }: { label: string; value: number; accent: string; sub: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-5 hover:border-zinc-700 transition-colors">
      <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">{label}</div>
      <div className="text-3xl font-bold font-mono" style={{ color: accent, textShadow: `0 0 20px ${accent}40` }}>
        {value}
      </div>
      <div className="text-xs font-mono text-zinc-500 mt-1">{sub}</div>
    </div>
  );
}