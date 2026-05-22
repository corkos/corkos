import { useRef } from 'react';
import type { ReactNode } from 'react';

import { useDndMonitor, useDraggable } from '@dnd-kit/core';

import type { Note, Position } from '@corkos/core';

import './window.css';

type WindowProps = {
  note: Note;
  focusOrder?: readonly string[];
  onMove?: (newPosition: Position) => void;
  onFocus?: () => void;
  children?: ReactNode;
};

const EMPTY_FOCUS_ORDER: readonly string[] = [];

export function Window({
  note,
  focusOrder = EMPTY_FOCUS_ORDER,
  onMove,
  onFocus,
  children,
}: WindowProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: note.id });
  const baseRef = useRef<Position | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      if (event.active.id === note.id) {
        baseRef.current = note.position;
        onFocus?.();
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

  const focusIndex = focusOrder.indexOf(note.id);
  const zIndex = focusIndex === -1 ? 0 : focusIndex + 1;
  const isFocused = focusOrder.length > 0 && focusOrder[focusOrder.length - 1] === note.id;
  const className = isFocused ? 'corkos-window corkos-window--focused' : 'corkos-window';

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{ left: note.position.x, top: note.position.y, zIndex }}
      onClick={onFocus}
    >
      <div className="corkos-window__header" {...listeners} {...attributes}>
        <h3 className="corkos-window__title">{note.title}</h3>
      </div>
      <div className="corkos-window__body">{children}</div>
    </div>
  );
}
