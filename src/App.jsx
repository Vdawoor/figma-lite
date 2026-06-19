import { useRef, useState } from 'react';
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

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileSheet, setMobileSheet] = useState(null); // 'tools' | 'layers' | 'properties' | null

  const closeMobileSheet = () => setMobileSheet(null);
  const toggleMobileSheet = (sheet) => setMobileSheet((v) => (v === sheet ? null : sheet));

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <button
            className="panel-toggle-btn desktop-only"
            onClick={() => setLeftPanelOpen((v) => !v)}
            title={leftPanelOpen ? 'Hide left panel' : 'Show left panel'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          <div className="app-logo">✦ Figma Lite</div>
        </div>
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
        <div className="header-right">
          <ExportPanel stageRef={stageRef} />
          <button
            className="panel-toggle-btn desktop-only"
            onClick={() => setRightPanelOpen((v) => !v)}
            title={rightPanelOpen ? 'Hide right panel' : 'Show right panel'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </button>
        </div>
      </header>
      <div className="app-body">
        <aside className={`left-panel ${leftPanelOpen ? '' : 'collapsed'}`}>
          <Toolbar />
          <LayersPanel />
        </aside>
        <main className="canvas-area">
          <Canvas stageRef={stageRef} />
        </main>
        <aside className={`right-panel ${rightPanelOpen ? '' : 'collapsed'}`}>
          <PropertiesPanel />
        </aside>
      </div>

      {/* Mobile bottom toolbar */}
      <nav className="mobile-bottom-bar">
        <button
          className={`mobile-bar-btn ${mobileSheet === 'tools' ? 'active' : ''}`}
          onClick={() => toggleMobileSheet('tools')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <span>Tools</span>
        </button>
        <button
          className={`mobile-bar-btn ${mobileSheet === 'layers' ? 'active' : ''}`}
          onClick={() => toggleMobileSheet('layers')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span>Layers</span>
        </button>
        <button
          className={`mobile-bar-btn ${mobileSheet === 'properties' ? 'active' : ''}`}
          onClick={() => toggleMobileSheet('properties')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Properties</span>
        </button>
      </nav>

      {/* Mobile bottom sheet */}
      {mobileSheet && (
        <div className="mobile-sheet-overlay" onClick={closeMobileSheet}>
          <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-handle" />
            <div className="mobile-sheet-content">
              {mobileSheet === 'tools' && <Toolbar />}
              {mobileSheet === 'layers' && <LayersPanel />}
              {mobileSheet === 'properties' && <PropertiesPanel />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
