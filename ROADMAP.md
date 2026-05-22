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

### External theming ecosystem

Corkos is being designed so that authoring an external theme (e.g.
"Windows 95 classic", "Apple System 1", "Xerox Star inspired",
"macOS modern") is a tractable CSS exercise, not a fork of the
framework.

The convention is established in CLAUDE.md (see "Styling
conventions"): any visually-customizable property is declared as
a `--corkos-*` custom property with a visible default. External
themes override these variables; they do not modify framework CSS.

**Today's reality:** the framework ships sober, neutral defaults
and exposes its custom properties. No theme packages exist. No
formal theme API exists.

**Anticipated work when external themes become a concrete need:**

- Decide packaging convention for themes (e.g. `@corkos-themes/win95`
  as separate npm packages, or a `@corkos/themes` umbrella package
  with subpaths).
- Decide application convention (class on root container, attribute
  selector, CSS layer, or other).
- Document the full public API of custom properties as part of
  Corkos's published reference.
- Establish semver discipline for custom property names (renaming
  or removing a variable becomes a breaking change of the framework).

Triggered by: the first concrete need for a theme beyond the
defaults — whether driven by agenda.madrid, by a contributor, or by
an explicit design milestone.

**Discipline today:** every CSS file added to Corkos must consider
whether each property could be reasonably customized by a theme. If
yes, it becomes a custom property. If no, it stays hard-coded. This
is preventive design, not speculative implementation: we are not
building the theme system, we are making sure it can be built later
without refactoring what exists.

### Dragging class cleanup on DndContext unmount

The `corkos-dragging` body class is currently applied by playground
handlers wired to `DndContext` (`onDragStart`/`onDragEnd`/
`onDragCancel`). If the `DndContext` is ever placed under conditional
logic — for example, inside a `Workspace` component that mounts and
unmounts — a component unmount during an active drag would leave the
class orphaned on the body, and any subsequent cursor would remain
stuck as `grabbing` until the page is reloaded.

Resolution when the case appears: add a `useEffect` cleanup in the
component that owns these handlers, ensuring the class is removed
on unmount.

Triggered by: extracting `DndContext` setup into a conditionally
mounted component (most likely a `Workspace` envelope in
`@corkos/desktop`, when a second consumer makes the extraction
worthwhile).

### Focus integration with browser history

The focus model from block 2 lives only in memory. It does not
generate browser-history entries and is not reflected in the URL.
The Corkos vision contemplates deep linking of workspace state
(CLAUDE.md, "Vision" section and glossary): a URL that restores
which notes are open, at what position, and which one is focused.

When this is tackled, the open questions are:

- What workspace-state information is encoded in the URL (which
  notes, positions, which one focused).
- Which focus changes push a new history entry vs which replace
  the current one.
- How this reconciles with persistence (Phase 4) when it exists:
  if the URL contradicts the last saved state, which one wins.
- How the initial case is treated: when the page loads with
  persisted focus, does that count as a history entry?

Triggered by: the first concrete use case that requires shareable
URLs of workspace state, or when deep linking is tackled as a
milestone of its own.

### Persisting focusOrder, not just the notes

When persistence (Phase 4) is tackled, the minimum state to
persist includes both `notes` and `focusOrder`. Persisting only
`notes` loses the visual order between sessions: notes would
restore flat, without remembering which one was raised above
which.

The visually-focused note on load is none: starting a new session
does not render a focus affordance until the user interacts, even
if `focusOrder` was restored from the last saved state. The last
item of `focusOrder` represents the most recent note that had
focus, not the note shown focused on load.

Triggered by: Phase 4, persistence.

### Typed notes with their own internal state

The current `Note` type models a generic note with id, title, and
position. Anticipated use cases of consumer applications (e.g.
agenda.madrid: a search note with criteria and results, a concert
note with event data, a venue note with location info) require
notes to have a discriminated type and their own type-specific
internal state. This state must survive minimization (Principle 2:
the system supports more than it implements) but is destroyed when
the note is closed.

When this is tackled, the open questions are:

- How to model the Note variant (discriminated union vs generic
  slot vs extensible record).
- Where the type-specific state lives (in core as opaque data vs
  in each consumer).
- How it is serialized for persistence (Phase 4).
- How it interacts with minimize (state preserved) and close
  (state destroyed).

Triggered by: the first consumer application that needs note types
with their own state. Almost certainly agenda.madrid when it
builds its first note type beyond "plain text".
