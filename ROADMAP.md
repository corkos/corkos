# Corkos — Roadmap

This document tracks design decisions and improvements that are 
anticipated but deliberately deferred. Following the project's 
principle of "extract, don't predict", we capture ideas here rather 
than implementing them speculatively.

This is a living document. Items move from here to actual commits 
when a real need drives the work.

## Known issues

### Playground has unwanted scroll

The `apps/playground` viewport shows a small scroll due to default 
browser margins on `<body>`. Cosmetic only; does not affect drag 
or visual demonstration. To fix: minimal CSS reset on the playground 
container or the body.

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
