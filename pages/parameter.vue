<script setup lang="ts">
import TimeThemeController from "~/components/TimeThemeController.vue";
</script>

<template>
  <div
    class="hero bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 min-h-screen relative overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"
      />
      <div
        class="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"
      />
      <div
        class="absolute top-1/2 right-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse delay-2000"
      />
    </div>
    <main class="hero-content flex-col items-center justify-center w-full">
      <TimeThemeController />
    </main>
  </div>
</template>
