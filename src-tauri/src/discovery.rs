use serde::{Deserialize, Serialize};
use std::net::{UdpSocket, Ipv4Addr};
use tauri::{AppHandle, Emitter};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Beacon {
    pub name: String,
    pub ip: String,
    pub version: String,
}

pub async fn start_discovery(app: AppHandle) -> anyhow::Result<()> {
    let multicast_addr = Ipv4Addr::new(224, 0, 0, 251);
    let port = 7475;
    
    // Bind to all interfaces on the multicast port
    let socket = UdpSocket::bind(("0.0.0.0", port))?;
    socket.join_multicast_v4(&multicast_addr, &Ipv4Addr::new(0, 0, 0, 0))?;
    socket.set_nonblocking(true)?;

    println!("Discovery listener started on 224.0.0.251:{}", port);

    let mut buf = [0u8; 1024];
    
    // Run in a background thread
    tokio::spawn(async move {
        loop {
            // Since we set nonblocking, we have to handle the error or use tokio's UdpSocket
            // For simplicity in this integration, we'll just poll or use a blocking read in a dedicated thread
            // But let's try to be a bit more "Tokio-native" if possible
            match socket.recv_from(&mut buf) {
                Ok((size, _src)) => {
                    let data = &buf[..size];
                    if let Ok(beacon) = serde_json::from_slice::<Beacon>(data) {
                        println!("Found beacon: {:?}", beacon);
                        // Emit event to frontend
                        let _ = app.emit("beacon-discovered", beacon);
                    }
                }
                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
                }
                Err(e) => {
                    eprintln!("Discovery error: {}", e);
                    break;
                }
            }
        }
    });

    Ok(())
}
