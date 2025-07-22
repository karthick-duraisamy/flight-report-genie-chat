
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  messageCount: number;
}

interface HistoryState {
  items: HistoryItem[];
  searchTerm: string;
  sortBy: 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  isEditingTitle: string | null;
}

const initialState: HistoryState = {
  items: [],
  searchTerm: '',
  sortBy: 'date',
  sortOrder: 'desc',
  isEditingTitle: null,
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
    removeHistoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'date' | 'title'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setEditingTitle: (state, action: PayloadAction<string | null>) => {
      state.isEditingTitle = action.payload;
    },
  },
});

export const {
  addHistoryItem,
  updateHistoryTitle,
  removeHistoryItem,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  setEditingTitle,
} = historySlice.actions;

export default historySlice.reducer;
