import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Tela inicial que apresenta rapidamente a premissa do jogo.
 */
export default function Intro() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Chef Alerg</h1>
      <p>
        Você é o Chef Alerg, um detetive de alergias viajando pelo mundo
        para proteger pessoas de ingredientes perigosos. Descubra o que é seguro
        em cada fase e ajude a todos a comer sem medo!
      </p>
      <button onClick={() => navigate('/register')}>Iniciar Missão</button>
    </div>
  );
}
