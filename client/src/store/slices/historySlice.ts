import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  messageCount: number;
}

interface HistoryState {
  items: HistoryItem[];
  currentItemId: string | null;
}

const initialState: HistoryState = {
  items: [],
  currentItemId: null,
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
    setCurrentHistoryItem: (state, action: PayloadAction<string | null>) => {
      state.currentItemId = action.payload;
    },
    removeHistoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addHistoryItem, updateHistoryTitle, setCurrentHistoryItem, removeHistoryItem } = historySlice.actions;
export default historySlice.reducer;