# AGENTS.md

## Project: DevRoast

A code review tool that delivers brutally honest feedback with optional roast mode.

## Tech Stack

- **Framework**: Next.js 16.1.6, TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables
- **Linting/Formatting**: Biome
- **Syntax Highlighting**: Shiki

## Design System

- Dark theme by default (add `.dark` on `<html>` for light mode)
- CSS variables exposed via `@theme` in `globals.css`
- Design tokens: `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `foreground`, `background`, `card`
- Status colors: `success`, `warning`, `info`, `error`
- Text hierarchy: `text-primary`, `text-secondary`, `text-tertiary`, `text-muted`
- Surfaces: `bg-page`, `bg-surface`, `bg-elevated`, `bg-input`
- Fonts: System sans (default), `font-mono` (JetBrains Mono)

## Component Patterns

- **UI Components**: `src/components/ui/` - Generic reusable interface components
- **Feature Components**: `src/app/components/features/` - Domain-specific application components
- **Layout Components**: `src/app/components/layout/` - Layout elements (Navbar, PageContainer)
- **Pattern**: Composition pattern for complex components (e.g., `AnalysisCard` has `Root`, `Header`, `Title`)
- **Exports**: Named exports only, barrel exports via `index.ts`
- **Styling**: Use `tv()` from `tailwind-variants` with `twMerge: true`

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Biome lint check
npm run format   # Biome format
npm run check   # Lint + format
```

## Key Directories

- `src/app/` - Next.js app router pages
- `src/components/ui/` - Generic reusable interface components
- `src/app/components/features/` - Domain-specific application components
- `src/app/components/layout/` - Application layout components

## Mandatory Multi-Agent Workflow

All prompts, instructions, and task executions in this project must follow this workflow, regardless of tool or interface:
- Codex
- Gemini
- Claude
- OpenCode
- Terminal-based execution

### Required Sequence (No Skips)

1. `brainstorming`
- Activate before writing code
- Refine rough ideas through questions
- Explore alternatives
- Present design in clear sections for validation
- Save a design document in `specs/`

2. `using-git-worktrees`
- Activate after design approval
- Create isolated workspace on a new branch
- Run project setup
- Verify clean baseline (`npm run check` and relevant tests)

3. `writing-plans`
- Activate with approved design
- Break work into small tasks (2-5 minutes each)
- For each task include exact file paths, complete code intent, and verification steps

4. `subagent-driven-development` or `executing-plans`
- Activate with an approved plan
- Execute task-by-task with review gates
- If using subagents, require two-stage review:
- Spec compliance
- Code quality

5. `test-driven-development`
- Mandatory during implementation (RED -> GREEN -> REFACTOR)
- Write failing test first, confirm failure, implement minimal fix, confirm pass
- Do not keep implementation code that bypasses this cycle

6. `requesting-code-review`
- Activate between tasks or task batches
- Report issues by severity
- Critical issues block progress until fixed

7. `finishing-a-development-branch`
- Activate when planned tasks are complete
- Re-run verification (`npm run check`, tests, and `npm run build` when relevant)
- Present closure options:
- Merge
- Open PR
- Keep branch/worktree
- Discard branch/worktree

### Enforcement Rules

- Any skipped step invalidates the execution and requires rollback to the correct phase.
- No direct implementation is allowed without explicit design approval.
- No merge/PR is allowed without final verification and review.
- When context is unclear, stop and resolve ambiguity before coding.

### Prompting Rule for Any Agent

Every execution prompt in this repository must explicitly state:
- "Follow the Mandatory Multi-Agent Workflow from `AGENTS.md`."
- Current phase
- Entry criteria satisfied
- Exit criteria expected
