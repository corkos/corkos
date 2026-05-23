import { useState } from 'react';

import { useNotes } from '@corkos/desktop';

import './playground-panel.css';

const CASCADE_ORIGIN = { x: 40, y: 40 };
const CASCADE_STEP = 20;

export function PlaygroundPanel() {
  const { createNote } = useNotes();
  const [cascadeIndex, setCascadeIndex] = useState(0);

  const handleCreate = () => {
    const position = {
      x: CASCADE_ORIGIN.x + cascadeIndex * CASCADE_STEP,
      y: CASCADE_ORIGIN.y + cascadeIndex * CASCADE_STEP,
    };
    createNote({ position });
    setCascadeIndex((current) => current + 1);
  };

  return (
    <aside className="playground-panel">
      <button type="button" className="playground-panel__trigger" onClick={handleCreate}>
        Create note
      </button>
    </aside>
  );
}
