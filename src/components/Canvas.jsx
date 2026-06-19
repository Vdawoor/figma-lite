import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Group, Rect, Circle, Text, Image, Transformer } from 'react-konva';
import useStore from '../store/useStore';
import useImage from '../hooks/useImage';


function ImageElement({ element, onSelect, onChange }) {
  const shapeRef = useRef();
  const [image] = useImage(element.src);

  return (
    <Image
      ref={shapeRef}
      id={element.id}
      image={image}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation || 0}
      opacity={element.opacity ?? 1}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        });
      }}
    />
  );
}

function TextElement({ element, onSelect, onChange, onDblClick }) {
  const shapeRef = useRef();

  return (
    <Text
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      text={element.text}
      fontSize={element.fontSize || 24}
      fontFamily={element.fontFamily || 'Arial'}
      fill={element.fill}
      width={element.width}
      rotation={element.rotation || 0}
      opacity={element.opacity ?? 1}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onDblClick}
      onDblTap={onDblClick}
      onDragEnd={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          rotation: node.rotation(),
        });
      }}
    />
  );
}

function RectElement({ element, onSelect, onChange }) {
  const shapeRef = useRef();

  return (
    <Rect
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth || 0}
      rotation={element.rotation || 0}
      opacity={element.opacity ?? 1}
      cornerRadius={element.cornerRadius || 0}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        });
      }}
    />
  );
}

function CircleElement({ element, onSelect, onChange }) {
  const shapeRef = useRef();
  const radiusX = element.width / 2;
  const radiusY = element.height / 2;

  return (
    <Circle
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      radiusX={radiusX}
      radiusY={radiusY}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth || 0}
      rotation={element.rotation || 0}
      opacity={element.opacity ?? 1}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        });
      }}
    />
  );
}

export default function Canvas({ stageRef }) {
  const elements = useStore((s) => s.elements);
  const selectedIds = useStore((s) => s.selectedIds);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const toggleSelection = useStore((s) => s.toggleSelection);
  const updateElementWithHistory = useStore((s) => s.updateElementWithHistory);
  const artboard = useStore((s) => s.artboard);
  const setArtboard = useStore((s) => s.setArtboard);

  const transformerRef = useRef();
  const artboardRef = useRef();
  const artboardTrRef = useRef();
  const containerRef = useRef();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [isDrawingArtboard, setIsDrawingArtboard] = useState(false);
  const [artboardDraft, setArtboardDraft] = useState(null);
  const [artboardSelected, setArtboardSelected] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    const stage = stageRef.current;
    const nodes = selectedIds
      .map((id) => stage.findOne('#' + id))
      .filter(Boolean);
    transformerRef.current.nodes(nodes);
    transformerRef.current.getLayer().batchDraw();
  }, [selectedIds, elements]);

  useEffect(() => {
    if (!artboardTrRef.current) return;
    if (artboardSelected && artboardRef.current) {
      artboardTrRef.current.nodes([artboardRef.current]);
    } else {
      artboardTrRef.current.nodes([]);
    }
    artboardTrRef.current.getLayer()?.batchDraw();
  }, [artboardSelected, artboard]);

  const handleStageMouseDown = (e) => {
    if (e.target !== e.target.getStage()) return;
    const pos = e.target.getStage().getPointerPosition();

    setArtboardSelected(false);

    if (!artboard) {
      setIsDrawingArtboard(true);
      setArtboardDraft({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
      return;
    }

    if (!e.evt.shiftKey) {
      setSelectedIds([]);
    }
    setIsSelecting(true);
    setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
  };

  const handleStageMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();

    if (isDrawingArtboard) {
      setArtboardDraft((prev) => ({ ...prev, x2: pos.x, y2: pos.y }));
      return;
    }

    if (!isSelecting) return;
    setSelectionRect((prev) => ({ ...prev, x2: pos.x, y2: pos.y }));
  };

  const handleStageMouseUp = () => {
    if (isDrawingArtboard && artboardDraft) {
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
      setIsDrawingArtboard(false);
      setArtboardDraft(null);
      return;
    }

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

  const handleSelect = (e, element) => {
    setArtboardSelected(false);
    if (e.evt.shiftKey) {
      toggleSelection(element.id);
    } else {
      setSelectedIds([element.id]);
    }
  };

  const handleTextDblClick = (element) => {
    const stage = stageRef.current;
    const textNode = stage.findOne('#' + element.id);
    if (!textNode) return;

    const textPosition = textNode.absolutePosition();
    const stageContainer = stage.container();
    const areaPosition = {
      x: stageContainer.offsetLeft + textPosition.x,
      y: stageContainer.offsetTop + textPosition.y,
    };

    setEditingText({
      id: element.id,
      x: areaPosition.x,
      y: areaPosition.y,
      text: element.text,
      fontSize: element.fontSize || 24,
      fontFamily: element.fontFamily || 'Arial',
      width: element.width || 200,
    });
    setSelectedIds([]);
  };

  const handleTextEdit = (e) => {
    setEditingText((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleTextEditEnd = () => {
    if (editingText) {
      updateElementWithHistory(editingText.id, { text: editingText.text });
      setEditingText(null);
    }
  };

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
            onDblClick={() => handleTextDblClick(element)}
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

  const drawingRect = artboardDraft
    ? {
        x: Math.min(artboardDraft.x1, artboardDraft.x2),
        y: Math.min(artboardDraft.y1, artboardDraft.y2),
        width: Math.abs(artboardDraft.x2 - artboardDraft.x1),
        height: Math.abs(artboardDraft.y2 - artboardDraft.y1),
      }
    : null;

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      style={{ cursor: !artboard ? 'crosshair' : 'default' }}
    >
      {!artboard && (
        <div className="artboard-hint">
          Draw your canvas — click and drag to create your design area
        </div>
      )}

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        style={{ background: '#e8e8e8' }}
      >
        <Layer>
          {artboard && (
            <Rect
              ref={artboardRef}
              x={artboard.x}
              y={artboard.y}
              width={artboard.width}
              height={artboard.height}
              fill="#ffffff"
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={12}
              shadowOffsetX={0}
              shadowOffsetY={2}
              cornerRadius={2}
              draggable
              onClick={(e) => {
                if (e.target === artboardRef.current) {
                  setArtboardSelected(true);
                  setSelectedIds([]);
                }
              }}
              onDragEnd={(e) => {
                setArtboard({
                  ...artboard,
                  x: e.target.x(),
                  y: e.target.y(),
                });
              }}
              onTransformEnd={() => {
                const node = artboardRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);
                setArtboard({
                  x: node.x(),
                  y: node.y(),
                  width: Math.max(50, node.width() * scaleX),
                  height: Math.max(50, node.height() * scaleY),
                });
              }}
            />
          )}

          {isDrawingArtboard && drawingRect && (
            <Rect
              x={drawingRect.x}
              y={drawingRect.y}
              width={drawingRect.width}
              height={drawingRect.height}
              fill="#ffffff"
              stroke="#e60023"
              strokeWidth={2}
              dash={[6, 4]}
              opacity={0.8}
              listening={false}
            />
          )}

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
          {artboard && elements.filter((el) => selectedIds.includes(el.id)).map(renderElement)}

          {isSelecting && selectionRect && (
            <Rect
              x={Math.min(selectionRect.x1, selectionRect.x2)}
              y={Math.min(selectionRect.y1, selectionRect.y2)}
              width={Math.abs(selectionRect.x2 - selectionRect.x1)}
              height={Math.abs(selectionRect.y2 - selectionRect.y1)}
              fill="rgba(230, 0, 35, 0.05)"
              stroke="#e60023"
              strokeWidth={1}
              dash={[4, 4]}
            />
          )}

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
          <Transformer
            ref={artboardTrRef}
            rotateEnabled={false}
            enabledAnchors={[
              'top-left', 'top-center', 'top-right',
              'middle-left', 'middle-right',
              'bottom-left', 'bottom-center', 'bottom-right',
            ]}
            borderStroke="#e60023"
            borderStrokeWidth={1.5}
            anchorStroke="#e60023"
            anchorFill="#fff"
            anchorSize={8}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 50 || newBox.height < 50) return oldBox;
              return newBox;
            }}
          />
        </Layer>
      </Stage>

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
          onChange={handleTextEdit}
          onBlur={handleTextEditEnd}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleTextEditEnd();
          }}
          autoFocus
        />
      )}

      {artboard && (
        <div className="artboard-size-label">
          {Math.round(artboard.width)} × {Math.round(artboard.height)} px
        </div>
      )}
    </div>
  );
}
