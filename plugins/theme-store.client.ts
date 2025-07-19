export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    nextTick(() => {
      const themeStore = useThemeStore();
      const { startAutoTheme, applyTheme, stopAutoTheme } = useTimeBasedTheme();

      stopAutoTheme();

      themeStore.loadStateFromStorage();

      setTimeout(() => {
        if (themeStore.isAutoMode.value) {
          startAutoTheme();
        } else if (themeStore.selectedTheme.value) {
          stopAutoTheme();
          applyTheme(themeStore.selectedTheme.value);
        } else {
          themeStore.setAutoMode(true);
          startAutoTheme();
        }
      }, 50);
    });
  }
});
