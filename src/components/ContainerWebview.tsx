import React from 'react';

interface Props {
  url: string;
  containerName: string;
  onClose: () => void;
}

export const ContainerWebview: React.FC<Props> = ({ url, containerName, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ width: '90vw', height: '90vh', padding: 0, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #30363d', backgroundColor: '#161b22' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{containerName} <span style={{ fontSize: '0.8rem', color: '#8b949e', marginLeft: '8px' }}>({url})</span></h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 0.8rem', backgroundColor: '#238636', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem' }}>
              Open in Browser
            </a>
            <button onClick={onClose} style={{ padding: '0.4rem 0.8rem' }}>Close</button>
          </div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <iframe 
            src={url} 
            title={`Web UI for ${containerName}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
};
