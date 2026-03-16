import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { Server } from "../components/ServerList";

interface Beacon {
  name: string;
  ip: string;
  version: string;
}

export function useDiscovery() {
  const [discoveredServers, setDiscoveredServers] = useState<Server[]>([]);

  useEffect(() => {
    const unlisten = listen<Beacon>("beacon-discovered", (event) => {
      const beacon = event.payload;
      setDiscoveredServers((prev) => {
        // Check if server already exists
        if (prev.find((s) => s.host === beacon.ip)) {
          return prev;
        }
        
        const newServer: Server = {
          id: `discovered-${beacon.ip}`,
          name: beacon.name,
          host: beacon.ip,
          port: 22,
          user: "root",
        };
        
        return [...prev, newServer];
      });
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return { discoveredServers };
}
