import { useState } from "react";

const allContainers = [
  { id: "a1b2c3d4", name: "nginx-prod",    image: "nginx:latest",    status: "running", cpu: "2.1%",  mem: "45 MB",  ports: "80:80, 443:443", uptime: "2d 4h" },
  { id: "e5f6g7h8", name: "postgres-dev",  image: "postgres:16",     status: "running", cpu: "5.4%",  mem: "256 MB", ports: "5432:5432",       uptime: "1d 2h" },
  { id: "i9j0k1l2", name: "redis-dev",     image: "redis:7-alpine",  status: "running", cpu: "0.3%",  mem: "8 MB",   ports: "6379:6379",       uptime: "3d 8h" },
  { id: "m3n4o5p6", name: "api-server",    image: "myapp:v2.1",      status: "running", cpu: "12.2%", mem: "180 MB", ports: "3000:3000",       uptime: "5h 20m" },
  { id: "q7r8s9t0", name: "debug-app",     image: "ubuntu:22.04",    status: "running", cpu: "0.1%",  mem: "12 MB",  ports: "—",               uptime: "10m" },
  { id: "u1v2w3x4", name: "old-worker",    image: "myapp:v1.9",      status: "stopped", cpu: "0%",    mem: "0 MB",   ports: "—",               uptime: "Exited" },
  { id: "y5z6a7b8", name: "test-nginx",    image: "nginx:1.24",      status: "stopped", cpu: "0%",    mem: "0 MB",   ports: "—",               uptime: "Exited" },
  { id: "c9d0e1f2", name: "broken-svc",    image: "node:20-alpine",  status: "stopped", cpu: "0%",    mem: "0 MB",   ports: "—",               uptime: "Error" },
];

export default function Containers() {
  const [filter, setFilter] = useState<"all" | "running" | "stopped">("all");
  const [search, setSearch] = useState("");

  const visible = allContainers.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.name.includes(search) && !c.image.includes(search)) return false;
    return true;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Containers</h1>
        <p>$ manoj-docker ps --all</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {(["all", "running", "stopped"] as const).map((f) => (
            <button
              key={f}
              className={`log-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="search-bar">
            <span style={{ fontSize: 11 }}>🔍</span>
            <input
              placeholder="Search containers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm">+ New Container</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>CONTAINER ID</th>
              <th>NAME</th>
              <th>IMAGE</th>
              <th>STATUS</th>
              <th>CPU</th>
              <th>MEMORY</th>
              <th>PORTS</th>
              <th>UPTIME</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => (
              <tr key={c.id}>
                <td>{c.id.slice(0, 8)}</td>
                <td style={{ color: "#e8edf5", fontWeight: 600 }}>{c.name}</td>
                <td>{c.image}</td>
                <td>
                  <span className={`badge ${c.status}`}>
                    <span className="badge-dot" />
                    {c.status}
                  </span>
                </td>
                <td>{c.cpu}</td>
                <td>{c.mem}</td>
                <td>{c.ports}</td>
                <td>{c.uptime}</td>
                <td>
                  <div className="actions-row">
                    {c.status === "running" ? (
                      <button className="btn btn-danger btn-sm btn-icon" title="Stop">■</button>
                    ) : (
                      <button className="btn btn-success btn-sm btn-icon" title="Start">▶</button>
                    )}
                    <button className="btn btn-ghost btn-sm btn-icon" title="Logs">≡</button>
                    <button className="btn btn-ghost btn-sm btn-icon" title="Terminal">›_</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="empty-state">
            <span>No containers match your filter.</span>
          </div>
        )}
      </div>
    </div>
  );
}