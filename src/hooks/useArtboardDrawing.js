import { useState } from 'react';
import useStore from '../store/useStore';

export default function useArtboardDrawing() {
  const artboard = useStore((s) => s.artboard);
  const setArtboard = useStore((s) => s.setArtboard);
  const [isDrawingArtboard, setIsDrawingArtboard] = useState(false);
  const [artboardDraft, setArtboardDraft] = useState(null);

  const drawingRect = artboardDraft
    ? {
        x: Math.min(artboardDraft.x1, artboardDraft.x2),
        y: Math.min(artboardDraft.y1, artboardDraft.y2),
        width: Math.abs(artboardDraft.x2 - artboardDraft.x1),
        height: Math.abs(artboardDraft.y2 - artboardDraft.y1),
      }
    : null;

  const startDrawing = (pos) => {
    setIsDrawingArtboard(true);
    setArtboardDraft({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
  };

  const updateDrawing = (pos) => {
    setArtboardDraft((prev) => ({ ...prev, x2: pos.x, y2: pos.y }));
  };

  const finishDrawing = () => {
    if (artboardDraft) {
      const { x1, y1, x2, y2 } = artboardDraft;
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);

      if (width >= 50 && height >= 50) {
        setArtboard({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width,
          height,
        });
      }
    }
    setIsDrawingArtboard(false);
    setArtboardDraft(null);
  };

  return { isDrawingArtboard, drawingRect, startDrawing, updateDrawing, finishDrawing };
}
