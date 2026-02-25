import { useState } from "react";
import { useApp } from "../store/AppContext";

const AVAILABLE_IMAGES_FOR_RUN = [
  "nginx:latest",
  "ubuntu:22.04",
  "postgres:16",
  "redis:7-alpine"
];

interface Props {
  onClose: () => void;
}

export default function NewContainerModal({ onClose }: Props) {

  const { runContainer, images } = useApp();

  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState("nginx:latest");
  const [customImage, setCustomImage] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [ports, setPorts] = useState("");
  const [command, setCommand] = useState("");
  const [creating, setCreating] = useState(false);
  const [done, setDone] = useState(false);

  const allImageOptions = [
    ...AVAILABLE_IMAGES_FOR_RUN,
    ...images.map(i => `${i.repository}:${i.tag}`)
  ].filter((v, i, a) => a.indexOf(v) === i);

  const finalImage = useCustom ? customImage : selectedImage;

  const handleCreate = async () => {

    if (!finalImage) return;

    setCreating(true);

    try {

      await runContainer(
        finalImage,
        name.trim() || undefined,
        ports.trim() || undefined,
        command.trim() || undefined
      );

      setDone(true);

      setTimeout(() => {
        onClose();
      }, 600);

    } catch (e) {
      console.error("Docker run failed:", e);
    }

    setCreating(false);
  };

  return (
    <button onClick={handleCreate}>
      {creating ? "Creating..." : "Run Container"}
    </button>
  );
}