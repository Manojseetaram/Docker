import { useState, useRef, useEffect } from "react";
import { useApp } from "../store/AppContext";
import { listen } from "@tauri-apps/api/event";

type LineType = "prompt" | "output" | "error" | "info";
interface Line { type: LineType; text: string; }

const LINE_COLOR: Record<LineType, string> = {
  prompt: "#60a5fa",
  output: "#cbd5e1",
  error:  "#f87171",
  info:   "#475569",
};

export default function Terminal() {
const { containers: rawC, images: rawI, runContainer, pullImage, execIntoContainer } = useApp();
  const containers = rawC ?? [];
  const images = rawI ?? [];

  const [lines, setLines] = useState<Line[]>([
    { type: "info",   text: "  ManojDocker Engine v0.1.0" },
    { type: "info",   text: "  Connected to daemon at localhost:9000" },
    { type: "output", text: '  Type "help" for available commands.' },
    { type: "info",   text: "  ─────────────────────────────────────" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [selectedContainer, setSelectedContainer] = useState(
    containers.find(c => c.status === "running")?.id ?? ""
  );

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (containers.length > 0 && !selectedContainer) {
      const r = containers.find(c => c.status === "running");
      if (r) setSelectedContainer(r.id ?? "");
    }
  }, [containers]);
useEffect(() => {
  const unlisten = listen<string>("exec-output", (event) => {
    push([
      {
        type: "output",
        text: `  ${event.payload}`,
      },
    ]);
  });

  return () => {
    unlisten.then(f => f());
  };
}, []);
  const push = (newLines: Line[]) => setLines(prev => [...prev, ...newLines]);

  const execute = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setHistIdx(-1);

    const ctx = containers.find(c => c.id === selectedContainer);
    push([{ type: "prompt", text: `[${ctx?.name ?? "engine"}] $ ${cmd}` }]);

    const [op, ...args] = cmd.split(" ");
    let out: Line[] = [];

    switch (op) {
      case "help":
        out = [
          { type: "output", text: "  Available commands:" },
          { type: "output", text: "  ──────────────────────────────────────────" },
          { type: "output", text: "  ps                  List all containers" },
          { type: "output", text: "  images              List local images" },
          { type: "output", text: "  run <img> [name]    Create and start container" },
          { type: "output", text: "  pull <img>          Pull image from registry" },
          { type: "output", text: "  clear               Clear terminal output" },
        ];
        break;

      case "clear":
        setLines([]);
        return;

      case "ps":
        out = containers.length
          ? [
              { type: "output", text: "  CONTAINER ID  NAME                 STATUS" },
              { type: "output", text: "  ──────────────────────────────────────────" },
              ...containers.map(c => ({
                type: "output" as LineType,
                text: `  ${(c.id ?? "").slice(0, 12).padEnd(12)}  ${(c.name ?? "").padEnd(20)} ${c.status}`,
              })),
            ]
          : [{ type: "output", text: "  No containers found." }];
        break;

case "images":
  out = images.length
    ? [
        { type: "output", text: "  REPOSITORY            TAG             SIZE" },
        { type: "output", text: "  ──────────────────────────────────────────" },
        ...images.map(i => ({
          type: "output" as LineType,
          text: `  ${i.repository.padEnd(22)}${i.tag.padEnd(16)}${i.size}`,
        })),
      ]
    : [{ type: "output", text: "  No images found." }];
  break;

      case "run":
        if (!args[0]) {
          out = [{ type: "error", text: "  Error: usage: run <image> [name]" }];
        } else {
          try {
            await runContainer(args[0], args[1]);
            out = [{ type: "output", text: `  ✓ Container started from ${args[0]}` }];
          } catch (e) {
            out = [{ type: "error", text: `  Error: ${e}` }];
          }
        }
        break;
case "exec":
  if (!selectedContainer) {
    out = [{ type: "error", text: "  No container selected." }];
  } else if (!args.length) {
    out = [{ type: "error", text: "  usage: exec <command>" }];
  } else {
    try {
      // Display the command prompt
      push([{ type: "prompt", text: `[${ctx?.name ?? "engine"}] $ ${cmd}` }]);
      // Run the command — output will come via exec-output events
      execIntoContainer(selectedContainer, args.join(" "));
      out = []; // don't add anything here
    } catch (e) {
      out = [{ type: "error", text: `  Error: ${e}` }];
    }
  }
  break;
      case "pull":
        if (!args[0]) {
          out = [{ type: "error", text: "  Error: usage: pull <image[:tag]>" }];
        } else {
          try {
            const [repo, tag = "latest"] = args[0].includes(":") ? args[0].split(":") : [args[0], "latest"];
            await pullImage(repo, tag);
            out = [{ type: "output", text: `  ✓ Pulled ${args[0]}` }];
          } catch (e) {
            out = [{ type: "error", text: `  Error: ${e}` }];
          }
        }
        break;

      default:
        out = [{ type: "error", text: `  bash: ${op}: command not found. Type 'help' for commands.` }];
    }

    push(out);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { execute(input); setInput(""); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx < history.length - 1) { const i = histIdx + 1; setHistIdx(i); setInput(history[i]); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) { const i = histIdx - 1; setHistIdx(i); setInput(history[i]); }
      else if (histIdx === 0) { setHistIdx(-1); setInput(""); }
    }
  };

  const ctxName = containers.find(c => c.id === selectedContainer)?.name ?? "engine";

  return (
    <div style={{ maxWidth: 900, height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Terminal</h1>
          <p className="page-sub">Interactive shell · {ctxName}</p>
        </div>
        <select
          className="input"
          style={{ width: "auto", minWidth: 200 }}
          value={selectedContainer}
          onChange={e => setSelectedContainer(e.target.value)}
        >
          <option value="">engine (host)</option>
          {containers.filter(c => c.status === "running").map(c => (
            <option key={c.id} value={c.id ?? ""}>{c.name} (container)</option>
          ))}
        </select>
      </div>

      {/* Terminal */}
      <div style={{
        flex: 1, borderRadius: "var(--radius-lg)", overflow: "hidden",
        border: "1px solid var(--border)", display: "flex", flexDirection: "column", minHeight: 0,
      }}>
        {/* Titlebar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#1e293b", borderBottom: "1px solid #334155" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map(c => (
                <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.8 }} />
              ))}
            </div>
            <span className="mono" style={{ fontSize: 11, color: "#64748b" }}>bash — {ctxName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
            <span className="mono" style={{ fontSize: 10, color: "#22c55e" }}>connected</span>
          </div>
        </div>

        {/* Output */}
        <div
          ref={bodyRef}
          style={{ flex: 1, overflowY: "auto", padding: "14px 18px", background: "#0f172a", cursor: "text", minHeight: 0 }}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i} className="mono" style={{ fontSize: 12.5, lineHeight: 1.75, color: LINE_COLOR[line.type], fontWeight: line.type === "prompt" ? 600 : 400 }}>
              {line.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px",
          background: "#0a1020",
          borderTop: "1px solid #1e293b",
        }}>
          <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: "#60a5fa", flexShrink: 0 }}>
            [{ctxName}] $
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder="Type a command…"
            className="mono"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 12.5, color: "#e2e8f0", caretColor: "#60a5fa",
            }}
          />
        </div>
      </div>
    </div>
  );
}

