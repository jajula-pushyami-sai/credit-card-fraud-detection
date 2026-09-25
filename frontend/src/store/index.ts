import { create } from "zustand";

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AppStore {
  user: UserProfile | null;
  theme: "light" | "dark";
  setUser: (user: UserProfile | null) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  theme: "dark", // default theme for premium dark aesthetics
  setUser: (user) => set({ user }),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      const root = window.document.documentElement;
      root.classList.remove(state.theme);
      root.classList.add(newTheme);
      return { theme: newTheme };
    }),
}));
