# Corkos — Project Context

This document provides essential context for anyone (human or AI) working on the Corkos codebase. It captures the project's vision, architectural decisions, conventions, and operational details.

If you are an AI assistant (such as Claude Code), please read this file in full before making suggestions or changes. The decisions documented here are deliberate and should be respected unless explicitly reconsidered with the project owner.

If you are a human contributor, this file is your map. The README is the friendly entry point; this file is the operating manual.

## About this document

- **Purpose:** to keep the project's reasoning and conventions in a single, version-controlled place.
- **Scope:** Corkos as a framework. Application-specific context (e.g., agenda.madrid) lives in its own repository.
- **Status:** living document. Update it when significant decisions change.

## Where project knowledge lives

Information about Corkos belongs in the repository, not in any
collaborator's local notes or AI memory system. The split is:

- **Architectural decisions, conventions, principles, glossary** — this
  document (`CLAUDE.md`).
- **Anticipated design decisions and deferred work** — `ROADMAP.md`,
  with a clear "Triggered by" condition for each item.
- **Code-level documentation** — JSDoc comments in source files,
  scoped to the unit being documented.

If during a working session a piece of project-relevant information
emerges (an architectural insight, a deferred decision, a watch-item,
a constraint discovered), it is captured here in the repository before
the session ends. Personal preferences and individual workflow notes
may stay in local tooling; project-relevant information does not.

The reason is durability and shareability: information that only lives
on one machine or in one tool is lost the moment the machine changes,
the tool updates, or another person joins. Information in the
repository survives all three.

## Vision

Corkos brings the familiarity of a desktop or mobile operating system to the web. The fundamental insight is simple: people already know how to use an OS. They know how to open a window, drag it, minimize it, switch between apps, pin shortcuts on a desktop or home screen. Decades of OS conventions have shaped the universal mental model of personal computing.

Corkos translates that mental model into a web framework. It provides the building blocks — windows, icons, desktop, taskbar, springboard — to construct web applications that feel like an operating system rather than a series of pages.

But Corkos is more than a literal copy of Windows or macOS. The translation is given a warmer, more human shape: **a personal cork board**. The desktop is your cork board. Icons are pinned items. Windows are notes you have unfolded to read. The metaphor preserves all the OS conventions but reframes them through something physical, accessible, and universally understood — anyone knows how to pin a note, move it, take it down.

In practice, this means Corkos provides:

- **A persistent personal workspace** unique to each user, like an OS desktop survives reboots.
- **Windows** that can be opened, moved, resized, minimized, maximized, focused, and closed.
- **Icons** placed on the workspace, representing apps, content, or shortcuts.
- **A taskbar** (desktop) or **app switcher** (mobile) for navigating between open windows.
- **Native dual-format design**: floating windows on desktop, full-screen views with springboard on mobile — both first-class citizens, not adaptations.
- **Deep linking**: every window has its own URL, so any state can be shared, bookmarked, and recovered.

## Architecture: three levels

Corkos sits in a deliberate three-level architecture, each level with its own identity and responsibility:

### Level 1 — Corkos (this repository)

A reusable, open-source UI framework. Provides the primitives, components, and conventions for building cork-board-style applications. Internationally distributed via npm. Vendor-neutral, application-agnostic.

### Level 2 — agenda.zone (separate, future)

A network of cultural-agenda applications, one per city, all built on top of Corkos. Provides the shared identity, federation infrastructure, and umbrella branding for the network. The first instance is agenda.madrid; future instances may follow (Barcelona, Lisbon, Porto, etc.).

### Level 3 — agenda.madrid (separate, future)

The first concrete application of the network. A cultural agenda for the city of Madrid: events, venues, artists, communities. The proving ground from which Corkos is iteratively extracted.

These three levels are **separate repositories**. Corkos has no knowledge of agenda.zone or agenda.madrid; it is built to be used by anyone, for anything that fits the cork-board paradigm.

### Workspace as full-viewport background layer

**Workspace as full-viewport background layer.** The `Workspace` occupies the entire viewport as the bottom layer of the application, and never scrolls: its dimensions are always the viewport's, never the content's. Other elements (taskbar, menus, floating panels, springboard) may overlap the `Workspace`, but never crop it: the `Workspace` remains a complete surface, partially occluded if needed. Notes live within the rectangle of the `Workspace` and are repositioned when it changes size. The analogy is a desktop operating system: the taskbar sits _above_ the desktop, and the desktop never scrolls.

### Mode selection by device capabilities and viewport

**Mode selection by device capabilities and viewport.** Corkos does not use user-agent strings to guess device brand or model. It chooses between desktop and mobile modes by combining two objective criteria:

- Device capabilities (`pointer: coarse` vs fine, presence of `hover`, etc.), which may impose mobile mode even on large viewports.
- Viewport dimensions, which may impose mobile mode when desktop minimums are not met.

On devices that admit both modes (tablets, touch-screen laptops), the user may explicitly switch to mobile mode as a preference. This aligns with principle 5 (native dual-format): both modes are first-class citizens and are chosen according to objective conditions, not assumptions about the device.

## What Corkos is not

To prevent misunderstandings:

- **Corkos is not a content management system.** It does not store events, articles, or any specific data type. Applications built with Corkos define their own domain models.
- **Corkos is not a presentation framework.** It is not Reveal.js, not Slidev, not a slide tool. The visual metaphor is a working surface, not a presentation surface.
- **Corkos is not a desktop environment.** It does not aim to replace operating systems or run native applications. It is a web UI metaphor, inspired by but distinct from native operating systems.
- **Corkos is not just a window manager library.** It is the full package: cork board, windows, icons, persistence, dual-format design, accessibility, and the philosophy that holds them together.

## Tech stack

The technology choices below are deliberate and should be respected when contributing to Corkos.

### Language

- **TypeScript** in strict mode. All `strict` flags are enabled, plus several additional safety checks (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, etc.). New code is fully typed; `any` is treated as a code smell, not a tool.
- **Modern ECMAScript** (ES2022 target). Async/await, optional chaining, nullish coalescing, top-level await, and other modern features are encouraged.
- **ECMAScript Modules** throughout. CommonJS is avoided unless interoperability with legacy dependencies requires it.

### Runtime and tooling

- **Node.js 20+** is the minimum supported version. The project is developed and tested on the current LTS.
- **pnpm** is the package manager and workspace orchestrator. npm and yarn are not used; do not introduce a `package-lock.json` or `yarn.lock`.
- **Project layout** is a monorepo with workspaces under `packages/`. Each package has its own `package.json` and is published independently.

### Build and quality

- **TypeScript compiler (`tsc --build`)** with project references and composite mode for incremental builds. No bundler is used at the package level; bundling is the responsibility of consumer applications.
- **Prettier** is the single source of truth for formatting. ESLint does not handle formatting; the two tools are configured to coexist without overlap.
- **ESLint** with flat config (`eslint.config.js`), the `typescript-eslint` recommended type-checked ruleset, plus selective custom rules. ESLint runs with full type information for catching logic-level bugs.

### Testing (planned)

- **Vitest** is the intended testing framework when test infrastructure is added. Vitest aligns with Vite-based ecosystems and has excellent TypeScript support.
- Until Vitest is configured in this repository, **no tests should be added**. Package `test` scripts are placeholders.
- **If a feature requires testing before the infrastructure exists**, the correct action is to set up Vitest as a separate commit first, then add the tests. Do not improvise tests with alternative frameworks or ad-hoc scripts.

### What is intentionally absent

- **No bundler at framework level.** Corkos packages publish raw `.js` and `.d.ts` files. Bundling is a concern of the consumer application, not the framework.
- **No CSS-in-JS library.** Styling decisions are deferred to consumer applications. Corkos provides structural primitives, not opinionated styling.
- **No state management library** (Redux, Zustand, etc.) inside the framework's core. State management is the responsibility of consumer applications. Corkos may expose hooks or utilities to integrate with whatever the consumer chooses.
- **No backend code.** Corkos is a UI framework. Persistence, authentication, and APIs are concerns of the consumer application's backend.

## Principles

These principles emerge from the project's design decisions and should guide future ones. When in doubt, return here.

### 1. Public content, personal experience

Cultural content (events, venues, artists) is public, addressable, and shareable. Every entity has its own URL. Anyone can link to it, search engines can index it, browsers can bookmark it. The exploration experience around that content (the cork board, the open windows, the personal layout) is private, session-based, and unique to each user. The two layers are clearly separated; mixing them creates fragility.

**Implication:** every domain entity must have a canonical URL. Never tie content addressability to user state.

### 2. The system supports more than it implements

The data model and architecture should accommodate scenarios that are not yet implemented. We do not build features speculatively, but we leave room for them in the schema, the types, and the structural decisions. The cost of leaving room is low; the cost of retrofitting later is high.

**Implication:** when designing models, ask "could this need to grow in this direction within five years?" If yes, leave the door open. If no, keep it tight.

### 3. Accessibility as first-class

Corkos must be usable by people with diverse abilities and technical backgrounds, including people with intellectual disabilities, older users, and users uncomfortable with technology. The cork board metaphor is intentionally chosen because it is universally understood; this advantage must not be squandered with poor implementation.

A "simple mode" must always exist alongside the rich experience: linear, predictable navigation, larger fonts, fewer simultaneous elements, plain language. The simple mode is not a degraded fallback; it is a parallel experience of equal dignity.

**Implication:** every feature is designed in two forms simultaneously — the rich one and the simple one. Accessibility is never an afterthought, never a separate ticket, never "we will get to it later."

### 4. Generic framework, specific applications

Corkos is the framework; applications (such as agenda.madrid) are separate. The framework knows nothing about cultural events, venues, or any specific domain. Applications inherit from Corkos and define their own domain models.

**Implication:** if a piece of code references a cultural-domain concept (event, venue, artist, ticket), it does not belong in this repository. It belongs in the application repository.

### 5. Native dual-format

Desktop and mobile are not the same experience scaled differently. They are two distinct paradigms of the same conceptual system: floating windows on desktop, springboard on mobile. Both are first-class citizens, designed in parallel, sharing the same data and identity but presenting it in their native form.

**Implication:** never design "for desktop first and adapt to mobile later". Each feature is conceived simultaneously in both formats, and consistency is preserved at four levels: data, visual identity, mental model, and accessibility.

### 6. Extract, don't predict

Corkos as a framework is extracted from real applications, not predicted in advance. We build agenda.madrid; when patterns become clear and reusable, they are lifted into Corkos. The reverse — designing Corkos in isolation hoping someone will use it — is a recipe for irrelevance.

**Implication:** if a Corkos feature is being designed without a concrete application driving the need, pause. Find a real application that needs it, or wait until one does.

### 7. The network is replicable

agenda.madrid is the first instance, not the only one. The data model, the conventions, the architecture must contemplate "city" as a first-class concept from day one, even when only Madrid exists.

**Implication:** never hard-code Madrid into Corkos or into the agenda layer. Cities are parameters, not assumptions.

### 8. European digital sovereignty, autonomy, and minimal intrusion

Corkos is a tool built in the European Union by people who believe in the digital sovereignty of the individual. It stands on three foundations that are not negotiable: privacy by design and by default, digital autonomy, and digital accessibility. These foundations are not aesthetic choices; they are the ethical core of the project, and every other decision in this codebase must remain compatible with them.

The framing of these foundations follows the _European Declaration on Digital Rights and Principles for the Digital Decade_ (2022), signed by the European Parliament, the Council, and the European Commission. The Declaration places people at the centre of digital transformation and commits to ensuring privacy and individual control over data. Corkos adopts this framing as its own.

**Privacy by design and by default** (in the sense of Article 25 of the GDPR): Corkos is built so that the privacy-respecting behaviour is the default behaviour, not an option the user has to discover and enable. The framework does not collect data it does not need. The framework does not enable telemetry, analytics, fingerprinting, or any form of passive observation of the user.

**Digital autonomy:** the user retains control over their experience. They are not nudged, dark-patterned, or steered towards decisions that benefit the operator. Choices that affect the user are surfaced honestly; defaults are reasonable for the user, not optimal for the operator. The user can leave, export, delete, or change their mind without friction.

**Digital sovereignty of the individual:** distinct from geopolitical digital sovereignty (which speaks of states and economic blocs), this refers to the individual's right to be the ultimate authority over their own data, attention, and digital presence. Corkos treats the user not as a resource to be measured but as a person to be served.

**Operative consequence: minimal intrusion.** From the three foundations above flows a concrete engineering discipline. Any data Corkos consults — location, device capabilities, browser, language, system preferences, identity — represents a cost to the user and a potential risk to their privacy. That cost must be justified by a real and unavoidable need of the product, not by technical convenience.

When a decision can be made by consulting less information, that path is preferred. When consulting a piece of data is unavoidable, the most restricted version that solves the problem is used (`pointer: coarse` over user-agent strings; viewport size over device type; browser language over IP-based geolocation).

**Implication for contributors:** every time a new query against the user or environment is introduced, it must be justified in the commit or PR: which decision depends on it, which less-intrusive alternative was discarded, and why. No data is "free" to collect. Connecting Corkos to a third-party service that collects user data on its own (analytics providers, error trackers with PII, recommendation engines tied to identity) requires this same justification and is treated as a serious architectural decision, not a convenience.

## Code conventions

These conventions apply to all code in this repository. They are enforced by tooling where possible (Prettier, ESLint, TypeScript) and by convention where not.

### File and folder naming

- **kebab-case** for file and folder names (`window-manager.ts`, `desktop-workspace/`).
- **PascalCase** is reserved for files containing a single React component as default export (`Window.tsx`, `Taskbar.tsx`). When such a file exists, its name matches the component name exactly.
- **Test files** end with `.test.ts` or `.test.tsx` and live alongside the file under test, not in a separate `__tests__` directory.
- **Type-only files** end with `.types.ts` when they contain only type declarations.
- **Index files** (`index.ts`) act as public entry points for a folder. They re-export the folder's public API and nothing else.

### Imports

- **Use the `@corkos/*` scoped names** for cross-package imports (`import { WindowManager } from '@corkos/core'`). Never use relative paths to navigate between packages.
- **Group imports** in this order, separated by a blank line:
  1. Node built-ins (`node:fs`, `node:path`)
  2. External dependencies (`react`, `lodash`)
  3. Internal `@corkos/*` imports
  4. Relative imports (`./`, `../`)
- **Type-only imports** use the `import type` syntax explicitly: `import type { Window } from './types'`. This aligns with `verbatimModuleSyntax` and produces cleaner output.

### TypeScript style

- **Prefer `type` over `interface`** for object shapes, unless declaration merging is needed (rare).
- **Use `readonly`** for fields that should not mutate after construction. Default to immutability.
- **Avoid `any` and `unknown` casually.** When a type is genuinely unknown, model it precisely (`unknown` with type guards) rather than escaping with `any`.
- **Discriminated unions** are preferred over class hierarchies for modeling state variants.
- **Generics** should be named meaningfully (`TWindow`, `TPayload`) rather than single letters when they carry domain meaning.

### React conventions (when applicable)

Once React components are introduced, the following apply to `@corkos/desktop` and `@corkos/mobile`:

- **Functional components only.** No class components.
- **Hooks at the top.** All `use*` calls happen at the top of the component, before any conditional logic.
- **Props as named type.** Always declare props as a named `type Props = { ... }` above the component, never inline.
- **No default exports for components in shared modules.** Prefer named exports for clarity in import statements. The exception is `index.tsx`-style entry points where a default export is expected.
- **No prop drilling deeper than two levels.** If a prop traverses more than two component layers, lift state to a React Context provided at the presentation-layer root. Do not push React-specific state mechanisms (Context, hooks) into `@corkos/core`.

### State and React integration

The framework is split deliberately:

- **`@corkos/core` is React-free.** It exposes pure functions, types, and possibly small classes for domain logic. It does not import React, does not define hooks, and does not provide Context.
- **`@corkos/desktop` and `@corkos/mobile` are the React layers.** Each presentation layer wraps `@corkos/core` in its own React hooks and Contexts. For example, `@corkos/desktop` may expose a `useNotes()` hook that internally uses `@corkos/core` functions and a React Context, but the Context and the hook live in `@corkos/desktop`, not in `core`.
- **Cross-cutting domain state** (the list of notes, the focused note, the workspace layout) is owned by `@corkos/core` as plain data, and exposed to React components through the presentation layer's own hooks.
- **UI-only state** (a dropdown is open, a modal is visible) stays local to the React component as `useState`.

This split ensures that `@corkos/core` could be consumed by a non-React UI in the future, and keeps presentation concerns where they belong.

### Comments and documentation

- **Code should be self-explanatory.** Comments explain _why_, not _what_. If a comment describes what the code is doing, the code probably needs renaming or restructuring instead.
- **JSDoc** is used on exported public APIs. It should describe purpose, parameters, return values, and notable side effects.
- **TODO comments** must include a context: `// TODO(corkos): explain what is missing`. Faceless `// TODO` is not acceptable.

### Errors and edge cases

- **Throw early.** Validate inputs at function entry and throw descriptive errors. Do not propagate invalid state.
- **Use custom error classes** for domain-specific errors (e.g., `WindowNotFoundError`). Do not use generic `Error` for situations that callers might want to handle differently.
- **Never silently catch.** Every `catch` either handles the error meaningfully, rethrows, or logs deliberately. Empty catch blocks are forbidden.

### Tests (when present)

Even though tests will arrive later, the convention is fixed in advance:

- **One test file per source file**, colocated.
- **Describe blocks** group tests by behavior, not by method name.
- **Test names read as sentences**: `it('returns null when no window is focused')`, not `it('test getFocusedWindow null case')`.
- **Pure unit tests** preferred over integration tests for the framework. Integration concerns belong in consuming applications.

## Styling conventions

Corkos provides minimal default styling and is intentionally neutral
in aesthetic, but it is designed so that external themes are
straightforward to author without forking or refactoring the
framework.

### CSS Custom Properties

Any CSS value that an external theme might reasonably want to
customize is declared as a CSS Custom Property with the `--corkos-`
prefix, with its default visible at the declaration site. Themes
override these variables; they do not modify the framework's CSS.

**What gets variabilized:**

- Colors (backgrounds, borders, text)
- Border widths, radii, styles
- Shadows
- Padding and visual spacing
- Typography (font family, weight, size, line-height)
- Anything that contributes to "how a component looks"

**What stays hard-coded:**

- Layout primitives (`position`, `display`, `box-sizing`)
- Structural sizing (`width`, `height`, `min-height` when they
  define the component's contract, not its aesthetic)
- Behavioral properties (`cursor` values when they communicate
  affordance, `user-select` when it serves the interaction)
- Anything that contributes to "how a component works"

### Default values

Defaults are sober, neutral, and functional. They are a reasonable
starting point, not an opinionated aesthetic. A consumer using
Corkos without any theme should get something visually plain but
fully usable.

### Themes are out of scope for the framework

The Corkos framework does not ship themes. Themes are external
artifacts (separate packages, consumer CSS files, or runtime style
injection) that override the published custom properties. The
framework's responsibility is to expose a complete and coherent
set of variables; the theme's responsibility is to assign aesthetic
values to them.

## Repository structure

Corkos is organized as a pnpm workspaces monorepo. Each package under `packages/` is a separate published unit.

### Top-level layout

```text
corkos/
├── packages/                   # Published packages (open source via npm)
│   ├── core/                   # @corkos/core — agnostic logic
│   ├── desktop/                # @corkos/desktop — desktop UI layer
│   └── mobile/                 # @corkos/mobile — mobile UI layer
├── apps/                       # Internal apps — not published
│   └── playground/             # Sandbox to test Corkos components
├── .vscode/                    # Workspace configuration for VS Code
├── .gitignore
├── .prettierignore
├── .prettierrc.json            # Prettier configuration
├── eslint.config.js            # ESLint flat config
├── tsconfig.base.json          # Shared TypeScript configuration
├── tsconfig.json               # Root orchestrator (project references)
├── package.json                # Workspace root, scripts only
├── pnpm-workspace.yaml         # Declares packages location
├── pnpm-lock.yaml              # Lockfile (committed)
├── LICENSE                     # MIT
├── README.md                   # Public-facing introduction
└── CLAUDE.md                   # This file
```

The repository contains two top-level folders for code:

- **`packages/`** holds the published Corkos packages. These are the open-source deliverables, distributed via npm. They contain no application-specific code.
- **`apps/`** holds internal applications used during Corkos development — sandboxes, examples, and experimental prototypes. These are never published. They depend on `packages/*` to exercise the framework in real conditions, but they are not part of the Corkos framework itself.

Apps are explicitly **not** the place to build production applications. The cultural agenda (agenda.madrid) and its network (agenda.zone) live in their own repositories. Apps here exist purely to serve Corkos's own development needs.

### The three packages

#### `@corkos/core`

Pure logic. State management for boards, notes, pins, and windows. Knows nothing about how the UI renders. Knows nothing about React, DOM, or any presentation layer.

This package can be consumed by:

- `@corkos/desktop` and `@corkos/mobile` (the standard Corkos UI layers)
- Any custom UI implementation a consumer may build
- Server-side code that needs to manipulate corkboard state without rendering

**Dependencies:** none from this monorepo. May depend on small utility libraries.

#### `@corkos/desktop`

The desktop presentation layer. Floating windows, taskbar, corkboard workspace, drag-and-drop, keyboard shortcuts, focus management. Built with React.

Depends on `@corkos/core` for all state and logic. Does not contain its own state management.

**Dependencies:** `@corkos/core`, React.

#### `@corkos/mobile`

The mobile presentation layer. Springboard home screen, full-screen views, app switcher, gesture-based navigation. Built with React.

Depends on `@corkos/core` for all state and logic. Does not contain its own state management.

**Dependencies:** `@corkos/core`, React.

### How dependencies flow

```text
                  @corkos/core  (no monorepo dependencies)
                       ▲
                       │
         ┌─────────────┴─────────────┐
         │                           │
    @corkos/desktop              @corkos/mobile
```

This direction is one-way and must be respected:

- `core` must never import from `desktop` or `mobile`.
- `desktop` and `mobile` must never import from each other.
- Shared UI utilities, if needed, should be extracted into a future `@corkos/shared` package, not added to one of the existing packages.

### Each package's internal structure

```text
packages/<name>/
├── src/                        # Source code
│   ├── index.ts                # Public API entry point (re-exports only)
│   └── ...                     # Implementation files
├── dist/                       # Compiled output (gitignored)
├── package.json                # Package manifest
└── tsconfig.json               # Extends ../../tsconfig.base.json
```

**The `src/index.ts` file is the contract** with consumers. Anything not exported from `index.ts` is implementation detail and may change without notice. Anything exported from `index.ts` is public API and follows semantic versioning once the package is published as stable.

### Where new things go

When adding code, place it according to its concern:

- **Domain logic without rendering** → `@corkos/core`
- **A React component used in floating windows** → `@corkos/desktop`
- **A React component used in mobile springboard** → `@corkos/mobile`
- **A utility shared between desktop and mobile** → for now, place a copy in each (acceptable for small utilities) or open an issue to extract a `@corkos/shared` package.

When uncertain, the question is: _does this know about the visual presentation?_ If yes → `desktop` or `mobile`. If no → `core`.

## Common commands

All commands are run from the repository root unless specified otherwise.

### Setup

```bash
# Install all workspace dependencies
pnpm install
```

After cloning the repository, this is the only command needed to get a working development environment. It installs dependencies for all packages and links them via pnpm workspaces.

### Build

```bash
# Build all packages (uses TypeScript composite mode)
pnpm build

# Build with verbose output
pnpm exec tsc --build --verbose

# Force rebuild ignoring cache
pnpm exec tsc --build --force

# Clean build artifacts
rm -rf packages/*/dist packages/*/tsconfig.tsbuildinfo
```

The `pnpm build` command runs `tsc --build` for every package in the correct dependency order, thanks to TypeScript project references.

### Linting and formatting

```bash
# Run ESLint on the entire repository
pnpm lint

# Run ESLint and auto-fix what can be fixed
pnpm lint:fix

# Format all files with Prettier
pnpm format

# Check formatting without modifying files (useful in CI)
pnpm format:check
```

Both ESLint and Prettier respect the configuration in `eslint.config.js` and `.prettierrc.json`. The two tools coexist without conflict because `eslint-config-prettier` disables ESLint rules that overlap with formatting.

### Working with packages

```bash
# Add a dependency to the workspace root (devDependency)
pnpm add -Dw <package>

# Add a dependency to a specific package
pnpm add <package> --filter @corkos/core

# Add a workspace package as a dependency of another
# (this is what we did for @corkos/desktop depending on @corkos/core)
pnpm add @corkos/core --filter @corkos/desktop --workspace

# List all packages in the workspace
pnpm m ls

# Run a command in all packages
pnpm -r <command>

# Run a command in a specific package
pnpm --filter @corkos/core <command>
```

The `--filter` flag is the workhorse for monorepo work. Get comfortable with it.

### Git workflow

```bash
# Standard development cycle
git status
git add <files>
git commit -m "<descriptive message>"
git push

# Inspect history
git log --oneline
git log --oneline -10                  # Last 10 commits
git log --oneline --graph              # With visual branching

# Compare changes
git diff                                # Unstaged changes
git diff --staged                       # Staged changes
git diff <commit1> <commit2>            # Between two commits
```

### Commit message conventions

**Commits are atomic.** Each commit represents one conceptually distinct change: a new component, a documentation update, a refactor, a fix. Code changes, CLAUDE.md updates, and ROADMAP.md updates travel in separate commits even when they belong to the same block of work. The test: reading a commit in isolation should make sense without the surrounding ones. If a commit only makes sense alongside another, fuse them. If it does, separate them.

A block of work (as tracked in MILESTONES.md) typically produces several atomic commits — one for the component, one for the documentation, one for the roadmap update, and so on. There is no "one commit per block" rule.

Commit messages follow a simple, descriptive style. They should:

- Start with a capitalized verb in imperative mood ("Add", "Configure", "Fix", "Refactor")
- Describe what the commit does, not how
- Be self-contained: a reader of `git log --oneline` should understand the change without opening the diff

**Good examples:**

- `Configure TypeScript with strict mode and project references`
- `Add VS Code workspace settings and recommended extensions`
- `Fix focus loss when minimizing window during drag`

**Avoid:**

- `update`, `fix`, `wip` (no context)
- `Updated the eslint.config.js file to add some new rules` (verbose, past tense)
- Multi-line messages without a clear summary line

If a change is large enough to need explanation, the first line is a short summary, then a blank line, then a longer description.

### Troubleshooting

```bash
# Clean install (rare but useful when something breaks)
rm -rf node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript version actually used
pnpm exec tsc --version

# Check pnpm version
pnpm --version

# See what files Prettier would reformat without changing them
pnpm format:check

# See what files ESLint considers
pnpm exec eslint . --debug 2>&1 | head -50
```

If a tool behaves unexpectedly, the first three checks are usually:

1. Did `pnpm install` run successfully?
2. Is the version reported by `--version` what is expected?
3. Are there leftover artifacts from an old build (`*.tsbuildinfo`, stale `dist/`)?

## Anti-patterns

These are practices to avoid in this codebase. Some are obvious; others have been learned the hard way and deserve explicit mention.

### Architectural anti-patterns

- **Do not import from `@corkos/desktop` or `@corkos/mobile` inside `@corkos/core`.** Core is presentation-agnostic by design. Violating this couples logic to presentation and breaks the architecture.
- **Do not import from `@corkos/mobile` inside `@corkos/desktop`** (or vice versa). The two presentation layers are independent siblings, not a hierarchy.
- **Do not introduce cultural-domain concepts in this repository.** Events, venues, artists, tickets — none of these belong in Corkos. They belong in agenda.madrid (or whatever consumer application).
- **Do not hard-code city names, languages, or locales.** Every parameter that could vary between deployments must be configurable, even if today only one value is used.

### TypeScript anti-patterns

- **Do not use `any` to silence type errors.** If the type is genuinely unknown, model it with `unknown` and narrow it with type guards. If a library has bad types, declare a precise local type or open an issue with the upstream.
- **Do not disable strict checks file-by-file** with `// @ts-nocheck` or `// @ts-expect-error` without an explanation. When `// @ts-expect-error` is unavoidable, it must include a comment describing why.
- **Do not write `as` casts to escape type checking.** Casts are last resorts; they tell the compiler to trust you, and that trust must be earned.

### Tooling anti-patterns

- **Do not run `npm install` or `yarn install`.** Only `pnpm install`. Mixing package managers produces inconsistent lockfiles and broken installs.
- **Do not commit `dist/` folders or `*.tsbuildinfo` files.** They are build artifacts and are gitignored. If they appear in `git status`, something is misconfigured.
- **Do not commit `node_modules/`.** Same reason. Should never appear in `git status`.
- **Do not bypass Prettier or ESLint** with `// prettier-ignore` or `// eslint-disable` casually. Both have their use cases, but each instance should be deliberate and documented.

### Process anti-patterns

- **Do not design Corkos features without a real consumer driving the need.** This contradicts principle 6 (Extract, don't predict). If you find yourself building "for a future use case", stop and find a present one.
- **Do not skip the simple-mode design** of an accessibility-relevant feature, planning to "add it later". This contradicts principle 3. Both forms are designed together.
- **Do not introduce dependencies casually.** Each new external dependency adds maintenance, security, and bundle-size cost. Justify each addition; prefer the standard library or local utilities first.

## Glossary

Vocabulary used consistently throughout the codebase and documentation.

### Core domain

- **Cork board** — the metaphorical surface where a user pins their content. The conceptual root of the framework.
- **Workspace** — the technical term for the cork board, used in code where "cork board" would feel out of place. They refer to the same thing.
- **Note** — a single piece of pinnable content. In code, this is the canonical name for what the user sees as a "note pinned on the cork board". On desktop it renders as a window; on mobile as a full-screen view.
- **Pin** — the act of placing a Note on a Workspace, or the visual representation of a pinned item (icon, marker).
- **Window** — the desktop rendering of an open Note. Has a title bar, can be moved, resized, minimized, maximized, focused, closed.
- **Springboard** — the mobile rendering of the Workspace. A grid of Pins that the user can tap to open a Note in full screen.
- **Taskbar** — the desktop strip (typically bottom of screen) showing currently open Windows for navigation.
- **App switcher** — the mobile equivalent of the taskbar, typically accessed by gesture.

### State and identity

- **Focus** — the property of a single Window or App being the active target of user input. At most one item is focused at a time.
- **Z-index** — the stacking order of Windows on desktop. Determined by focus history.
- **Deep link** — a URL that, when opened, restores a specific Workspace state (which Notes are open, which one is focused).
- **Simple mode** — the parallel accessibility-first experience, providing linear navigation without the spatial metaphor. Equal in dignity to the rich mode.

### Architecture

- **Core** — `@corkos/core`. Logic, agnostic to presentation.
- **Desktop layer** — `@corkos/desktop`. Floating-window presentation.
- **Mobile layer** — `@corkos/mobile`. Springboard presentation.
- **Consumer application** — any application built on top of Corkos (e.g., agenda.madrid). Lives in its own repository.

---

_This document is a living artifact. Update it when significant decisions change. Keep it honest, keep it useful._
