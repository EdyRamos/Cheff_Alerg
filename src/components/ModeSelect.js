import React from 'react';
import { useNavigate } from 'react-router-dom';

// List of available phases.  The key matches the JSON file name in
// `src/phases/` and the label is shown to the player.
const PHASES = [
  { key: 'feira', label: 'Feira de Rua' },
  { key: 'supermercado', label: 'Supermercado' },
  { key: 'festa', label: 'Festa de Aniversário' }
];

export default function ModeSelect() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Escolha uma Fase</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {PHASES.map(({ key, label }) => (
          <li key={key} style={{ margin: '0.5rem 0' }}>
            <button onClick={() => navigate(`/play/${key}`)}>{label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}