
import "./App.css";

import { useState } from "react";
import { AppProvider, useApp } from "./store/AppContext"
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

import Images from "./pages/Images";
import Logs from "./pages/Logs";
import Terminal from "./pages/Terminal";
import Containers from "./pages/container";

export type Page = "dashboard" | "containers" | "images" | "logs" | "terminal";

function AppShell() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { containers } = useApp();
  const running = containers.filter(c => c.status === "running").length;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":  return <Dashboard />;
      case "containers": return <Containers />;
      case "images":     return <Images />;
      case "logs":       return <Logs />;
      case "terminal":   return <Terminal />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c10]" style={{fontFamily:'Syne,sans-serif'}}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        containerCount={containers.length}
        runningCount={running}
      />
      <main className="flex-1 overflow-y-auto p-8">
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