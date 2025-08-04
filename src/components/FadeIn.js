import React, { useEffect, useState } from 'react';

/**
 * Simple wrapper that fades its children in on mount.
 */
export default function FadeIn({ children, duration = 500 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const style = {
    opacity: visible ? 1 : 0,
    transition: `opacity ${duration}ms ease-in`,
    height: '100%'
  };

  return <div style={style}>{children}</div>;
}
