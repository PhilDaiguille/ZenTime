export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    document.documentElement.style.transition = "all 0.3s ease";
  }
});
