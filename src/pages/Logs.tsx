import { useState } from "react";

const containers = ["nginx-prod", "postgres-dev", "redis-dev", "api-server", "debug-app"];

const generateLogs = (name: string) => {
  const base: { time: string; level: string; msg: string }[] = {
    "nginx-prod":   [
      { time: "09:01:02", level: "info",    msg: '172.17.0.1 - - "GET /health HTTP/1.1" 200 2' },
      { time: "09:01:05", level: "info",    msg: '172.17.0.4 - - "POST /api/data HTTP/1.1" 201 512' },
      { time: "09:01:10", level: "warn",    msg: "upstream response time 1.23s for /api/slow" },
      { time: "09:01:22", level: "info",    msg: '172.17.0.2 - - "GET / HTTP/1.1" 200 4096' },
      { time: "09:02:00", level: "success", msg: "Health probe OK — serving" },
      { time: "09:03:14", level: "error",   msg: "connect() failed (111: connection refused) while connecting to upstream" },
      { time: "09:03:15", level: "info",    msg: "Retrying upstream connection..." },
      { time: "09:03:17", level: "success", msg: "Upstream reconnected" },
    ],
    "api-server": [
      { time: "09:00:01", level: "info",    msg: "Server started on port 3000" },
      { time: "09:00:03", level: "success", msg: "Database connection established" },
      { time: "09:00:10", level: "info",    msg: "GET /api/users 200 — 14ms" },
      { time: "09:01:05", level: "warn",    msg: "Rate limit exceeded for IP 10.0.0.5" },
      { time: "09:02:33", level: "error",   msg: "Unhandled rejection: TypeError: Cannot read property 'id'" },
    ],
  }[name] ?? [
    { time: "09:00:00", level: "info",    msg: `${name} starting...` },
    { time: "09:00:02", level: "success", msg: `${name} ready` },
    { time: "09:01:00", level: "info",    msg: "Health check ping received" },
    { time: "09:01:01", level: "success", msg: "Pong" },
  ];
  return base;
};

export default function Logs() {
  const [selected, setSelected] = useState("nginx-prod");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const logs = generateLogs(selected).filter(
    (l) => levelFilter === "all" || l.level === levelFilter
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Logs</h1>
        <p>$ manoj-docker logs {selected} --follow --timestamps</p>
      </div>

      {/* Container selector */}
      <div className="log-selector" style={{ marginBottom: 12 }}>
        {containers.map((c) => (
          <button
            key={c}
            className={`log-filter-btn ${selected === c ? "active" : ""}`}
            onClick={() => setSelected(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Level filter */}
      <div className="log-selector">
        {["all", "info", "success", "warn", "error"].map((l) => (
          <button
            key={l}
            className={`log-filter-btn ${levelFilter === l ? "active" : ""}`}
            onClick={() => setLevelFilter(l)}
          >
            {l}
          </button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <button className="btn btn-ghost btn-sm">↓ Download</button>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 6 }}>Clear</button>
        </div>
      </div>

      <div className="log-full">
        {logs.map((l, i) => (
          <div className="log-line" key={i}>
            <span className="log-time">{l.time}</span>
            <span
              style={{
                padding: "0 6px",
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                textTransform: "uppercase",
                opacity: 0.6,
                minWidth: 58,
              }}
              className={`log-msg ${l.level}`}
            >
              [{l.level}]
            </span>
            <span className={`log-msg ${l.level}`}>{l.msg}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="empty-state">No log entries match filter.</div>
        )}
      </div>
    </div>
  );
}