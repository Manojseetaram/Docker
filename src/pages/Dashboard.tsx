const logLines = [
  { time: "08:42:01", level: "info",    msg: "Container nginx-prod started" },
  { time: "08:42:03", level: "success", msg: "Health check passed — nginx-prod" },
  { time: "08:43:15", level: "info",    msg: "Image pulled: postgres:16" },
  { time: "08:45:00", level: "warn",    msg: "Container redis-dev memory at 78%" },
  { time: "08:46:12", level: "success", msg: "Container postgres-dev ready" },
  { time: "08:48:30", level: "error",   msg: "Container debug-app exited with code 1" },
  { time: "08:49:02", level: "info",    msg: "Restarting debug-app..." },
  { time: "08:49:05", level: "success", msg: "debug-app restarted successfully" },
];

const resources = [
  { name: "CPU", value: 34, color: "blue", display: "34%" },
  { name: "Memory", value: 61, color: "green", display: "4.9 / 8 GB" },
  { name: "Disk", value: 45, color: "blue", display: "22.5 / 50 GB" },
  { name: "Network I/O", value: 22, color: "green", display: "↑ 1.2 MB/s  ↓ 3.4 MB/s" },
];

export default function Dashboard() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>$ manoj-docker ps --all --format=overview</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Containers</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">↑ 2 since yesterday</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Running</div>
          <div className="stat-value">5</div>
          <div className="stat-sub">All healthy</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Stopped</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">1 exited with error</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Images</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">2.4 GB total</div>
        </div>
      </div>

      <div className="two-col">
        {/* Resource Usage */}
        <div className="card">
          <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 14 }}>System Resources</div>
          {resources.map((r) => (
            <div className="resource-item" key={r.name}>
              <div className="resource-label">
                <span className="resource-name">{r.name}</span>
                <span className="resource-val">{r.display}</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${r.color}`}
                  style={{ width: `${r.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Containers */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-header">
            <span className="table-title">Running Containers</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>IMAGE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "nginx-prod",    image: "nginx:latest",    status: "running" },
                { name: "postgres-dev",  image: "postgres:16",     status: "running" },
                { name: "redis-dev",     image: "redis:7-alpine",  status: "running" },
                { name: "api-server",    image: "myapp:v2.1",      status: "running" },
                { name: "debug-app",     image: "ubuntu:22.04",    status: "running" },
              ].map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td>{c.image}</td>
                  <td>
                    <span className={`badge ${c.status}`}>
                      <span className="badge-dot" />
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log */}
      <div className="card section-gap" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-header">
          <span className="table-title">Activity Feed</span>
          <span className="chip neutral">Live</span>
        </div>
        <div className="log-stream" style={{ margin: 0, border: 'none', borderRadius: 0 }}>
          {logLines.map((l, i) => (
            <div className="log-line" key={i}>
              <span className="log-time">{l.time}</span>
              <span className={`log-msg ${l.level}`}>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}