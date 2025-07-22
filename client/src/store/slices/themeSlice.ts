
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeType = 'light' | 'dark' | 'yellow' | 'blue' | 'green';

interface ThemeState {
  currentTheme: ThemeType;
  availableThemes: ThemeType[];
}

const initialState: ThemeState = {
  currentTheme: 'light',
  availableThemes: ['light', 'dark', 'yellow', 'blue', 'green'],
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.currentTheme = action.payload;
      // Store theme preference in localStorage
      localStorage.setItem('airline-chatbot-theme', action.payload);
    },
    initializeTheme: (state) => {
      const savedTheme = localStorage.getItem('airline-chatbot-theme') as ThemeType;
      if (savedTheme && state.availableThemes.includes(savedTheme)) {
        state.currentTheme = savedTheme;
      }
    },
  },
});

export const { setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
