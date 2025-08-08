import React from 'react';
import { useNavigate } from 'react-router-dom';
import FadeIn from './FadeIn';
import NavBar from './NavBar';

/**
 * Tela inicial que apresenta rapidamente a premissa do jogo.
 */
export default function Intro() {
  const navigate = useNavigate();
  const handleStart = () => navigate('/startup');
  const handleSkip = () => navigate('/modes');
  return (
    <FadeIn>
      <NavBar />
      <div className="intro-screen">
        <div className="page-content">
          <h1>Chef Alerg</h1>
          <p>
            Você é o Chef Alerg, um educador sobre glúten dedicado a mostrar
            como identificá-lo e a importância dos rótulos “sem glúten”.
            Em cada fase, oriente os jogadores a ler os rótulos com atenção
            e a distinguir alimentos seguros dos que contêm glúten.
          </p>
          <button className="btn" onClick={handleStart}>Iniciar Missão</button>
          <button className="btn" onClick={handleSkip}>Pular</button>
        </div>
      </div>
    </FadeIn>
  );
}
