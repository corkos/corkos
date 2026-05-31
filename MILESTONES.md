# Corkos — Milestones

This document outlines the planned phases of Corkos development,
from the current state to the first published version (v1.0.0) and
beyond. Each milestone represents a verifiable, demonstrable state
of the product, marked with a Git tag.

This is a living document. Phase order may shift based on emerging
needs; phases may be paused or extended; new phases may appear.
The document captures the current best plan, not a contract.

## Phase 1 — Hello, Cork ✅

**Tag**: `v0.1.0-hello-cork`

**Demonstrable**: a single yellow note is rendered on screen,
draggable with mouse and keyboard.

- Note and Position types in @corkos/core
- Window component in @corkos/desktop
- Playground app with Vite
- Drag-and-drop integration with dnd-kit
- State integration via useNotes hook

## Phase 2 — Window structure ✅

**Tag**: (not tagged; can be retrospectively tagged as `v0.2.0-window-structure`)

**Demonstrable**: the Window has a clear internal structure with
a draggable header and a body that holds content. The styling is
fully theme-ready via CSS Custom Properties.

- Internal header/body structure
- 21 CSS Custom Properties (`--corkos-*`) as the public theming
  contract
- Selective drag (header is the handle, body is not)
- Consistent cursor during active drag
- Children prop in Window for body content

## Phase 3 — Functional cork board 🔜

**Anticipated tag**: `v0.3.0-cork-board`

**Demonstrable**: multiple notes coexist on the workspace; the
user can create new ones and remove them; the active note comes
to the front. Corkos stops being "a note" and becomes "a cork
board".

- Multiple notes managed via useNotes
- Note creation (likely click on workspace background)
- Note removal
- Focus / z-index management (the active note rises)
- Workspace component as the DndContext envelope (likely in
  @corkos/desktop, replacing the playground-mounted DndContext)

### Block decomposition (current plan)

Phase 3 is split into five blocks of work, each producing one or
two clean commits. Order respects dependencies: model before
render, focus before creation, Workspace envelope before adding
logic to it.

1. **Plural model + plural render** ✅ — `useNotes` and the
   underlying core operations support an array of notes; the
   playground renders N notes from a seed. Single commit possible.

2. **Focus and z-index** ✅ — active note rises to the front. Focus
   model in `@corkos/core`, z-index applied in `@corkos/desktop`.
   Click on a note focuses it; starting drag implicitly focuses
   the dragged note.

3. **Workspace component** ✅ — extract `DndContext` from the
   playground into a `Workspace` component in `@corkos/desktop`.
   The playground stops mounting `DndContext` directly; it uses
   `<Workspace>` and renders notes inside it. This block
   activates the ROADMAP watch-item on dragging class cleanup
   (its "Triggered by" condition is met).

4. **Note creation** ✅ — the `createNote` state operation lives in
   `@corkos/core` and is exposed via `useNotes`. Corkos does not
   impose any gesture on the `Workspace` background; the
   playground demonstrates the operation with its own
   `PlaygroundPanel`, which mounts an explicit trigger and tracks
   a local cascade position. Shared workspace state is provided by
   a new `NotesProvider` context in `@corkos/desktop`.

5. **Note deletion** ✅ — `deleteNote` lives in `@corkos/core` as
   a pure operation that filters the note and its `focusOrder`
   entry, leaving `nextId` untouched. `useNotes` exposes it in
   `@corkos/desktop`. `Window` gains a `closable` prop (default
   `true`) and an `onClose` callback; when closable, the header
   renders an accessible ✕ button (`<button>`, descriptive
   `aria-label`, visible focus ring) themable through new
   `--corkos-window-close-*` custom properties. The
   `PlaygroundPanel` exercises the operation from outside the
   note by rendering one "Delete note N" trigger per existing
   note. Accessibility topics raised by this block (focus
   restoration after destructive operations, simple-mode
   deletion, keyboard shortcuts) are deferred to Phase 6 and
   tracked as ROADMAP watch-items.

Phase closure (verify deliverables, capture findings in ROADMAP,
tag `v0.3.0-cork-board`) follows the established ritual and is
not counted as a separate block.

This decomposition is the current best plan; blocks may merge or
split as work reveals new structure. Deviations are discussed
before applying.

## Phase 4 — Persistence 🔜

**Anticipated tag**: `v0.4.0-persistence`

**Demonstrable**: notes survive a page reload. The cork board
remembers its state.

- Architectural decision: localStorage / IndexedDB / backend
- Hook for persisted state (e.g. `usePersistedNotes`)
- Serialization of cork board state
- Restoration on page load

This phase requires a major design decision about the user model
(anonymous local vs authenticated multi-device). Resolution depends
on the broader direction of agenda.zone.

## Phase 5 — Editable notes 🔜

**Anticipated tag**: `v0.5.0-editable-notes`

**Demonstrable**: notes have editable titles and bodies.
Interactions with content do not interfere with drag.

- In-place editing of the title
- Plain text editing of the body
- Final activation of WindowHeader as the exclusive drag handle
  (resolves a ROADMAP watch-item)
- Cursor adapts to context (`text` in body, `grab` on header)

## Phase 6 — Accessibility 🔜

**Anticipated tag**: `v0.6.0-accessibility`

**Demonstrable**: Corkos is usable by users with motor, visual,
and cognitive disabilities. The "simple mode" of CLAUDE.md
Principle 3 is concrete.

- Screen reader announcements during drag, focus changes, note
  operations
- Visible focus indicators meeting WCAG contrast requirements
- Simple mode: alternative UI for users with cognitive
  disabilities
- Keyboard shortcuts for common operations beyond drag
- Documented accessibility contract

## Phase 7 — Mobile 🔜

**Anticipated tag**: `v0.7.0-mobile`

**Demonstrable**: Corkos works natively on mobile devices. The
@corkos/mobile package is no longer empty.

- Architectural decision: paradigm for mobile (springboard?
  full-screen views? both?)
- Note and equivalent components for mobile
- Springboard component (mobile counterpart of Workspace)
- Verified on real devices, not only emulators

## Phase 8 — External theming 🔜

**Anticipated tag**: `v0.8.0-themes`

**Demonstrable**: a third party can author a Corkos theme from
CSS alone, without forking or modifying the framework.

- Published reference of all `--corkos-*` custom properties
- Example external theme (e.g. `@corkos-themes/win95-inspired`)
- Validation from outside the repo
- Confirmation that creating a theme does not require touching
  framework CSS

## Phase 9 — First npm release 🔜

**Anticipated tag**: `v1.0.0`

**Demonstrable**: Corkos is installable via npm. The API is
considered stable. The community can adopt it.

- CSS distribution build pipeline (resolves a ROADMAP watch-item)
- Complete public documentation
- Versioning and breaking-change policy
- npm package names and scopes finalized
- First official release announcement

## Parallel — agenda.madrid

**Not tied to a Corkos tag.**

**Demonstrable**: agenda.madrid is a working instance of a
cultural agenda, built on top of Corkos.

agenda.madrid is the first concrete application of Corkos. It
can start as soon as Phase 3 lands (multiple notes is the
minimum useful base for an agenda); it does not need to wait for
v1.0.0. Building it in parallel serves as continuous validation
that Corkos works for its intended use case.

- Separate repository: agenda.madrid
- Corkos consumed as a dependency
- Data model for a cultural agenda (events, dates, locations)
- First functional screen
- Deployment to a public URL (TBD: corkos.dev/madrid,
  agenda.madrid, or other)
