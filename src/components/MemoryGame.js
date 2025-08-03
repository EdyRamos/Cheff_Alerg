import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameWrapper from './GameWrapper';
import LoadingScreen from './LoadingScreen';
import { useStore } from '../store';
import { loadProfile } from '../services/firestore';
import { loadNfcPreference } from '../utils/storage';

/**
 * MemoryGame
 *
 * This component orchestrates loading the phase configuration and
 * player bitmask before rendering the Phaser canvas via GameWrapper.
 * It replaces the old implementation which embedded all Phaser
 * classes directly in a React component.  Separating these concerns
 * keeps React declarative and makes the game loop easier to test.
 */
export default function MemoryGame() {
  const { phase } = useParams();
  const navigate   = useNavigate();
  const [phaseConfig, setPhaseConfigState] = useState(null);
  const [bitmask, setBitmask]         = useState(null);
  const setCurrentPhase               = useStore((s) => s.setCurrentPhase);
  const cachedPhaseConfig             = useStore((s) => s.phases[phase]);
  const setPhaseConfig                = useStore((s) => s.setPhaseConfig);

  // Load phase JSON on mount or when the route param changes.
  // If the configuration was loaded previously, reuse it from the store
  // instead of importing the JSON again.
  useEffect(() => {
    (async () => {
      try {
        let cfg = cachedPhaseConfig;
        if (!cfg) {
          const imported = await import(`../phases/${phase}.json`);
          cfg = imported.default || imported;
          setPhaseConfig(phase, cfg); // cache for future use
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

  // Load the player's allergen bitmask from remote storage.
  useEffect(() => {
    (async () => {
      const useNfc = loadNfcPreference();
      try {
        const profile = await loadProfile({ nfc: useNfc });
        setBitmask(profile?.bitmask || 0);
      } catch (err) {
        console.error('Erro ao carregar o perfil', err);
        if (useNfc) {
          alert('Falha ao ler dados do NFC. Usando perfil local.');
          try {
            const profile = await loadProfile();
            setBitmask(profile?.bitmask || 0);
            return;
          } catch (_) {
            /* ignore */
          }
        }
        setBitmask(0);
      }
    })();
  }, []);

  const handleReturnToMenu = () => {
    navigate('/modes');
  };
  const handleGameOver = () => {
    handleReturnToMenu();
  };

  if (!phaseConfig || bitmask === null) return <LoadingScreen />;
  return (
    <GameWrapper
      phaseConfig={phaseConfig}
      bitmask={bitmask}
      onGameOver={handleGameOver}
      onReturnToMenu={handleReturnToMenu}
    />
  );
}