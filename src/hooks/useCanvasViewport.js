import { useState, useCallback, useEffect } from 'react';

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_STEP = 1.15;

export default function useCanvasViewport(stageRef) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);

  // Scroll-wheel zoom centered on cursor
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    let newScale = direction > 0 ? oldScale * ZOOM_STEP : oldScale / ZOOM_STEP;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  }, [stageRef]);

  // Space key toggles pan mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        setSpaceHeld(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpaceHeld(false);
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleDragStart = useCallback((e) => {
    // Only allow stage dragging when space is held or middle mouse
    if (e.target !== e.target.getStage()) return;
    if (!spaceHeld && e.evt.button !== 1) {
      e.target.stopDrag();
    }
  }, [spaceHeld]);

  const handleDragEnd = useCallback((e) => {
    if (e.target === e.target.getStage()) {
      setPosition({ x: e.target.x(), y: e.target.y() });
      setIsPanning(false);
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (spaceHeld || e.evt.button === 1) {
      setIsPanning(true);
    }
  }, [spaceHeld]);

  // Zoom to fit
  const zoomToFit = useCallback((artboard, stageWidth, stageHeight) => {
    if (!artboard) return;
    const padding = 60;
    const scaleX = (stageWidth - padding * 2) / artboard.width;
    const scaleY = (stageHeight - padding * 2) / artboard.height;
    const newScale = Math.min(scaleX, scaleY, 1);
    const newPos = {
      x: (stageWidth - artboard.width * newScale) / 2 - artboard.x * newScale,
      y: (stageHeight - artboard.height * newScale) / 2 - artboard.y * newScale,
    };
    setScale(newScale);
    setPosition(newPos);
  }, []);

  // Zoom in/out by button
  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, s * ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN_SCALE, s / ZOOM_STEP));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    scale,
    position,
    isPanning,
    spaceHeld,
    handleWheel,
    handleDragStart,
    handleDragEnd,
    handleMouseDown,
    zoomIn,
    zoomOut,
    resetZoom,
    zoomToFit,
  };
}
