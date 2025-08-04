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
  return (
    <FadeIn>
      <NavBar />
      <div
        style={{
          backgroundImage: 'url(/assets/images/ui/intro_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <h1>Chef Alerg</h1>
        <p>
          Você é o Chef Alerg, um detetive de alergias viajando pelo mundo
          para proteger pessoas de ingredientes perigosos. Descubra o que é seguro
          em cada fase e ajude a todos a comer sem medo!
        </p>
        <button onClick={handleStart}>Iniciar Missão</button>
        <button onClick={handleStart}>Pular</button>
      </div>
    </FadeIn>
  );
}
