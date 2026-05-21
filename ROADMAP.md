# Corkos — Roadmap

This document tracks design decisions and improvements that are
anticipated but deliberately deferred. Following the project's
principle of "extract, don't predict", we capture ideas here rather
than implementing them speculatively.

This is a living document. Items move from here to actual commits
when a real need drives the work.

## Anticipated design decisions

### Selective drag area

The current Window component treats the entire surface as draggable.
This works for a single-element note, but breaks down once Windows
contain editable content (text fields, attachments, interactive
elements). Industry convention: only the title bar is draggable;
the content area uses normal cursors (`text`, `default`, `pointer`)
and interacts as expected.

When this comes up: introduce a dedicated `WindowHeader` subcomponent
that owns the drag handle. The body of the Window stops being a drag
target.

### Persistence

After T4, the position of a moved Window is lost on page reload
(the `helloNote` is re-created with its initial position). This is
expected behavior for "Hello, Cork" (level 2 prototype), which is
about validating the drag interaction.

Persistence is a major design decision deferred to a later milestone:

- localStorage: simple, client-only, no auth needed
- IndexedDB: more capacity, more complex
- Backend with user account: real, multi-device, requires auth

Each option has different consequences for the user model and the
network architecture (agenda.zone). To be decided when the first
real persistence need arises.

### Accessibility refinements

The default `@dnd-kit/core` keyboard sensor (Tab → Enter to grab →
arrows to move → Enter to release) works as designed. However, full
accessibility for Corkos as a framework requires more than the
defaults:

- Screen reader announcements when a Window is grabbed, moved, or
  released
- Visible focus indicators that meet WCAG contrast requirements
- A "simple mode" alternative for users with cognitive disabilities,
  per principle 3 of CLAUDE.md
- Keyboard shortcuts for common operations beyond drag

This is a dedicated future workstream, not an incremental polish
of T4.

### CSS distribution from framework packages

`@corkos/desktop` co-locates component CSS with its TypeScript files
(e.g. `import './window.css'` inside `window.tsx`). This works
seamlessly today because `package.json` has `"main": "./src/index.ts"`:
consumers resolve the package source through the workspace symlink,
and their bundler (Vite in `apps/playground`) handles the CSS import
natively.

Two known costs and one deferred decision flow from this setup:

**Cost 1 — Consumer ambient declarations.** Every consumer that
type-checks through `@corkos/desktop` must declare `*.css` modules
itself, because the package's own `styles.d.ts` is internal to its
compilation unit and is not exported. Today this means
`apps/playground/src/styles.d.ts` duplicates that declaration. Any
future consumer will have to do the same.

**Cost 2 — `tsc --build` does not copy CSS to `dist/`.** When we
switch `@corkos/desktop` to publish from `./dist/index.js` instead of
source, the `.css` files will be missing from the published package
and consumers will get broken imports.

**Deferred decision.** Following principle 6 ("extract, don't
predict"), we have not built a publish pipeline yet. When publishing
becomes a concrete need, the likely resolution is:

- A build step (small esbuild or rollup script) that emits `.js` and
  `.d.ts` and copies `.css` files alongside.
- An `exports` field in `package.json` mapping the CSS subpaths
  explicitly, so consumers can `import '@corkos/desktop/window.css'`
  if they prefer that style.
- Re-evaluating whether each consumer still needs its own ambient
  `*.css` declaration once types are properly exported.

Triggered by: the first need to publish `@corkos/desktop` to npm, or
the first external consumer that cannot use the workspace symlink.
