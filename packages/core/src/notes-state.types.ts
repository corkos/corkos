import type { Note } from './note.types';

export type NotesState = {
  readonly notes: readonly Note[];
  readonly focusOrder: readonly string[];
  readonly nextId: number;
};
