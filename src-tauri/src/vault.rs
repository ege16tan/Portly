use tauri_plugin_stronghold::Stronghold;
use tauri_plugin_stronghold::app_handle_ext::StrongholdExt;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Credentials {
    pub username: String,
    pub password: Option<String>,
}

pub async fn save_credentials(
    app: tauri::AppHandle,
    server_id: &str,
    creds: Credentials
) -> anyhow::Result<()> {
    let stronghold = app.stronghold();
    let client = stronghold.load_client(server_id).await?;
    let store = client.store();

    let json = serde_json::to_string(&creds)?;
    store.insert(server_id.to_string(), json.into_bytes()).await?;
    
    stronghold.save().await?;
    Ok(())
}

pub async fn get_credentials(
    app: tauri::AppHandle,
    server_id: &str
) -> anyhow::Result<Option<Credentials>> {
    let stronghold = app.stronghold();
    let client = stronghold.load_client(server_id).await?;
    let store = client.store();

    if let Ok(data) = store.get(server_id).await {
        let creds: Credentials = serde_json::from_slice(&data)?;
        Ok(Some(creds))
    } else {
        Ok(None)
    }
}

pub async fn delete_credentials(
    app: tauri::AppHandle,
    server_id: &str
) -> anyhow::Result<()> {
    let stronghold = app.stronghold();
    let client = stronghold.load_client(server_id).await?;
    let store = client.store();

    store.remove(server_id).await?;
    stronghold.save().await?;
    Ok(())
}
