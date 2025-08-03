import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../services/firestore';
import { loadNfcPreference } from '../utils/storage';

/**
 * Component that checks for an existing profile on load and
 * redirects the user accordingly. If a profile is found, the
 * player is taken directly to the mode selection screen.
 * Otherwise we send them to registration to create a profile.
 */
export default function StartupRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const useNfc = loadNfcPreference();
      try {
        const profile = await loadProfile({ nfc: useNfc });
        if (profile) {
          navigate('/modes', { replace: true });
        } else {
          navigate('/register', { replace: true });
        }
      } catch (err) {
        console.error('Erro ao carregar o perfil', err);
        alert('Falha ao ler dados do NFC. Prosseguindo sem NFC.');
        const profile = await loadProfile();
        if (profile) {
          navigate('/modes', { replace: true });
        } else {
          navigate('/register', { replace: true });
        }
      }
    })();
  }, [navigate]);

  return <div style={{ padding: '2rem' }}>Carregando…</div>;
}
