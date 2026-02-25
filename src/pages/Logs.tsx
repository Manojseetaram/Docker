// src/pages/Logs.tsx

import { useMemo, useState } from "react";
import { useApp } from "../store/AppContext";

export default function Logs() {
  const { logs } = useApp();
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return logs.filter(l =>
      l.message.toLowerCase().includes(search.toLowerCase())
    );
  }, [logs, search]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Logs</h1>

      <input
        type="text"
        placeholder="Search logs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-[#111418] border border-[#232a36] rounded px-3 py-2 text-sm text-white"
      />

      <div className="bg-black border border-[#232a36] rounded-xl p-4 font-mono text-sm max-h-[500px] overflow-y-auto">
        {visible.map((log, i) => (
          <div key={i} className="mb-1 text-slate-400">
            [{log.time}] {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}