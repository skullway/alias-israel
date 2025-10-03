import { useState, useEffect } from 'react';

function useDarkMode() {
  // 1. Initialize state based on Local Storage or default to 'light'
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Use 'dark' if saved, otherwise check system preference, default to light
    return savedTheme === 'dark' || (
      savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const theme = isDarkMode ? 'dark' : 'light';

    localStorage.setItem('theme', theme);

    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return [isDarkMode, toggleDarkMode];
}

export default useDarkMode;