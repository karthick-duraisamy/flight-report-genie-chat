
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ThemeType } from '@/store/slices/themeSlice';

const ThemeSelector: React.FC = () => {
  const { currentTheme, availableThemes, changeTheme } = useTheme();

  const themeLabels: Record<ThemeType, string> = {
    light: 'Light',
    dark: 'Dark',
    yellow: 'Yellow',
    blue: 'Blue',
    green: 'Green',
  };

  return (
    <div className="theme-selector">
      <label className="theme-label">Theme</label>
      <div className="theme-options">
        {availableThemes.map((theme) => (
          <button
            key={theme}
            className={`theme-option ${theme} ${currentTheme === theme ? 'active' : ''}`}
            onClick={() => changeTheme(theme)}
            title={themeLabels[theme]}
            aria-label={`Switch to ${themeLabels[theme]} theme`}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
