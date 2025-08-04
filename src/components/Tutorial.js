import React from 'react';
import { useNavigate } from 'react-router-dom';

import pauseIcon from '../assets/images/ui/pause.png';
import lifeIcon from '../assets/images/ui/life_full.png';
import scoreIcon from '../assets/images/ui/score.png';
import timeIcon from '../assets/images/ui/time.png';
import tipIcon from '../assets/images/ui/card_tip_bg.png';

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
        você perderá uma vida
        <img
          src={lifeIcon}
          alt="Vidas"
          style={{ height: '1.2em', verticalAlign: 'middle', margin: '0 0.25em' }}
        />
        e receberá uma dica
        <img
          src={tipIcon}
          alt="Dica"
          style={{ height: '1.2em', verticalAlign: 'middle', margin: '0 0.25em' }}
        />
        sobre o ingrediente.
      </p>
      <p>
        Use o ícone
        <img
          src={pauseIcon}
          alt="Pausar"
          style={{ height: '1.2em', verticalAlign: 'middle', margin: '0 0.25em' }}
        />
        para pausar o jogo. Acompanhe sua pontuação
        <img
          src={scoreIcon}
          alt="Pontuação"
          style={{ height: '1.2em', verticalAlign: 'middle', margin: '0 0.25em' }}
        />
        e o tempo restante
        <img
          src={timeIcon}
          alt="Tempo"
          style={{ height: '1.2em', verticalAlign: 'middle', margin: '0 0.25em' }}
        />
        na parte superior da tela.
      </p>
      <button onClick={() => navigate('/modes')}>Voltar</button>
    </div>
  );
}
