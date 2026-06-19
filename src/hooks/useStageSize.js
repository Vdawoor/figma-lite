import { useRef, useEffect, useState } from 'react';

export default function useStageSize() {
  const containerRef = useRef();
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return { stageSize, containerRef };
}
