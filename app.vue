<script setup lang="ts">
const { startAutoTheme } = useTimeBasedTheme();

onMounted(() => {
  startAutoTheme();
});
</script>

<template>
  <UHeader />
  <NuxtPage />
  <UFooter />
</template>
