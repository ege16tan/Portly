import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  ports: string;
}

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchContainers(server: any) {
    setLoading(true);
    setError(null);
    try {
      const result: Container[] = await invoke("list_containers", server);
      setContainers(result);
    } catch (e: any) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  async function controlContainer(server: any, id: string, action: string) {
    try {
      await invoke("control_container", { ...server, id, action });
      await fetchContainers(server);
    } catch (e: any) {
      setError(e.toString());
    }
  }

  return { containers, loading, error, fetchContainers, controlContainer };
}
