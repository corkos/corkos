import type { Note, Position } from './note.types';

export function createNote(title: string, position: Position): Note {
  if (title.trim() === '') {
    throw new Error('createNote: title must not be empty');
  }
  return {
    id: crypto.randomUUID(),
    title,
    position,
  };
}
