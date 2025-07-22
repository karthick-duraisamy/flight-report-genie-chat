import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  sessionId: string;
}

interface HistoryState {
  items: HistoryItem[];
}

const initialState: HistoryState = {
  items: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<HistoryItem>) => {
      state.items.unshift(action.payload);
    },
    updateHistoryTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.title = action.payload.title;
      }
    },
    clearHistory: (state) => {
      state.items = [];
    },
  },
});

export const { addHistoryItem, updateHistoryTitle, clearHistory } = historySlice.actions;
export default historySlice.reducer;