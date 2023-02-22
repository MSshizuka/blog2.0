import { defineStore } from 'pinia';
import { store } from '/@/store';

interface ThemeState {
  themeMap: Recordable;
}

export const useThemeStore = defineStore({
  id: 'app-theme',
  state: (): ThemeState => ({
    themeMap: {},
  }),
  getters: {
    getThemeMap(): Recordable {
      return this.themeMap;
    },
  },
  actions: {
    setThemeMap(themeMap: Recordable) {
      this.themeMap = themeMap;
    },
  },
});

export function useUserStoreWithOut() {
  return useThemeStore(store);
}
