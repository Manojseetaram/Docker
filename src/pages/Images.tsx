import { useMemo, useState } from "react";
import { useApp } from "../store/AppContext";
import PullImageModal from "../components/PullImageModal";

export default function Images() {
  const { images, removeImage } = useApp();
  const [search, setSearch] = useState("");
  const [showPull, setShowPull] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return images.filter(
      img =>
        img.repository.toLowerCase().includes(search.toLowerCase()) ||
        img.tag.toLowerCase().includes(search.toLowerCase())
    );
  }, [images, search]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await removeImage(id);
    } finally {
      setRemovingId(null);
    }
  };

  const totalSize = images.length;

  return (
    <>
      {showPull && <PullImageModal onClose={() => setShowPull(false)} />}

      <div className="space-y-7 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#f5f3ff", color: "#7c3aed" }}
              >
                LOCAL REGISTRY
              </span>
            </div>
            <h1
              className="text-[28px] font-black text-black tracking-tight leading-none"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Images
            </h1>
            <p className="text-[12px] font-mono mt-1.5" style={{ color: "#93c5fd" }}>
              {totalSize} image{totalSize !== 1 ? "s" : ""} cached locally
            </p>
          </div>
          <button
            onClick={() => setShowPull(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono font-black text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(37,99,235,0.5)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(37,99,235,0.35)"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Pull Image
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 pl-9 text-sm text-black font-mono focus:outline-none transition-all"
            style={{
              background: "white",
              border: "1.5px solid #dbeafe",
              boxShadow: "0 1px 4px rgba(37,99,235,0.04)",
            }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#2563eb"}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#dbeafe"}
          />
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid #e8f0fe", boxShadow: "0 1px 20px rgba(37,99,235,0.05)" }}
        >
          <table className="w-full text-sm font-mono">
            <thead style={{ background: "#f8faff", borderBottom: "1px solid #e8f0fe" }}>
              <tr>
                {["Repository", "Tag", "Size", "Image ID", ""].map((h, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest ${i === 4 ? "text-right" : "text-left"}`}
                    style={{ color: "#60a5fa" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ background: "white" }}>
              {visible.map((img, idx) => (
                <tr
                  key={img.id}
                  className="transition-colors"
                  style={{ borderTop: idx === 0 ? "none" : "1px solid #f0f7ff" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fafcff"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "white"}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "#f5f3ff" }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <span className="text-black font-bold text-[13px]">{img.repository}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[11px] px-2.5 py-1 rounded-full font-bold"
                      style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
                    >
                      {img.tag}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[12px]" style={{ color: "#64748b" }}>
                    {img.size}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-lg"
                      style={{ background: "#f8faff", color: "#93c5fd" }}
                    >
                      {img.id.slice(0, 12)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleRemove(img.id)}
                      disabled={removingId === img.id}
                      className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                      style={{ border: "1.5px solid #fecaca", color: "#ef4444", background: "white" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#fff1f2";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#f87171";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "white";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#fecaca";
                      }}
                    >
                      {removingId === img.id ? "Removing…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-14">
                    <div className="text-[32px] mb-3">🖼️</div>
                    <p className="text-[13px] font-mono font-bold" style={{ color: "#93c5fd" }}>
                      {search ? "No images match your search" : "No images found"}
                    </p>
                    <p className="text-[11px] font-mono mt-1" style={{ color: "#bfdbfe" }}>
                      Pull an image to get started
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}