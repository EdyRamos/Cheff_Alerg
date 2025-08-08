import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TransitionScreen from './TransitionScreen';
import { DEFAULT_TRANSITION } from '../constants/transitionThemes';

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
      const transition = { ...DEFAULT_TRANSITION, ...(config.transition || {}) };
      const { duration, skipAfter, audio } = transition;

      const hideTimer = setTimeout(() => setShow(false), duration);
      const skipTimer = setTimeout(() => setAllowSkip(true), skipAfter);

      if (audio) {
        const sound = new Audio(audio);
        sound.play();
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

  const transition = { ...DEFAULT_TRANSITION, ...(config.transition || {}) };
  // Destructure instructions so they can be displayed alongside text/tip
  const { text, image, tip, animation, video, instructions } = transition;

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
            className="transition-image"
          />
        )}
        {text && <h2>{text}</h2>}
        {instructions && <p style={{ fontStyle: 'italic' }}>{instructions}</p>}
        {tip && <p>{tip}</p>}
        {allowSkip && (
          <button className="btn" onClick={handleSkip} style={{ marginTop: '1rem' }}>
            Pular
          </button>
        )}
      </div>
    </TransitionScreen>
  );
}
