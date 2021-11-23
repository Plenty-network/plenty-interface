import { useEffect, useState } from 'react';
import { THEME } from '../constants/localStorage';

const useThemes = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const localTheme = localStorage.getItem(THEME);
    // ? Setting default theme as light
    toggleTheme({ defaultTheme: localTheme ?? 'light' });
  }, []);

  const toggleTheme = ({ defaultTheme = null }) => {
    const newTheme = defaultTheme != null ? defaultTheme : theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);

    document.documentElement.className = `${newTheme} theme-transiton`;
    localStorage.setItem(THEME, newTheme);

    setTimeout(() => {
      document.documentElement.className = `${newTheme}`;
    }, 1000);
  };

  return { theme, toggleTheme };
};

export default useThemes;
