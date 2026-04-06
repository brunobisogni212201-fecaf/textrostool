# Spec: Web Stack Language Detection + Highlight Subset

## Objetivo

Criar uma função de detecção de linguagens prioritárias da Web Stack para:
- identificar a linguagem mais provável de um snippet;
- definir a ordem de prioridade das linguagens;
- carregar apenas o subset necessário no highlight (Shiki), reduzindo custo.

## Escopo

Linguagens suportadas:
- `javascript`
- `typescript`
- `jsx`
- `tsx`
- `html`
- `css`
- `json`

Modo adicional:
- `auto` (detecção automática com fallback para JavaScript)

## Estratégia

1. Gerar score heurístico por linguagem usando padrões comuns:
- JSON: parse válido + estrutura `{}`/`[]`
- HTML: presença de tags/doctype
- CSS: seletores + propriedades
- JSX/TSX: tags JSX + pistas de JS/TS
- TypeScript: tipos/interfaces/enums/anotações
- JavaScript: fallback com palavras-chave JS

2. Ordenar linguagens por score:
- score maior primeiro;
- empate resolvido pela ordem base da stack.

3. Highlight:
- quando `auto`, usar linguagem detectada para `lang`;
- carregar Shiki com o subset ordenado por prioridade;
- reaproveitar instâncias em cache para evitar recriação.

## Critérios de Aceite

1. Existe utilitário central para detectar linguagem principal.
2. Existe utilitário para retornar lista priorizada da stack.
3. Editor usa detecção em `auto` e highlight com subset priorizado.
4. Se falhar highlight, fallback para HTML escapado continua funcionando.
