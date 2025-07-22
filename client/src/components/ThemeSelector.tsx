
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setTheme, toggleThemeSelector, setThemeSelectorOpen, themes } from '@/store/slices/themeSlice';

const ThemeSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTheme, isThemeSelectorOpen } = useSelector((state: RootState) => state.theme);

  const handleThemeSelect = (themeKey: string) => {
    dispatch(setTheme(themeKey));
    dispatch(setThemeSelectorOpen(false));
  };

  const handleToggle = () => {
    dispatch(toggleThemeSelector());
  };

  const handleOverlayClick = () => {
    dispatch(setThemeSelectorOpen(false));
  };

  return (
    <div className="cls-cb-theme-selector">
      <button
        className="cls-cb-theme-toggle-btn"
        onClick={handleToggle}
        aria-label="Toggle theme selector"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" 
            fill="currentColor"
          />
        </svg>
      </button>

      {isThemeSelectorOpen && (
        <>
          <div className="cls-cb-theme-overlay" onClick={handleOverlayClick}></div>
          <div className="cls-cb-theme-dropdown">
            <div className="cls-cb-theme-dropdown-header">
              <h3>Choose Theme</h3>
              <button
                className="cls-cb-theme-close"
                onClick={() => dispatch(setThemeSelectorOpen(false))}
              >
                ×
              </button>
            </div>
            <div className="cls-cb-theme-dropdown-content">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`cls-cb-theme-option ${currentTheme === key ? 'cls-cb-theme-selected' : ''}`}
                  onClick={() => handleThemeSelect(key)}
                >
                  <div 
                    className="cls-cb-theme-preview"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {currentTheme === key && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>
                  <div className="cls-cb-theme-info">
                    <div className="cls-cb-theme-name">{theme.name}</div>
                    <div className="cls-cb-theme-font">{theme.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
