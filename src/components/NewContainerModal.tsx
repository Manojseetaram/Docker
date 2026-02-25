import { useState } from "react";
import { AVAILABLE_IMAGES_FOR_RUN } from "../store/mockData";
import { Container } from "../store/mockData";
import { useApp } from "../store/AppContext";

interface Props {
  onClose: () => void;
}

export default function NewContainerModal({ onClose }: Props) {
  const { addContainer, images } = useApp();
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState("nginx:latest");
  const [customImage, setCustomImage] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [ports, setPorts] = useState("");
  const [command, setCommand] = useState("");
  const [envVars, setEnvVars] = useState("");
  const [restartPolicy, setRestartPolicy] = useState("no");
  const [memLimit, setMemLimit] = useState("");
  const [creating, setCreating] = useState(false);
  const [done, setDone] = useState(false);

  const allImageOptions = [
    ...AVAILABLE_IMAGES_FOR_RUN,
    ...images.map(i => `${i.repository}:${i.tag}`),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const finalImage = useCustom ? customImage : selectedImage;

  const handleCreate = async () => {
    if (!finalImage) return;
    setCreating(true);
    await new Promise(r => setTimeout(r, 1400)); // simulate delay

    const id = Math.random().toString(36).slice(2, 14);
    const containerName = name.trim() || `container-${id.slice(0, 6)}`;
    const newContainer: Container = {
      id,
      name: containerName,
      image: finalImage,
      status: "running",
      cpu: "0.5%",
      memory: "32 MB",
      ports: ports.trim() || "—",
      uptime: "just now",
      created: new Date().toISOString().split("T")[0],
      command: command.trim() || "—",
    };
    addContainer(newContainer);
    setDone(true);
    await new Promise(r => setTimeout(r, 700));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-[#111418] border border-[#2e3a4e] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232a36] bg-[#0d1017]">
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>New Container</h2>
            <p className="text-[#445060] text-xs font-mono mt-0.5">manoj-docker run --detach ...</p>
          </div>
          <button onClick={onClose} className="text-[#445060] hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Container Name */}
          <div>
            <label className="block text-xs font-mono text-[#7a8a9e] mb-1.5 uppercase tracking-widest">Container Name</label>
            <input
              type="text"
              placeholder="e.g. my-nginx"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none placeholder-[#445060] transition-colors"
            />
          </div>

          {/* Image selection */}
          <div>
            <label className="block text-xs font-mono text-[#7a8a9e] mb-1.5 uppercase tracking-widest">Image</label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setUseCustom(false)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${!useCustom ? "border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10" : "border-[#232a36] text-[#445060] hover:border-[#2e3a4e]"}`}
              >
                Select
              </button>
              <button
                onClick={() => setUseCustom(true)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${useCustom ? "border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10" : "border-[#232a36] text-[#445060] hover:border-[#2e3a4e]"}`}
              >
                Custom
              </button>
            </div>
            {!useCustom ? (
              <select
                value={selectedImage}
                onChange={e => setSelectedImage(e.target.value)}
                className="w-full bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none transition-colors"
              >
                {allImageOptions.map(img => (
                  <option key={img} value={img}>{img}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="e.g. ubuntu:22.04"
                value={customImage}
                onChange={e => setCustomImage(e.target.value)}
                className="w-full bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none placeholder-[#445060] transition-colors"
              />
            )}
          </div>

          {/* Ports */}
          <div>
            <label className="block text-xs font-mono text-[#7a8a9e] mb-1.5 uppercase tracking-widest">Port Mapping <span className="normal-case text-[#445060]">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. 8080:80, 443:443"
              value={ports}
              onChange={e => setPorts(e.target.value)}
              className="w-full bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none placeholder-[#445060] transition-colors"
            />
          </div>

          {/* Command */}
          <div>
            <label className="block text-xs font-mono text-[#7a8a9e] mb-1.5 uppercase tracking-widest">Command <span className="normal-case text-[#445060]">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. nginx -g 'daemon off;'"
              value={command}
              onChange={e => setCommand(e.target.value)}
              className="w-full bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none placeholder-[#445060] transition-colors"
            />
          </div>

          {/* Env vars */}
          <div>
            <label className="block text-xs font-mono text-[#7a8a9e] mb-1.5 uppercase tracking-widest">Env Variables <span className="normal-case text-[#445060]">(optional)</span></label>
            <textarea
              placeholder={"KEY=VALUE\nANOTHER=thing"}
              value={envVars}
              onChange={e => setEnvVars(e.target.value)}
              rows={3}
              className="w-full bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none placeholder-[#445060] transition-colors resize-none"
            />
          </div>

          {/* Restart & Memory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#7a8a9e] mb-1.5 uppercase tracking-widest">Restart Policy</label>
              <select
                value={restartPolicy}
                onChange={e => setRestartPolicy(e.target.value)}
                className="w-full bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none transition-colors"
              >
                <option value="no">no</option>
                <option value="always">always</option>
                <option value="unless-stopped">unless-stopped</option>
                <option value="on-failure">on-failure</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#7a8a9e] mb-1.5 uppercase tracking-widest">Memory Limit</label>
              <input
                type="text"
                placeholder="e.g. 512m"
                value={memLimit}
                onChange={e => setMemLimit(e.target.value)}
                className="w-full bg-[#0a0c10] border border-[#232a36] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:border-[#00d4ff] focus:outline-none placeholder-[#445060] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#232a36] bg-[#0d1017]">
          <div className="text-xs font-mono text-[#445060] truncate max-w-[260px]">
            {finalImage ? <span>Image: <span className="text-[#00d4ff]">{finalImage}</span></span> : "No image selected"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#232a36] text-[#7a8a9e] text-sm font-mono hover:border-[#2e3a4e] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !finalImage}
              className="px-5 py-2 rounded-lg bg-[#00d4ff] text-black text-sm font-mono font-bold hover:bg-[#22dcff] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {creating ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {done ? "Done!" : "Creating..."}
                </>
              ) : "▶ Run Container"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}