import "./App.css";
import { useState } from "react";
import { AppProvider, useApp } from "./store/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Images from "./pages/Images";
import Logs from "./pages/Logs";
import Terminal from "./pages/Terminal";
import Containers from "./pages/Container-doc";


export type Page = "dashboard" | "containers" | "images" | "logs" | "terminal";

function AppShell() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { containers } = useApp();
  const safeContainers = containers ?? [];
  const running = safeContainers.filter(c => c?.status === "running").length;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":  return <Dashboard />;
      case "containers": return <Containers />;
      case "images":     return <Images />;
      case "logs":       return <Logs />;
      case "terminal":   return <Terminal />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        containerCount={safeContainers.length}
        runningCount={running}
      />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}