# 🤖 Rules for AI Agents - 78726470-e48f-42a0-8d14-15faa7b49bb0

> Specific guidelines for AI agents working with this codebase.
> Read this document **BEFORE** making any code changes.

**Architecture:** Monolithic with potential separation of concerns using components. It's likely a React application built with Vite.  
**Main Language:** TypeScript  
**Framework:** Vite  
**Last Updated:** February 2026

---

## 📋 Index

- [Project Context](#project-context)
- [Documentation Navigation](#documentation-navigation)
- [File Structure](#file-structure)
- [Code Patterns](#code-patterns)
- [Naming Conventions](#naming-conventions)
- [Dependencies and Imports](#dependencies-and-imports)
- [Anti-Patterns](#anti-patterns)
- [Checklist Before Committing](#checklist-before-committing)

---

## Project Context

### About the Project

This project follows a **Monolithic with potential separation of concerns using components. It's likely a React application built with Vite.** architecture, 
implemented primarily in **TypeScript**.

### Detected Patterns

- No specific patterns detected

### Technology Stack

- Stack not identified


---

## Documentation Navigation

### Golden Rule
```
ALWAYS start reading in this order:
1. This file (AGENT_RULES.md) ─ You are here
2. /docs/usage/00_INDEX.md ─ To know which guide to follow
3. The specific guide for your task ─ Only ONE at a time
4. Documents from /context/ ─ Only when referenced
```

### Decision Tree

```
What do you need to do?
│
├─► Create new component/module?
│   └─► Read: /docs/usage/02_CODE_PATTERNS.md
│
├─► Understand data flow?
│   └─► Read: /docs/usage/03_DATA_FLOW.md
│
├─► Add new feature?
│   └─► Read: /docs/usage/04_ADDING_FEATURES.md
│
├─► Understand general architecture?
│   └─► Read: /docs/charts/01_ARCHITECTURE_OVERVIEW.md
│
└─► Debug or maintenance?
    └─► Read: /docs/charts/06_DEPENDENCY_GRAPH.md
```

### ⚠️ DON'T DO
- Don't load all documents at once
- Don't ignore documentation and go straight to code
- Don't modify code without checking patterns

---

## File Structure

### Modular Monolith

```
src/
├── modules/
│   ├── module-a/
│   └── module-b/
├── shared/        ─► Shared code
└── infrastructure/
```

**Rules:**
1. Modules should be as independent as possible
2. Inter-module communication via public interfaces
3. Shared contains only generic utilities


---

## Code Patterns

### General Patterns

Follow existing patterns in the code. Before implementing:

1. Look for similar implementations in the codebase
2. Maintain consistency with existing style
3. Check `/docs/context/PATTERNS.md`


---

## Naming Conventions

### TypeScript/JavaScript

```typescript
// Files: kebab-case or PascalCase for components
my-service.ts
MyComponent.tsx

// Classes and Components: PascalCase
class MyService {}
function MyComponent() {}

// Functions and variables: camelCase
function myFunction() {}
const myVariable = 1;

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Interfaces: PascalCase, optional I prefix
interface UserData {}
interface IUserService {}

// Types: PascalCase
type UserRole = 'admin' | 'user';
```


---

## Dependencies and Imports

### Import Order

1. **Standard libraries** (built-in)
2. **External dependencies** (third-party)
3. **Internal imports** (from project)

### TypeScript/JavaScript

```typescript
// 1. Node/Built-in
import path from 'path';

// 2. Third-party
import express from 'express';
import { z } from 'zod';

// 3. Internal - aliases (@/)
import { MyService } from '@/services/my-service';

// 4. Internal - relative
import { helper } from './utils';
```


---

## Useful Commands

```bash
# Install dependencies
npm install
# or
yarn
# or
pnpm install

# Run development
npm run dev

# Build
npm run build

# Tests
npm run test

# Lint
npm run lint

# Format
npm run format
```


---

## Anti-Patterns

> ⛔ What **NOT** to do in this project

### Avoid These Mistakes

1. **Don't duplicate code**
   - Before creating something new, check if it already exists
   - Check `/docs/context/COMPONENTS.md`

2. **Don't ignore architecture**
   - Respect layers and responsibilities
   - Don't create circular dependencies

3. **Don't hardcode values**
   - Use configurations and constants
   - Sensitive data goes in environment variables

4. **Don't make giant commits**
   - Small and focused commits
   - One feature per commit

5. **Don't ignore types**
   - If the project uses TypeScript/types, maintain typing
   - Avoid `any` or overly generic types

6. **Don't modify configuration files unnecessarily**
   - `package.json`, `pyproject.toml`, etc.
   - Only when strictly necessary


---

## Checklist Before Committing

```
□ Does the code follow patterns documented in /docs/context/PATTERNS.md?
□ Are new components in the correct folder?
□ Do imports follow project conventions?
□ Is there no duplicate code of something that already exists?
□ Were tests added/updated?
□ Was documentation updated if needed?
```

---

## Key Modules

| Module | Description |
|--------|-------------|
| `postcss.config.js` | N/A |
| `landingpage` | N/A |
| `vite.config.ts` | N/A |
| `src` | N/A |
| `vite.config.d.ts` | N/A |
| `tailwind.config.js` | N/A |

---

## Entry Points

- `vite.config.d.ts`
- `postcss.config.js`
- `tailwind.config.js`
- `vite.config.ts`
- `src/vite-env.d.ts`
- `src/main.tsx`
- `landingpage/types.ts`
- `landingpage/index.tsx`
- `landingpage/App.tsx`
- `landingpage/vite.config.ts`

---

*Automatically generated by Code Analysis Agent*  
*Last updated: February 2026*
