// ⚠️ IMPORTANT: Save this file as "Containers.tsx" (capital C) to match the import in App.tsx
// The original file was named "container.tsx" (lowercase) which caused the Images page routing to break
// because React's switch/case falls through on import errors

import { useMemo, useState } from "react";
import { useApp } from "../store/AppContext";
import NewContainerModal from "../components/NewContainerModal";

export default function Containers() {
  const { containers, startContainer, stopContainer, removeContainer } = useApp();

  const [filter, setFilter] = useState<"all" | "running" | "stopped">("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return containers.filter(c => {
      if (filter === "running" && c.status !== "running") return false;
      if (filter === "stopped" && c.status === "running") return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [containers, filter, search]);

  const handleToggle = async (id: string, status: string) => {
    setLoadingId(id);
    try {
      status === "running" ? await stopContainer(id) : await startContainer(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    setLoadingId(id);
    try {
      await removeContainer(id);
    } finally {
      setLoadingId(null);
    }
  };

  const runningCount = containers.filter(c => c.status === "running").length;

  return (
    <>
      {showModal && <NewContainerModal onClose={() => setShowModal(false)} />}

      <div className="space-y-7 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#eff6ff", color: "#2563eb" }}
              >
                CONTAINERS
              </span>
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#f0fdf4", color: "#16a34a" }}
              >
                {runningCount} RUNNING
              </span>
            </div>
            <h1
              className="text-[28px] font-black text-black tracking-tight leading-none"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Containers
            </h1>
            <p className="text-[12px] font-mono mt-1.5" style={{ color: "#93c5fd" }}>
              {containers.length} total · {runningCount} active
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono font-black text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(37,99,235,0.5)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(37,99,235,0.35)"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Container
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "#f0f7ff" }}>
            {(["all", "running", "stopped"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3.5 py-1.5 rounded-lg text-[11px] font-mono font-bold capitalize transition-all"
                style={
                  filter === f
                    ? { background: "white", color: "#2563eb", boxShadow: "0 1px 6px rgba(37,99,235,0.15)" }
                    : { color: "#93c5fd", background: "transparent" }
                }
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search containers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-xl px-4 py-2 pl-9 text-[12px] text-black font-mono focus:outline-none transition-all w-52"
              style={{ background: "white", border: "1.5px solid #dbeafe" }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#2563eb"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#dbeafe"}
            />
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid #e8f0fe", boxShadow: "0 1px 20px rgba(37,99,235,0.05)" }}
        >
          <table className="w-full text-sm font-mono">
            <thead style={{ background: "#f8faff", borderBottom: "1px solid #e8f0fe" }}>
              <tr>
                {["Container", "Image", "Status", "ID", "Actions"].map((h, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest ${i === 4 ? "text-right" : "text-left"}`}
                    style={{ color: "#60a5fa" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ background: "white" }}>
              {visible.map((c, idx) => (
                <tr
                  key={c.id}
                  className="transition-colors"
                  style={{ borderTop: idx === 0 ? "none" : "1px solid #f0f7ff" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fafcff"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "white"}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: c.status === "running" ? "#22c55e" : "#fbbf24",
                          boxShadow: c.status === "running" ? "0 0 6px rgba(34,197,94,0.5)" : "0 0 6px rgba(251,191,36,0.4)",
                        }}
                      />
                      <span className="text-black font-bold text-[13px]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[12px]" style={{ color: "#60a5fa" }}>
                    {c.image}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full"
                      style={
                        c.status === "running"
                          ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }
                          : { background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" }
                      }
                    >
                      ● {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-lg"
                      style={{ background: "#f8faff", color: "#93c5fd" }}
                    >
                      {c.id.slice(0, 12)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(c.id, c.status)}
                        disabled={loadingId === c.id}
                        className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                        style={
                          c.status === "running"
                            ? { border: "1.5px solid #fde68a", color: "#b45309", background: "white" }
                            : { border: "1.5px solid #bbf7d0", color: "#16a34a", background: "white" }
                        }
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            c.status === "running" ? "#fffbeb" : "#f0fdf4";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "white";
                        }}
                      >
                        {loadingId === c.id ? "…" : c.status === "running" ? "Stop" : "Start"}
                      </button>
                      <button
                        onClick={() => handleRemove(c.id)}
                        disabled={loadingId === c.id}
                        className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                        style={{ border: "1.5px solid #fecaca", color: "#ef4444", background: "white" }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "#fff1f2";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = "white";
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="text-[32px] mb-3">📦</div>
                    <p className="text-[13px] font-mono font-bold" style={{ color: "#93c5fd" }}>
                      {search ? "No containers match your search" : "No containers found"}
                    </p>
                    <p className="text-[11px] font-mono mt-1" style={{ color: "#bfdbfe" }}>
                      Create a new container to get started
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}