import { JSX } from "react";
import { Page } from "../App";

interface Props {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  containerCount: number;
  runningCount: number;
}

const navItems: { id: Page; label: string; icon: JSX.Element }[] = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    id: "containers", label: "Containers",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>,
  },
  {
    id: "images", label: "Images",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  },
  {
    id: "logs", label: "Logs",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    id: "terminal", label: "Terminal",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  },
];

export default function Sidebar({ currentPage, setCurrentPage, containerCount, runningCount }: Props) {
  return (
    <aside className="w-[220px] min-w-[220px] bg-[#0d1017] border-r border-[#232a36] flex flex-col py-5 px-3">
      <div className="flex items-center gap-3 px-2 pb-5 mb-4 border-b border-[#232a36]">
        <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="8" width="5" height="5" rx="1" fill="#00d4ff"/>
            <rect x="9" y="8" width="5" height="5" rx="1" fill="#00d4ff"/>
            <rect x="16" y="8" width="5" height="5" rx="1" fill="#00d4ff" opacity="0.5"/>
            <rect x="2" y="15" width="5" height="5" rx="1" fill="#00d4ff" opacity="0.4"/>
            <rect x="9" y="15" width="5" height="5" rx="1" fill="#00d4ff"/>
          </svg>
        </div>
        <div>
          <div className="text-white font-extrabold text-sm leading-tight tracking-tight" style={{fontFamily:'Syne,sans-serif'}}>ManojDocker</div>
          <div className="text-slate-600 font-mono text-[10px]">v0.1.0-alpha</div>
        </div>
      </div>

      <div className="text-slate-600 font-mono text-[9px] tracking-[1.5px] uppercase px-2 mb-2">Navigate</div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`group flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all relative text-left ${
                active ? "bg-cyan-400/10 text-cyan-400" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
              style={{fontFamily:'Syne,sans-serif'}}
            >
              <span className={active ? "text-cyan-400" : "text-slate-600 group-hover:text-slate-400"}>{item.icon}</span>
              {item.label}
              {item.id === "containers" && (
                <span className="ml-auto text-[10px] font-mono bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">{containerCount}</span>
              )}
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-l-full" style={{boxShadow:'0 0 8px rgba(0,212,255,0.6)'}} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-[#232a36] px-2 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{boxShadow:'0 0 6px rgba(52,211,153,0.7)'}} />
          <span className="text-emerald-400 font-mono text-[11px]">Engine running</span>
        </div>
        <div className="font-mono text-[10px] text-slate-600">localhost:9000</div>
        <div className="font-mono text-[10px] text-slate-600">{runningCount}/{containerCount} containers up</div>
      </div>
    </aside>
  );
}