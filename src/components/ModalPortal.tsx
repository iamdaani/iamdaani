'use client';

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
}

/**
 * Renders children into a DOM node appended to document.body.
 * This is useful for modals and other UI that should visually
 * break out of the parent component tree.
 */
export default function ModalPortal({ children }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [portalElement] = useState(() => {
    const el = document.createElement('div');
    el.id = 'modal-root';
    return el;
  });

  useEffect(() => {
    document.body.appendChild(portalElement);
    setMounted(true);

    return () => {
      document.body.removeChild(portalElement);
    };
  }, [portalElement]);

  if (!mounted) return null;

  return createPortal(children, portalElement);
}
