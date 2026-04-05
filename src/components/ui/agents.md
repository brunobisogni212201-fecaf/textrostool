# UI COMPONENTS GUIDE

## OVERVIEW

THIS DIRECTORY CONTAINS ALL REUSABLE UI COMPONENTS FOR THE PROJECT.

## FILE STRUCTURE

```
src/components/ui/
├── button.tsx      # BUTTON COMPONENT
├── index.ts        # BARREL EXPORTS
└── AGENTS.md       # THIS FILE
```

## BARREL EXPORTS

THE `index.ts` FILE PROVIDES A CENTRAL EXPORT POINT FOR ALL COMPONENTS IN THIS DIRECTORY.

**BENEFITS:**
- SINGLE IMPORT PATH FOR ALL COMPONENTS
- CLEANER IMPORTS ACROSS THE PROJECT
- EASY SCALABILITY

**EXAMPLE:**
```tsx
// CLEAN IMPORT (RECOMMENDED)
import { Button } from "@/components/ui"

// VERSUS
import { Button } from "@/components/ui/button"
```

## COMPONENT CREATION RULES

### 1. USE TAILWIND-VARIANTS (TV)

ALWAYS USE `tv()` FROM TAILWIND-VARIANTS FOR DEFINING COMPONENT VARIANTS.

**STRUCTURE:**
- `base`: SHARED CLASSES APPLIED TO ALL VARIANTS
- `variants`: NAMED GROUPS OF MUTUALLY EXCLUSIVE STYLES (E.G., `variant`, `size`)
- `defaultVariants`: DEFAULT VALUES WHEN PROPS ARE NOT SPECIFIED
- `twMerge: true`: ENABLES AUTOMATIC CLASSNAME MERGING

### 2. NAMED EXPORTS ONLY

NEVER USE DEFAULT EXPORTS.

**CORRECT PATTERN:**
```tsx
export { Component, component }
export type { ComponentProps, ComponentVariantProps }
```

### 3. PROPS PATTERN

DEFINE PROPS USING `VariantProps` FROM TAILWIND-VARIANTS COMBINED WITH HTML ATTRIBUTES.

**PATTERN:**
```tsx
export type ComponentVariantProps = VariantProps<typeof component>
export type ComponentProps = ComponentVariantProps &
  Omit<HTMLAttributes<HTMLElement>, "className">
```

### 4. CLASSNAME MERGE

PASS `className` DIRECTLY TO `tv()` - DO NOT USE TWMERGE SEPARATELY.

**CORRECT:**
```tsx
className={component({ variant, size, className })}
```

**INCORRECT:**
```tsx
className={twMerge(component({ variant, size }), className)}
```

### 5. DISPLAY NAME

ALWAYS SET `displayName` FOR REACT DEVTOOLS DEBUGGING.

```tsx
Component.displayName = "Component"
```

### 6. CSS VARIABLES & DESIGN TOKENS

USE DESIGN TOKENS FROM `src/app/globals.css` VIA TAILWIND UTILITIES.

**REFERENCE PATTERN:**
```tsx
// CORRECT
className="bg-primary text-foreground rounded-[radius-md]"

// INCORRECT
className="bg-[#ff8400] text-[#111111]"
```

### 7. FORWARDREF

ONLY USE `forwardRef` WHEN THE COMPONENT NEEDS TO EXPOSE A REF TO THE UNDERLYING DOM ELEMENT.

### 8. FONT CLASSES

USE TAILWIND DEFAULT FONT UTILITIES:
- `font-sans`: SYSTEM SANS-SERIF FONT (DEFAULT)
- `font-mono`: JETBRAINS MONO FOR MONOSPACED TEXT

**CONFIGURATION IN `globals.css`:**
```css
@theme {
  --font-sans: system-ui, -apple-system, sans-serif
  --font-mono: "JetBrains Mono", monospace
}
```

## DESIGN TOKENS REFERENCE

SEE `src/app/globals.css` FOR COMPLETE TOKEN LIST.

**KEY CATEGORIES:**

| CATEGORY | TOKENS |
|----------|--------|
| SEMANTIC COLORS | `primary`, `secondary`, `destructive`, `border`, `ring` |
| FOREGROUND VARIANTS | `*-foreground` (E.G., `primary-foreground`) |
| STATUS COLORS | `success`, `warning`, `info`, `error` |
| TEXT HIERARCHY | `text-primary`, `text-secondary`, `text-muted` |
| SURFACE COLORS | `bg-page`, `bg-surface`, `bg-elevated` |
| BORDER RADIUS | `radius-sm`, `radius-md`, `radius-lg` |
| SPACING | `spacing-xs`, `spacing-sm`, `spacing-md` |

## THEMING

THE DESIGN SYSTEM SUPPORTS:
- **LIGHT MODE**: DEFAULT
- **DARK MODE**: ADD `.dark` CLASS TO `<html>` ELEMENT

COLORS AUTOMATICALLY ADAPT BASED ON THE ACTIVE THEME VIA CSS CUSTOM PROPERTIES.

## ADDING NEW COMPONENTS

1. CREATE A NEW COMPONENT FILE IN THIS DIRECTORY
2. FOLLOW THE COMPONENT CREATION RULES OUTLINED ABOVE
3. EXPORT USING NAMED EXPORTS
4. UPDATE `index.ts` WITH BARREL EXPORTS
5. ADD EXAMPLES TO `src/app/components/page.tsx`
