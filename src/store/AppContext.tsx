import { createContext, useContext, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
}

export interface Image {
  id: string;
  repository: string;
  tag: string;
  size: string;
}

export interface LogEntry {
  time: string;
  message: string;
}

interface AppContextType {
  containers: Container[];
  images: Image[];
  logs: LogEntry[];

  refreshContainers: () => Promise<void>;
  refreshImages: () => Promise<void>;

  startContainer: (id: string) => Promise<void>;
  stopContainer: (id: string) => Promise<void>;
  removeContainer: (id: string) => Promise<void>;
  runContainer: (
    image: string,
    name?: string,
    ports?: string,
    cmd?: string
  ) => Promise<void>;

  pullImage: (name: string, tag: string) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
  buildImage: (path: string, tag: string) => Promise<void>;

  execIntoContainer: (id: string, cmd: string) => Promise<string>;
  streamLogs: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // -------------------------
  // REFRESH
  // -------------------------

  const refreshContainers = async () => {
    try {
      const data = await invoke<Container[]>("list_containers");
      setContainers(data);
    } catch (error) {
      console.error("Failed to refresh containers:", error);
    }
  };

  const refreshImages = async () => {
    try {
      const data = await invoke<Image[]>("list_images");
      setImages(data);
    } catch (error) {
      console.error("Failed to refresh images:", error);
    }
  };

  // -------------------------
  // CONTAINERS
  // -------------------------

  const startContainer = async (id: string) => {
    try {
      await invoke("start_container", { id });
      await refreshContainers();
    } catch (error) {
      console.error("Failed to start container:", error);
      throw error;
    }
  };

  const stopContainer = async (id: string) => {
    try {
      await invoke("stop_container", { id });
      await refreshContainers();
    } catch (error) {
      console.error("Failed to stop container:", error);
      throw error;
    }
  };

  const removeContainer = async (id: string) => {
    try {
      await invoke("remove_container", { id });
      await refreshContainers();
    } catch (error) {
      console.error("Failed to remove container:", error);
      throw error;
    }
  };

  const runContainer = async (
    image: string,
    name?: string,
    ports?: string,
    cmd?: string
  ) => {
    try {
      await invoke("run_container", {
        image,
        name,
        ports,
        cmd,
      });
      await refreshContainers();
    } catch (error) {
      console.error("Failed to run container:", error);
      throw error;
    }
  };

  // -------------------------
  // IMAGES
  // -------------------------

  const pullImage = async (name: string, tag: string) => {
    try {
      await invoke("pull_image", { name, tag });
      await refreshImages();
    } catch (error) {
      console.error("Failed to pull image:", error);
      throw error;
    }
  };

  const removeImage = async (id: string) => {
    try {
      await invoke("remove_image", { id });
      await refreshImages();
    } catch (error) {
      console.error("Failed to remove image:", error);
      throw error;
    }
  };

  const buildImage = async (path: string, tag: string) => {
    try {
      await invoke("build_image", { path, tag });
      await refreshImages();
    } catch (error) {
      console.error("Failed to build image:", error);
      throw error;
    }
  };

  // -------------------------
  // TERMINAL
  // -------------------------

  const execIntoContainer = async (id: string, cmd: string) => {
    try {
      const output = await invoke<string>("exec_into_container", { id, cmd });
      return output;
    } catch (error) {
      console.error("Failed to exec into container:", error);
      throw error;
    }
  };

  // -------------------------
  // LOGS
  // -------------------------

  const streamLogs = async (id: string) => {
    try {
      const output = await invoke<string>("stream_logs", { id });
      const lines = output.split("\n").map((line) => ({
        time: new Date().toLocaleTimeString(),
        message: line,
      }));
      setLogs(lines);
    } catch (error) {
      console.error("Failed to stream logs:", error);
      setLogs([{ time: new Date().toLocaleTimeString(), message: "Failed to fetch logs" }]);
    }
  };

  useEffect(() => {
    refreshContainers();
    refreshImages();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      refreshContainers();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        containers,
        images,
        logs,

        refreshContainers,
        refreshImages,

        startContainer,
        stopContainer,
        removeContainer,
        runContainer,

        pullImage,
        removeImage,
        buildImage,

        execIntoContainer,
        streamLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);