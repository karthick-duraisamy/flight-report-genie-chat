import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  sessionId: string;
}

interface HistoryState {
  items: HistoryItem[];
  isHistoryOpen: boolean;
}

const initialState: HistoryState = {
  items: [],
  isHistoryOpen: false,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<Omit<HistoryItem, 'id' | 'timestamp'>>) => {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...action.payload,
      };
      state.items.unshift(newItem);
    },
    updateHistoryTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.title = action.payload.title;
      }
    },
    removeHistoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearHistory: (state) => {
      state.items = [];
    },
    toggleHistory: (state) => {
      state.isHistoryOpen = !state.isHistoryOpen;
    },
    setHistoryOpen: (state, action: PayloadAction<boolean>) => {
      state.isHistoryOpen = action.payload;
    },
  },
});

export const { 
  addHistoryItem, 
  updateHistoryTitle, 
  removeHistoryItem, 
  clearHistory, 
  toggleHistory, 
  setHistoryOpen 
} = historySlice.actions;

export default historySlice.reducer;