import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY = 50;

const useStore = create((set, get) => ({
  artboard: null,
  elements: [],
  selectedIds: [],
  history: [[]],
  historyIndex: 0,

  setArtboard: (artboard) => set({ artboard }),

  pushHistory: () => {
    const { elements, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(elements)));
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({
      elements: JSON.parse(JSON.stringify(history[newIndex])),
      historyIndex: newIndex,
      selectedIds: [],
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({
      elements: JSON.parse(JSON.stringify(history[newIndex])),
      historyIndex: newIndex,
      selectedIds: [],
    });
  },

  addElement: (element) => {
    const newElement = { ...element, id: uuidv4(), visible: true };
    set((state) => ({ elements: [...state.elements, newElement] }));
    get().pushHistory();
  },

  updateElement: (id, attrs) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...attrs } : el
      ),
    }));
  },

  updateElementWithHistory: (id, attrs) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...attrs } : el
      ),
    }));
    get().pushHistory();
  },

  deleteElements: (ids) => {
    set((state) => ({
      elements: state.elements.filter((el) => !ids.includes(el.id)),
      selectedIds: [],
    }));
    get().pushHistory();
  },

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  toggleSelection: (id) => {
    set((state) => {
      const exists = state.selectedIds.includes(id);
      return {
        selectedIds: exists
          ? state.selectedIds.filter((i) => i !== id)
          : [...state.selectedIds, id],
      };
    });
  },

  reorderElement: (fromIndex, toIndex) => {
    set((state) => {
      const elements = [...state.elements];
      const [moved] = elements.splice(fromIndex, 1);
      elements.splice(toIndex, 0, moved);
      return { elements };
    });
    get().pushHistory();
  },

  toggleVisibility: (id) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, visible: !el.visible } : el
      ),
    }));
  },

  duplicateElements: (ids) => {
    const { elements } = get();
    const duplicates = elements
      .filter((el) => ids.includes(el.id))
      .map((el) => ({
        ...el,
        id: uuidv4(),
        x: el.x + 20,
        y: el.y + 20,
      }));
    set((state) => ({ elements: [...state.elements, ...duplicates] }));
    get().pushHistory();
  },
}));

export default useStore;
