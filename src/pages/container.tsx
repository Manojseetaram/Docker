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
      if (status === "running") {
        await stopContainer(id);
      } else {
        await startContainer(id);
      }
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

  return (
    <>
      {showModal && <NewContainerModal onClose={() => setShowModal(false)} />}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{fontFamily:'monospace'}}>Containers</h1>
            <p className="text-xs font-mono text-zinc-500 mt-1">{containers.length} total</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-mono font-bold hover:bg-red-400 transition-all"
            style={{boxShadow:'0 0 20px rgba(239,68,68,0.25)'}}
          >
            + New Container
          </button>
        </div>

        {/* Filters + Search */}
        <div className="flex items-center gap-3">
          {(["all", "running", "stopped"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                filter === f
                  ? "border-red-500/40 text-red-400 bg-red-500/10"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {f}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search containers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ml-auto bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:border-red-500/40 focus:outline-none placeholder-zinc-600 w-52 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead className="bg-[#0a0a0a] text-zinc-500 text-xs border-b border-[#1f1f1f]">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(c => (
                <tr key={c.id} className="border-t border-[#1a1a1a] hover:bg-zinc-900/20 transition-colors">
                  <td className="px-4 py-3 text-white font-semibold">{c.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.image}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded border font-mono ${
                      c.status === "running"
                        ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                        : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 text-xs">{c.id.slice(0, 12)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(c.id, c.status)}
                        disabled={loadingId === c.id}
                        className={`px-3 py-1 rounded text-xs font-mono border transition-all disabled:opacity-40 ${
                          c.status === "running"
                            ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                            : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {loadingId === c.id ? "..." : c.status === "running" ? "Stop" : "Start"}
                      </button>
                      <button
                        onClick={() => handleRemove(c.id)}
                        disabled={loadingId === c.id}
                        className="px-3 py-1 rounded text-xs font-mono border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-zinc-600 font-mono">
                    No containers found
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