mod ssh;
mod docker;
mod discovery;
mod vault;

use docker::Container;
use tauri::Manager;
use vault::Credentials;

#[tauri::command]
async fn save_credentials(
    app: tauri::AppHandle,
    server_id: String,
    creds: Credentials,
) -> Result<(), String> {
    vault::save_credentials(app, &server_id, creds)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_credentials(
    app: tauri::AppHandle,
    server_id: String,
) -> Result<Option<Credentials>, String> {
    vault::get_credentials(app, &server_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn list_containers(
    host: String,
    port: u16,
    user: String,
    password: Option<String>,
) -> Result<Vec<Container>, String> {
    docker::list_containers(&host, port, &user, password.as_deref())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn control_container(
    host: String,
    port: u16,
    user: String,
    password: Option<String>,
    id: String,
    action: String,
) -> Result<String, String> {
    docker::control_container(&host, port, &user, password.as_deref(), &id, &action)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_logs(
    host: String,
    port: u16,
    user: String,
    password: Option<String>,
    id: String,
    tail: u32,
) -> Result<String, String> {
    docker::get_logs(&host, port, &user, password.as_deref(), &id, tail)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_credentials(
    app: tauri::AppHandle,
    server_id: String,
) -> Result<(), String> {
    vault::delete_credentials(app, &server_id)
        .await
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = discovery::start_discovery(handle).await {
                    eprintln!("Failed to start discovery: {}", e);
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_containers,
            control_container,
            get_logs,
            save_credentials,
            get_credentials,
            delete_credentials
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
