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
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    id: "containers", label: "Containers",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>,
  },
  {
    id: "images", label: "Images",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  },
  {
    id: "logs", label: "Logs",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    id: "terminal", label: "Terminal",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  },
];

export default function Sidebar({ currentPage, setCurrentPage, containerCount, runningCount }: Props) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="8" width="5" height="5" rx="1" fill="white"/>
            <rect x="9" y="8" width="5" height="5" rx="1" fill="white"/>
            <rect x="16" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
            <rect x="2" y="15" width="5" height="5" rx="1" fill="white" opacity="0.4"/>
            <rect x="9" y="15" width="5" height="5" rx="1" fill="#93c5fd"/>
          </svg>
        </div>
        <div>
          <div className="sidebar-logo-name">Docker</div>
         
        </div>
      </div>

      <div className="sidebar-section-label">Navigation</div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {navItems.map(item => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`nav-item${active ? " active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === "containers" && (
                <span className="nav-badge">{containerCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="status-line">
          <span className="status-dot" />
          Engine running
        </div>
        
        <div className="status-sub">{runningCount}/{containerCount} containers up</div>
      </div>
    </aside>
  );
}