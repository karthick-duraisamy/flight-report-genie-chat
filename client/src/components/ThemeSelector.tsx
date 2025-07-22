
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    {
      id: 'light',
      name: 'Light Theme',
      font: 'Open Sans',
      type: 'Light'
    },
    {
      id: 'dark',
      name: 'Dark Theme',
      font: 'Times New Roman',
      type: 'Dark'
    },
    {
      id: 'yellow',
      name: 'Yellow Theme',
      font: 'Arial',
      type: 'Colored'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(theme => theme.id === currentTheme) || themes[0];

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme selector"
      >
        <span>🎨</span>
        <span>{currentThemeData.name}</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-grid">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`theme-option ${currentTheme === theme.id ? 'selected' : ''}`}
                data-theme={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <div className="theme-preview" />
                <div className="theme-info">
                  <div className="theme-name">{theme.name}</div>
                  <div className="theme-font">{theme.font}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
