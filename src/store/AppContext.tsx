import { createContext, useContext, useState, ReactNode } from "react";
import {
  Container, DockerImage, LogEntry,
  INITIAL_CONTAINERS, INITIAL_IMAGES, INITIAL_LOGS,
  ContainerStatus
} from "./mockData";

interface AppStore {
  containers: Container[];
  images: DockerImage[];
  logs: LogEntry[];
  addContainer: (c: Container) => void;
  removeContainer: (id: string) => void;
  updateContainerStatus: (id: string, status: ContainerStatus) => void;
  removeImage: (id: string) => void;
  pullImage: (repo: string, tag: string) => void;
  addLog: (entry: LogEntry) => void;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [containers, setContainers] = useState<Container[]>(INITIAL_CONTAINERS);
  const [images, setImages] = useState<DockerImage[]>(INITIAL_IMAGES);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  const addLog = (entry: LogEntry) => {
    setLogs(prev => [entry, ...prev]);
  };

  const addContainer = (c: Container) => {
    setContainers(prev => [c, ...prev]);
    addLog({
      time: new Date().toTimeString().slice(0, 8),
      level: "success",
      container: c.name,
      message: `Container '${c.name}' created and started from ${c.image}`,
    });
  };

  const removeContainer = (id: string) => {
    const c = containers.find(x => x.id === id);
    setContainers(prev => prev.filter(x => x.id !== id));
    if (c) addLog({
      time: new Date().toTimeString().slice(0, 8),
      level: "warn",
      container: c.name,
      message: `Container '${c.name}' removed`,
    });
  };

  const updateContainerStatus = (id: string, status: ContainerStatus) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, status, cpu: status === "running" ? "1.0%" : "0.0%", memory: status === "running" ? c.memory : "0 MB", uptime: status === "running" ? "just now" : "Stopped" } : c));
    const c = containers.find(x => x.id === id);
    if (c) addLog({
      time: new Date().toTimeString().slice(0, 8),
      level: status === "running" ? "success" : "warn",
      container: c.name,
      message: `Container '${c.name}' ${status}`,
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(x => x.id !== id));
  };

  const pullImage = (repo: string, tag: string) => {
    const newImg: DockerImage = {
      id: Math.random().toString(36).slice(2, 14),
      repository: repo,
      tag,
      size: `${Math.floor(Math.random() * 400 + 30)} MB`,
      created: "just now",
      inUse: false,
    };
    setImages(prev => [newImg, ...prev]);
    addLog({
      time: new Date().toTimeString().slice(0, 8),
      level: "success",
      container: "daemon",
      message: `Image '${repo}:${tag}' pulled successfully`,
    });
  };

  return (
    <AppContext.Provider value={{ containers, images, logs, addContainer, removeContainer, updateContainerStatus, removeImage, pullImage, addLog }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};