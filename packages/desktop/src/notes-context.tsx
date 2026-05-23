import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { CreateNoteOptions, Note, NotesState, Position } from '@corkos/core';
import {
  createNote as createNoteCore,
  focusNote as focusNoteCore,
  moveNote as moveNoteCore,
} from '@corkos/core';

type NotesContextValue = {
  readonly notes: readonly Note[];
  readonly focusOrder: readonly string[];
  readonly focusedId: string | null;
  readonly createNote: (options?: CreateNoteOptions) => void;
  readonly moveNote: (id: string, newPosition: Position) => void;
  readonly focusNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextValue | null>(null);

type NotesProviderProps = {
  children: ReactNode;
};

export function NotesProvider({ children }: NotesProviderProps) {
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

  const value = useMemo<NotesContextValue>(
    () => ({
      notes: state.notes,
      focusOrder: state.focusOrder,
      focusedId,
      createNote,
      moveNote,
      focusNote,
    }),
    [state.notes, state.focusOrder, focusedId, createNote, moveNote, focusNote],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes(): NotesContextValue {
  const value = useContext(NotesContext);
  if (value === null) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return value;
}
