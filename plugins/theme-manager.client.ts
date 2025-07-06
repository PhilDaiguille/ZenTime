export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const { startAutoTheme } = useTimeBasedTheme();

    startAutoTheme();

    document.documentElement.style.transition = "all 0.3s ease";
  }
});
