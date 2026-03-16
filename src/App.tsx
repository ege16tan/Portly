import { useEffect, useState, useMemo } from "react";
import "./styles/globals.css";
import { useContainers } from "./hooks/useContainers";
import { useDiscovery } from "./hooks/useDiscovery";
import { Dashboard } from "./components/Dashboard";
import { ServerList, Server } from "./components/ServerList";
import { AddServerModal } from "./components/AddServerModal";
import { LogViewer } from "./components/LogViewer";

function App() {
  const { containers, loading, error, fetchContainers, controlContainer, getLogs } = useContainers();
  const { discoveredServers } = useDiscovery();
  const [manualServers, setManualServers] = useState<Server[]>([]);
  const [activeServer, setActiveServer] = useState<Server | null>(null);
  const [showAddServer, setShowAddServer] = useState(false);
  const [showLogs, setShowLogs] = useState<{ id: string, name: string } | null>(null);
  const [currentLogs, setCurrentLogs] = useState("");
  const [logsLoading, setLogsLoading] = useState(false);

  const allServers = useMemo(() => {
    // Basic deduplication could be added here
    return [...manualServers, ...discoveredServers];
  }, [manualServers, discoveredServers]);

  useEffect(() => {
    if (!activeServer && allServers.length > 0) {
      setActiveServer(allServers[0]);
    }
  }, [allServers, activeServer]);

  useEffect(() => {
    // fetchContainers(server);
  }, []);

  return (
    <div className="root-layout" style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <ServerList 
        servers={allServers} 
        activeServerId={activeServer?.id || null} 
        onSelectServer={setActiveServer} 
        onAddServer={() => setShowAddServer(true)}
      />

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <div style={{ color: '#8b949e', fontSize: '0.85rem' }}>
              {activeServer ? `${activeServer.name} (${activeServer.host})` : 'No server selected'}
            </div>
          </div>
          <button 
            onClick={() => activeServer && fetchContainers({ ...activeServer, password: activeServer.password })} 
            className="primary" 
            disabled={loading || !activeServer}
          >
            {loading ? "Refreshing..." : "Refresh List"}
          </button>
        </header>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(248,81,73,0.1)', border: '1px solid #f85149', borderRadius: '6px', color: '#f85149', marginTop: '1.5rem' }}>
            <strong>Connection Error:</strong> {error}
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Dashboard 
            containers={containers} 
            loading={loading} 
            onAction={(id: string, action: string) => activeServer && controlContainer({ ...activeServer, password: activeServer.password }, id, action)}
            onLogs={async (id: string, name: string) => {
              if (activeServer) {
                setShowLogs({ id, name });
                setLogsLoading(true);
                const logs = await getLogs({ ...activeServer, password: activeServer.password }, id);
                setCurrentLogs(logs);
                setLogsLoading(false);
              }
            }}
          />
        </div>
      </main>

      {showAddServer && (
        <AddServerModal
          onAdd={(server) => setManualServers(prev => [...prev, server])}
          onClose={() => setShowAddServer(false)}
        />
      )}

      {showLogs && (
        <LogViewer
          containerName={showLogs.name}
          logs={currentLogs}
          loading={logsLoading}
          onClose={() => {
            setShowLogs(null);
            setCurrentLogs("");
          }}
        />
      )}
    </div>
  );
}

export default App;
