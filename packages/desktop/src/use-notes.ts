import { useCallback, useState } from 'react';

import type { Note, Position } from '@corkos/core';
import { moveNote as moveNoteCore } from '@corkos/core';

export function useNotes(initialNotes: Note[]) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const moveNote = useCallback((id: string, newPosition: Position) => {
    setNotes((current) =>
      current.map((note) => (note.id === id ? moveNoteCore(note, newPosition) : note)),
    );
  }, []);

  return { notes, moveNote };
}
