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
        <div className="intro-content">
          <h1>Chef Alerg</h1>
          <p>
            Você é o Chef Alerg, um detetive de alergias viajando pelo mundo
            para proteger pessoas de ingredientes perigosos. Descubra o que é seguro
            em cada fase e ajude a todos a comer sem medo!
          </p>
          <button onClick={handleStart}>Iniciar Missão</button>
          <button onClick={handleSkip}>Pular</button>
        </div>
      </div>
    </FadeIn>
  );
}
