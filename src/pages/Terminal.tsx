import { useState, useRef, useEffect } from "react";
import { useApp } from "../store/AppContext";

type LineType = "prompt" | "output" | "error" | "info";
interface Line { type: LineType; text: string; }

export default function Terminal() {
  const { containers, images, runContainer, pullImage } = useApp();

  const [lines, setLines] = useState<Line[]>([
    { type: "info",   text: "┌─────────────────────────────────────────┐" },
    { type: "info",   text: "│  ManojDocker Engine v0.1.0              │" },
    { type: "info",   text: "│  Connected to daemon at localhost:9000  │" },
    { type: "info",   text: "└─────────────────────────────────────────┘" },
    { type: "output", text: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
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
      const running = containers.find(c => c.status === "running");
      if (running) setSelectedContainer(running.id);
    }
  }, [containers]);

  const addLines = (nl: Line[]) => setLines(prev => [...prev, ...nl]);

  const executeCommand = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setHistory(prev => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);

    const container = containers.find(c => c.id === selectedContainer);
    const promptLine: Line = { type: "prompt", text: `[${container?.name || "engine"}] $ ${trimmed}` };
    const [cmd, ...args] = trimmed.split(" ");
    let output: Line[] = [];

    switch (cmd) {
      case "help":
        output = [
          { type: "output", text: "  Available commands:" },
          { type: "output", text: "  ─────────────────────────────────────────" },
          { type: "output", text: "  ps               List all containers" },
          { type: "output", text: "  images           List local images" },
          { type: "output", text: "  run <img> [name] Run a new container" },
          { type: "output", text: "  pull <img>       Pull an image" },
          { type: "output", text: "  clear            Clear terminal" },
        ];
        break;
      case "clear":
        setLines([]);
        return;
      case "ps":
        output = containers.length
          ? [
              { type: "output", text: "  ID            NAME                  STATUS" },
              { type: "output", text: "  ──────────────────────────────────────────" },
              ...containers.map(c => ({
                type: "output" as LineType,
                text: `  ${c.id.slice(0, 12)}  ${c.name.padEnd(20)}  ${c.status}`,
              })),
            ]
          : [{ type: "output", text: "  No containers found." }];
        break;
      case "images":
        output = images.length
          ? [
              { type: "output", text: "  REPOSITORY         TAG              SIZE" },
              { type: "output", text: "  ──────────────────────────────────────────" },
              ...images.map(i => ({
                type: "output" as LineType,
                text: `  ${i.repository.padEnd(18)} ${i.tag.padEnd(16)} ${i.size}`,
              })),
            ]
          : [{ type: "output", text: "  No images found." }];
        break;
      case "run":
        if (!args[0]) {
          output = [{ type: "error", text: "  Error: Usage: run <image> [container-name]" }];
        } else {
          try {
            await runContainer(args[0], args[1] || undefined);
            output = [{ type: "output", text: `  ✓ Container created from ${args[0]}` }];
          } catch (error) {
            output = [{ type: "error", text: `  Error: Failed to run container: ${error}` }];
          }
        }
        break;
      case "pull":
        if (!args[0]) {
          output = [{ type: "error", text: "  Error: Usage: pull <image>" }];
        } else {
          try {
            const [repo, tag = "latest"] = args[0].includes(":") ? args[0].split(":") : [args[0], "latest"];
            await pullImage(repo, tag);
            output = [{ type: "output", text: `  ✓ Successfully pulled ${args[0]}` }];
          } catch (error) {
            output = [{ type: "error", text: `  Error: Failed to pull image: ${error}` }];
          }
        }
        break;
      default:
        output = [{ type: "error", text: `  bash: command not found: ${cmd}. Type 'help' for commands.` }];
    }

    addLines([promptLine, ...output]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { executeCommand(input); setInput(""); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const i = historyIndex + 1;
        setHistoryIndex(i); setInput(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const i = historyIndex - 1;
        setHistoryIndex(i); setInput(history[i]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1); setInput("");
      }
    }
  };

  const selectedContainerName = containers.find(c => c.id === selectedContainer)?.name || "engine";

  return (
    <div className="h-full flex flex-col max-w-5xl">
      {/* Header */}
      <div className="mb-5 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#0f172a", color: "#60a5fa" }}
            >
              TERMINAL
            </span>
          </div>
          <h1
            className="text-[28px] font-black text-black tracking-tight leading-none"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Terminal
          </h1>
          <p className="text-[12px] font-mono mt-1.5" style={{ color: "#93c5fd" }}>
            Interactive docker shell · {selectedContainerName}
          </p>
        </div>
        <select
          value={selectedContainer}
          onChange={e => setSelectedContainer(e.target.value)}
          className="rounded-xl px-4 py-2.5 text-black font-mono text-[12px] focus:outline-none transition-all"
          style={{ background: "white", border: "1.5px solid #dbeafe" }}
          onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "#2563eb"}
          onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "#dbeafe"}
        >
          <option value="">engine (host)</option>
          {containers.filter(c => c.status === "running").map(c => (
            <option key={c.id} value={c.id}>{c.name} (container)</option>
          ))}
        </select>
      </div>

      {/* Terminal window */}
      <div
        className="flex-1 flex flex-col rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e8f0fe", boxShadow: "0 1px 20px rgba(37,99,235,0.05)" }}
      >
        {/* Titlebar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: "#0a1020", borderBottom: "1px solid #1e293b" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#fbbf24" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
            </div>
            <span className="font-mono text-[11px] ml-3" style={{ color: "#334155" }}>
              bash — {selectedContainerName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 5px rgba(34,197,94,0.7)" }} />
            <span className="font-mono text-[10px]" style={{ color: "#22c55e" }}>connected</span>
          </div>
        </div>

        {/* Output */}
        <div
          ref={bodyRef}
          className="flex-1 p-5 overflow-y-auto cursor-text"
          style={{ background: "#0f172a" }}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className="mb-0.5 leading-relaxed text-[12.5px] font-mono"
              style={{
                color:
                  line.type === "prompt" ? "#60a5fa"
                  : line.type === "error"  ? "#f87171"
                  : line.type === "info"   ? "#334155"
                  : "#cbd5e1",
                fontWeight: line.type === "prompt" ? "700" : "400",
              }}
            >
              {line.text}
            </div>
          ))}
          {/* Blinking cursor line */}
          <div className="flex items-center gap-0 mt-1">
            <span className="text-[12.5px] font-mono font-bold" style={{ color: "#60a5fa" }}>
              [{selectedContainerName}] $&nbsp;
            </span>
            <span className="animate-pulse text-[12.5px] font-mono" style={{ color: "#60a5fa" }}>█</span>
          </div>
        </div>

        {/* Input */}
        <div
          className="flex items-center px-5 py-3.5 gap-3"
          style={{
            background: "#0a1020",
            borderTop: "1px solid #1e293b",
          }}
        >
          <span className="font-mono font-black text-[12.5px] flex-shrink-0" style={{ color: "#60a5fa" }}>
            [{selectedContainerName}] $
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none font-mono text-[12.5px]"
            style={{ color: "#e2e8f0", caretColor: "#60a5fa" }}
            placeholder="Type a command…"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={() => { executeCommand(input); setInput(""); }}
            disabled={!input.trim()}
            className="font-mono text-[10px] px-2.5 py-1 rounded-lg transition-all disabled:opacity-30"
            style={{ border: "1px solid #1e293b", color: "#475569" }}
          >
            ↵
          </button>
        </div>
      </div>
    </div>
  );
}