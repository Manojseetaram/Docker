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
    <div className="space-y-7 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#eff6ff", color: "#2563eb" }}
            >
              OVERVIEW
            </span>
          </div>
          <h1 className="text-[28px] font-black text-black tracking-tight leading-none" style={{ fontFamily: "Syne, sans-serif" }}>
            Dashboard
          </h1>
          <p className="text-[12px] font-mono mt-1.5" style={{ color: "#93c5fd" }}>
            manoj-docker engine · localhost:9000
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all"
          style={{
            border: "1.5px solid #dbeafe",
            color: "#2563eb",
            background: "white",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#93c5fd";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "white";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#dbeafe";
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Containers" value={stats.total} sub={`${stats.running} active`} color="#2563eb" bg="#eff6ff" border="#dbeafe" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        }/>
        <StatCard label="Running" value={stats.running} sub="Active containers" color="#16a34a" bg="#f0fdf4" border="#bbf7d0" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        }/>
        <StatCard label="Stopped" value={stats.stopped} sub="Idle containers" color="#b45309" bg="#fffbeb" border="#fde68a" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>
        }/>
        <StatCard label="Images" value={stats.images} sub="Locally cached" color="#7c3aed" bg="#f5f3ff" border="#ddd6fe" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        }/>
      </div>

      {/* Running Containers table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e8f0fe", boxShadow: "0 1px 20px rgba(37,99,235,0.05)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #eef3ff", background: "white" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#eff6ff" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "#2563eb", boxShadow: "0 0 5px rgba(37,99,235,0.5)" }} />
            </div>
            <div>
              <span className="text-black font-bold text-[13px]" style={{ fontFamily: "Syne, sans-serif" }}>
                Running Containers
              </span>
              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>
                {runningContainers.length}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono" style={{ color: "#93c5fd" }}>
            Auto-refreshes every 5s
          </span>
        </div>

        <div style={{ background: "white" }}>
          {runningContainers.length === 0 ? (
            <div className="py-14 text-center">
              <div className="text-[32px] mb-3">📦</div>
              <p className="text-[13px] font-mono font-bold" style={{ color: "#93c5fd" }}>No running containers</p>
              <p className="text-[11px] font-mono mt-1" style={{ color: "#bfdbfe" }}>Start a container to see it here</p>
            </div>
          ) : (
            runningContainers.map((c, idx) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-6 py-4 transition-colors"
                style={{
                  borderTop: idx === 0 ? "none" : "1px solid #f0f7ff",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#fafcff"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "white"}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.5)" }}
                  />
                  <div>
                    <span className="text-black font-bold text-[13px]" style={{ fontFamily: "Syne, sans-serif" }}>
                      {c.name}
                    </span>
                    <span className="ml-3 font-mono text-[11px]" style={{ color: "#93c5fd" }}>
                      {c.id.slice(0, 12)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-mono" style={{ color: "#60a5fa" }}>{c.image}</span>
                  <span
                    className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}
                  >
                    ● {c.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, color, bg, border, icon
}: {
  label: string; value: number; sub: string;
  color: string; bg: string; border: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 transition-all"
      style={{
        background: "white",
        border: `1px solid ${border}`,
        boxShadow: "0 1px 12px rgba(37,99,235,0.04)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(37,99,235,0.10)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 12px rgba(37,99,235,0.04)"}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10.5px] font-mono font-bold uppercase tracking-widest" style={{ color }}>
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: bg, color }}
        >
          {icon}
        </div>
      </div>
      <div className="font-black text-[36px] leading-none tracking-tight" style={{ color, fontFamily: "Syne, sans-serif" }}>
        {value}
      </div>
      <div className="text-[11px] font-mono mt-2" style={{ color }}>
        {sub}
      </div>
    </div>
  );
}