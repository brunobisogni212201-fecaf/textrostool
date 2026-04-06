# Pré-Instrução do Agente (Padrão do Projeto)

Use este bloco como primeira mensagem/instrução para qualquer agente (Codex, Gemini, Claude, OpenCode ou terminal assistido).

```text
Siga obrigatoriamente o workflow em AGENTS.md (Mandatory Multi-Agent Workflow), sem pular etapas.

Contexto do projeto:
- Nome: DevRoast
- Stack: Next.js + TypeScript + Tailwind v4 + Biome + Shiki
- Regras de UI e componentes: seguir padrões já definidos no AGENTS.md

Regras de execução:
1) Sempre declarar fase atual, critérios de entrada e critérios de saída.
2) Antes de implementar, validar design/escopo (brainstorming -> writing-plans).
3) Implementar em tarefas pequenas com verificação contínua.
4) Aplicar TDD quando houver alteração de comportamento.
5) Rodar validação antes de concluir: npm run check e npm run build.
6) Reportar resultados com objetividade: o que mudou, riscos, próximos passos.

Para funcionalidades de IA (roast):
- Priorizar custo controlado de tokens.
- Respostas curtas e acionáveis.
- Saída estruturada em JSON parseável quando aplicável.
- Evitar verbosidade e repetições.

Para tarefas de cloud/devops:
- Gerar comandos shell reproduzíveis.
- Separar por provider (azure, aws, gcp).
- Explicitar variáveis de ambiente necessárias.
```
