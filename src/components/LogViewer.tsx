import React, { useEffect, useRef } from 'react';

interface Props {
  containerName: string;
  logs: string;
  onClose: () => void;
  loading?: boolean;
}

export const LogViewer: React.FC<Props> = ({ containerName, logs, onClose, loading }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 101, padding: '2rem'
    }}>
      <div style={{
        background: '#0d1117', border: '1px solid #30363d',
        borderRadius: '12px', width: '90%', maxWidth: '1000px', height: '80vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.5rem', borderBottom: '1px solid #30363d',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Logs: {containerName}</h2>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: '#8b949e',
            cursor: 'pointer', fontSize: '1.5rem'
          }}>&times;</button>
        </div>

        <div style={{
          flex: 1, overflowY: 'auto', padding: '1.5rem',
          fontFamily: 'monospace', fontSize: '0.9rem', backgroundColor: '#010409',
          color: '#e6edf3', whiteSpace: 'pre-wrap', lineHeight: '1.5'
        }}>
          {loading ? (
            <div style={{ color: '#8b949e' }}>Loading logs...</div>
          ) : logs ? (
            <>
              {logs}
              <div ref={logEndRef} />
            </>
          ) : (
            <div style={{ color: '#8b949e' }}>No logs found.</div>
          )}
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
