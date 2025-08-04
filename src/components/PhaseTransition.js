import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TransitionScreen from './TransitionScreen';

/**
 * PhaseTransition
 *
 * Displays a message and optional image between phases before the next
 * phase of the game begins. It pulls the configuration from the target
 * phase JSON and then navigates to the MemoryGame route for that phase
 * after a short delay.
 */
export default function PhaseTransition() {
  const { phase } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const imported = await import(`../phases/${phase}.json`);
        setConfig(imported.default || imported);
      } catch (err) {
        console.error('Erro ao carregar fase', err);
        navigate('/modes');
      }
    })();
  }, [phase, navigate]);

  useEffect(() => {
    if (config) {
      const t = setTimeout(() => navigate(`/play/${phase}`), 800);
      return () => clearTimeout(t);
    }
  }, [config, navigate, phase]);

  if (!config) return null;

  const transition = config.transition || {};
  const { text, image } = transition;

  return (
    <TransitionScreen>
      <div className="phase-transition">
        {image && (
          <img
            src={image}
            alt=""
            className="transition-image"
          />
        )}
        {text && <h2>{text}</h2>}
      </div>
    </TransitionScreen>
  );
}
