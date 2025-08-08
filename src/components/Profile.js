import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../services/firestore';
import { useStore } from '../store';
import LoadingScreen from './LoadingScreen';
import NavBar from './NavBar';
import PageLayout from './PageLayout';

/**
 * Displays the saved user profile and whether the player has celiac disease.
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

  // Check whether the gluten bit (0) is set.
  const isCeliac = (profile.bitmask & 1) !== 0;

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
            <strong>Doença Celíaca:</strong> {isCeliac ? 'Sim' : 'Não'}
          </p>
          {isCeliac && (
            <p className="gluten-tip">
              Opte por alimentos naturalmente sem glúten e evite contaminação cruzada.
            </p>
          )}
          <div className="flex-gap">
            <button className="btn" onClick={() => navigate('/modes')}>Selecionar Fase</button>
            <button className="btn" onClick={() => navigate('/profile/edit')}>Editar perfil</button>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
