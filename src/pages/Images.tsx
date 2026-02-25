import { useMemo, useState } from "react";
import { useApp } from "../store/AppContext";
import PullImageModal from "../components/PullImageModal";

export default function Images() {
  const { images, removeImage } = useApp();
  const [search, setSearch] = useState("");
  const [showPull, setShowPull] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return images.filter(img =>
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

  return (
    <>
      {showPull && <PullImageModal onClose={() => setShowPull(false)} />}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{fontFamily:'monospace'}}>Images</h1>
            <p className="text-xs font-mono text-zinc-500 mt-1">{images.length} images local</p>
          </div>
          <button
            onClick={() => setShowPull(true)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-mono font-bold hover:bg-red-400 transition-all"
            style={{boxShadow:'0 0 20px rgba(239,68,68,0.25)'}}
          >
            Pull Image
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search images..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-red-500/40 focus:outline-none placeholder-zinc-600 transition-colors"
        />

        {/* Table */}
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead className="bg-[#0a0a0a] text-zinc-500 text-xs border-b border-[#1f1f1f]">
              <tr>
                <th className="px-4 py-3 text-left">Repository</th>
                <th className="px-4 py-3 text-left">Tag</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(img => (
                <tr key={img.id} className="border-t border-[#1a1a1a] hover:bg-zinc-900/20 transition-colors">
                  <td className="px-4 py-3 text-white">{img.repository}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                      {img.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{img.size}</td>
                  <td className="px-4 py-3 text-zinc-600 text-xs">{img.id.slice(0, 12)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemove(img.id)}
                      disabled={removingId === img.id}
                      className="px-3 py-1 rounded text-xs font-mono border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                    >
                      {removingId === img.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-zinc-600 font-mono">
                    No images found
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