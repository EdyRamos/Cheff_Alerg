import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Profile from './components/Profile';
import ModeSelect from './components/ModeSelect';
import Tutorial from './components/Tutorial';
import MemoryGame from './components/MemoryGame';
import Intro from './components/Intro';
import StartupRedirect from './components/StartupRedirect';

/**
 * The top level application component.  It defines the routes
 * available in the PWA and orchestrates navigation between screens.
 *
 * In a real game you would likely conditionally redirect based on
 * whether a profile has been created.  For this MVP we simply
 * expose each screen via its own route.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartupRedirect />} />
      <Route path="/intro" element={<Intro />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/modes" element={<ModeSelect />} />
      <Route path="/tutorial" element={<Tutorial />} />
      <Route path="/play/:phase" element={<MemoryGame />} />
      <Route path="*" element={<div style={{ padding: '1rem' }}>Page not found</div>} />
    </Routes>
  );
}