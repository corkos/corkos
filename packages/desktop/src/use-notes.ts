import { useCallback, useMemo, useState } from 'react';

import type { NotesState, Position } from '@corkos/core';
import { focusNote as focusNoteCore, moveNote as moveNoteCore } from '@corkos/core';

export function useNotes() {
  const [state, setState] = useState<NotesState>(() => ({
    notes: [],
    focusOrder: [],
    nextId: 1,
  }));

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
    moveNote,
    focusNote,
  };
}
