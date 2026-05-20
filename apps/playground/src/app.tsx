import { DndContext } from '@dnd-kit/core';

import { createNote } from '@corkos/core';
import { Window, useNotes } from '@corkos/desktop';

const initialNotes = [createNote('Hello, Cork', { x: 100, y: 100 })];

export function App() {
  const { notes, moveNote } = useNotes(initialNotes);
  const note = notes[0];

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f5f5f0',
        overflow: 'hidden',
      }}
    >
      <DndContext>
        {note && <Window note={note} onMove={(newPosition) => moveNote(note.id, newPosition)} />}
      </DndContext>
    </div>
  );
}
