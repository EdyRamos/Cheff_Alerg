import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../services/firestore';
import { loadNfcPreference } from '../utils/storage';
import { useStore } from '../store';
import LoadingScreen from './LoadingScreen';

/**
 * Component that checks for an existing profile on load and
 * redirects the user accordingly. If a profile is found, the
 * player is taken directly to the mode selection screen.
 * Otherwise we send them to registration to create a profile.
 */
export default function StartupRedirect() {
  const navigate = useNavigate();
  const setProfile = useStore((s) => s.setProfile);

  useEffect(() => {
    (async () => {
      const useNfc = loadNfcPreference();
      let profile = null;
      try {
        profile = await loadProfile({ nfc: useNfc });
      } catch (err) {
        console.error('Erro ao carregar o perfil', err);
        if (useNfc) {
          alert('Falha ao ler dados do NFC. Prosseguindo sem NFC.');
        }
        try {
          profile = await loadProfile();
        } catch (_) {
          profile = null;
        }
      }
      setProfile(profile);
      if (profile) {
        navigate('/modes', { replace: true });
      } else {
        navigate('/register', { replace: true });
      }
    })();
  }, [navigate, setProfile]);

  return <LoadingScreen />;
}
