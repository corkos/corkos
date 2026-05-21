import { useRef } from 'react';
import type { ReactNode } from 'react';

import { useDndMonitor, useDraggable } from '@dnd-kit/core';

import type { Note, Position } from '@corkos/core';

import './window.css';

type WindowProps = {
  note: Note;
  onMove?: (newPosition: Position) => void;
  children?: ReactNode;
};

export function Window({ note, onMove, children }: WindowProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: note.id });
  const baseRef = useRef<Position | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      if (event.active.id === note.id) {
        baseRef.current = note.position;
      }
    },
    onDragMove: (event) => {
      const base = baseRef.current;
      if (base === null) return;
      if (event.active.id !== note.id) return;
      onMove?.({
        x: base.x + event.delta.x,
        y: base.y + event.delta.y,
      });
    },
    onDragEnd: () => {
      baseRef.current = null;
    },
    onDragCancel: () => {
      baseRef.current = null;
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="corkos-window"
      style={{ left: note.position.x, top: note.position.y }}
    >
      <div className="corkos-window__header" {...listeners} {...attributes}>
        <h3 className="corkos-window__title">{note.title}</h3>
      </div>
      <div className="corkos-window__body">{children}</div>
    </div>
  );
}
