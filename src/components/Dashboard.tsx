import React from 'react';
import { Container } from '../types';
import { ContainerCard } from './ContainerCard';

interface Props {
  containers: Container[];
  loading: boolean;
  onAction: (id: string, action: string) => void;
  onLogs: (id: string, name: string) => void;
  onWebview?: (id: string, name: string, port: string) => void;
}

export const Dashboard: React.FC<Props> = ({ containers, loading, onAction, onLogs, onWebview }) => {
  if (loading && containers.length === 0) {
    return (
      <div style={{ color: '#8b949e', textAlign: 'center', padding: '4rem' }}>
        Loading containers...
      </div>
    );
  }

  if (containers.length === 0) {
    return (
      <div style={{ color: '#8b949e', textAlign: 'center', padding: '4rem' }}>
        No containers found. Connect to a server to see your containers.
      </div>
    );
  }

  return (
    <div className="container-grid">
      {containers.map((c) => (
        <ContainerCard 
          key={c.id} 
          container={c} 
          onAction={onAction} 
          onLogs={onLogs} 
          onWebview={onWebview}
        />
      ))}
    </div>
  );
};
