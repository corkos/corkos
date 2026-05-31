import { NotesProvider, Window, Workspace, useNotes } from '@corkos/desktop';

import { PlaygroundPanel } from './playground-panel';

function Notes() {
  const { notes, focusOrder, moveNote, focusNote, deleteNote } = useNotes();

  return (
    <Workspace>
      {notes.map((note) => (
        <Window
          key={note.id}
          note={note}
          focusOrder={focusOrder}
          onMove={(newPosition) => moveNote(note.id, newPosition)}
          onFocus={() => focusNote(note.id)}
          onClose={() => deleteNote(note.id)}
        >
          {note.body}
        </Window>
      ))}
    </Workspace>
  );
}

export function App() {
  return (
    <NotesProvider>
      <Notes />
      <PlaygroundPanel />
    </NotesProvider>
  );
}
