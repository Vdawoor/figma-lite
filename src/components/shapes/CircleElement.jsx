import { useRef } from 'react';
import { Circle } from 'react-konva';

export default function CircleElement({ element, onSelect, onChange }) {
  const shapeRef = useRef();
  const radiusX = element.width / 2;
  const radiusY = element.height / 2;

  return (
    <Circle
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
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
