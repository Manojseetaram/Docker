import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

import Images from "./pages/Images";
import Logs from "./pages/Logs";
import Terminal from "./pages/Terminal";
import Containers from "./pages/container";

export type Page = "dashboard" | "containers" | "images" | "logs" | "terminal";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard />;
      case "containers": return <Containers />;
      case "images": return <Images />;
      case "logs": return <Logs />;
      case "terminal": return <Terminal />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;