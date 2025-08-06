import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameWrapper from './GameWrapper';
import LoadingScreen from './LoadingScreen';
import TransitionScreen from './TransitionScreen';
import { useStore } from '../store';
import { loadProfile } from '../services/firestore';
import { loadNfcPreference } from '../utils/storage';
import { PHASES } from './ModeSelect';
import NavBar from './NavBar';

/**
 * MemoryGame
 *
 * Orquestra o carregamento da configuração da fase e o profile do jogador,
 * usando Zustand como store central. Busca o profile do NFC/local se necessário.
 */
export default function MemoryGame() {
  const { phase } = useParams();
  const navigate = useNavigate();
  const [phaseConfig, setPhaseConfigState] = useState(null);
  const [transitionMsg, setTransitionMsg] = useState('');

  // Zustand store
  const profile           = useStore((s) => s.profile);
  const setProfile        = useStore((s) => s.setProfile);
  const setCurrentPhase   = useStore((s) => s.setCurrentPhase);
  const cachedPhaseConfig = useStore((s) => s.phases[phase]);
  const setPhaseConfig    = useStore((s) => s.setPhaseConfig);
  const unlockPhase       = useStore((s) => s.unlockPhase);
  const unlockedPhases    = useStore((s) => s.unlockedPhases);

  // Ordem das fases para permitir navegação sequencial
  const PHASE_SEQUENCE = ['feira', 'supermercado', 'festa', 'praia'];

  // Carrega a configuração da fase, cacheando no Zustand
  useEffect(() => {
    (async () => {
      try {
        let cfg = cachedPhaseConfig;
        if (!cfg) {
          const imported = await import(`../phases/${phase}.json`);
          cfg = imported.default || imported;
          setPhaseConfig(phase, cfg); // Salva no Zustand
        }
        setPhaseConfigState(cfg);
        setCurrentPhase(phase);
      } catch (err) {
        console.error('Erro ao carregar a fase', err);
        alert('Fase não encontrada.');
        navigate('/modes');
      }
    })();
  }, [phase, cachedPhaseConfig, navigate, setCurrentPhase, setPhaseConfig]);

  // Carrega o profile se necessário, preferindo NFC se configurado
  useEffect(() => {
    if (!profile) {
      (async () => {
        const useNfc = loadNfcPreference();
        try {
          const loaded = await loadProfile({ nfc: useNfc });
          setProfile(loaded || { bitmask: 0 });
        } catch (err) {
          console.error('Erro ao carregar o perfil', err);
          if (useNfc) {
            alert('Falha ao ler dados do NFC. Usando perfil local.');
            try {
              const loaded = await loadProfile();
              setProfile(loaded || { bitmask: 0 });
              return;
            } catch (_) {
              // ignora
            }
          }
          setProfile({ bitmask: 0 });
        }
      })();
    }
  }, [profile, setProfile]);

  const navigateWithTransition = (msg) => {
    setTransitionMsg(msg);
    setTimeout(() => navigate('/modes'), 800);
  };

  const handleReturnToMenu = () => navigateWithTransition('Voltando ao menu...');

  // Após o término de uma fase, destrava próxima fase somente em caso de sucesso
  const handlePhaseComplete = (result) => {
    if (result?.success) {
      const idx = PHASES.findIndex((p) => p.key === phase);
      const next = PHASES[idx + 1];
      if (next && !unlockedPhases.includes(next.key)) {
        unlockPhase(next.key);
      }
      if (next) {
        navigate(`/transition/${next.key}`);
      } else {
        navigateWithTransition('Fim de jogo!');
      }
    } else {
      navigateWithTransition('Tente novamente!');
    }
  };

  if (!phaseConfig || !profile) return <LoadingScreen />;

  return (
    <>
      <NavBar />
      <GameWrapper
        phaseConfig={phaseConfig}
        bitmask={profile.bitmask || 0}
        onGameOver={handlePhaseComplete}
        onReturnToMenu={handleReturnToMenu}
      />
      {transitionMsg && <TransitionScreen message={transitionMsg} />}
    </>
  );
}
