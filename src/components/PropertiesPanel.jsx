import useStore from '../store/useStore';

export default function PropertiesPanel() {
  const elements = useStore((s) => s.elements);
  const selectedIds = useStore((s) => s.selectedIds);
  const updateElementWithHistory = useStore((s) => s.updateElementWithHistory);
  const deleteElements = useStore((s) => s.deleteElements);
  const duplicateElements = useStore((s) => s.duplicateElements);

  if (selectedIds.length === 0) {
    return (
      <div className="properties-panel">
        <div className="panel-title">Properties</div>
        <p className="panel-hint">Select an element to edit its properties</p>
      </div>
    );
  }

  if (selectedIds.length > 1) {
    return (
      <div className="properties-panel">
        <div className="panel-title">Properties</div>
        <p className="panel-hint">{selectedIds.length} elements selected</p>
        <div className="panel-actions">
          <button className="action-btn delete" onClick={() => deleteElements(selectedIds)}>
            Delete All
          </button>
          <button className="action-btn" onClick={() => duplicateElements(selectedIds)}>
            Duplicate All
          </button>
        </div>
      </div>
    );
  }

  const element = elements.find((el) => el.id === selectedIds[0]);
  if (!element) return null;

  const handleChange = (key, value) => {
    updateElementWithHistory(element.id, { [key]: value });
  };

  return (
    <div className="properties-panel">
      <div className="panel-title">Properties</div>

      <div className="prop-section">
        <div className="prop-section-title">Position</div>
        <div className="prop-row">
          <label>X</label>
          <input
            type="number"
            value={Math.round(element.x || 0)}
            onChange={(e) => handleChange('x', Number(e.target.value))}
          />
        </div>
        <div className="prop-row">
          <label>Y</label>
          <input
            type="number"
            value={Math.round(element.y || 0)}
            onChange={(e) => handleChange('y', Number(e.target.value))}
          />
        </div>
      </div>

      {element.type !== 'text' && (
        <div className="prop-section">
          <div className="prop-section-title">Size</div>
          <div className="prop-row">
            <label>W</label>
            <input
              type="number"
              value={Math.round(element.width || 0)}
              onChange={(e) => handleChange('width', Number(e.target.value))}
            />
          </div>
          <div className="prop-row">
            <label>H</label>
            <input
              type="number"
              value={Math.round(element.height || 0)}
              onChange={(e) => handleChange('height', Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="prop-section">
        <div className="prop-section-title">Transform</div>
        <div className="prop-row">
          <label>Rotation</label>
          <input
            type="number"
            value={Math.round(element.rotation || 0)}
            onChange={(e) => handleChange('rotation', Number(e.target.value))}
          />
        </div>
        <div className="prop-row">
          <label>Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={element.opacity ?? 1}
            onChange={(e) => handleChange('opacity', Number(e.target.value))}
          />
          <span className="prop-value">{Math.round((element.opacity ?? 1) * 100)}%</span>
        </div>
      </div>

      {element.type !== 'image' && (
        <div className="prop-section">
          <div className="prop-section-title">Fill</div>
          <div className="prop-row">
            <label>Color</label>
            <input
              type="color"
              value={element.fill || '#000000'}
              onChange={(e) => handleChange('fill', e.target.value)}
            />
            <span className="prop-value">{element.fill}</span>
          </div>
        </div>
      )}

      {(element.type === 'rect' || element.type === 'circle') && (
        <div className="prop-section">
          <div className="prop-section-title">Stroke</div>
          <div className="prop-row">
            <label>Color</label>
            <input
              type="color"
              value={element.stroke || '#000000'}
              onChange={(e) => handleChange('stroke', e.target.value)}
            />
          </div>
          <div className="prop-row">
            <label>Width</label>
            <input
              type="number"
              min="0"
              value={element.strokeWidth || 0}
              onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {element.type === 'rect' && (
        <div className="prop-section">
          <div className="prop-section-title">Corner Radius</div>
          <div className="prop-row">
            <label>Radius</label>
            <input
              type="number"
              min="0"
              value={element.cornerRadius || 0}
              onChange={(e) => handleChange('cornerRadius', Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {element.type === 'text' && (
        <div className="prop-section">
          <div className="prop-section-title">Text</div>
          <div className="prop-row">
            <label>Content</label>
            <input
              type="text"
              value={element.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
            />
          </div>
          <div className="prop-row">
            <label>Font Size</label>
            <input
              type="number"
              min="8"
              value={element.fontSize || 24}
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
            />
          </div>
          <div className="prop-row">
            <label>Font</label>
            <select
              value={element.fontFamily || 'Arial'}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div className="prop-row">
            <label>Width</label>
            <input
              type="number"
              min="20"
              value={element.width || 200}
              onChange={(e) => handleChange('width', Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="panel-actions">
        <button className="action-btn delete" onClick={() => deleteElements([element.id])}>
          Delete
        </button>
        <button className="action-btn" onClick={() => duplicateElements([element.id])}>
          Duplicate
        </button>
      </div>
    </div>
  );
}
