import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../services/firestore';

// Lookup table for allergen names corresponding to each bit.
const ALLERGEN_NAMES = [
  'Leite',
  'Ovo',
  'Amendoim',
  'Soja',
  'Trigo',
  'Peixes',
  'Frutos do Mar'
];

/**
 * Displays the saved user profile along with a list of allergens to avoid.
 */
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const data = await loadProfile();
      setProfile(data);
    }
    init();
  }, []);

  if (!profile) {
    return <div style={{ padding: '2rem' }}>Carregando…</div>;
  }

  // Compute a list of allergens from the bitmask for display.
  const selected = ALLERGEN_NAMES.filter((_, idx) => (profile.bitmask & (1 << idx)) !== 0);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Seu Perfil</h1>
      <p>
        <strong>Nome:</strong> {profile.nome}
      </p>
      <p>
        <strong>Idade:</strong> {profile.idade}
      </p>
      <p>
        <strong>Alérgenos selecionados:</strong>{' '}
        {selected.length > 0 ? selected.join(', ') : 'Nenhum'}
      </p>
      <button onClick={() => navigate('/modes')}>Selecionar Fase</button>
    </div>
  );
}