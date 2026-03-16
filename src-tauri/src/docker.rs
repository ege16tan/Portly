use crate::ssh;
use serde::Serialize;

#[derive(Serialize)]
pub struct Container {
    pub id: String,
    pub name: String,
    pub image: String,
    pub status: String,
    pub state: String,
    pub ports: String,
}

pub async fn list_containers(
    host: &str,
    port: u16,
    user: &str,
    password: Option<&str>,
) -> anyhow::Result<Vec<Container>> {
    let command = "docker ps -a --format '{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}|{{.State}}|{{.Ports}}'";
    let output = ssh::execute_command(host, port, user, password, command).await?;
    
    let mut containers = Vec::new();
    for line in output.lines() {
        let parts: Vec<&str> = line.split('|').collect();
        if parts.len() >= 6 {
            containers.push(Container {
                id: parts[0].to_string(),
                name: parts[1].to_string(),
                image: parts[2].to_string(),
                status: parts[3].to_string(),
                state: parts[4].to_string(),
                ports: parts[5].to_string(),
            });
        }
    }
    
    Ok(containers)
}

pub async fn control_container(
    host: &str,
    port: u16,
    user: &str,
    password: Option<&str>,
    id: &str,
    action: &str,
) -> anyhow::Result<String> {
    let command = format!("docker {} {}", action, id);
    ssh::execute_command(host, port, user, password, &command).await
}

pub async fn get_logs(
    host: &str,
    port: u16,
    user: &str,
    password: Option<&str>,
    id: &str,
    tail: u32,
) -> anyhow::Result<String> {
    let command = format!("docker logs --tail {} {}", tail, id);
    ssh::execute_command(host, port, user, password, &command).await
}
