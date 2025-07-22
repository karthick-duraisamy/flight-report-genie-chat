
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <div className="cls-cb-theme-selector">
      <button
        className="cls-cb-theme-toggle-btn"
        onClick={handleToggle}
        aria-label="Toggle theme selector"
      >
        <span className="cls-cb-theme-toggle-icon">🎨</span>
        <span className="cls-cb-theme-toggle-text">Themes</span>
      </button>

      <AnimatePresence>
        {isThemeSelectorOpen && (
          <>
            <motion.div
              className="cls-cb-theme-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(setThemeSelectorOpen(false))}
            />
            
            <motion.div
              className="cls-cb-theme-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="cls-cb-theme-panel-header">
                <h3 className="cls-cb-theme-panel-title">Choose Theme</h3>
                <button
                  className="cls-cb-theme-close-btn"
                  onClick={() => dispatch(setThemeSelectorOpen(false))}
                  aria-label="Close theme selector"
                >
                  ✕
                </button>
              </div>

              <div className="cls-cb-theme-grid">
                {Object.entries(themes).map(([key, theme]) => (
                  <motion.div
                    key={key}
                    className={`cls-cb-theme-card ${currentTheme === key ? 'cls-cb-theme-selected' : ''}`}
                    onClick={() => handleThemeSelect(key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="cls-cb-theme-preview" style={{ backgroundColor: theme.colors.primary }}>
                      <div className="cls-cb-theme-preview-bg" style={{ backgroundColor: theme.colors.background }}>
                        <div className="cls-cb-theme-preview-surface" style={{ backgroundColor: theme.colors.surface }}></div>
                      </div>
                    </div>
                    
                    <div className="cls-cb-theme-info">
                      <h4 className="cls-cb-theme-name">{theme.name}</h4>
                      <p className="cls-cb-theme-type">{theme.type}</p>
                      <p className="cls-cb-theme-description">{theme.description}</p>
                      <p className="cls-cb-theme-font">{theme.fontFamily}</p>
                    </div>

                    {currentTheme === key && (
                      <div className="cls-cb-theme-checkmark">
                        ✓
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
