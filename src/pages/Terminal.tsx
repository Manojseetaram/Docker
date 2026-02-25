import { useState, useRef, useEffect } from "react";
import { useApp } from "../store/AppContext";

type LineType = "prompt" | "output" | "error" | "info";
interface Line { type: LineType; text: string; }

const COMMANDS: Record<string, (args: string[], containers: any[], images: any[]) => string[]> = {
  help: () => [
    "┌─────────────────────────────────────────────────┐",
    "│  ManojDocker CLI — Available Commands           │",
    "├─────────────────────────────────────────────────┤",
    "│  ps            List all containers              │",
    "│  ps -q         List running containers          │",
    "│  images        List all images                  │",
    "│  run <image>   Create & run a container         │",
    "│  stop <name>   Stop a running container         │",
    "│  start <name>  Start a stopped container        │",
    "│  rm <name>     Remove a container               │",
    "│  rmi <image>   Remove an image                  │",
    "│  pull <image>  Pull image from registry         │",
    "│  inspect <n>   Inspect container details        │",
    "│  stats         Show resource usage              │",
    "│  version       Show engine version              │",
    "│  clear         Clear terminal                   │",
    "└─────────────────────────────────────────────────┘",
  ],
  version: () => [
    "ManojDocker Engine v0.1.0",
    "  Runtime:    custom-rust-runtime v0.1",
    "  OS/Arch:    linux/amd64",
    "  API:        http://localhost:9000",
    "  Git commit: a8f4c2d",
    "  Built:      2024-01-22T10:30:00Z",
  ],
  ps: (args, containers) => {
    const list = args.includes("-q")
      ? containers.filter(c => c.status === "running")
      : containers;
    if (list.length === 0) return ["No containers found."];
    const header = "CONTAINER ID   NAME              IMAGE              STATUS    PORTS";
    const rows = list.map(c =>
      `${c.id.slice(0,12)}   ${c.name.padEnd(16)}  ${c.image.padEnd(18)} ${c.status.padEnd(9)} ${c.ports}`
    );
    return [header, "─".repeat(80), ...rows];
  },
  images: (_, __, images) => {
    if (images.length === 0) return ["No images found."];
    const header = "REPOSITORY     TAG           IMAGE ID       SIZE        CREATED";
    const rows = images.map(i =>
      `${i.repository.padEnd(14)} ${i.tag.padEnd(12)}  ${i.id.slice(0,12)}   ${i.size.padEnd(12)} ${i.created}`
    );
    return [header, "─".repeat(80), ...rows];
  },
  stats: (_, containers) => {
    const running = containers.filter(c => c.status === "running");
    if (running.length === 0) return ["No running containers."];
    const header = "NAME              CPU %     MEM USAGE";
    const rows = running.map(c => `${c.name.padEnd(17)} ${c.cpu.padEnd(9)} ${c.memory}`);
    return [header, "─".repeat(40), ...rows];
  },
};

export default function Terminal() {
  const { containers, images } = useApp();
  const [lines, setLines] = useState<Line[]>([
    { type: "info",   text: "ManojDocker Engine v0.1.0" },
    { type: "info",   text: "Connected to daemon at localhost:9000" },
    { type: "info",   text: 'Type "help" to see available commands.' },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [selectedContainer, setSelectedContainer] = useState(containers[0]?.name ?? "");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setHistory(h => [trimmed, ...h.slice(0, 49)]);
    setHistIdx(-1);

    const promptLine: Line = { type: "prompt", text: `[${selectedContainer || "engine"}] $ ${trimmed}` };
    const [cmd, ...args] = trimmed.split(" ");

    if (cmd === "clear") { setLines([]); return; }

    let output: Line[] = [];

    if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd](args, containers, images);
      output = result.map(t => ({ type: "output" as LineType, text: t }));
    } else if (cmd === "run") {
      const image = args[0];
      if (!image) {
        output = [{ type: "error", text: "Usage: run <image>" }];
      } else {
        const id = Math.random().toString(36).slice(2, 14);
        output = [
          { type: "output", text: `Pulling image '${image}'...` },
          { type: "output", text: "Pull complete." },
          { type: "output", text: `Creating container...` },
          { type: "output", text: `Container started: ${id}` },
        ];
      }
    } else if (cmd === "stop") {
      const name = args[0];
      const c = containers.find(x => x.name === name || x.id.startsWith(name ?? ""));
      output = c
        ? [{ type: "output", text: `${c.name}` }]
        : [{ type: "error", text: `Error: No such container: ${name}` }];
    } else if (cmd === "inspect") {
      const name = args[0];
      const c = containers.find(x => x.name === name || x.id.startsWith(name ?? ""));
      if (c) {
        output = [
          { type: "output", text: "{" },
          { type: "output", text: `  "Id": "${c.id}",` },
          { type: "output", text: `  "Name": "/${c.name}",` },
          { type: "output", text: `  "Image": "${c.image}",` },
          { type: "output", text: `  "Status": "${c.status}",` },
          { type: "output", text: `  "Ports": "${c.ports}",` },
          { type: "output", text: `  "Command": "${c.command}",` },
          { type: "output", text: `  "Created": "${c.created}"` },
          { type: "output", text: "}" },
        ];
      } else {
        output = [{ type: "error", text: `Error: No such container: ${name}` }];
      }
    } else if (cmd === "pull") {
      const img = args[0];
      output = img
        ? [
            { type: "output", text: `Pulling from registry: ${img}` },
            { type: "output", text: "  Pulling layer: sha256:a1b2c3d4..." },
            { type: "output", text: "  Download complete." },
            { type: "output", text: "  Pull complete." },
            { type: "output", text: `Status: Downloaded newer image for ${img}` },
          ]
        : [{ type: "error", text: "Usage: pull <image:tag>" }];
    } else {
      output = [{ type: "error", text: `manoj-docker: '${cmd}' is not a recognized command. Try 'help'.` }];
    }

    setLines(prev => [...prev, promptLine, ...output, { type: "output", text: "" }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{fontFamily:'Syne,sans-serif'}}>Terminal</h1>
          <p className="text-slate-500 font-mono text-xs mt-1">$ manoj-docker exec -it {selectedContainer || "engine"} /bin/sh</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">Container:</span>
          <select
            value={selectedContainer}
            onChange={e => setSelectedContainer(e.target.value)}
            className="bg-[#111418] border border-[#232a36] text-white text-xs font-mono rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-400 transition-colors"
          >
            {containers.filter(c => c.status === "running").map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Terminal window */}
      <div
        className="bg-[#050708] border border-[#1e2430] rounded-2xl overflow-hidden flex flex-col"
        style={{height: "calc(100vh - 200px)"}}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1017] border-b border-[#1a2030]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-[11px] text-slate-500 flex-1 text-center">
            manoj-docker — {selectedContainer || "engine"} — /bin/sh
          </span>
          <button
            onClick={() => setLines([])}
            className="text-[10px] font-mono text-slate-600 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
          >
            clear
          </button>
        </div>

        {/* Output */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto p-5 font-mono text-[13px] leading-6 cursor-text">
          {lines.map((line, i) => {
            if (line.type === "prompt")
              return <div key={i} className="mb-0.5"><span className="text-emerald-400">{line.text}</span></div>;
            if (line.type === "error")
              return <div key={i} className="text-red-400 mb-0.5">{line.text}</div>;
            if (line.type === "info")
              return <div key={i} className="text-cyan-400/70 mb-0.5">{line.text}</div>;
            return <div key={i} className="text-slate-400 mb-0.5">{line.text}</div>;
          })}
        </div>

        {/* Input row */}
        <div className="flex items-center gap-3 px-5 py-3 border-t border-[#1a2030] bg-[#0d1017]">
          <span className="text-emerald-400 font-mono text-[13px] flex-shrink-0">
            [{selectedContainer || "engine"}] $
          </span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] text-white caret-cyan-400"
            placeholder="Type a command..."
            spellCheck={false}
          />
        </div>
      </div>

      <p className="mt-2 text-[10px] font-mono text-slate-700">↑ ↓ arrow keys to navigate command history</p>
    </div>
  );
}