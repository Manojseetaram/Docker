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
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "containers",
    label: "Containers",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    id: "images",
    label: "Images",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: "logs",
    label: "Logs",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
];

export default function Sidebar({ currentPage, setCurrentPage, containerCount, runningCount }: Props) {
  return (
    <aside
      className="w-[230px] min-w-[230px] flex flex-col py-6 px-4"
      style={{
        background: "white",
        borderRight: "1px solid #e8f0fe",
        boxShadow: "2px 0 20px rgba(37, 99, 235, 0.04)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 pb-6 mb-5" style={{ borderBottom: "1px solid #eef3ff" }}>
        <div
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="8" width="5" height="5" rx="1" fill="white" />
            <rect x="9" y="8" width="5" height="5" rx="1" fill="white" />
            <rect x="16" y="8" width="5" height="5" rx="1" fill="white" opacity="0.55" />
            <rect x="2" y="15" width="5" height="5" rx="1" fill="white" opacity="0.4" />
            <rect x="9" y="15" width="5" height="5" rx="1" fill="#93c5fd" />
          </svg>
        </div>
        <div>
          <div className="text-black font-black text-[13px] leading-tight tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            ManojDocker
          </div>
          <div className="text-blue-400 font-mono text-[9.5px] mt-0.5 tracking-wide">v0.1.0-alpha</div>
        </div>
      </div>

      {/* Section label */}
      <div className="text-blue-300 font-mono text-[8.5px] tracking-[2px] uppercase px-2 mb-3 font-bold">
        Navigation
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all relative text-left"
              style={{
                fontFamily: "Syne, sans-serif",
                background: active ? "linear-gradient(135deg, #eff6ff, #dbeafe)" : "transparent",
                color: active ? "#1d4ed8" : "#0f172a",
                boxShadow: active ? "0 1px 4px rgba(37,99,235,0.10)" : "none",
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = "#f8faff";
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span
                style={{ color: active ? "#2563eb" : "#93c5fd" }}
                className="transition-colors group-hover:text-blue-400 flex-shrink-0"
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.id === "containers" && (
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold"
                  style={{
                    background: active ? "#dbeafe" : "#eff6ff",
                    color: active ? "#1d4ed8" : "#60a5fa",
                  }}
                >
                  {containerCount}
                </span>
              )}
              {active && (
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-full"
                  style={{ width: "3px", height: "20px", background: "linear-gradient(180deg, #2563eb, #60a5fa)" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Status footer */}
      <div className="mt-5 pt-5 px-2 space-y-2" style={{ borderTop: "1px solid #eef3ff" }}>
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: "#22c55e",
              boxShadow: "0 0 6px rgba(34,197,94,0.6)",
            }}
          />
          <span className="text-green-600 font-mono text-[10.5px] font-bold">Engine running</span>
        </div>
        <div className="font-mono text-[10px] text-blue-300 ml-0.5">localhost:9000</div>
        <div
          className="font-mono text-[10px] px-2 py-1 rounded-lg inline-block"
          style={{ background: "#eff6ff", color: "#60a5fa" }}
        >
          {runningCount}/{containerCount} containers up
        </div>
      </div>
    </aside>
  );
}