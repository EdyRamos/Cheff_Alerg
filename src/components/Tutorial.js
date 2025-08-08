import React from 'react';
import { useNavigate } from 'react-router-dom';

import pauseIcon from '../assets/images/ui/pause.png';
import lifeIcon from '../assets/images/ui/life_full.png';
import scoreIcon from '../assets/images/ui/score.png';
import timeIcon from '../assets/images/ui/time.png';
import tipIcon from '../assets/images/ui/card_tip_bg.png';
import PageLayout from './PageLayout';

/**
 * Displays a basic tutorial overlay explaining how to play.  In the
 * final game this could be more interactive or animated.  For the
 * MVP we present a simple set of instructions and a button to
 * return to the mode selection.
 */
export default function Tutorial() {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <div className="page-content">
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
            className="inline-icon"
          />
          e receberá uma dica
          <img
            src={tipIcon}
            alt="Dica"
            className="inline-icon"
          />
          sobre o ingrediente.
        </p>
       <p>
         Contaminação cruzada é um perigo comum: utensílios, tábuas e
         superfícies usadas com glúten podem transferir partículas para
         alimentos seguros. Em cozinhas compartilhadas, limpe bem os
         equipamentos e, se possível, tenha utensílios exclusivos para
         preparos sem glúten.
       </p>
       <p>
         A leitura de rótulos é fundamental. Procure sempre o selo “sem
         glúten” e desconfie de ingredientes duvidosos ou listas incompletas.
         Produtos sem indicação clara podem conter traços de glúten.
       </p>
       <p>
         Boas práticas incluem lavar as mãos antes de cozinhar, separar
         alimentos com e sem glúten e evitar usar a mesma esponja ou
         pano em utensílios diferentes. Pequenas migalhas podem causar
         problemas para pessoas sensíveis.
       </p>
        <p>
          Use o ícone
          <img
            src={pauseIcon}
            alt="Pausar"
            className="inline-icon"
          />
          para pausar o jogo. Acompanhe sua pontuação
          <img
            src={scoreIcon}
            alt="Pontuação"
            className="inline-icon"
          />
          e o tempo restante
          <img
            src={timeIcon}
            alt="Tempo"
            className="inline-icon"
          />
          na parte superior da tela.
        </p>
        <button className="btn" onClick={() => navigate('/modes')}>Voltar</button>
      </div>
    </PageLayout>
  );
}
