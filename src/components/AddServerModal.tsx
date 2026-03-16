import React, { useState } from 'react';
import { Server } from './ServerList';

interface Props {
  onAdd: (server: Server) => void;
  onClose: () => void;
}

export const AddServerModal: React.FC<Props> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('22');
  const [user, setUser] = useState('root');
  const [password, setPassword] = useState('');

  const handleAdd = () => {
    if (!host || !user) return;
    onAdd({
      id: `manual-${host}`,
      name: name || host,
      host,
      port: parseInt(port),
      user,
      password,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        background: '#161b22', border: '1px solid #30363d',
        borderRadius: '12px', padding: '2rem', width: '400px',
        display: 'flex', flexDirection: 'column', gap: '1rem'
      }}>
        <h2 style={{ margin: 0, color: '#f0f6fc' }}>Add Server</h2>

        <label style={{ color: '#8b949e', fontSize: '0.85rem' }}>
          Display Name
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Mein Heimserver"
            style={{ display: 'block', width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }}
          />
        </label>

        <label style={{ color: '#8b949e', fontSize: '0.85rem' }}>
          IP Adresse / Hostname *
          <input
            value={host}
            onChange={e => setHost(e.target.value)}
            placeholder="192.168.1.42"
            style={{ display: 'block', width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }}
          />
        </label>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ color: '#8b949e', fontSize: '0.85rem', flex: 2 }}>
            SSH User *
            <input
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="root"
              style={{ display: 'block', width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }}
            />
          </label>
          <label style={{ color: '#8b949e', fontSize: '0.85rem', flex: 1 }}>
            Port
            <input
              value={port}
              onChange={e => setPort(e.target.value)}
              placeholder="22"
              style={{ display: 'block', width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }}
            />
          </label>
        </div>

        <label style={{ color: '#8b949e', fontSize: '0.85rem' }}>
          Passwort
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ display: 'block', width: '100%', marginTop: '0.3rem', boxSizing: 'border-box' }}
          />
        </label>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button onClick={onClose}>Abbrechen</button>
          <button className="primary" onClick={handleAdd}>Server hinzufügen</button>
        </div>
      </div>
    </div>
  );
};
