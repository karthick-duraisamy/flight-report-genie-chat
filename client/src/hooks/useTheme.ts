
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store';
import { setTheme, themes } from '@/store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state: RootState) => state.theme);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Add theme transition class for smooth transitions
    document.documentElement.classList.add('theme-transition');
    
    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timer);
  }, [currentTheme]);

  const changeTheme = (theme: string) => {
    // Add transition class before changing theme
    document.documentElement.classList.add('theme-transition');
    dispatch(setTheme(theme));
  };

  return {
    currentTheme,
    availableThemes: themes,
    changeTheme,
  };
};
