import { invoke } from "@tauri-apps/api/core";
import { Credentials } from "../types";

export async function saveCredentials(serverId: string, creds: Credentials) {
  return await invoke("save_credentials", { serverId, creds });
}

export async function getCredentials(serverId: string): Promise<Credentials | null> {
  return await invoke("get_credentials", { serverId });
}
