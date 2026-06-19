import { useState } from 'react';
import useStore from '../store/useStore';

export default function useTextEditing(stageRef) {
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const updateElementWithHistory = useStore((s) => s.updateElementWithHistory);
  const [editingText, setEditingText] = useState(null);

  const startEditing = (element) => {
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

  const updateText = (e) => {
    setEditingText((prev) => ({ ...prev, text: e.target.value }));
  };

  const finishEditing = () => {
    if (editingText) {
      updateElementWithHistory(editingText.id, { text: editingText.text });
      setEditingText(null);
    }
  };

  return { editingText, startEditing, updateText, finishEditing };
}
