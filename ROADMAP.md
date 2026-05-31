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

Corkos ships a baseline of accessibility primitives as part of the
work that introduces each component (the close button delivered in
Block 5 of Phase 3, for instance, uses `<button>`, an `aria-label`
including the note title, and a visible `:focus-visible` outline
themable via CSS variables). The default `@dnd-kit/core` keyboard
sensor (Tab → Enter to grab → arrows to move → Enter to release)
likewise works as designed. Beyond that baseline, Corkos needs a
dedicated, comprehensive accessibility pass — not an incremental
polish of any single component.

The umbrella scope of that pass includes, at minimum:

- Visible focus indicators across the framework that meet WCAG
  contrast requirements in every state, not only where they have
  been added opportunistically.
- A "simple mode" alternative for users with cognitive
  disabilities, per principle 3 of CLAUDE.md, designed as a whole
  rather than feature by feature.

Specific topics that surfaced during earlier blocks and that
benefit from being designed together with the broader keyboard
and screen-reader story are tracked as their own watch-items
below: focus restoration after destructive operations, simple
mode for note deletion, and keyboard shortcuts for note
operations. Screen-reader announcements during drag interactions
likewise belong in this workstream.

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

### Persisting focusOrder and the id counter, not just the notes

When persistence (Phase 4) is tackled, the minimum state to
persist includes `notes`, `focusOrder`, and the `nextId` counter
introduced by Block 4 of Phase 3.

Persisting only `notes` loses the visual order between sessions:
notes would restore flat, without remembering which one was raised
above which.

Persisting `notes` and `focusOrder` but resetting the id counter on
load is worse than it looks: the next note created after restore
would be assigned id `"1"`, colliding with any persisted note that
already holds that id. Collisions would silently corrupt
`focusOrder` and any other future reference held by id. The
counter must be persisted alongside the notes so that newly created
notes continue the sequence.

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

### Confinement of notes to the Workspace

Notes cannot end up at coordinates outside the rectangle of the
`Workspace`. Applies both to drag (position clamped on release) and
to creation (Block 4 will need to respect this).

Open question: should the clamping happen in `@corkos/core` (position
model rejects invalid coordinates) or in `@corkos/desktop` (drag
handler enforces bounds before persisting)?

Triggered by: Block 4 (note creation), or the first natural occasion
where a drag can carry a note to coordinates outside the viewport.

### Repositioning of notes on viewport resize

When the viewport resizes, notes that fall outside the new rectangle
of the `Workspace` must be repositioned to fall back inside.

Open questions: should this be eager (recompute on every resize
event) or lazy (only when needed)? Should the original positions be
remembered for restoration if the viewport grows back?

Triggered by: the first concrete report (internal or external) of
notes becoming unreachable after a resize, or when the automatic
desktop ↔ mobile switch is addressed in Phase 7.

### Automatic desktop ↔ mobile switch

The application transitions between desktop mode and mobile mode
according to a hierarchy of criteria: device capability (smartphones
always mobile), minimum viewport threshold (below it, mobile is
forced), and explicit user preference on devices that admit both
modes.

The minimum-viewport thresholds (width and height) must be defined.
The hierarchy must be revisited under principle 8 (minimal
intrusion): can the criterion be reduced to viewport only, with
manual override for the rest? Hypothesis to validate in Phase 7.

Triggered by: Phase 7 (Mobile).

### Preservation of desktop positions across mobile transitions

Note positions in desktop mode are preserved in the model even when
the application enters mobile mode (where they don't apply). When
the application returns to desktop, notes are restored to the
positions they had the last time desktop mode was active.

Focus, by contrast, is shared between modes: any focus change made
in mobile carries over to desktop and vice versa.

Triggered by: Phase 7 (Mobile), jointly with the automatic switch.

### Reachability of notes occluded by chrome

When chrome elements (taskbar, menus, springboard, panels) overlap
the `Workspace`, notes positioned behind them may become
unreachable. Resolution depends on the chrome at hand: a taskbar
might reserve a no-drop zone, a transient menu might not need any
treatment, etc. Decision deferred until concrete chrome appears.

Triggered by: the first appearance of chrome elements overlapping
the `Workspace`.

### License with ethical clauses

The repository currently declares MIT license in its README. The
compatibility of MIT with principle 8 (minimal intrusion and digital
sovereignty of the individual) is indirect: it relies on GDPR and
equivalent laws to cover what the license does not enforce.

Ethical licenses exist (Hippocratic License 3.0, Anti-996, others)
that condition use on behaviour compatible with human rights, but
lose the canonical "open source" label as defined by the OSI. The
final licence decision must be made before the first public npm
release, evaluating: scope of ethical clauses (privacy, human
rights, environment), impact on adoption, practical enforceability.

Triggered by: Phase 9 (first npm release).

### Focus restoration after keyboard deletion of the focused note

When the user activates the ✕ button with Enter or Space on the
focused note, that note is removed from the DOM and DOM focus
falls to the body. Decision 1 of Block 5 (Phase 3) defines which
note is logically focused after deletion (the previous one in
`focusOrder`, or none if the deleted note was the only one), but
nothing moves DOM focus there. The user must press Tab to return
to an operational point.

Resolution requires coordination between `@corkos/core` (which
note is now logically focused) and `@corkos/desktop` (which DOM
node to land focus on). Open questions:

- When at least one note remains: focus the ✕ button of the new
  focused note, the header as a whole, the body, or another
  canonical anchor?
- When no notes remain: focus the Workspace, the
  `PlaygroundPanel`, or another canonical landing point?
- How does `Window` expose its focusable nodes from outside
  (ref, callback, imperative handle)?
- Does this same mechanism serve other operations that destroy
  the focused element (future minimize, future move-to-another-
  board, etc.)?

The second question overlaps with the broader design of Tab
navigation in Corkos, which is why this is best resolved with
the full keyboard-navigation picture in view.

Triggered by: Phase 6 (Accessibility).

### Simple mode for note deletion

CLAUDE.md Principle 3 commits Corkos to a "simple mode" parallel
experience of equal dignity: linear navigation, predictable
flow, larger fonts, plain language, fewer simultaneous elements.
The deletion of notes in simple mode likely requires:

- Larger, more prominent close affordances.
- Explicit confirmation ("Are you sure you want to close this
  note?") instead of single-click destruction.
- Plain-language labels without abstract iconography.
- Undo or recovery mechanism, since confirmation alone may not
  be enough for users who cannot easily recover from a
  mis-click.

The concrete design depends on how simple mode is conceived as a
whole; deletion is one of several operations that must be
reconsidered through that lens.

Triggered by: Phase 6 (Accessibility), simple-mode workstream.

### Keyboard shortcuts for note operations

The ✕ button delivered in Block 5 (Phase 3) is activatable with
Enter and Space because it is a `<button>`; this is part of the
accessibility baseline. There are no OS-style keyboard shortcuts
yet (`Cmd+W` / `Ctrl+W` to close the focused note, equivalents
for create, focus next, focus previous, etc.) that would let a
keyboard-only user operate Corkos without tabbing to each
control.

Open questions:

- Which operations deserve shortcuts (close, create, cycle
  focus, minimize when it exists, etc.)?
- Platform convention: follow macOS (`Cmd`), Windows/Linux
  (`Ctrl`), or detect and adapt?
- Coexistence with browser shortcuts: `Cmd+W` closes the browser
  tab; can Corkos override it inside its viewport, and should
  it?
- How are shortcuts discovered by users (help panel, tooltips,
  documentation only)?
- How do shortcuts behave in simple mode (same, different,
  none)?

The decision benefits from having the full shortcut set
designed together, not piecemeal per operation.

Triggered by: Phase 6 (Accessibility).
