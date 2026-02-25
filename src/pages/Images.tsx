import { useState } from "react";
import { useApp } from "../store/AppContext";
import PullImageModal from "../components/PullImageModal";

export default function Images() {
  const { images, removeImage } = useApp();
  const [search, setSearch] = useState("");
  const [showPull, setShowPull] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const visible = images.filter(img => {
    if (!search) return true;
    const q = search.toLowerCase();
    return img.repository.toLowerCase().includes(q) || img.tag.toLowerCase().includes(q) || img.id.includes(q);
  });

  const totalSize = images.reduce((acc, img) => {
    const n = parseFloat(img.size);
    const unit = img.size.includes("GB") ? 1024 : 1;
    return acc + n * unit;
  }, 0);

  const handleRemove = async (id: string) => {
    const img = images.find(x => x.id === id);
    if (img?.inUse) {
      alert("Cannot remove image — it is used by a container.");
      return;
    }
    setRemoving(id);
    await new Promise(r => setTimeout(r, 500));
    removeImage(id);
    setRemoving(null);
  };

  return (
    <>
      {showPull && <PullImageModal onClose={() => setShowPull(false)} />}

      <div>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight" style={{fontFamily:'Syne,sans-serif'}}>Images</h1>
            <p className="text-slate-500 font-mono text-xs mt-1">$ manoj-docker images --all</p>
          </div>
          <button
            onClick={() => setShowPull(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 text-black text-sm font-bold rounded-lg hover:bg-cyan-300 transition-all"
            style={{fontFamily:'Syne,sans-serif'}}
          >
            ↓ Pull Image
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Images", value: images.length, sub: "local registry" },
            { label: "In Use",       value: images.filter(i => i.inUse).length, sub: "by containers" },
            { label: "Total Size",   value: `${(totalSize / 1024).toFixed(1)} GB`, sub: "on disk" },
          ].map(s => (
            <div key={s.label} className="bg-[#111418] border border-[#232a36] rounded-xl p-4">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">{s.label}</div>
              <div className="text-2xl font-extrabold text-cyan-400" style={{fontFamily:'Syne,sans-serif'}}>{s.value}</div>
              <div className="text-[11px] font-mono text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#0d1017] border border-[#232a36] rounded-lg px-3 py-2 focus-within:border-cyan-400 transition-colors mb-4 max-w-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#445060" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-white text-xs font-mono flex-1 outline-none placeholder-slate-600"
          />
          {search && <button onClick={() => setSearch("")} className="text-slate-600 hover:text-white text-sm">✕</button>}
        </div>

        {/* Table */}
        <div className="bg-[#111418] border border-[#232a36] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0d1017] border-b border-[#232a36]">
                {["Repository","Tag","Image ID","Size","Created","Status","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-mono text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(img => {
                const isRemoving = removing === img.id;
                return (
                  <tr key={img.id} className={`border-b border-[#181e28] hover:bg-slate-800/20 transition-colors last:border-0 ${isRemoving ? "opacity-40" : ""}`}>
                    <td className="px-4 py-3 font-mono text-[12px] text-white font-semibold">{img.repository}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">:{img.tag}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{img.id.slice(0, 12)}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{img.size}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{img.created}</td>
                    <td className="px-4 py-3">
                      {img.inUse
                        ? <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">In use</span>
                        : <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Unused</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          className="text-[11px] font-mono px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        >
                          ▶ Run
                        </button>
                        <button
                          onClick={() => handleRemove(img.id)}
                          disabled={isRemoving || img.inUse}
                          title={img.inUse ? "In use by a container" : "Delete image"}
                          className="text-[11px] font-mono px-2 py-1.5 rounded-lg border border-[#232a36] text-slate-500 hover:border-red-500/40 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {isRemoving ? "…" : "✕"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600 font-mono text-sm gap-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              {search ? `No images matching "${search}"` : "No images found"}
              {!search && (
                <button onClick={() => setShowPull(true)} className="text-cyan-400 text-xs hover:underline">↓ Pull an image</button>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 text-[11px] font-mono text-slate-600">
          {visible.length} image{visible.length !== 1 ? "s" : ""} — {(totalSize / 1024).toFixed(2)} GB total
        </div>
      </div>
    </>
  );
}