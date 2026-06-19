import { useState } from 'react';
import useStore from '../store/useStore';

export default function useMarqueeSelection() {
  const elements = useStore((s) => s.elements);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null);

  const startSelection = (pos, shiftKey) => {
    if (!shiftKey) {
      setSelectedIds([]);
    }
    setIsSelecting(true);
    setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
  };

  const updateSelection = (pos) => {
    setSelectionRect((prev) => ({ ...prev, x2: pos.x, y2: pos.y }));
  };

  const finishSelection = () => {
    if (!isSelecting || !selectionRect) {
      setIsSelecting(false);
      return;
    }
    setIsSelecting(false);

    const { x1, y1, x2, y2 } = selectionRect;
    const box = {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    };

    if (box.width < 5 && box.height < 5) {
      setSelectionRect(null);
      return;
    }

    const selected = elements.filter((el) => {
      const elBox = { x: el.x, y: el.y, width: el.width || 100, height: el.height || 50 };
      return (
        elBox.x < box.x + box.width &&
        elBox.x + elBox.width > box.x &&
        elBox.y < box.y + box.height &&
        elBox.y + elBox.height > box.y
      );
    });
    setSelectedIds(selected.map((el) => el.id));
    setSelectionRect(null);
  };

  return { isSelecting, selectionRect, startSelection, updateSelection, finishSelection };
}
