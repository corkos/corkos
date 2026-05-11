import { createNote } from '@corkos/core';
import { Window } from '@corkos/desktop';

const helloNote = createNote('Hello, Cork', { x: 100, y: 100 });

export function App() {
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
      <Window note={helloNote} />
    </div>
  );
}
