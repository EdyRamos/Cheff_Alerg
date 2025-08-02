# Image assets

Este diretório contém sprites e imagens usadas pelo jogo. Para manter uma identidade visual coerente, recomendamos:

## Personagens e Chef

- Crie um conjunto de sprites para o Chef protagonista (idle, coletar ingrediente, erro).
- Use um estilo cartunesco com traços arredondados.
- Guarde os sprites em `images/chef/`.

## Fundos de fase

- Crie imagens de fundo para cada fase (feira, supermercado, praia, festa, etc.).
- Os arquivos devem ser colocados em `images/backgrounds/`.

## Itens

- Cada item comestível deve ter um sprite individual (ex.: maçã, bolo, camarão).
- Os nomes dos arquivos devem corresponder às chaves `sprite` nos arquivos de fase JSON.
- Guarde os sprites de itens em `images/items/`.

## Outros elementos

- Imagens para telas de transição, dicas educativas e ícones de HUD podem ser colocadas em `images/ui/`.

Sinta-se livre para substituir as imagens de exemplo atuais por versões mais consistentes seguindo estas orientações. Todos os caminhos devem ser referenciados a partir de `/assets/images/` nas configurações do jogo.
