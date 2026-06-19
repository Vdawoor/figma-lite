import { useRef } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import ExportPanel from './components/ExportPanel';
import useKeyboard from './hooks/useKeyboard';
import useStore from './store/useStore';
import './App.css';

function App() {
  const stageRef = useRef(null);
  useKeyboard();
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const historyIndex = useStore((s) => s.historyIndex);
  const history = useStore((s) => s.history);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">✦ Figma Lite</div>
        <div className="undo-redo-controls">
          <button
            className="undo-redo-btn"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button
            className="undo-redo-btn"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
            </svg>
          </button>
        </div>
        <div className="header-controls">
          <ExportPanel stageRef={stageRef} />
        </div>
      </header>
      <div className="app-body">
        <aside className="left-panel">
          <Toolbar />
          <LayersPanel />
        </aside>
        <main className="canvas-area">
          <Canvas stageRef={stageRef} />
        </main>
        <aside className="right-panel">
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  );
}

export default App;
