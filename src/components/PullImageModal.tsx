import { useState } from "react";
import { useApp } from "../store/AppContext";

interface Props { onClose: () => void; }

const POPULAR = ["nginx:latest", "ubuntu:22.04", "postgres:16", "redis:7-alpine", "node:20-alpine", "python:3.12-slim", "golang:1.22", "alpine:3.19", "mysql:8", "mongo:7"];

export default function PullImageModal({ onClose }: Props) {
  const { pullImage } = useApp();
  const [input, setInput] = useState("");
  const [pulling, setPulling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pullingName, setPullingName] = useState("");
  const [error, setError] = useState("");

  const handlePull = async (imageStr?: string) => {
    const raw = (imageStr ?? input).trim();
    if (!raw) return;
    const [repo, tag = "latest"] = raw.includes(":") ? raw.split(":") : [raw, "latest"];

    setPulling(true);
    setPullingName(raw);
    setProgress(0);
    setError("");

    try {
      // Simulate layer download progress
      const tick = async () => {
        for (let p = 0; p <= 85; p += Math.floor(Math.random() * 18 + 5)) {
          await new Promise(r => setTimeout(r, 180));
          setProgress(Math.min(p, 85));
        }
      };
      const [_, result] = await Promise.all([tick(), pullImage(repo, tag)]);
      setProgress(100);
      await new Promise(r => setTimeout(r, 500));
      onClose();
    } catch (e) {
      setError(`Failed to pull "${raw}". Check the image name and try again.`);
      setPulling(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={!pulling ? onClose : undefined}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 4 }}>docker pull</div>
            <div className="modal-title">Pull Image</div>
          </div>
          {!pulling && (
            <button className="modal-close" onClick={onClose}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Input row */}
          <div>
            <label className="field-label">Image Name</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                style={{ flex: 1 }}
                disabled={pulling}
                type="text"
                placeholder="nginx:latest"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handlePull()}
              />
              <button className="btn btn-primary" disabled={pulling || !input.trim()} onClick={() => handlePull()}>
                Pull
              </button>
            </div>
          </div>

          {/* Progress */}
          {pulling && (
            <div style={{
              padding: "14px 16px", borderRadius: "var(--radius)",
              background: "var(--surface-2)", border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{pullingName}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--text-4)", marginTop: 2 }}>Downloading layers…</div>
                </div>
                <span style={{ fontWeight: 800, fontSize: 20, color: "var(--blue)", fontFamily: "JetBrains Mono, monospace" }}>{progress}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99, transition: "width 0.2s ease",
                  width: `${progress}%`,
                  background: progress === 100 ? "#22c55e" : "var(--blue)",
                }} />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mono" style={{
              fontSize: 11, padding: "10px 12px", borderRadius: 8,
              background: "var(--red-light)", border: "1px solid var(--red-border)", color: "var(--red)",
            }}>
              {error}
            </div>
          )}

          {/* Popular */}
          {!pulling && (
            <div>
              <label className="field-label" style={{ marginBottom: 10 }}>Popular Images</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {POPULAR.map(img => (
                  <button
                    key={img}
                    className="mono"
                    onClick={() => { setInput(img); handlePull(img); }}
                    style={{
                      padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600,
                      border: "1.5px solid var(--border)", background: "var(--surface)",
                      color: "var(--text-2)", cursor: "pointer", transition: "all 0.12s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--blue)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--blue)";
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--blue-light)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-2)";
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--surface)";
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