import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const tools = [
  { type: 'rect', label: 'Rectangle', icon: '▬' },
  { type: 'circle', label: 'Circle', icon: '●' },
  { type: 'text', label: 'Text', icon: 'T' },
  { type: 'image', label: 'Image', icon: '🖼' },
];

export default function Toolbar() {
  const addElement = useStore((s) => s.addElement);
  const artboard = useStore((s) => s.artboard);

  const handleAdd = (type) => {
    if (!artboard) return;

    const ax = artboard.x;
    const ay = artboard.y;

    if (type === 'image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          addElement({
            type: 'image',
            x: ax + 50,
            y: ay + 50,
            width: 200,
            height: 200,
            src: reader.result,
            rotation: 0,
            opacity: 1,
          });
        };
        reader.readAsDataURL(file);
      };
      input.click();
      return;
    }

    const defaults = {
      rect: { type: 'rect', x: ax + 80, y: ay + 80, width: 150, height: 100, fill: '#4A90D9', stroke: '#2C5F8A', strokeWidth: 0, rotation: 0, opacity: 1 },
      circle: { type: 'circle', x: ax + 150, y: ay + 150, width: 100, height: 100, fill: '#E74C3C', stroke: '#C0392B', strokeWidth: 0, rotation: 0, opacity: 1 },
      text: { type: 'text', x: ax + 60, y: ay + 60, text: 'Double click to edit', fontSize: 24, fill: '#333333', fontFamily: 'Arial', rotation: 0, opacity: 1, width: 200 },
    };

    addElement(defaults[type]);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-title">Tools</div>
      <div className="toolbar-buttons">
        {tools.map((tool) => (
          <motion.button
            key={tool.type}
            className={`toolbar-btn ${!artboard ? 'disabled' : ''}`}
            onClick={() => handleAdd(tool.type)}
            whileHover={artboard ? { scale: 1.05 } : {}}
            whileTap={artboard ? { scale: 0.95 } : {}}
            title={artboard ? tool.label : 'Draw a canvas first'}
            disabled={!artboard}
          >
            <span className="toolbar-icon">{tool.icon}</span>
            <span className="toolbar-label">{tool.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
