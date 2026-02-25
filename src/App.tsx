import "./App.css";
import { useState } from "react";
import { AppProvider, useApp } from "./store/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

import Logs from "./pages/Logs";
import Terminal from "./pages/Terminal";
import Containers from "./pages/container";
import Images from "./pages/Images";




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
      default:           return <Dashboard />; 
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        fontFamily: "Syne, sans-serif",
        background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f8faff 100%)",
      }}
    >
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