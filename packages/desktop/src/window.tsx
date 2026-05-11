import type { Note } from '@corkos/core';

import './window.css';

type WindowProps = {
  note: Note;
};

export function Window({ note }: WindowProps) {
  return (
    <div className="corkos-window" style={{ left: note.position.x, top: note.position.y }}>
      <div className="corkos-window__title">{note.title}</div>
    </div>
  );
}
