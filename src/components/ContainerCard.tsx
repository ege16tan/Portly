import React from 'react';
import { Container } from '../hooks/useContainers';

interface Props {
  container: Container;
  onAction: (id: string, action: string) => void;
  onLogs: (id: string) => void;
}

export const ContainerCard: React.FC<Props> = ({ container, onAction, onLogs }) => {
  return (
    <div className="card">
      <div className="card-header">
        <span className="container-name">{container.name}</span>
        <span className={`status-badge ${container.state === 'running' ? 'status-running' : 'status-stopped'}`}>
          {container.state}
        </span>
      </div>
      <div className="container-info">Image: {container.image}</div>
      <div className="container-info">Status: {container.status}</div>
      <div className="container-info">Ports: {container.ports || 'none'}</div>
      <div className="card-actions">
        <button onClick={() => onAction(container.id, 'restart')}>Restart</button>
        <button onClick={() => onAction(container.id, container.state === 'running' ? 'stop' : 'start')}>
          {container.state === 'running' ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => onLogs(container.id)}>Logs</button>
      </div>
    </div>
  );
};
