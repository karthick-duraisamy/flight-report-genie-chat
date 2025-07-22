
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryState {
  searchTerm: string;
  sortBy: 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  isEditingTitle: string | null;
}

const initialState: HistoryState = {
  searchTerm: '',
  sortBy: 'date',
  sortOrder: 'desc',
  isEditingTitle: null,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
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
  setSearchTerm,
  setSortBy,
  setSortOrder,
  setEditingTitle,
} = historySlice.actions;

export default historySlice.reducer;
