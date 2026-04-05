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

- **UI Components**: `src/components/ui/` - Generic reusable components
- **Feature Components**: `src/components/features/` - Domain-specific components
- **Layout Components**: `src/components/layout/` - Layout elements (Navbar, PageContainer)
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
- `src/components/ui/` - Generic reusable components
- `src/components/features/` - Domain-specific components
- `src/components/layout/` - Layout components
