// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxtjs/tailwindcss", "@nuxt/fonts"],
  app: {
    head: {
      htmlAttrs: {
        "data-theme": "ZenTime",
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["@/assets/css/app.css"],
  fonts: {
    defaults: {
      weights: [400],
      styles: ["normal", "italic"],
      subsets: [
        "cyrillic-ext",
        "cyrillic",
        "greek-ext",
        "greek",
        "vietnamese",
        "latin-ext",
        "latin",
      ],
    },
    families: [{ name: "Inter", provider: "google" }],
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
  ssr: true,
});
