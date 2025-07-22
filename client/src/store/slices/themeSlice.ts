import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeConfig {
  name: string;
  type: 'Light' | 'Dark' | 'Colored';
  fontFamily: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
}

export const themes: Record<string, ThemeConfig> = {
  light: {
    name: 'Light Theme',
    type: 'Light',
    fontFamily: 'Open Sans, sans-serif',
    description: 'Clean and bright interface',
    colors: {
      primary: '#3B82F6',
      secondary: '#64748b',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1F2937',
      border: '#E5E7EB'
    },
  },
  dark: {
    name: 'Dark Theme',
    type: 'Dark',
    fontFamily: 'Times New Roman, serif',
    description: 'Easy on the eyes in low light',
    colors: {
      primary: '#6366F1',
      secondary: '#94a3b8',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      border: '#374151'
    },
  },
  yellow: {
    name: 'Yellow Theme',
    type: 'Colored',
    fontFamily: 'Arial, sans-serif',
    description: 'Bright and energetic design',
    colors: {
      primary: '#F59E0B',
      secondary: '#92400e',
      background: '#FFFBEB',
      surface: '#FEF3C7',
      text: '#92400E',
      border: '#F9D71C'
    },
  },
};

interface ThemeState {
  currentTheme: string;
  isThemeSelectorOpen: boolean;
}

const initialState: ThemeState = {
  currentTheme: 'light',
  isThemeSelectorOpen: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.currentTheme = action.payload;
      // Apply font family to document body
      if (typeof document !== 'undefined') {
        const theme = themes[action.payload];
        if (theme) {
          document.body.style.fontFamily = theme.fontFamily;
          // Update CSS custom properties
          const root = document.documentElement;
          Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
          });
        }
      }
    },
    toggleThemeSelector: (state) => {
      state.isThemeSelectorOpen = !state.isThemeSelectorOpen;
    },
    setThemeSelectorOpen: (state, action: PayloadAction<boolean>) => {
      state.isThemeSelectorOpen = action.payload;
    },
  },
});

export const { setTheme, toggleThemeSelector, setThemeSelectorOpen } = themeSlice.actions;
export default themeSlice.reducer;