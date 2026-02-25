import { useMemo, useState } from "react";
import { useApp } from "../store/AppContext";
import PullImageModal from "../components/PullImageModal";

export default function Images() {
  const { images: rawImages, removeImage } = useApp();
  const images = rawImages ?? [];
  const [search, setSearch] = useState("");
  const [showPull, setShowPull] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (!search.trim()) return images;
    const q = search.toLowerCase();
    return images.filter(img => {
      if (!img) return false;
      return (img.repository ?? "").toLowerCase().includes(q) ||
             (img.tag ?? "").toLowerCase().includes(q);
    });
  }, [images, search]);

  // FIX: Docker removeImage needs the full image id (sha256:...) or repo:tag string
  // We pass img.id which is the full ID from the backend
  const handleRemove = async (img: { id?: string; repository?: string; tag?: string }) => {
    // Use full id if available, otherwise fall back to repo:tag
    const target = img.id || `${img.repository}:${img.tag}`;
    if (!target) return;

    setRemovingId(target);
    setError(null);
    try {
      await removeImage(target);
    } catch (e) {
      console.error("Delete failed:", e);
      setError(`Failed to delete image: ${target}`);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      {showPull && <PullImageModal onClose={() => setShowPull(false)} />}

      <div style={{ maxWidth: 900 }}>
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Images</h1>
            <p className="page-sub">{images.length} image{images.length !== 1 ? "s" : ""} locally cached</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowPull(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Pull Image
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            marginBottom: 16, padding: "10px 14px", borderRadius: 10,
            background: "var(--red-light)", border: "1px solid var(--red-border)",
            color: "var(--red)", fontSize: 12, fontFamily: "JetBrains Mono, monospace",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 300, marginBottom: 20 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-4)" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="input"
            style={{ paddingLeft: 34 }}
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Repository</th>
                <th>Tag</th>
                <th>Size</th>
                <th>Image ID</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" style={{ margin: "0 auto 10px" }}>
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <p>{search ? "No images match your search" : "No images found"}</p>
                      <p style={{ marginTop: 4 }}>Pull an image to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                visible.map((img, idx) => {
                  const key = img.id ?? `${img.repository}:${img.tag}:${idx}`;
                  const isRemoving = removingId === (img.id || `${img.repository}:${img.tag}`);
                  return (
                    <tr key={key}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                            </svg>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>
                            {img.repository ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-blue">{img.tag ?? "latest"}</span>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>
                          {img.size ?? "—"}
                        </span>
                      </td>
                      <td>
                        <span className="mono" style={{
                          fontSize: 11, color: "var(--text-4)",
                          background: "var(--surface-2)", padding: "3px 8px", borderRadius: 6,
                        }}>
                          {(img.id ?? "").slice(0, 12) || "—"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-danger btn"
                          disabled={isRemoving}
                          onClick={() => handleRemove(img)}
                        >
                          {isRemoving ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}