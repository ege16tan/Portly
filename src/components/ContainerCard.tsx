import React from 'react';
import { Container } from '../types';

interface Props {
  container: Container;
  onAction: (id: string, action: string) => void;
  onLogs: (id: string, name: string) => void;
  onWebview?: (id: string, name: string, port: string) => void;
}

const getPublicPort = (ports: string) => {
  if (!ports) return null;
  // Match forms like '0.0.0.0:8080->80/tcp' or '127.0.0.1:443->443/tcp' or ':::3000->3000'
  const match = ports.match(/(?:\d+\.\d+\.\d+\.\d+:|:::)(\d+)->/);
  return match ? match[1] : null;
};

export const ContainerCard: React.FC<Props> = ({ container, onAction, onLogs, onWebview }) => {
  const publicPort = getPublicPort(container.ports);

  return (
    <div className="card">
      <div className="card-header">
        <span className="container-name" title={container.name} style={{ width: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{container.name}</span>
        <span className={`status-badge ${container.state === 'running' ? 'status-running' : 'status-stopped'}`}>
          {container.state}
        </span>
      </div>
      <div className="container-info">Image: <span title={container.image}>{container.image.length > 25 ? container.image.substring(0, 22) + '...' : container.image}</span></div>
      <div className="container-info">Status: {container.status}</div>
      <div className="container-info">Ports: {container.ports || 'none'}</div>
      <div className="card-actions" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
        <button onClick={() => onAction(container.id, 'restart')}>Restart</button>
        <button onClick={() => onAction(container.id, container.state === 'running' ? 'stop' : 'start')}>
          {container.state === 'running' ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => onLogs(container.id, container.name)}>Logs</button>
        {publicPort && container.state === 'running' && onWebview && (
          <button 
            onClick={() => onWebview(container.id, container.name, publicPort)}
            style={{ backgroundColor: '#238636', color: 'white', borderColor: '#238636' }}
          >
            Web UI
          </button>
        )}
      </div>
    </div>
  );
};
