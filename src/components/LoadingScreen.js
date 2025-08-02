import React from 'react';

/**
 * LoadingScreen
 *
 * Displayed while game assets such as the phase configuration or
 * player profile bitmask are being loaded.  Keeps the user informed
 * that something is happening instead of rendering nothing.
 */
export default function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: '1.5rem',
      }}
    >
      Carregando...
    </div>
  );
}
