# Universo Estelar

Protótipo de um jogo social 3D fofo para Android, em tela horizontal, com personagens personalizáveis e mundos privados com amigos.

## Plano de desenvolvimento

1. **Base jogável:** projeto Godot, cenário 3D simples, personagem com movimento e câmera.
2. **Controles móveis:** joystick virtual implementado; botões de interação ficam para uma revisão futura.
3. **Visual do personagem:** modelo 3D inicial, animações e opções de aparência.
4. **Primeiro mundo:** praça central, fonte, árvores coloridas, postes de luz, bancos e casinhas estilizadas criados por script. Colisões e interações serão refinadas depois.
5. **Personalização:** painel na tela para alternar cores de cabelo, roupa e acessório; escolhas salvas localmente no aparelho.
6. **Multiplayer privado:** salas, convites e sincronização dos jogadores.
7. **Teste Android:** otimização, exportação e instalação do APK.

## Ferramenta

Godot Engine 4.x. Este repositório contém os arquivos-fonte do protótipo; gerar um APK requer configurar a exportação Android no ambiente de desenvolvimento.

## Estado atual

Etapas 1 a 5 preparadas no código: joystick, movimento, personagem 3D inicial, praça e painel de personalização com salvamento local da aparência. O projeto ainda não foi executado no Godot; é necessário testar a abertura e corrigir eventuais erros antes do multiplayer.


## Versão web em desenvolvimento

A versão web inicial foi adicionada na raiz do repositório:
- `index.html`: interface do jogo.
- `style.css`: interface adaptada para celular.
- `game.js`: cena 3D inicial com praça pastel, fonte estrelada, casas, árvores, personagem e joystick virtual.

A cena usa Three.js carregado por CDN, então é necessário estar conectado à internet. Esta é uma primeira versão experimental; ainda precisa ser aberta em hospedagem web e testada em um celular real. A versão Godot original foi mantida nos arquivos do projeto.
