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
  const [show, setShow] = useState(true);
  const [allowSkip, setAllowSkip] = useState(false);

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
      const transition = config.transition || {};
      const display = transition.duration ?? 3000;
      const skipDelay = transition.skipAfter ?? 2000;

      const hideTimer = setTimeout(() => setShow(false), display);
      const skipTimer = setTimeout(() => setAllowSkip(true), skipDelay);

      if (transition.audio) {
        const audio = new Audio(transition.audio);
        audio.play();
      }

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(skipTimer);
      };
    }
  }, [config]);

  const handleComplete = () => navigate(`/play/${phase}`);
  const handleSkip = () => setShow(false);

  if (!config) return null;

  const transition = config.transition || {};
  const { text, image, tip, animation, video } = transition;

  return (
    <TransitionScreen
      show={show}
      animation={animation}
      videoSrc={video}
      onComplete={handleComplete}
    >
      <div className="phase-transition" style={{ textAlign: 'center' }}>
        {image && (
          <img
            src={image}
            alt=""
            style={{ maxWidth: '80%', marginBottom: '1rem' }}
          />
        )}
        {text && <h2>{text}</h2>}
        {tip && <p>{tip}</p>}
        {allowSkip && (
          <button onClick={handleSkip} style={{ marginTop: '1rem' }}>
            Pular
          </button>
        )}
      </div>
    </TransitionScreen>
  );
}
