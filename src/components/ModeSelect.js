import React from 'react';
import { useNavigate } from 'react-router-dom';

// Thumbnails for each phase
// Assets are served from the public folder using absolute paths
const feiraImg = '/assets/images/items/apple.png';
const supermercadoImg = '/assets/images/items/bread.png';
const festaImg = '/assets/images/items/cake.png';
const praiaImg = '/assets/images/items/coconut.png';

// List of available phases.  The key matches the JSON file name in
// `src/phases/` and the label is shown to the player.
const PHASES = [
  { key: 'feira', label: 'Feira de Rua', img: feiraImg, alt: 'Banca de feira' },
  { key: 'supermercado', label: 'Supermercado', img: supermercadoImg, alt: 'Corredor de supermercado' },
  { key: 'festa', label: 'Festa de Aniversário', img: festaImg, alt: 'Bolo de festa' },
  { key: 'praia', label: 'Praia', img: praiaImg, alt: 'Coco na praia' }
];

export default function ModeSelect() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Escolha uma Fase</h1>
      <div className="phase-grid">
        {PHASES.map(({ key, label, img, alt }) => (
          <button
            key={key}
            className="phase-button"
            onClick={() => navigate(`/play/${key}`)}
            aria-label={label}
          >
            <img src={img} alt={alt || label} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}