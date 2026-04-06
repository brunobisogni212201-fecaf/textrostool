# Especificação de Persistência — Drizzle + Postgres

Esta especificação descreve como introduzir o Drizzle ORM no DevRoast para armazenar submissões de código, análises e dados de ranking. Foi elaborada com base no layout atual (páginas de envio/roast, resultados e leaderboard) e nas funcionalidades descritas no `README.md` (envio de código em múltiplas linguagens, modo roast, pontuação 0-10, ranking e destaque de sintaxe).

## Objetivos

1. Disponibilizar uma instância Postgres local via Docker Compose para desenvolvimento.
2. Modelar o domínio do DevRoast em tabelas SQL normalizadas, respeitando os fluxos da UI existente.
3. Configurar o Drizzle (ORM + CLI) para geração/aplicação de migrações e acesso aos dados em rotas/ações server-side do Next.js.
4. Permitir consultas eficientes para:
   - listar submissões recentes e seus resultados;
   - recuperar detalhes completos de uma análise (para a tela de resultados);
   - construir o ranking (leaderboard) ordenado do pior para o “menos ruim”.

## Dependências e Estrutura de Projeto

Adicionar os pacotes:

```bash
npm install drizzle-orm drizzle-kit pg pg-connection-string zod
```

Novos arquivos/pastas:

- `drizzle.config.ts` — apontando para `./drizzle` (pasta das migrações) e `./src/lib/db/schema`.
- `drizzle/` — diretório para artefatos de migração gerados pelo Drizzle Kit.
- `src/lib/db/`
  - `client.ts` — cria pool do `pg` e exporta `db` via `drizzle(pool)`.
  - `schema/` — arquivos com tabelas/enums Drizzle.
  - `queries/` — consultas reutilizáveis (ex.: leaderboard, submissões recentes).

## Docker Compose (Postgres)

Criar `docker-compose.yml` na raiz:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Variável `.env.local`:

```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

## Modelagem de Dados

### Enums (Drizzle `pgEnum`)

| Enum | Valores | Uso |
| --- | --- | --- |
| `language` | `javascript`, `typescript`, `python`, `rust`, `go`, `java`, `cpp`, `csharp`, `unknown` | Linguagem selecionada ou detectada na submissão. |
| `analysis_status` | `pending`, `processing`, `completed`, `failed` | Estado do pipeline de análise. |
| `severity` | `critical`, `warning`, `good`, `info` | Severidade das findings individuais. |
| `consultation_type` | `online`, `presencial` | Preparado para futuros módulos (ex.: agenda) caso sincronizemos com dados clínicos. |

> Observação: apesar do app atual não exigir informações de agenda no backend, o enum `consultation_type` prepara terreno para persistir sessões futuras se necessário. Excluir se não fizer sentido neste escopo.

### Tabelas

#### 1. `users`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` PK default `gen_random_uuid()` | Usuário autenticado (futuro); nulo em submissões anônimas. |
| `email` | `text` único, nullable | Guarda se a pessoa identificar-se. |
| `display_name` | `text` | Nome mostrado no leaderboard se permitido. |
| `created_at` | `timestamp` default `now()` | Registro de criação. |

> Opcional: se não houver autenticação prevista, deixar tabela pronta mas permitir `user_id` nullable em `submissions`.

#### 2. `submissions`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` PK | Identificador da submissão. |
| `user_id` | `uuid` FK `users.id` nullable | Submissões anônimas deixam `NULL`. |
| `code` | `text` | Código original enviado (até ~64k). |
| `language` | `language` enum | Linguagem detectada/selecionada. |
| `roast_mode` | `boolean` default `true` | Se usuário ativou modo roast. |
| `status` | `analysis_status` enum default `pending` | Estado atual da análise. |
| `submitted_at` | `timestamp` default `now()` | Data/hora da submissão. |
| `processed_at` | `timestamp` nullable | Fim da análise. |

#### 3. `analysis_results`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `submission_id` | `uuid` FK `submissions.id` único | Relacionamento 1:1. |
| `score` | `numeric(3,1)` | Escala 0-10 exibida na UI. |
| `total_issues` | `integer` | Total curto para resumo. |
| `critical_count` | `integer` | |
| `warning_count` | `integer` | |
| `good_count` | `integer` | |
| `language_override` | `language` enum nullable | Caso o analista/manual altere. |
| `summary` | `text` | Texto livre exibido como “roast completo”. |

#### 4. `analysis_findings`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` PK |
| `analysis_id` | `uuid` FK `analysis_results.id` |
| `severity` | `severity` enum |
| `title` | `text` |
| `description` | `text` |
| `line_start` | `integer` nullable | Ajuda para highlight futuro. |
| `line_end` | `integer` nullable | |

#### 5. `leaderboard_entries`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` PK |
| `submission_id` | `uuid` FK `submissions.id` | Vínculo para dados completos. |
| `score` | `numeric(3,1)` | Repetimos para indexação. |
| `language` | `language` enum |
| `author_alias` | `text` nullable | Ex.: “js_ninja”. |
| `created_at` | `timestamp` default `now()` |

#### 6. (Opcional) `session_events`

Registra atividades da interface para telemetria futura (não obrigatório agora). Manter em backlog.

### Relacionamentos

- `users (1) ── (n) submissions`
- `submissions (1) ── (1) analysis_results`
- `analysis_results (1) ── (n) analysis_findings`
- `submissions (1) ── (0|1) leaderboard_entries`

Indices recomendados:

- `submissions_language_idx` em (`language`).
- `analysis_results_score_idx` em (`score DESC`).
- `leaderboard_entries_score_idx` em (`score ASC`).

## Fluxos e Consultas

1. **Criar submissão** — inserir em `submissions` (status `pending`).
2. **Atualizar análise** — após processamento, inserir em `analysis_results`, findings e atualizar `submissions.status = 'completed'`, `processed_at = now()`.
3. **Leaderboard** — `SELECT * FROM leaderboard_entries ORDER BY score ASC LIMIT 50;` exibindo alias e linguagem.
4. **Histórico do usuário** — `SELECT s.id, s.language, ar.score FROM submissions s LEFT JOIN analysis_results ar ON ar.submission_id = s.id WHERE s.user_id = $1 ORDER BY s.submitted_at DESC;`

## Passo a Passo (TODOs)

1. **Infra**
   - [ ] Adicionar `docker-compose.yml` (Postgres) e atualizar `README` com instruções para `docker compose up -d`.
   - [ ] Declarar `DATABASE_URL` em `.env.local.example`.

2. **Configuração Drizzle**
   - [ ] Criar `drizzle.config.ts` com:
     ```ts
     import { defineConfig } from "drizzle-kit";
     export default defineConfig({
       schema: "./src/lib/db/schema/index.ts",
       out: "./drizzle",
       dialect: "postgresql",
       dbCredentials: { url: process.env.DATABASE_URL! },
     });
     ```
   - [ ] Adicionar scripts no `package.json`: `"db:generate": "drizzle-kit generate"`, `"db:migrate": "drizzle-kit migrate"`.

3. **Schema + Migrações**
   - [ ] Implementar enums e tabelas descritas acima em `schema/*.ts` (sugerir arquivos: `enums.ts`, `users.ts`, `submissions.ts`, `analysis.ts`, `leaderboard.ts`).
   - [ ] Exportar tudo por `schema/index.ts`.
   - [ ] Rodar `npm run db:generate` e revisar SQL gerado.
   - [ ] Aplicar com `npm run db:migrate`.

4. **Client e Queries**
   - [ ] Criar `src/lib/db/client.ts` com `pg.Pool` respeitando `NODE_ENV` (evitar múltiplos pools em dev). Exportar `db` e `schema`.
   - [ ] Escrever helpers em `src/lib/db/queries`: `createSubmission`, `completeAnalysis`, `listLeaderboard`, `getAnalysisDetail`.
   - [ ] Atualizar ações server-side / API routes para usar os helpers.

5. **Integração UI**
   - [ ] Ajustar páginas `/results` e `/leaderboard` para consumir os dados reais.
   - [ ] Garantir que `language` seja enviado pelos novos componentes de editor (quando prontos) para armazenar no banco.

6. **Observabilidade / Futuro**
   - [ ] (Opcional) adicionar seeds base usando script `drizzle-kit push --config` ou seeds customizados.
   - [ ] Planejar replicação para produção (RDS, etc.).

## Entregáveis

- Docker Compose funcional (`docker compose up -d` cria banco pronto).
- Schema Drizzle com enums/tabelas descritas acima.
- Migrações aplicáveis + scripts `db:*` no `package.json`.
- Helpers de acesso aos dados prontos para serem usados nas rotas/ações do Next.js.

Com isso, o DevRoast terá uma base sólida para evoluir de protótipo estático para aplicação dinâmica com persistência garantida pelo Drizzle ORM.
