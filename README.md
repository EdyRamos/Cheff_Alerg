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

- 🎯 **Gameplay de Reflexo**  
  Tocar em itens seguros e evitar itens alergênicos antes que desapareçam.
- 👤 **Perfil de Usuário**  
  Cadastro simples com nome, idade e bitmask de alergênicos.
- 🧩 **Bitmask de Alergênicos**  
  Representa até 7 alergênicos principais via máscara de bits.
- 🎚️ **Dificuldade Dinâmica**  
  Ajuste automático de taxa de spawn e quantidade simultânea baseado na performance.
- 📱 **PWA Ready**  
  Instalável em dispositivos móveis e desktop.
 - 🔌 **Firebase + Web NFC**
   Perfis salvos no Firestore e opcionalmente gravados em tags NFC.
- 📊 **Fases Configuráveis**  
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

1. **Cadastro**: Preencha nome, idade e selecione alergênicos.
2. **Escolha a fase**: Feira, Supermercado, Festa etc.
3. **Jogue**:

   * Toque em itens seguros para ganhar pontos.
   * Evite itens com alérgenos marcados no seu perfil.
   * Cada erro reduz uma vida; zero vidas encerra o jogo.
   * Aperte **P** ou o botão "Pausar" para abrir o menu de pausa.
4. **Pontuação**: +10 pontos por acerto.
5. **Fim de Jogo**: Veja seu resultado e reinicie.

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

