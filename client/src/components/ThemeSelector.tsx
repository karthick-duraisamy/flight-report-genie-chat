
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

              <div className="cls-cb-theme-options">
                {Object.entries(themes).map(([themeKey, theme]) => (
                  <motion.div
                    key={themeKey}
                    className={`cls-cb-theme-card ${currentTheme === themeKey ? 'cls-cb-theme-selected' : ''}`}
                    onClick={() => handleThemeSelect(themeKey)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    <div className="cls-cb-theme-preview" style={{
                      background: `linear-gradient(135deg, ${theme.colors.background} 30%, ${theme.colors.primary} 100%)`
                    }}>
                      {currentTheme === themeKey && (
                        <motion.div
                          className="cls-cb-theme-checkmark"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15 }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="cls-cb-theme-info">
                      <div className="cls-cb-theme-name">{theme.name}</div>
                      <div className="cls-cb-theme-type">{theme.type}</div>
                      <div className="cls-cb-theme-font">{theme.fontFamily.split(',')[0]}</div>
                      <div className="cls-cb-theme-description">{theme.description}</div>
                    </div>
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
