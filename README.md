````markdown
# Chef Alerg

Jogo educativo casual de reflexo que desafia crianças e adultos a identificar e evitar ingredientes alergênicos em diversos cenários. Construído como PWA com **React** + **Phaser 3**, perfil de usuário, bitmask de alergênicos, dificuldade dinâmica e backend em Firebase (Firestore).

---

## Índice

- [Demonstração](#demonstração)  
- [Funcionalidades](#funcionalidades)  
- [Tecnologias](#tecnologias)  
- [Instalação](#instalação)  
- [Uso](#uso)  
- [Estrutura do Projeto](#estrutura-do-projeto)  
- [Configuração de Fases](#configuração-de-fases)  
- [Assets](#assets)  
- [Contribuição](#contribuição)  
- [Licença](#licença)  

---

## Demonstração

![Chef Alerg Logo](src/assets/images/logo_chef_alerg.png)

---

## Funcionalidades

- 🍞 **Reconhecimento de Glúten**
  Analisa rótulos e itens do jogo para diferenciar alimentos com e sem glúten, destacando o selo "sem glúten".
- ⚠️ **Contaminação Cruzada**
  Avisa sobre produtos e superfícies com risco de traços de glúten.
- 📊 **Métricas de Leitura de Rótulos**
  Registra tempo de leitura e percentual de acertos ao identificar rótulos.
- 🎯 **Gameplay de Reflexo**
  Toque em itens seguros e evite ingredientes com glúten antes que desapareçam.
- 👤 **Perfil de Usuário**
  Cadastro simples com nome, idade e histórico de leituras.
- 🎚️ **Dificuldade Dinâmica**
  Ajuste automático de taxa de spawn e quantidade simultânea baseado na performance.
- 📱 **PWA Ready**
  Instalável em dispositivos móveis e desktop.
- 🔌 **Firebase + Web NFC**
  Perfis salvos no Firestore e opcionalmente gravados em tags NFC.
- 🗺️ **Fases Configuráveis**
  Carga de JSON para cada cenário (feira, supermercado, festa…).
- 🎉 **Efeitos Visuais**
  Confetes (particles) e dicas contextuais no jogo.
- 🔄 **Hot‑reload**
  Desenvolvimento rápido via Create‑React‑App.

---

## Tecnologias

- **Front‑end**: React 18, Phaser 3.70, React Router  
 - **Serviços**: Firebase SDK (Firestore), Web NFC
- **Build**: Create‑React‑App, Webpack  
- **Styling**: CSS puro (reset simples)  
- **Imagens**: Placeholder gerado via Python/Pillow  
- **Versionamento**: Git + GitHub  

---

## Instalação

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/seu-usuario/chef-alerg.git
   cd chef-alerg
````

2. **Instale dependências**

   ```bash
    npm install
    ```

3. **Configure o Firebase**
   Copie `.env.example` para `.env` e preencha com suas credenciais.

4. **Verifique a pasta `public/assets/images`**
   Certifique-se de que existem `.png` para cada item e `missing.png`.

5. **Inicie o servidor de desenvolvimento**

   ```bash
   npm start
   ```

   Acesse `http://localhost:3000` no navegador.

6. **Build de produção**

   ```bash
   npm run build
   ```

---

## Uso

1. **Cadastro**: Informe nome, idade e se adota dieta sem glúten.
2. **Escolha a fase**: Feira, Supermercado, Festa etc.
3. **Jogue**:

   * Toque em itens com rótulo "sem glúten" para ganhar pontos.
   * Evite produtos com glúten ou indicados como possivelmente contaminados.
   * Leia os rótulos e confirme o selo antes de tocar.
   * Cada erro reduz uma vida; zero vidas encerra o jogo.
   * Aperte **P** ou o botão "Pausar" para abrir o menu de pausa.
4. **Pontuação**: +10 pontos por acerto e tempo de leitura registrado.
5. **Fim de Jogo**: Veja estatísticas de leitura e reinicie.

---

## Estrutura do Projeto

```
chef-alerg/
├─ public/
│   ├─ assets/
│   │  ├─ images/        ← PNGs de itens e missing.png
│   │  └─ audio/         ← Efeitos sonoros (opcional)
│   └─ index.html        ← HTML base do CRA
├─ src/
│   ├─ assets/
│   │  └─ images/        ← Originais (se usar import/webpack)
│   ├─ components/
│   │  ├─ Register.js    ← Tela de cadastro
│   │  ├─ Profile.js     ← Perfil do usuário
│   │  ├─ ModeSelect.js  ← Seleção de fases
│   │  ├─ Tutorial.js    ← Overlay de instruções
│   │  └─ MemoryGame.js  ← Componente React + Phaser
│   ├─ phases/
│   │  ├─ feira.json
│   │  ├─ supermercado.json
│   │  └─ festa.json
│   ├─ services/
│   │  ├─ firestore.js   ← Integração Firestore
│   │  └─ nfc.js         ← Web NFC
│   ├─ utils/
│   │  ├─ storage.js     ← Helpers localStorage
│   │  ├─ bitmask.js     ← Funções de máscara de bits
│   │  └─ DifficultyManager.js
│   ├─ index.css
│   ├─ index.js
│   └─ App.js
├─ .gitignore
├─ package.json
└─ README.md
```

---

## Configuração de Fases

Cada arquivo `src/phases/*.json` define:

```jsonc
{
  "spawnRate": 1500,        // intervalo entre spawns (ms)
  "simultaneous": 2,        // itens simultâneos
  "items": [
    {
      "key": "apple",         // nome único da sprite
      "spriteUrl": "/assets/images/apple.png",
      "bitmaskBit": 0         // posição do bit no perfil
    },
    // …
  ]
}
```

Para adicionar uma nova fase:

1. Criar `src/phases/nomeDaFase.json`.
2. Copiar imagens para `public/assets/images/`.
3. Adicionar no componente `ModeSelect.js`.

---

## Assets

* **Imagens**: PNG de 128×128 px para cada alimento.
* **Placeholder**: `missing.png` (8×8 px, branco).
* **Áudio**: você pode colocar WAV/MP3 em `public/assets/audio`.

---

## Referências Educativas

- [FENACELBRA – Federação Nacional das Associações de Celíacos do Brasil](https://fenacelbra.org.br/)
- [ANVISA – Rotulagem de Alimentos e a declaração "Sem Glúten"](https://www.gov.br/anvisa/pt-br/assuntos/alimentos/rotulagem/rotulagem-de-alimentos-alergenicos-e-sem-gluten)
- [Celiac Disease Foundation – Gluten-Free Labeling and Celiac Disease Education](https://celiac.org/)

---

## Contribuição

1. Faça um fork deste repositório.
2. Crie uma branch (`git checkout -b feature/minha-ideia`).
3. Commit suas mudanças (`git commit -m "feat: ..."`)
4. Push na branch (`git push origin feature/minha-ideia`)
5. Abra um Pull Request.

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
Sinta‑se à vontade para usar, modificar e distribuir!

