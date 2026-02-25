import { useState } from "react";
import { useApp } from "../store/AppContext";

interface Props { onClose: () => void; }

export default function NewContainerModal({ onClose }: Props) {
  const { runContainer, images: rawImages } = useApp();
  const images = rawImages ?? [];
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
    } catch (e) {
      setError(String(e));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 4 }}>docker run</div>
            <div className="modal-title">Create Container</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Image */}
          <div>
            <label className="field-label">Image <span style={{ color: "var(--red)" }}>*</span></label>
            <select className="input" value={image} onChange={e => setImage(e.target.value)}>
              <option value="">Select an image…</option>
              {images.map((img, i) => (
                <option key={img.id ?? i} value={`${img.repository}:${img.tag}`}>
                  {img.repository}:{img.tag}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="field-label">
              Container Name
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--text-4)" }}>optional</span>
            </label>
            <input className="input" type="text" placeholder="my-container" value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Ports */}
          <div>
            <label className="field-label">
              Port Mapping
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--text-4)" }}>optional</span>
            </label>
            <input className="input" type="text" placeholder="8080:80" value={ports} onChange={e => setPorts(e.target.value)} />
          </div>

          {/* Command */}
          <div>
            <label className="field-label">
              Command
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6, color: "var(--text-4)" }}>optional</span>
            </label>
            <input className="input" type="text" placeholder="npm start" value={cmd} onChange={e => setCmd(e.target.value)} />
          </div>

          {/* Error */}
          {error && (
            <div className="mono" style={{
              fontSize: 11, padding: "10px 12px", borderRadius: 8,
              background: "var(--red-light)", border: "1px solid var(--red-border)", color: "var(--red)",
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={creating || !image}
              onClick={handleCreate}
            >
              {creating ? "Creating…" : "Create Container"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}