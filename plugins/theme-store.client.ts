export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const themeStore = useThemeStore();
    const { startAutoTheme, applyTheme, stopAutoTheme } = useTimeBasedTheme();

    stopAutoTheme();

    themeStore.loadStateFromStorage();

    if (themeStore.isAutoMode.value) {
      startAutoTheme();
    } else if (themeStore.selectedTheme.value) {
      applyTheme(themeStore.selectedTheme.value);
    } else {
      themeStore.setAutoMode(true);
      startAutoTheme();
    }
  }
});
