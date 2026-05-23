import { useCallback, useMemo, useState } from 'react';

import type { CreateNoteOptions, NotesState, Position } from '@corkos/core';
import {
  createNote as createNoteCore,
  focusNote as focusNoteCore,
  moveNote as moveNoteCore,
} from '@corkos/core';

export function useNotes() {
  const [state, setState] = useState<NotesState>(() => ({
    notes: [],
    focusOrder: [],
    nextId: 1,
  }));

  const createNote = useCallback((options: CreateNoteOptions = {}) => {
    setState((current) => createNoteCore(current, options));
  }, []);

  const moveNote = useCallback((id: string, newPosition: Position) => {
    setState((current) => moveNoteCore(current, id, newPosition));
  }, []);

  const focusNote = useCallback((id: string) => {
    setState((current) => focusNoteCore(current, id));
  }, []);

  const focusedId = useMemo(
    () => state.focusOrder[state.focusOrder.length - 1] ?? null,
    [state.focusOrder],
  );

  return {
    notes: state.notes,
    focusOrder: state.focusOrder,
    focusedId,
    createNote,
    moveNote,
    focusNote,
  };
}
