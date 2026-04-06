# Spec: Code Editor com Syntax Highlighting

## Objetivo

Criar um editor de código com destaque de sintaxe que permita ao usuário colar código e visualizar com cores automaticamente, com detecção de linguagem automática e opção de seleção manual.

## Referência

- **Ray.so**: Usa **Shiki** + textarea overlay com highlight.js como fallback
- Bibliotecas em `ray.so/package.json`:
  - `highlight.js: ^11.7.0`
  - `shiki: ^1.0.0`
  - `react-simple-code-editor` (implícito pelo padrão overlay)

## Opções de Syntax Highlighting

| Biblioteca | Tamanho | Servidor/Cliente | Qualidade | Manutenção |
|------------|---------|-------------------|-----------|-------------|
| **Shiki** | ~5MB | SSR (recomendado) | Excelente (gramáticas VS Code) | Ativa |
| **Prism.js** | ~50KB | Cliente | Boa | Ativa |
| **highlight.js** | ~200KB | Cliente | Boa | Ativa |
| **react-syntax-highlighter** | ~200KB+ | Ambos | Boa | Ativa |

### Recomendação: **Shiki** (já instalado no projeto)

Vantagens:
- Usa gramáticas TextMate do VS Code → highlighting mais preciso
- Suporte a 100+ linguagens
- Tema consistente com VS Code
- Renderização SSR (zero JS no cliente para highlighting)
- Usado pelo VitePress, Astro, Nuxt Content

## Opções de Language Detection

| Biblioteca | Precisão | Tamanho | Notas |
|------------|----------|---------|-------|
| **highlight.js auto-detection** | Boa | 0 (built-in) | Ja incluido com Shiki |
| **linguist-js** | Excelente | ~500KB | Usa GitHub Linguist |
| **guesslang-js** | Muito alta | ~1MB | ML-based, mais lento |
| **regex heuristics** | Razoável | <1KB | Rápido, heurísticas manuais |

### Recomendação: **Shiki + auto-detection** (built-in)

O Shiki já tem detecção automática de linguagem via `highlight.js`. Podemos usar o método `createHighlighter` ou `codeToHtml` com `lang: 'auto'`.

## Arquitetura do Editor (Pattern Ray.so)

```
┌─────────────────────────────────────┐
│  Window Header (dots)               │
├─────────────────────────────────────┤
│ ┌─────────┬───────────────────────┐ │
│ │ Line    │  Highlighted Code     │ │
│ │ Numbers │  (Shiki output)       │ │
│ │         │                      │ │
│ │ (sync   │                      │ │
│ │  scroll)│                      │ │
│ ├─────────┼───────────────────────┤ │
│ │ textarea (invisible, for input) │ │
│ └─────────┴───────────────────────┘ │
└─────────────────────────────────────┘
```

**Técnica**: Overlay pattern
1. Camada visível: `<pre><code>` com HTML colorido do Shiki
2. Camada invisível: `<textarea>` transparente por cima
3. Line numbers: `<div>` com scroll sincronizado

## Funcionalidades Necessárias

- [ ] Editor com textarea editável
- [ ] Syntax highlighting em tempo real (debounced)
- [ ] Detecção automática de linguagem
- [ ] Dropdown para seleção manual de linguagem
- [ ] Line numbers com scroll sincronizado
- [ ] Window header (dots)
- [ ] Suporte a múltiplas linguagens
- [ ] Tema dark consistente

## Perguntas em Aberto

1. **Modo de Edição**: O editor deve permitir edição inline (como Ray.so) ou apenas visualização do código colado?

2. **Performance**: Qual threshold de debounce? (Ray.so usa ~300ms)

3. **Languages**: Quais linguagens são prioritárias? ( JS, TS, Python, Rust, Go já temos)

4. **UI do Seletor**: Dropdown simples ou combobox com busca?

5. **Tamanho Inicial**: O editor deve começar vazio ou com placeholder estilizado?

6. **Copy/Paste**: Devemos suportar copy do código destacado?

## Brainstorm 2026-04-06

### Visão Geral

- **Input Layer**: `<textarea>` 100% transparente com `caret-color` visível para permitir edição/colagem nativa.
- **Highlight Layer**: `<pre><code>` posicionado atrás do textarea usando `pointer-events: none`. Conteúdo gerado via `shiki.codeToHtml` rodando em Web Worker/edge? Para MVP, rodaremos no cliente com `createHighlighter` compartilhado.
- **Line Numbers**: `<div>` colado à esquerda, com `overflow: hidden`, sincronizado via event `scrollTop` do textarea.
- **Detecção de linguagem**: heurística leve baseada em extensão/keywords + fallback `auto` do Shiki quando sem override manual.
- **Manual Override**: dropdown minimalista (provavelmente `Select` custom) com opção "Auto" default.

### Fluxo do Usuário

1. Usuário cola código → `onChange` atualiza `rawCode`.
2. Disparamos debounce (~250ms) para gerar highlight HTML.
3. Detectamos linguagem (caso `languageMode === "auto"`). Exibimos label "Detectado: TypeScript" ao lado do seletor.
4. Render `<pre dangerouslySetInnerHTML>` com classes Tailwind (`font-mono`, `text-sm`).
5. Scroll do textarea atualiza scroll do highlight + coluna de números (pattern já usado na home atual, replicaremos com hook).
6. Se o snippet exceder ~5.000 linhas, exibimos aviso persistente e estimativa de tokens (`tokens ≈ caracteres / 4`) próxima ao CTA.

### Considerações Técnicas

- **Estado**: `rawCode`, `manualLanguage`, `detectedLanguage`, `highlightHtml`, `isHighlighting`, `tokenEstimate`.
- **Hooks utilitários**: `useShikiHighlighter` (singleton), `useCodeDetection` (regex heurísticas), `useSyncedScroll`.
- **Aprimoramentos futuros**: copy button, temas (dark/light), export style Ray.so.
- **Fallback**: se Shiki falhar, exibir texto simples com classes `text-text-secondary`.
- **Execução server-side**: highlighter roda em server action/worker (Edge) para evitar bundle pesado; textarea envia código e recebe HTML + linguagem detectada. Cachear instância do highlighter nesse ambiente.

### Perguntas para o Usuário

1. Precisamos armazenar o HTML destacado ou apenas o código + linguagem? (impacta Drizzle). **Resposta: apenas código + linguagem.**
2. Precisamos limitar tamanho do input? (performance > 5k linhas). **Resposta: avisar e estimar tokens quando exceder ~5k linhas.**
3. Podemos depender somente de Shiki no cliente ou precisamos de SSR/worker para performance? **Resposta: processar server-side/worker.**
