// src/pages/Terminal.tsx

import { useState, useRef, useEffect } from "react";
import { useApp } from "../store/AppContext";

type LineType = "prompt" | "output" | "error" | "info";

interface Line {
  type: LineType;
  text: string;
}

export default function Terminal() {
  const { containers, images } = useApp();

  const [lines, setLines] = useState<Line[]>([
    { type: "info", text: "ManojDocker Engine v0.1.0" },
    { type: "info", text: "Connected to daemon at localhost:9000" },
    { type: "info", text: 'Type "help" to see available commands.' },
    { type: "output", text: "" },
  ]);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedContainer, setSelectedContainer] = useState(
    containers.find(c => c.status === "running")?.name ?? ""
  );

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  const addLines = (newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines, { type: "output", text: "" }]);
  };

  const executeCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setHistory(prev => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);

    const promptLine: Line = {
      type: "prompt",
      text: `[${selectedContainer || "engine"}] $ ${trimmed}`,
    };

    const [cmd, ...args] = trimmed.split(" ");

    let output: Line[] = [];

    switch (cmd) {
      case "help":
        output = [
          { type: "output", text: "Available commands:" },
          { type: "output", text: "ps | images | stats | run <image>" },
          { type: "output", text: "stop <container> | inspect <container>" },
          { type: "output", text: "pull <image> | clear" },
        ];
        break;

      case "clear":
        setLines([]);
        return;

      case "ps":
        output = containers.length
          ? containers.map(c => ({
              type: "output",
              text: `${c.id.slice(0, 12)}  ${c.name}  ${c.status}`,
            }))
          : [{ type: "output", text: "No containers found." }];
        break;

      case "images":
        output = images.length
          ? images.map(i => ({
              type: "output",
              text: `${i.repository}:${i.tag}  ${i.size}`,
            }))
          : [{ type: "output", text: "No images found." }];
        break;

      case "run":
        if (!args[0]) {
          output = [{ type: "error", text: "Usage: run <image>" }];
        } else {
          output = [
            { type: "output", text: `Pulling ${args[0]}...` },
            { type: "output", text: "Container started." },
          ];
        }
        break;

      default:
        output = [
          {
            type: "error",
            text: `manoj-docker: '${cmd}' is not recognized.`,
          },
        ];
    }

    addLines([promptLine, ...output]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold text-white">Terminal</h1>

        <select
          value={selectedContainer}
          onChange={e => setSelectedContainer(e.target.value)}
          className="bg-gray-800 text-white text-xs rounded px-2 py-1"
        >
          {containers
            .filter(c => c.status === "running")
            .map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div
        ref={bodyRef}
        className="flex-1 bg-black text-sm font-mono p-4 overflow-y-auto rounded"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "prompt"
                ? "text-green-400"
                : line.type === "error"
                ? "text-red-400"
                : line.type === "info"
                ? "text-cyan-400"
                : "text-gray-300"
            }
          >
            {line.text}
          </div>
        ))}
      </div>

      <div className="flex items-center bg-gray-900 p-2 rounded-b">
        <span className="text-green-400 font-mono mr-2">
          [{selectedContainer || "engine"}] $
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white outline-none font-mono"
        />
      </div>
    </div>
  );
}