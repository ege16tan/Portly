use russh::*;
use russh_keys::*;
use std::sync::Arc;
use tokio::io::AsyncWriteExt;

pub struct Client {
}

impl client::Handler for Client {
    type Error = anyhow::Error;
    async fn check_server_key(
        &mut self,
        _server_public_key: &key::PublicKey,
    ) -> Result<bool, Self::Error> {
        Ok(true)
    }
}

pub async fn execute_command(
    host: &str,
    port: u16,
    user: &str,
    password: Option<&str>,
    command: &str,
) -> anyhow::Result<String> {
    let config = client::Config::default();
    let config = Arc::new(config);
    let sh = Client {};

    let mut session = client::connect(config, (host, port), sh).await?;
    
    let auth_res = if let Some(p) = password {
        session.authenticate_password(user, p).await?
    } else {
        // Handle key auth if needed in future
        false
    };

    if !auth_res {
        return Err(anyhow::anyhow!("Authentication failed"));
    }

    let mut channel = session.channel_open_session().await?;
    channel.exec(true, command).await?;
    
    let mut output = String::new();
    while let Some(msg) = channel.wait().await {
        match msg {
            ChannelMsg::Data { data } => {
                output.push_str(&String::from_utf8_lossy(&data));
            }
            ChannelMsg::ExitStatus { .. } => break,
            _ => {}
        }
    }

    Ok(output)
}
