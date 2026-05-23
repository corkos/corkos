import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { DndContext } from '@dnd-kit/core';

import './workspace.css';

type WorkspaceProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const DRAGGING_CLASS = 'corkos-dragging';

export function Workspace({ children, className, style }: WorkspaceProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const addDraggingClass = () => {
    rootRef.current?.classList.add(DRAGGING_CLASS);
  };

  const removeDraggingClass = () => {
    rootRef.current?.classList.remove(DRAGGING_CLASS);
  };

  // Defensive cleanup: if the Workspace unmounts mid-drag, the dragging
  // class is stripped from the root element before it leaves the tree.
  useEffect(() => {
    return () => {
      rootRef.current?.classList.remove(DRAGGING_CLASS);
    };
  }, []);

  const composedClassName = ['corkos-workspace', className].filter(Boolean).join(' ');

  return (
    <DndContext
      onDragStart={addDraggingClass}
      onDragEnd={removeDraggingClass}
      onDragCancel={removeDraggingClass}
    >
      <div ref={rootRef} className={composedClassName} style={style}>
        {children}
      </div>
    </DndContext>
  );
}
