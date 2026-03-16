# Portly

> Remote Docker management over SSH — built with Tauri, React & Rust.

Portly is a lightweight desktop app that lets you monitor and control Docker containers on remote Linux servers via SSH. No agent, no open ports — just SSH.

![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Stack](https://img.shields.io/badge/stack-Tauri%20%7C%20React%20%7C%20Rust-orange)
![Version](https://img.shields.io/badge/version-0.1.0-green)

---

## Features

- **Container management** — list, start, stop, and restart Docker containers on remote hosts
- **Log viewer** — inspect container logs directly in the app
- **Auto-discovery** — automatically detects Portly-compatible servers on the local network via UDP multicast
- **Manual servers** — add any server by IP/hostname, SSH user, and password
- **Secure credential storage** — passwords are stored locally using [Tauri Stronghold](https://github.com/tauri-apps/tauri-plugin-stronghold) (encrypted vault)

---

## Requirements

- [Node.js](https://nodejs.org/) (LTS)
- [Rust](https://rustup.rs/) (stable)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/) for your OS

---

## Getting Started

```bash
# Install frontend dependencies
npm install

# Start in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

The built installer will be in `src-tauri/target/release/bundle/`.

---

## Project Structure

```
portly/
├── src/                    # React frontend
│   ├── components/         # UI components (Dashboard, ServerList, LogViewer, ...)
│   ├── hooks/              # useContainers, useDiscovery, useVault
│   ├── styles/             # Global CSS
│   └── types.ts            # Shared TypeScript types
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── lib.rs          # Tauri commands & app setup
│   │   ├── ssh.rs          # SSH connection & command execution (russh)
│   │   ├── docker.rs       # Docker commands over SSH
│   │   ├── discovery.rs    # UDP multicast server discovery
│   │   └── vault.rs        # Credential storage via Stronghold
│   └── tauri.conf.json
└── .github/workflows/      # CI/CD — builds & releases on push to master
```

---

## Server Discovery

Portly listens on the multicast address `224.0.0.251:7475` for JSON beacons in the following format:

```json
{
  "name": "My Home Server",
  "ip": "192.168.1.42",
  "version": "1.0.0"
}
```

Any host broadcasting this beacon will automatically appear in the server list.

---

## CI / Releases

Pushing to `master` triggers the GitHub Actions workflow, which builds a Windows installer and creates a draft release tagged `app-v<VERSION>` (version taken from `tauri.conf.json`).

---

## License

MIT
