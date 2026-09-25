import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

// Light-mode only theme store
export const useThemeStore = create<ThemeState>(() => {
  // Ensure dark class is never present on document element
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark');
  }

  return {
    isDarkMode: false,
    toggleDarkMode: () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode: () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
      }
    },
  };
});
