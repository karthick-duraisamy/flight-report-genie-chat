
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  messageCount: number;
  lastMessage?: string;
}

interface HistoryState {
  items: HistoryItem[];
  isExpanded: boolean;
}

const initialState: HistoryState = {
  items: [],
  isExpanded: true, // Default to expanded as requested
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<HistoryItem>) => {
      state.items.unshift(action.payload);
      // Keep only last 50 conversations
      if (state.items.length > 50) {
        state.items = state.items.slice(0, 50);
      }
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
    toggleExpanded: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    clearHistory: (state) => {
      state.items = [];
    },
  },
});

export const {
  addHistoryItem,
  updateHistoryTitle,
  removeHistoryItem,
  toggleExpanded,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;
