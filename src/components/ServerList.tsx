import React from 'react';
import { Server } from '../types';

interface Props {
  servers: Server[];
  activeServerId: string | null;
  onSelectServer: (server: Server) => void;
  onAddServer: () => void;
  onDeleteServer: (serverId: string) => void;
}

export const ServerList: React.FC<Props> = ({ servers, activeServerId, onSelectServer, onAddServer, onDeleteServer }) => {
  return (
    <aside className="sidebar">
      <h2 style={{ color: '#58a6ff', marginBottom: '1.5rem', userSelect: 'none' }}>Portly</h2>
      <nav style={{ flex: 1 }}>
        <div style={{ color: '#8b949e', fontSize: '0.75rem', marginBottom: '0.75rem', letterSpacing: '0.05em', fontWeight: 600 }}>SERVERS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {servers.map((server) => (
            <div 
              key={server.id}
              style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.8rem', 
                background: activeServerId === server.id ? '#1f6feb' : '#21262d', 
                borderRadius: '6px', 
                color: activeServerId === server.id ? 'white' : '#f0f6fc', 
                cursor: 'pointer', 
                fontSize: '0.9rem', 
                border: activeServerId === server.id ? '1px solid #58a6ff' : '1px solid #30363d',
                transition: 'all 0.1s ease',
              }}
              onClick={() => onSelectServer(server)}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{server.name}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{server.host}</span>
              </div>
              
              {server.id.startsWith('manual-') && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Möchtest du "${server.name}" wirklich löschen?`)) {
                      onDeleteServer(server.id);
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8b949e',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#f85149')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#8b949e')}
                  title="Server löschen"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {servers.length === 0 && (
            <div style={{ fontSize: '0.85rem', color: '#8b949e', fontStyle: 'italic', padding: '0.5rem' }}>
              No servers found...
            </div>
          )}
        </div>
      </nav>
      <div style={{ borderTop: '1px solid #30363d', paddingTop: '1rem' }}>
        <button style={{ width: '100%' }} onClick={onAddServer}>+ Add Server</button>
      </div>
    </aside>
  );
};
