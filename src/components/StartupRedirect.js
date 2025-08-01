import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProfile } from '../services/firestore';

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
      const profile = await loadProfile();
      if (profile) {
        navigate('/modes', { replace: true });
      } else {
        navigate('/register', { replace: true });
      }
    })();
  }, [navigate]);

  return <div style={{ padding: '2rem' }}>Carregando…</div>;
}
