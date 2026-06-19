import { useRef } from 'react';
import { Text } from 'react-konva';

export default function TextElement({ element, onSelect, onChange, onDblClick }) {
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
