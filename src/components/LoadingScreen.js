import React from 'react';
import TransitionScreen from './TransitionScreen';

/**
 * LoadingScreen
 *
 * Simple wrapper around TransitionScreen with a default loading message.
 * Useful for async phases like asset or profile loading.
 */
export default function LoadingScreen({ message = 'Carregando...' }) {
  return <TransitionScreen message={message} />;
}
