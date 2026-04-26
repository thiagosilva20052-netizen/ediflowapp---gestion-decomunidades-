import React from 'react';
import { useAppContext } from '../src/context/AppContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useAppContext();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-100 dark:border-gray-700 active:scale-90"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-[20px] block">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
};
