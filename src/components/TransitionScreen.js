import React, { useEffect, useState } from 'react';

/**
 * TransitionScreen
 *
 * A full-screen overlay used to present messages between major app
 * transitions. Accepts children or a simple message string. Optionally
 * fades in/out when the `show` prop changes.
 */
export default function TransitionScreen({
  children,
  message,
  show = true,
  fade = true,
  duration = 500,
  onComplete,
}) {
  const [visible, setVisible] = useState(show);
  const [anim, setAnim] = useState(show ? 'fade-in' : 'fade-out');

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnim('fade-in');
    } else if (fade) {
      setAnim('fade-out');
      const t = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      onComplete?.();
    }
  }, [show, fade, duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`transition-screen ${fade ? anim : ''}`}
      style={fade ? { animationDuration: `${duration}ms` } : null}
    >
      {children || <div>{message}</div>}
    </div>
  );
}
