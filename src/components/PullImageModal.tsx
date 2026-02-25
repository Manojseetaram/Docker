import { useState } from "react";
import { useApp } from "../store/AppContext";

interface Props { onClose: () => void; }

const POPULAR = [
  "nginx:latest", "ubuntu:22.04", "postgres:16", "redis:7-alpine",
  "node:20-alpine", "python:3.12-slim", "golang:1.22", "alpine:3.19",
  "mysql:8", "mongo:7",
];

export default function PullImageModal({ onClose }: Props) {
  const { pullImage } = useApp();
  const [input, setInput] = useState("");
  const [pulling, setPulling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState("");

  const handlePull = async (imageStr?: string) => {
    const raw = (imageStr ?? input).trim();
    if (!raw) return;
    const [repo, tag = "latest"] = raw.includes(":") ? raw.split(":") : [raw, "latest"];

    setCurrentImage(raw);
    setPulling(true);
    setProgress(0);
    setError("");

    try {
      for (let i = 0; i <= 90; i += Math.floor(Math.random() * 15 + 5)) {
        await new Promise(r => setTimeout(r, 180));
        setProgress(Math.min(i, 90));
      }
      await pullImage(repo, tag);
      setProgress(100);
      await new Promise(r => setTimeout(r, 600));
      onClose();
    } catch {
      setError(`Failed to pull ${raw}. Check the image name and try again.`);
      setPulling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(6px)" }}
        onClick={!pulling ? onClose : undefined}
      />
      <div
        className="relative z-10 w-full max-w-md"
        style={{
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 25px 60px rgba(37,99,235,0.15), 0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e8f0fe",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid #eef3ff", background: "#fafcff" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#eff6ff", color: "#2563eb" }}
              >
                DOCKER HUB
              </span>
            </div>
            <h2 className="text-[18px] font-black text-black" style={{ fontFamily: "Syne, sans-serif" }}>
              Pull Image
            </h2>
          </div>
          {!pulling && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
              style={{ border: "1.5px solid #dbeafe", color: "#64748b" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563eb";
                (e.currentTarget as HTMLButtonElement).style.color = "#2563eb";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#dbeafe";
                (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-5">
          {/* Input */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: "#60a5fa" }}>
              Image Name
            </label>
            <div className="flex gap-2.5">
              <input
                disabled={pulling}
                type="text"
                placeholder="nginx:latest"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handlePull()}
                className="flex-1 rounded-xl px-4 py-2.5 text-[13px] font-mono text-black focus:outline-none transition-all disabled:opacity-50"
                style={{ background: "white", border: "1.5px solid #dbeafe" }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#2563eb"}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#dbeafe"}
              />
              <button
                onClick={() => handlePull()}
                disabled={pulling || !input.trim()}
                className="px-5 py-2.5 rounded-xl text-[13px] font-mono font-black text-white transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                }}
              >
                Pull
              </button>
            </div>
          </div>

          {/* Progress */}
          {pulling && (
            <div
              className="p-4 rounded-xl"
              style={{ background: "#f8faff", border: "1px solid #dbeafe" }}
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-[11px] font-mono font-bold text-black">Pulling {currentImage}</div>
                  <div className="text-[10px] font-mono mt-0.5" style={{ color: "#93c5fd" }}>
                    Downloading layers from Docker Hub…
                  </div>
                </div>
                <span
                  className="text-[16px] font-black font-mono"
                  style={{ color: "#2563eb" }}
                >
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#dbeafe" }}>
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${progress}%`,
                    background: progress === 100
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : "linear-gradient(90deg, #2563eb, #60a5fa)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="text-[12px] font-mono px-4 py-3 rounded-xl"
              style={{ background: "#fff1f2", color: "#ef4444", border: "1px solid #fecaca" }}
            >
              {error}
            </div>
          )}

          {/* Popular */}
          {!pulling && (
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-3" style={{ color: "#60a5fa" }}>
                Popular Images
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map(img => (
                  <button
                    key={img}
                    onClick={() => { setInput(img); handlePull(img); }}
                    className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: "white",
                      border: "1.5px solid #dbeafe",
                      color: "#0f172a",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563eb";
                      (e.currentTarget as HTMLButtonElement).style.color = "#2563eb";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "white";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#dbeafe";
                      (e.currentTarget as HTMLButtonElement).style.color = "#0f172a";
                    }}
                  >
                    {img}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}