import { useRef, useEffect } from 'react';
import { Rect, Transformer } from 'react-konva';
import useStore from '../store/useStore';

export default function Artboard({ artboardSelected, setArtboardSelected }) {
  const artboard = useStore((s) => s.artboard);
  const setArtboard = useStore((s) => s.setArtboard);
  const setSelectedIds = useStore((s) => s.setSelectedIds);

  const artboardRef = useRef();
  const artboardTrRef = useRef();

  useEffect(() => {
    if (!artboardTrRef.current) return;
    if (artboardSelected && artboardRef.current) {
      artboardTrRef.current.nodes([artboardRef.current]);
    } else {
      artboardTrRef.current.nodes([]);
    }
    artboardTrRef.current.getLayer()?.batchDraw();
  }, [artboardSelected, artboard]);

  if (!artboard) return null;

  return (
    <>
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
      <Transformer
        ref={artboardTrRef}
        rotateEnabled={false}
        enabledAnchors={[
          'top-left', 'top-center', 'top-right',
          'middle-left', 'middle-right',
          'bottom-left', 'bottom-center', 'bottom-right',
        ]}
        borderStroke="#000000"
        borderStrokeWidth={1.5}
        anchorStroke="#000000"
        anchorFill="#fff"
        anchorSize={8}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 50 || newBox.height < 50) return oldBox;
          return newBox;
        }}
      />
    </>
  );
}
