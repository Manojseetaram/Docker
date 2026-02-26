import { useMemo, useState } from "react";
import { useApp } from "../store/AppContext";
import NewContainerModal from "../components/NewContainerModal";

// ⚠️ Save this file as pages/Containers.tsx (capital C)

export default function Containers() {
  const { containers: raw, startContainer, stopContainer, removeContainer } = useApp();
  const containers = raw ?? [];

  const [filter, setFilter] = useState<"all" | "running" | "stopped">("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return containers.filter(c => {
      if (!c) return false;
      if (filter === "running" && c.status !== "running") return false;
      if (filter === "stopped" && c.status === "running") return false;
      if (search && !(c.name ?? "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [containers, filter, search]);
const handleToggle = async (name: string, status: string) => {
  setLoadingId(name);
  try {
    if (status === "running") {
      await stopContainer(name);
    } else {
      await startContainer(name);
    }
  } catch (err: any) {
    console.error("Error starting/stopping container:", name);
    console.error(err); // <-- full error object
    if (err instanceof Error) {
      console.error("Error message:", err.message);
    }
    if ("payload" in err) {
      console.error("Tauri payload:", err.payload);
    }
  } finally {
    setLoadingId(null);
  }
};

const handleRemove = async (name: string) => {
  setLoadingId(name);
  try {
    await removeContainer(name);
  } finally {
    setLoadingId(null);
  }
};

  const running = containers.filter(c => c.status === "running").length;

  return (
    <>
      {showModal && <NewContainerModal onClose={() => setShowModal(false)} />}

      <div style={{ maxWidth: 900 }}>
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Containers</h1>
            <p className="page-sub">{containers.length} total · {running} running</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Container
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          {/* Filter pills */}
          <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border)" }}>
            {(["all", "running", "stopped"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "JetBrains Mono, monospace",
                  textTransform: "capitalize",
                  background: filter === f ? "var(--surface)" : "transparent",
                  color: filter === f ? "var(--blue)" : "var(--text-4)",
                  boxShadow: filter === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.12s",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginLeft: "auto" }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-4)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="input"
              style={{ paddingLeft: 32, width: 220 }}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Status</th>
                <th>ID</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" style={{ margin: "0 auto 10px" }}>
                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                      <p>{search ? "No containers match your search" : "No containers found"}</p>
                      <p style={{ marginTop: 4 }}>Click "New Container" to create one</p>
                    </div>
                  </td>
                </tr>
              ) : (
              visible.map((c, idx) => {
  const containerKey = c.id ?? `row-${idx}`;
  const isRunning = c.status === "running";
  const isLoading = loadingId === c.name; // ✅ compare with name, not id

  return (
    <tr key={containerKey}>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: isRunning ? "#22c55e" : "#f59e0b",
            boxShadow: isRunning ? "0 0 5px rgba(34,197,94,0.5)" : "none",
          }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>
            {c.name ?? "unnamed"}
          </span>
        </div>
      </td>
      <td>
        <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>
          {c.image ?? "—"}
        </span>
      </td>
      <td>
        <span className={`badge ${isRunning ? "badge-green" : "badge-yellow"}`}>
          ● {c.status ?? "unknown"}
        </span>
      </td>
      <td>
        <span className="mono" style={{
          fontSize: 11,
          color: "var(--text-4)",
          background: "var(--surface-2)",
          padding: "2px 7px",
          borderRadius: 6
        }}>
          {(c.id ?? "").slice(0, 12) || "—"}
        </span>
      </td>
      <td style={{ textAlign: "right" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
          <button
            className="btn-ghost"
            disabled={isLoading}
            onClick={() => handleToggle(c.name ?? "", c.status ?? "")} // ✅ pass name
            style={{
              color: isRunning ? "red" : "green",
              borderColor: isRunning ? "var(--yellow-border)" : "var(--green-border)"
            }}
          >
            {isLoading ? "…" : isRunning ? "Stop" : "Start"}
          </button>

          <button
            className="btn btn-danger"
            disabled={isLoading}
            onClick={() => handleRemove(c.name ?? "")} // ✅ pass name
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
})
)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}