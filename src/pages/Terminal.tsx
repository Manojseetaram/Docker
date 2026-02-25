import { useState, useRef, useEffect } from "react";

type Line = { type: "prompt" | "output" | "error"; text: string };

const MOCK_RESPONSES: Record<string, string[]> = {
  "help": [
    "Available commands:",
    "  ps              List containers",
    "  images          List images",
    "  run <image>     Run a container",
    "  stop <name>     Stop a container",
    "  rm <name>       Remove a container",
    "  pull <image>    Pull an image",
    "  version         Show engine version",
    "  clear           Clear terminal",
  ],
  "ps": [
    "CONTAINER ID   NAME            IMAGE              STATUS    PORTS",
    "a1b2c3d4       nginx-prod      nginx:latest       running   80:80",
    "e5f6g7h8       postgres-dev    postgres:16        running   5432:5432",
    "i9j0k1l2       redis-dev       redis:7-alpine     running   6379:6379",
    "m3n4o5p6       api-server      myapp:v2.1         running   3000:3000",
    "q7r8s9t0       debug-app       ubuntu:22.04       running   —",
  ],
  "images": [
    "REPOSITORY   TAG          IMAGE ID       SIZE",
    "nginx        latest       ab12cd34ef56   142 MB",
    "nginx        1.24         gh78ij90kl12   138 MB",
    "postgres     16           mn34op56qr78   412 MB",
    "redis        7-alpine     st90uv12wx34   28 MB",
    "myapp        v2.1         kl78mn90op12   89 MB",
    "rust         1.76         op78qr90st12   1.2 GB",
  ],
  "version": [
    "ManojDocker Engine v0.1.0",
    "Runtime: custom-rust-runtime v0.1",
    "OS/Arch: linux/amd64",
    "API: localhost:9000",
  ],
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "ManojDocker Engine v0.1.0 — Type 'help' for commands" },
    { type: "output", text: "Connected to daemon at localhost:9000" },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [container, setContainer] = useState("nginx-prod");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((h) => [trimmed, ...h]);
    setHistIdx(-1);

    const newLines: Line[] = [{ type: "prompt", text: `[${container}] $ ${trimmed}` }];

    if (trimmed === "clear") {
      setLines([]);
      return;
    }

    const key = trimmed.split(" ")[0].toLowerCase();
    const response = MOCK_RESPONSES[key];

    if (response) {
      response.forEach((l) => newLines.push({ type: "output", text: l }));
    } else if (trimmed.startsWith("run ")) {
      const image = trimmed.slice(4);
      newLines.push({ type: "output", text: `Pulling ${image}...` });
      newLines.push({ type: "output", text: `Creating container from ${image}` });
      newLines.push({ type: "output", text: "Container started: " + Math.random().toString(36).slice(2, 10) });
    } else if (trimmed.startsWith("stop ")) {
      newLines.push({ type: "output", text: `Container '${trimmed.slice(5)}' stopped.` });
    } else if (trimmed.startsWith("pull ")) {
      newLines.push({ type: "output", text: `Pulling from registry: ${trimmed.slice(5)}` });
      newLines.push({ type: "output", text: "Download complete." });
    } else {
      newLines.push({ type: "error", text: `manoj-docker: command not found: ${key}. Try 'help'.` });
    }

    newLines.push({ type: "output", text: "" });
    setLines((prev) => [...prev, ...newLines]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Terminal</h1>
        <p>$ manoj-docker exec -it {container} /bin/sh</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "JetBrains Mono", lineHeight: "30px" }}>Container:</span>
        {["nginx-prod", "postgres-dev", "redis-dev", "api-server"].map((c) => (
          <button
            key={c}
            className={`log-filter-btn ${container === c ? "active" : ""}`}
            onClick={() => setContainer(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="terminal-window">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <div className="terminal-dot red" />
            <div className="terminal-dot yellow" />
            <div className="terminal-dot green" />
          </div>
          <div className="terminal-title">manoj-docker — {container}</div>
        </div>

        <div className="terminal-body" ref={bodyRef}>
          {lines.map((line, i) => (
            <div className="terminal-line" key={i}>
              {line.type === "prompt" && (
                <span className="terminal-cmd">{line.text}</span>
              )}
              {line.type === "output" && (
                <span className="terminal-out">{line.text}</span>
              )}
              {line.type === "error" && (
                <span className="terminal-err">{line.text}</span>
              )}
            </div>
          ))}
        </div>

        <div className="terminal-input-row">
          <span>[{container}] $</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
          />
        </div>
      </div>
    </div>
  );
}