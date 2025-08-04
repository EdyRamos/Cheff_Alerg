import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../services/firestore';
import { useStore } from '../store';
import LoadingScreen from './LoadingScreen';
import { ALLERGEN_NAMES } from '../constants/allergens';
import NavBar from './NavBar';
import PageLayout from './PageLayout';

/**
 * Displays the saved user profile along with a list of allergens to avoid.
 */
export default function Profile() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      (async () => {
        const data = await loadProfile();
        setProfile(data);
      })();
    }
  }, [profile, setProfile]);

  if (!profile) {
    return <LoadingScreen />;
  }

  // Compute a list of allergens from the bitmask for display.
  const bitCount = profile.bitCount || ALLERGEN_NAMES.length;
  const selected = ALLERGEN_NAMES.slice(0, bitCount).filter((_, idx) => (profile.bitmask & (1 << idx)) !== 0);

  return (
    <>
      <NavBar />
      <PageLayout>
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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/modes')}>Selecionar Fase</button>
          <button onClick={() => navigate('/profile/edit')}>Editar perfil</button>
        </div>
      </PageLayout>
    </>
  );
}
