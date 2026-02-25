import { Page } from "../App";
import "./Sidebar.css";

interface Props {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard",  label: "Dashboard",  icon: "⬡" },
  { id: "containers", label: "Containers",  icon: "⬜" },
  { id: "images",     label: "Images",      icon: "◈" },
  { id: "logs",       label: "Logs",        icon: "≡" },
  { id: "terminal",   label: "Terminal",    icon: ">" },
];

export default function Sidebar({ currentPage, setCurrentPage }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="5" height="5" rx="1" fill="#00d4ff"/>
            <rect x="9" y="7" width="5" height="5" rx="1" fill="#00d4ff"/>
            <rect x="16" y="7" width="5" height="5" rx="1" fill="#00d4ff"/>
            <rect x="2" y="14" width="5" height="5" rx="1" fill="rgba(0,212,255,0.5)"/>
            <rect x="9" y="14" width="5" height="5" rx="1" fill="#00d4ff"/>
            <path d="M16 16 Q20 12 22 10" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-name">ManojDocker</span>
          <span className="brand-version">v0.1.0</span>
        </div>
      </div>

      <div className="sidebar-section-label">NAVIGATE</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {currentPage === item.id && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="engine-status">
          <span className="status-dot online" />
          <span className="status-text">Engine running</span>
        </div>
        <div className="engine-host">localhost:9000</div>
      </div>
    </aside>
  );
}