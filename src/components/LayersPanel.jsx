import { motion, Reorder } from 'framer-motion';
import useStore from '../store/useStore';

const typeIcons = {
  rect: '▬',
  circle: '●',
  text: 'T',
  image: '🖼',
};

function LayerItem({ element, index, isSelected, onSelect, onToggleVisibility }) {
  return (
    <Reorder.Item
      value={element}
      className={`layer-item ${isSelected ? 'selected' : ''}`}
      onClick={(e) => onSelect(e, element.id)}
      whileHover={{ backgroundColor: 'rgba(74, 144, 226, 0.1)' }}
    >
      <button
        className="visibility-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility(element.id);
        }}
        title={element.visible ? 'Hide' : 'Show'}
      >
        {element.visible ? '👁' : '👁‍🗨'}
      </button>
      <span className="layer-icon">{typeIcons[element.type] || '?'}</span>
      <span className="layer-name">
        {element.type === 'text'
          ? element.text?.substring(0, 15) || 'Text'
          : `${element.type} ${index + 1}`}
      </span>
    </Reorder.Item>
  );
}

export default function LayersPanel() {
  const elements = useStore((s) => s.elements);
  const selectedIds = useStore((s) => s.selectedIds);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const toggleSelection = useStore((s) => s.toggleSelection);
  const toggleVisibility = useStore((s) => s.toggleVisibility);
  const reorderElement = useStore((s) => s.reorderElement);

  const handleSelect = (e, id) => {
    if (e.shiftKey) {
      toggleSelection(id);
    } else {
      setSelectedIds([id]);
    }
  };

  const handleReorder = (newOrder) => {
    const oldOrder = elements;
    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i].id !== oldOrder[i].id) {
        const fromIndex = oldOrder.findIndex((el) => el.id === newOrder[i].id);
        reorderElement(fromIndex, i);
        break;
      }
    }
  };

  const reversedElements = [...elements].reverse();

  return (
    <div className="layers-panel">
      <div className="panel-title">Layers</div>
      {elements.length === 0 ? (
        <p className="panel-hint">No layers yet. Add elements using the toolbar.</p>
      ) : (
        <Reorder.Group
          axis="y"
          values={reversedElements}
          onReorder={(newOrder) => {
            const unreversed = [...newOrder].reverse();
            handleReorder(unreversed);
          }}
          className="layers-list"
        >
          {reversedElements.map((element, index) => (
            <LayerItem
              key={element.id}
              element={element}
              index={elements.length - 1 - index}
              isSelected={selectedIds.includes(element.id)}
              onSelect={handleSelect}
              onToggleVisibility={toggleVisibility}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
