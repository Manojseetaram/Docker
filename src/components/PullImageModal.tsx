import { useState } from "react";
import { useApp } from "../store/AppContext";

interface Props { onClose: () => void; }

const POPULAR = ["nginx:latest", "ubuntu:22.04", "postgres:16", "redis:7-alpine", "node:20-alpine", "python:3.12-slim", "golang:1.22", "alpine:3.19", "mysql:8", "mongo:7"];

export default function PullImageModal({ onClose }: Props) {
  const { pullImage } = useApp();
  const [input, setInput] = useState("");
  const [pulling, setPulling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handlePull = async (imageStr?: string) => {
    const raw = (imageStr ?? input).trim();
    if (!raw) return;
    const [repo, tag = "latest"] = raw.includes(":") ? raw.split(":") : [raw, "latest"];
    setPulling(true);
    setProgress(0);
    for (let i = 0; i <= 100; i += Math.floor(Math.random() * 15 + 5)) {
      await new Promise(r => setTimeout(r, 120));
      setProgress(Math.min(i, 100));
    }
    setProgress(100);
    pullImage(repo, tag);
    setDone(true);
    await new Promise(r => setTimeout(r, 800));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!pulling ? onClose : undefined} />
      <div className="relative z-10 w-full max-w-md bg-[#111418] border border-[#2e3a4e] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232a36] bg-[#0d1017]">
          <div>
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>Pull Image</h2>
            <p className="text-[#445060] text-xs font-mono mt-0.5">manoj-docker pull &lt;image:tag&gt;</p>
          </div>
          {!pulling && <button onClick={onClose} className="text-[#445060] hover:text-white transition-colors text-xl">✕</button>}
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-mono text-[#7a8a9e] mb-1.5 uppercase tracking-widest">Image Name</label>
            <div className="flex gap-2">
              <input
                disabled={pulling}
                type="text"
                placeholder="e.g. nginx:latest"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handlePull()}
                className="flex-1 bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none placeholder-[#445060] disabled:opacity-50"
              />
              <button
                onClick={() => handlePull()}
                disabled={pulling || !input.trim()}
                className="px-4 py-2.5 rounded-lg bg-[#00d4ff] text-black text-sm font-mono font-bold hover:bg-[#22dcff] disabled:opacity-40 transition-all"
              >
                Pull
              </button>
            </div>
          </div>

          {pulling && (
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#7a8a9e]">{done ? "Complete!" : "Downloading layers..."}</span>
                <span className="text-[#00d4ff]">{progress}%</span>
              </div>
              <div className="h-1.5 bg-[#1e2430] rounded-full overflow-hidden">
                <div className="h-full bg-[#00d4ff] rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {!pulling && (
            <div>
              <p className="text-xs font-mono text-[#445060] mb-2 uppercase tracking-widest">Popular Images</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map(img => (
                  <button
                    key={img}
                    onClick={() => { setInput(img); handlePull(img); }}
                    className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-[#0a0c10] border border-[#232a36] text-[#7a8a9e] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-colors"
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