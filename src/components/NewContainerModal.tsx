import { useState } from "react";
import { useApp } from "../store/AppContext";

interface Props { onClose: () => void; }

export default function NewContainerModal({ onClose }: Props) {
  const { runContainer, images } = useApp();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [ports, setPorts] = useState("");
  const [cmd, setCmd] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!image.trim()) return;
    setCreating(true);
    setError("");
    try {
      await runContainer(image, name || undefined, ports || undefined, cmd || undefined);
      onClose();
    } catch (err) {
      setError("Failed to create container. Check your configuration.");
    } finally {
      setCreating(false);
    }
  };

  const inputStyle = {
    background: "white",
    border: "1.5px solid #dbeafe",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "13px",
    fontFamily: "monospace",
    color: "#0f172a",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
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
                NEW CONTAINER
              </span>
            </div>
            <h2 className="text-[18px] font-black text-black" style={{ fontFamily: "Syne, sans-serif" }}>
              Create Container
            </h2>
          </div>
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
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-5">
          {/* Image */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: "#60a5fa" }}>
              Image <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={image}
              onChange={e => setImage(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}
              onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "#2563eb"}
              onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "#dbeafe"}
            >
              <option value="">Select an image…</option>
              {images.map(img => (
                <option key={img.id} value={`${img.repository}:${img.tag}`}>
                  {img.repository}:{img.tag}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: "#60a5fa" }}>
              Name <span className="normal-case font-normal ml-1" style={{ color: "#93c5fd" }}>optional</span>
            </label>
            <input
              type="text"
              placeholder="my-container"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#2563eb"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#dbeafe"}
            />
          </div>

          {/* Ports */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: "#60a5fa" }}>
              Port Mapping <span className="normal-case font-normal ml-1" style={{ color: "#93c5fd" }}>optional</span>
            </label>
            <input
              type="text"
              placeholder="8080:80"
              value={ports}
              onChange={e => setPorts(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#2563eb"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#dbeafe"}
            />
          </div>

          {/* Command */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: "#60a5fa" }}>
              Command <span className="normal-case font-normal ml-1" style={{ color: "#93c5fd" }}>optional</span>
            </label>
            <input
              type="text"
              placeholder="npm start"
              value={cmd}
              onChange={e => setCmd(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#2563eb"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#dbeafe"}
            />
          </div>

          {error && (
            <div
              className="text-[12px] font-mono px-4 py-3 rounded-xl"
              style={{ background: "#fff1f2", color: "#ef4444", border: "1px solid #fecaca" }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-mono font-bold transition-all"
              style={{ border: "1.5px solid #dbeafe", color: "#0f172a", background: "white" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#f8faff"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "white"}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !image}
              className="flex-1 py-2.5 rounded-xl text-sm font-mono font-black text-white transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              }}
              onMouseEnter={e => !creating && image && ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(37,99,235,0.5)")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(37,99,235,0.35)")}
            >
              {creating ? "Creating…" : "Create Container"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}