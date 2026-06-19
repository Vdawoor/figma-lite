import useStore from '../store/useStore';

export default function ExportPanel({ stageRef }) {
  const elements = useStore((s) => s.elements);
  const artboard = useStore((s) => s.artboard);

  const exportPNG = () => {
    if (!stageRef.current || !artboard) return;
    const uri = stageRef.current.toDataURL({
      x: artboard.x,
      y: artboard.y,
      width: artboard.width,
      height: artboard.height,
      pixelRatio: 2,
    });
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = uri;
    link.click();
  };

  const exportJSON = () => {
    const data = JSON.stringify({ artboard, elements }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'design.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          const store = useStore.getState();
          if (data.artboard) {
            store.setArtboard(data.artboard);
          }
          const els = Array.isArray(data) ? data : data.elements;
          if (Array.isArray(els)) {
            els.forEach((el) => store.addElement(el));
          }
        } catch (err) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="export-panel">
      <div className="panel-title">Export</div>
      <div className="export-buttons">
        <button className="export-btn" onClick={exportPNG} disabled={!artboard}>
          Export PNG
        </button>
        <button className="export-btn" onClick={exportJSON}>
          Save JSON
        </button>
        <button className="export-btn" onClick={importJSON}>
          Load JSON
        </button>
      </div>
    </div>
  );
}
