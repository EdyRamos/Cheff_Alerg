import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../services/firestore';
import { useStore } from '../store';
import LoadingScreen from './LoadingScreen';
import { GLUTEN_SOURCES } from '../constants/allergens';
import NavBar from './NavBar';
import PageLayout from './PageLayout';

/**
 * Exibe o perfil salvo do usuário, incluindo lista de fontes de glúten e status de doença celíaca.
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

  // BitCount garante compatibilidade com versões antigas
  const bitCount = profile.bitCount || GLUTEN_SOURCES.length;

  // Fontes de glúten selecionadas a partir do bitmask
  const selectedSources = GLUTEN_SOURCES.slice(0, bitCount).filter(
    (_, idx) => (profile.bitmask & (1 << idx)) !== 0
  );

  // Usuário é considerado celíaco se TODAS as fontes de glúten estiverem selecionadas
  const isCeliac = selectedSources.length === GLUTEN_SOURCES.length;

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
          <p>
            <strong>Fontes de glúten selecionadas:</strong>{' '}
            {selectedSources.length > 0
              ? selectedSources.join(', ')
              : 'Nenhuma'}
          </p>

          {isCeliac && (
            <p className="gluten-tip">
              Opte por alimentos naturalmente sem glúten e evite contaminação
              cruzada.
            </p>
          )}

          <div className="flex-gap">
            <button className="btn" onClick={() => navigate('/modes')}>
              Selecionar Fase
            </button>
            <button className="btn" onClick={() => navigate('/profile/edit')}>
              Editar perfil
            </button>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
