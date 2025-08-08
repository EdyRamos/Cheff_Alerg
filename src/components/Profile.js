import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../services/firestore';
import { useStore } from '../store';
import LoadingScreen from './LoadingScreen';
import { GLUTEN_SOURCES } from '../constants/allergens';
import NavBar from './NavBar';
import PageLayout from './PageLayout';

/**
 * Displays the saved user profile along with a list of gluten sources to avoid.
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

  // Compute a list of gluten sources from the bitmask for display.
  const bitCount = profile.bitCount || GLUTEN_SOURCES.length;
  const selected = GLUTEN_SOURCES.slice(0, bitCount).filter((_, idx) => (profile.bitmask & (1 << idx)) !== 0);

  return (
    <>
      <NavBar />
      <PageLayout>
        <div className="page-content">
          <h1>Seu Perfil</h1>
          <p>
            <strong>Nome:</strong> {profile.nome}
          </p>
          <p>
            <strong>Idade:</strong> {profile.idade}
          </p>
          <p>
            <strong>Fontes de glúten selecionadas:</strong>{' '}
            {selected.length > 0 ? selected.join(', ') : 'Nenhum'}
          </p>
          <div className="flex-gap">
            <button className="btn" onClick={() => navigate('/modes')}>Selecionar Fase</button>
            <button className="btn" onClick={() => navigate('/profile/edit')}>Editar perfil</button>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
