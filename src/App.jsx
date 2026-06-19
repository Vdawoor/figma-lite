import { useRef } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import ExportPanel from './components/ExportPanel';
import useKeyboard from './hooks/useKeyboard';
import './App.css';

function App() {
  const stageRef = useRef(null);
  useKeyboard();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">✦ Figma Lite</div>
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
