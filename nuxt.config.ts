// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
    },
  },
  modules: ["@nuxt/eslint", "@nuxtjs/tailwindcss", "@nuxt/fonts"],
  app: {
    head: {
      htmlAttrs: {
        "data-theme": "ZenTimeLight",
      },
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@magenta/lofi@latest/dist/bundle.js",
          defer: true,
        },
      ],
    },
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
    families: [
      { name: "Inter", provider: "google", global: true },
      { name: "Merriweather", provider: "google", global: true },
    ],
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    config: {
      daisyui: {
        themes: ["ZenTimeLight", "ZenTimeDawn", "ZenTimeDusk", "ZenTimeDark"],
      },
    },
  },

  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
});
