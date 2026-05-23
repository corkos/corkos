import { Window, Workspace, useNotes } from '@corkos/desktop';

export function App() {
  const { notes, focusOrder, moveNote, focusNote } = useNotes();

  return (
    <Workspace>
      {notes.map((note) => (
        <Window
          key={note.id}
          note={note}
          focusOrder={focusOrder}
          onMove={(newPosition) => moveNote(note.id, newPosition)}
          onFocus={() => focusNote(note.id)}
        >
          {`Cuerpo de la nota: ${note.title}`}
        </Window>
      ))}
    </Workspace>
  );
}
