import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Group, Rect, Transformer } from 'react-konva';
import useStore from '../store/useStore';
import useStageSize from '../hooks/useStageSize';
import useMarqueeSelection from '../hooks/useMarqueeSelection';
import useTextEditing from '../hooks/useTextEditing';
import useCanvasViewport from '../hooks/useCanvasViewport';
import Artboard from './Artboard';
import { RectElement, CircleElement, TextElement, ImageElement } from './shapes';

// Main canvas component — orchestrates stage, artboard, element rendering, and selection
export default function Canvas({ stageRef }) {
  const elements = useStore((s) => s.elements);
  const selectedIds = useStore((s) => s.selectedIds);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const toggleSelection = useStore((s) => s.toggleSelection);
  const updateElementWithHistory = useStore((s) => s.updateElementWithHistory);
  const artboard = useStore((s) => s.artboard);

  const { stageSize, containerRef } = useStageSize();
  const { isSelecting, selectionRect, startSelection, updateSelection, finishSelection } = useMarqueeSelection();
  const { editingText, startEditing, updateText, finishEditing } = useTextEditing(stageRef);
  const {
    scale, position, spaceHeld, isPanning,
    handleWheel, handleDragStart, handleDragEnd, handleMouseDown,
    zoomIn, zoomOut, resetZoom,
  } = useCanvasViewport(stageRef);

  const transformerRef = useRef();
  const [artboardSelected, setArtboardSelected] = useState(false);

  // Sync transformer handles to whichever elements are currently selected
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    const stage = stageRef.current;
    const nodes = selectedIds
      .map((id) => stage.findOne('#' + id))
      .filter(Boolean);
    transformerRef.current.nodes(nodes);
    transformerRef.current.getLayer().batchDraw();
  }, [selectedIds, elements]);

  const handleStageMouseDown = (e) => {
    // Let panning take over when space is held or middle-click
    if (spaceHeld || e.evt.button === 1) {
      handleMouseDown(e);
      return;
    }

    if (e.target !== e.target.getStage()) return;
    const pos = e.target.getStage().getPointerPosition();

    setArtboardSelected(false);
    startSelection(pos, e.evt.shiftKey);
  };

  const handleStageMouseMove = (e) => {
    if (!isSelecting) return;
    const pos = e.target.getStage().getPointerPosition();
    updateSelection(pos);
  };

  const handleStageMouseUp = () => {
    finishSelection();
  };

  // Shift-click adds to selection; plain click replaces it
  const handleSelect = (e, element) => {
    setArtboardSelected(false);
    if (e.evt.shiftKey) {
      toggleSelection(element.id);
    } else {
      setSelectedIds([element.id]);
    }
  };

  // Maps element type to its shape component — add new shape types here
  const renderElement = (element) => {
    if (!element.visible) return null;
    const isSelected = selectedIds.includes(element.id);

    switch (element.type) {
      case 'rect':
        return (
          <RectElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={(e) => handleSelect(e, element)}
            onChange={(attrs) => updateElementWithHistory(element.id, attrs)}
          />
        );
      case 'circle':
        return (
          <CircleElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={(e) => handleSelect(e, element)}
            onChange={(attrs) => updateElementWithHistory(element.id, attrs)}
          />
        );
      case 'text':
        return (
          <TextElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={(e) => handleSelect(e, element)}
            onChange={(attrs) => updateElementWithHistory(element.id, attrs)}
            onDblClick={() => startEditing(element)}
          />
        );
      case 'image':
        return (
          <ImageElement
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={(e) => handleSelect(e, element)}
            onChange={(attrs) => updateElementWithHistory(element.id, attrs)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      style={{ cursor: spaceHeld || isPanning ? 'grab' : 'default' }}
    >

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable={spaceHeld || isPanning}
        onWheel={handleWheel}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        style={{ background: '#e8e8e8' }}
      >
        <Layer>
          {/* Artboard (paper) with its own transformer */}
          <Artboard
            artboardSelected={artboardSelected}
            setArtboardSelected={setArtboardSelected}
          />

          {/* Clipped group: unselected elements are hidden if outside the artboard boundary */}
          {artboard && (
            <Group
              clipX={artboard.x}
              clipY={artboard.y}
              clipWidth={artboard.width}
              clipHeight={artboard.height}
            >
              {elements.filter((el) => !selectedIds.includes(el.id)).map(renderElement)}
            </Group>
          )}
          {/* Selected elements render outside the clip so they stay visible even if off-paper */}
          {artboard && elements.filter((el) => selectedIds.includes(el.id)).map(renderElement)}

          {/* Marquee selection rectangle */}
          {isSelecting && selectionRect && (
            <Rect
              x={Math.min(selectionRect.x1, selectionRect.x2)}
              y={Math.min(selectionRect.y1, selectionRect.y2)}
              width={Math.abs(selectionRect.x2 - selectionRect.x1)}
              height={Math.abs(selectionRect.y2 - selectionRect.y1)}
              fill="rgba(230, 0, 35, 0.05)"
              stroke="#000000"
              strokeWidth={1}
              dash={[4, 4]}
            />
          )}

          {/* Transformer for resizing/rotating selected elements */}
          {artboard && (
            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              enabledAnchors={[
                'top-left', 'top-center', 'top-right',
                'middle-left', 'middle-right',
                'bottom-left', 'bottom-center', 'bottom-right',
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>

      {/* Inline text editor overlay */}
      {editingText && (
        <textarea
          className="text-editor"
          style={{
            position: 'absolute',
            top: editingText.y + 'px',
            left: editingText.x + 'px',
            fontSize: editingText.fontSize + 'px',
            fontFamily: editingText.fontFamily,
            width: editingText.width + 'px',
            minHeight: '30px',
          }}
          value={editingText.text}
          onChange={updateText}
          onBlur={finishEditing}
          onKeyDown={(e) => {
            if (e.key === 'Escape') finishEditing();
          }}
          autoFocus
        />
      )}

      <div className="artboard-size-label">
        {Math.round(artboard.width)} × {Math.round(artboard.height)} px
      </div>

      {/* Zoom controls */}
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={zoomOut} title="Zoom out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button className="zoom-btn zoom-level" onClick={resetZoom} title="Reset zoom">
          {Math.round(scale * 100)}%
        </button>
        <button className="zoom-btn" onClick={zoomIn} title="Zoom in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
