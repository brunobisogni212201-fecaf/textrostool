# Spec Completo: Docker Compose + Drizzle Kit + Schema

Este documento cobre o setup completo de persistência para o DevRoast com Postgres + Drizzle:
- Infra local com Docker Compose
- Configuração do Drizzle Kit
- Fluxo de migrações (`generate`, `migrate`, `push`, `studio`)
- Schema completo das tabelas
- Estrutura de arquivos e comandos operacionais

## 1. Dependências

```bash
npm install drizzle-orm pg pg-connection-string zod
npm install -D drizzle-kit
```

## 2. Docker Compose (Postgres local)

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
      - devroast_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast -d devroast"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  devroast_pg_data:
```

Comandos:

```bash
docker compose up -d
docker compose ps
docker compose logs -f postgres
docker compose down
```

## 3. Variáveis de ambiente

No `.env.local`:

```bash
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

No `.env.local.example` (recomendado):

```bash
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

## 4. Drizzle Kit config

Criar `drizzle.config.ts`:

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});
```

## 5. Scripts npm (migrations, push, studio)

Adicionar em `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:check": "drizzle-kit check"
  }
}
```

Quando usar cada um:
- `db:generate`: gera SQL de migração a partir do schema TypeScript.
- `db:migrate`: aplica migrações versionadas da pasta `drizzle/`.
- `db:push`: sincroniza schema direto no banco (útil para protótipo/dev, evitar em produção).
- `db:studio`: UI para navegar/editar dados.
- `db:check`: valida drift entre schema e banco.

## 6. Estrutura de arquivos recomendada

```text
drizzle/
drizzle.config.ts
src/lib/db/
  client.ts
  schema/
    enums.ts
    users.ts
    submissions.ts
    analysis.ts
    leaderboard.ts
    style-agent.ts
    index.ts
  queries/
    submissions.ts
    analysis.ts
    leaderboard.ts
```

## 7. Schema completo (Drizzle)

### 7.1 `src/lib/db/schema/enums.ts`

```ts
import { pgEnum } from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "html",
  "css",
  "json",
  "python",
  "go",
  "java",
  "ruby",
  "rails",
  "sql",
  "nosql",
  "shell",
  "react-native",
  "flutter",
  "swift",
  "unknown",
]);

export const analysisStatusEnum = pgEnum("analysis_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const severityEnum = pgEnum("severity", ["critical", "warning", "good"]);

export const budgetModeEnum = pgEnum("budget_mode", ["cheap", "balanced", "deep"]);
```

### 7.2 `src/lib/db/schema/users.ts`

```ts
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

### 7.3 `src/lib/db/schema/submissions.ts`

```ts
import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { analysisStatusEnum, languageEnum } from "./enums";
import { users } from "./users";

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    code: text("code").notNull(),
    language: languageEnum("language").notNull().default("unknown"),
    roastMode: boolean("roast_mode").notNull().default(true),
    status: analysisStatusEnum("status").notNull().default("pending"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (table) => ({
    languageIdx: index("submissions_language_idx").on(table.language),
    statusIdx: index("submissions_status_idx").on(table.status),
    submittedAtIdx: index("submissions_submitted_at_idx").on(table.submittedAt),
  }),
);
```

### 7.4 `src/lib/db/schema/analysis.ts`

```ts
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { budgetModeEnum, languageEnum, severityEnum } from "./enums";
import { submissions } from "./submissions";

export const analysisResults = pgTable(
  "analysis_results",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    score: numeric("score", { precision: 3, scale: 1 }).notNull(),
    totalIssues: integer("total_issues").notNull().default(0),
    criticalCount: integer("critical_count").notNull().default(0),
    warningCount: integer("warning_count").notNull().default(0),
    goodCount: integer("good_count").notNull().default(0),
    languageOverride: languageEnum("language_override"),
    summary: text("summary").notNull(),
    model: text("model").notNull(),
    budgetMode: budgetModeEnum("budget_mode").notNull().default("cheap"),
    inputTokensEstimate: integer("input_tokens_estimate").notNull().default(0),
    outputTokensLimit: integer("output_tokens_limit").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    submissionUnique: uniqueIndex("analysis_results_submission_id_uidx").on(
      table.submissionId,
    ),
    scoreIdx: index("analysis_results_score_idx").on(table.score),
  }),
);

export const analysisFindings = pgTable(
  "analysis_findings",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    analysisId: uuid("analysis_id")
      .notNull()
      .references(() => analysisResults.id, { onDelete: "cascade" }),
    severity: severityEnum("severity").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    lineStart: integer("line_start"),
    lineEnd: integer("line_end"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    analysisIdIdx: index("analysis_findings_analysis_id_idx").on(table.analysisId),
    severityIdx: index("analysis_findings_severity_idx").on(table.severity),
  }),
);
```

### 7.5 `src/lib/db/schema/leaderboard.ts`

```ts
import { sql } from "drizzle-orm";
import { index, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { languageEnum } from "./enums";
import { submissions } from "./submissions";

export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    score: numeric("score", { precision: 3, scale: 1 }).notNull(),
    language: languageEnum("language").notNull(),
    authorAlias: text("author_alias"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    scoreIdx: index("leaderboard_entries_score_idx").on(table.score),
    createdAtIdx: index("leaderboard_entries_created_at_idx").on(table.createdAt),
  }),
);
```

### 7.6 `src/lib/db/schema/style-agent.ts`

```ts
import { sql } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const personalStyleProfiles = pgTable("personal_style_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  profileVersion: integer("profile_version").notNull().default(1),
  sessions: integer("sessions").notNull().default(0),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  signals: jsonb("signals").notNull(),
  preferredLanguages: jsonb("preferred_languages").notNull(),
  favoritePatterns: jsonb("favorite_patterns").notNull(),
  source: text("source").notNull().default("local-agent"),
});
```

### 7.7 `src/lib/db/schema/index.ts`

```ts
export * from "./analysis";
export * from "./enums";
export * from "./leaderboard";
export * from "./style-agent";
export * from "./submissions";
export * from "./users";
```

## 8. Cliente Drizzle

`src/lib/db/client.ts`:

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pool?: Pool };

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
export { pool };
```

## 9. Fluxo operacional de migrations

Primeiro setup:

```bash
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:studio
```

Mudança de schema:

```bash
# editar arquivos em src/lib/db/schema/*
npm run db:generate
npm run db:migrate
npm run db:check
```

Modo rápido de protótipo:

```bash
npm run db:push
```

Produção:
- usar `generate + migrate` versionado (não usar `push` direto).
- aplicar migração via pipeline CI/CD.

## 10. Queries essenciais

1. Criar submissão + status `pending`.
2. Salvar resultado + findings + atualizar status `completed`.
3. Consultar leaderboard por menor score.
4. Consultar histórico por usuário e por linguagem.
5. Consultar perfil do personal-style-agent (opcional, se migrar do JSON local para DB).

## 11. Checklist de pronto

- [ ] `docker compose up -d` sobe Postgres saudável
- [ ] `db:generate` cria SQL em `drizzle/`
- [ ] `db:migrate` aplica sem erro
- [ ] `db:studio` abre e visualiza tabelas
- [ ] Índices principais criados
- [ ] Queries básicas implementadas em `src/lib/db/queries/*`
