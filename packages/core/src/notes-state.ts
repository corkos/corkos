import type { Position } from './note.types';
import type { NotesState } from './notes-state.types';

export class NoteNotFoundError extends Error {
  readonly noteId: string;

  constructor(noteId: string) {
    super(`Note not found: ${noteId}`);
    this.name = 'NoteNotFoundError';
    this.noteId = noteId;
  }
}

export function moveNote(state: NotesState, id: string, newPosition: Position): NotesState {
  let found = false;
  const notes = state.notes.map((note) => {
    if (note.id !== id) return note;
    found = true;
    return { ...note, position: newPosition };
  });
  if (!found) {
    throw new NoteNotFoundError(id);
  }
  return { ...state, notes };
}

export function focusNote(state: NotesState, id: string): NotesState {
  if (!state.notes.some((note) => note.id === id)) {
    throw new NoteNotFoundError(id);
  }
  const without = state.focusOrder.filter((entry) => entry !== id);
  return { ...state, focusOrder: [...without, id] };
}
