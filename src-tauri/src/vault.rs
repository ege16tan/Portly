use serde::{Serialize, Deserialize};
use std::fs;
use tauri::Manager;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Credentials {
    pub username: String,
    pub password: Option<String>,
}

fn get_vault_path(app: &tauri::AppHandle) -> std::path::PathBuf {
    let mut path = app.path().app_local_data_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));
    path.push("vault.json");
    path
}

fn load_vault(app: &tauri::AppHandle) -> std::collections::HashMap<String, Credentials> {
    let path = get_vault_path(app);
    if let Ok(data) = fs::read_to_string(&path) {
        serde_json::from_str(&data).unwrap_or_default()
    } else {
        std::collections::HashMap::new()
    }
}

fn save_vault(app: &tauri::AppHandle, vault: &std::collections::HashMap<String, Credentials>) -> anyhow::Result<()> {
    let path = get_vault_path(app);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    let data = serde_json::to_string_pretty(vault)?;
    fs::write(path, data)?;
    Ok(())
}

pub async fn save_credentials(
    app: tauri::AppHandle,
    server_id: &str,
    creds: Credentials
) -> anyhow::Result<()> {
    let mut vault = load_vault(&app);
    vault.insert(server_id.to_string(), creds);
    save_vault(&app, &vault)?;
    Ok(())
}

pub async fn get_credentials(
    app: tauri::AppHandle,
    server_id: &str
) -> anyhow::Result<Option<Credentials>> {
    let vault = load_vault(&app);
    Ok(vault.get(server_id).cloned())
}

pub async fn delete_credentials(
    app: tauri::AppHandle,
    server_id: &str
) -> anyhow::Result<()> {
    let mut vault = load_vault(&app);
    vault.remove(server_id);
    save_vault(&app, &vault)?;
    Ok(())
}
