
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
  };
}

export const themes: Record<string, ThemeConfig> = {
  light: {
    name: 'Light Theme',
    type: 'Light',
    fontFamily: 'Open Sans, sans-serif',
    description: 'Clean and minimal light interface',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
    },
  },
  dark: {
    name: 'Dark Theme',
    type: 'Dark',
    fontFamily: 'Times New Roman, serif',
    description: 'Elegant dark interface with serif fonts',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      background: '#0f172a',
      surface: '#1e293b',
    },
  },
  yellow: {
    name: 'Yellow Theme',
    type: 'Colored',
    fontFamily: 'Arial, sans-serif',
    description: 'Warm and energetic color scheme',
    colors: {
      primary: '#f59e0b',
      secondary: '#92400e',
      background: '#fffbeb',
      surface: '#fef3c7',
    },
  },
  blue: {
    name: 'Blue Theme',
    type: 'Colored',
    fontFamily: 'Roboto, sans-serif',
    description: 'Professional blue interface',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      background: '#eff6ff',
      surface: '#dbeafe',
    },
  },
  green: {
    name: 'Green Theme',
    type: 'Colored',
    fontFamily: 'Inter, sans-serif',
    description: 'Natural and calming green theme',
    colors: {
      primary: '#16a34a',
      secondary: '#15803d',
      background: '#f0fdf4',
      surface: '#dcfce7',
    },
  },
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const themes = {
  light: {
    name: 'Light Theme',
    type: 'Light',
    description: 'Clean and bright interface',
    fontFamily: 'Open Sans, sans-serif',
    colors: {
      primary: '#3B82F6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1F2937',
      border: '#E5E7EB'
    }
  },
  dark: {
    name: 'Dark Theme',
    type: 'Dark',
    description: 'Easy on the eyes in low light',
    fontFamily: 'Times New Roman, serif',
    colors: {
      primary: '#6366F1',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      border: '#374151'
    }
  },
  yellow: {
    name: 'Yellow Theme',
    type: 'Colored',
    description: 'Bright and energetic design',
    fontFamily: 'Arial, sans-serif',
    colors: {
      primary: '#F59E0B',
      background: '#FFFBEB',
      surface: '#FEF3C7',
      text: '#92400E',
      border: '#F9D71C'
    }
  }
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
