import { create } from "zustand";

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: localStorage.getItem("theme") === "dark",
  toggle: () =>
    set((state) => {
      const newDark = !state.isDark;
      localStorage.setItem("theme", newDark ? "dark" : "light");
      if (newDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { isDark: newDark };
    }),
}));
