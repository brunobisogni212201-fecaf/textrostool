# Personal Style Agent (Aprendizado Incremental Real)

## Objetivo

Criar um agente que aprenda seu estilo de programação ao longo do tempo e use isso para melhorar sugestões e qualidade de código a cada dia.

## Como funciona hoje

1. A cada roast (`POST /api/roast`):
- analisa o código enviado
- extrai sinais de estilo (semicolon, quotes, TypeScript, funcional, async/await)
- atualiza o perfil persistente em:
  - `.devroast/personal-style-profile.json`

2. Na próxima execução:
- o roast injeta automaticamente dicas do seu estilo no prompt da IA
- resultado fica mais alinhado ao seu jeito de codar

3. Otimização diária:
- comando `npm run agent:optimize` aplica decay leve em preferências antigas
- mantém o perfil adaptativo (aprende sem ficar “engessado”)

## APIs do agente

- `GET /api/agent/style`
  - retorna perfil atual, hints de estilo e caminho do arquivo
- `POST /api/agent/style`
  - body `{ code, language, score? }` para aprender manualmente
  - body `{ optimizeDaily: true }` para otimização diária

## Integração recomendada (cron)

Exemplo no sistema:

```bash
# todo dia às 02:10
10 2 * * * cd /caminho/do/projeto && npm run agent:optimize
```

## Nota sobre fine-tuning

Fine-tuning de pesos do modelo (model training) depende da plataforma/modelo e custo extra.
Neste projeto, o que está implementado é um **fine-tuning comportamental real** via:
- memória persistente
- atualização incremental por sessão
- prompt adaptativo personalizado

Isso já funciona localmente agora, sem pipeline de treinamento externo.
