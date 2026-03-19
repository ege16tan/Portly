import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Container, Server } from "../types";

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchContainers(server: Server) {
    setLoading(true);
    setError(null);
    try {
      const result: Container[] = await invoke("list_containers", {
        host: server.host,
        port: server.port,
        user: server.user,
        password: server.password,
      });
      setContainers(result);
    } catch (e: any) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  async function controlContainer(server: Server, id: string, action: string) {
    try {
      console.log(`${action}ing container ${id}...`);
      await invoke("control_container", {
        host: server.host,
        port: server.port,
        user: server.user,
        password: server.password,
        id,
        action,
      });
      console.log(`Successfully ${action}ed container ${id}`);
      await fetchContainers(server);
    } catch (e: any) {
      console.error(`Failed to ${action} container ${id}:`, e);
      setError(e.toString());
    }
  }

  const getLogs = async (server: Server, id: string, tail: number = 100) => {
    try {
      return await invoke<string>("get_logs", {
        host: server.host,
        port: server.port,
        user: server.user,
        password: server.password,
        id,
        tail
      });
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      return `Error fetching logs: ${err}`;
    }
  };

  return { containers, loading, error, fetchContainers, controlContainer, getLogs };
}
