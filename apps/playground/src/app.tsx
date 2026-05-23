import { createNote } from '@corkos/core';
import { Window, Workspace, useNotes } from '@corkos/desktop';

const initialNotes = [
  createNote('Hello, Cork', { x: 100, y: 100 }),
  createNote('Segunda nota', { x: 180, y: 160 }),
  createNote('Tercera nota', { x: 260, y: 220 }),
];

export function App() {
  const { notes, focusOrder, moveNote, focusNote } = useNotes(initialNotes);

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
