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
  animation = 'fade',
  duration = 500,
  videoSrc,
  onComplete,
}) {
  const [visible, setVisible] = useState(show);
  const [anim, setAnim] = useState(show ? `${animation}-in` : `${animation}-out`);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnim(`${animation}-in`);
    } else if (animation) {
      setAnim(`${animation}-out`);
      const t = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      onComplete?.();
    }
  }, [show, animation, duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`transition-screen ${animation ? anim : ''}`}
      style={animation ? { animationDuration: `${duration}ms` } : null}
    >
      {videoSrc ? (
        <video src={videoSrc} autoPlay onEnded={onComplete} />
      ) : (
        children || <div>{message}</div>
      )}
    </div>
  );
}
