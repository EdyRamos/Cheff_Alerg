import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Displays a basic tutorial overlay explaining how to play.  In the
 * final game this could be more interactive or animated.  For the
 * MVP we present a simple set of instructions and a button to
 * return to the mode selection.
 */
export default function Tutorial() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tutorial</h1>
      <p>
        Bem‑vindo ao Chef Alerg! O objetivo é arrastar ou tocar os
        alimentos seguros para a panela enquanto evita os ingredientes
        que contêm alérgenos. Cada fase possui um conjunto de
        ingredientes e um nível de dificuldade diferente.
      </p>
      <p>
        Toque nas frutas e legumes frescos e arraste-os até a panela.
        Fique atento aos rótulos dos produtos no supermercado e
        evite aqueles que contêm seus alérgenos. Se cometer um erro,
        você perderá uma vida e receberá uma dica sobre o ingrediente.
      </p>
      <button onClick={() => navigate('/modes')}>Voltar</button>
    </div>
  );
}