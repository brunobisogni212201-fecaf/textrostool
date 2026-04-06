# DevRoast

Análises de código com honestidade brutal e modo roast opcional.

## Funcionalidades

- **Envio de Código** - Cole código em várias linguagens (JavaScript, TypeScript, Python, Rust, Go, Java, C++, C#)
- **Modo Roast** - Ative o sarcasmo máximo para feedbacks cômicos
- **Pontuação** - Escala de 0-10 com indicadores de severidade (crítico/atenção/bom)
- **Ranking** - Veja os piores códigos ranqueados (menor nota = pior código)
- **Destaque de Sintaxe** - Exibição bonita de código com Shiki

## Como Começar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Tecnologias

- Next.js 16.1.6, TypeScript, Tailwind CSS v4, Biome, Shiki
- Tema escuro por padrão
- Design responsivo mobile-first

## Workflow Obrigatório Para Agentes

Este projeto adota um fluxo mandatório para execução de tarefas com agentes e automações.

- Regra principal: seguir **sempre** o workflow definido em `AGENTS.md`
- Aplica para: Codex, Gemini, Claude, OpenCode e execução via terminal
- Prompt base reutilizável: `PROMPT_WORKFLOW.md`

Antes de iniciar qualquer implementação, leia:

1. `AGENTS.md` (política e sequência obrigatória)
2. `PROMPT_WORKFLOW.md` (header padrão para prompts)
