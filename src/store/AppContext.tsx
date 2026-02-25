import { createContext, useContext, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

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

    // Normalize status
    const normalized = (data ?? []).map(c => ({
      ...c,
      status: c.status.startsWith("Up") ? "running" : "stopped",
    }));

    setContainers(normalized);
  } catch (error) {
    console.error("Failed to refresh containers:", error);
  }
};

const refreshImages = async () => {
  try {
    // The backend now returns JSON, so no need for string parsing
    const data = await invoke<Image[]>("list_images");
    console.log("IMAGES FROM BACKEND:", data);
    setImages(data ?? []);
  } catch (error) {
    console.error("Failed to refresh images:", error);
  }
};
const startContainer = async (name: string) => {
  try {
    const result = await invoke("start_container", { name });
    console.log("Start container result:", result);

    const updated = await invoke<Container[]>("list_containers");
    console.log("Containers after start:", updated); // ✅ log to see real status
    setContainers(updated);

  } catch (error) {
    console.error("startContainer error:", error);
    throw error;
  }
};

const stopContainer = async (name: string) => {
  try {
    const result = await invoke("stop_container", { name });
    console.log("Stop container result:", result);
    await refreshContainers();
  } catch (error) {
    console.error("stopContainer error:", error);
    throw error;
  }
};
const removeContainer = async (name: string) => {
  try {
    await invoke("remove_container", { name }); // key must be `name`
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

const removeImage = async (name: string) => {
  try {
    await invoke("remove_image", { name }); // pass `name`, not `id`
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

const execIntoContainer = async (id: string, cmd: string): Promise<string> => {
  try {
    const output = await invoke<string>("exec_into_container", {
      container: id,
      command: cmd,
    });
    return output; // TypeScript now knows this is string
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
    // Clear previous logs
    setLogs([]);

    // Listen to streaming logs
    await listen<string>("container-log", (event) => {
      setLogs((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          message: event.payload,
        },
      ]);
    });

    // Start streaming
    await invoke("stream_logs", { container: id });

  } catch (error) {
    console.error("Failed to stream logs:", error);
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