# MagicChoice 🌌

Visual novel episódica em português, construída com HTML, CSS e JavaScript puro. O projeto não exige conta, servidor ou ferramenta externa de criação.

## Funcionalidades da primeira versão

- Biblioteca e exploração por gênero.
- História interativa **Perdidos — Episódio 1: A Porta**.
- Cenas ramificadas e escolhas com efeitos.
- Salvamento local do progresso e favoritos.
- Criador de histórias simples, sem programação.
- Importação de histórias JSON.
- Exportação de backup das histórias, favoritos e progresso.
- Layout responsivo para celular e computador.
- Manifesto básico para instalação como PWA.

## Estrutura

- `index.html` — telas e navegação.
- `styles.css` — identidade visual e responsividade.
- `js/app.js` — navegação, motor de cenas, editor e armazenamento local.
- `data/perdidos.json` — dados da primeira história.
- `manifest.json` — metadados da PWA.
- `assets/icon.svg` — ícone vetorial.

## Executar

A aplicação carrega `data/perdidos.json` por `fetch`, portanto deve ser aberta por um servidor HTTP, por exemplo por uma publicação do repositório no GitHub Pages. Abrir o arquivo HTML diretamente como `file://` pode impedir a leitura do JSON.

Para publicar pelo GitHub: abra **Settings → Pages**, escolha a branch `main` e a pasta `/(root)`, e salve. A publicação pode levar alguns minutos.

## Dados e privacidade

Histórias criadas, favoritos, preferências e progresso ficam no armazenamento local do navegador. Não existe sincronização entre dispositivos nesta versão. Limpar os dados do navegador pode apagar o progresso; use a opção de backup nas configurações.

## Formato dos dados

Cada história tem `id`, `title`, `genre`, `description` e `episodes`. Cada episódio define `startSceneId` e uma lista de `scenes`. Cada cena tem `id`, `text`, `choices` e, opcionalmente, `ending`. Cada escolha usa `nextSceneId` para apontar para outra cena do mesmo episódio.

Versão inicial: 0.1.