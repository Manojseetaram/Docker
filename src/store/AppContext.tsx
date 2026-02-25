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

interface AppContextType {
  containers: Container[];
  images: Image[];
  refreshContainers: () => Promise<void>;
  refreshImages: () => Promise<void>;
  startContainer: (id: string) => Promise<void>;
  stopContainer: (id: string) => Promise<void>;
  removeContainer: (id: string) => Promise<void>;
  pullImage: (name: string, tag: string) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [images, setImages] = useState<Image[]>([]);

  const refreshContainers = async () => {
    const data = await invoke<Container[]>("list_containers");
    setContainers(data);
  };

  const refreshImages = async () => {
    const data = await invoke<Image[]>("list_images");
    setImages(data);
  };

  const startContainer = async (id: string) => {
    await invoke("start_container", { id });
    await refreshContainers();
  };

  const stopContainer = async (id: string) => {
    await invoke("stop_container", { id });
    await refreshContainers();
  };

  const removeContainer = async (id: string) => {
    await invoke("remove_container", { id });
    await refreshContainers();
  };

  const pullImage = async (name: string, tag: string) => {
    await invoke("pull_image", { name, tag });
    await refreshImages();
  };

  const removeImage = async (id: string) => {
    await invoke("remove_image", { id });
    await refreshImages();
  };

  useEffect(() => {
    refreshContainers();
    refreshImages();
  }, []);

  return (
    <AppContext.Provider
      value={{
        containers,
        images,
        refreshContainers,
        refreshImages,
        startContainer,
        stopContainer,
        removeContainer,
        pullImage,
        removeImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);