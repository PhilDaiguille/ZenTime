<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#imports";

const props = defineProps({
  refreshInterval: {
    type: Number,
    default: 3600000,
  },
});

const weather = ref("Chargement...");
const time = ref("");
const config = useRuntimeConfig();
const apiKey = config.public.openWeatherApiKey;

async function fetchWeather() {
  try {
    const lat = 48.8566;
    const lon = 2.3522;
    const data = await $fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`,
    );
    const temp = Math.round(data.current.temp);
    const desc = data.current.weather[0].description;
    weather.value = `${temp}°C, ${desc}`;
  } catch {
    weather.value = "Météo indisponible";
  }
}

function updateTime() {
  const now = new Date();
  time.value = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(() => {
  fetchWeather();
  updateTime();
  setInterval(updateTime, 1000);
  setInterval(fetchWeather, props.refreshInterval);
});
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-center gap-3 text-sm text-base-content opacity-70 mb-8"
  >
    <span>{{ weather }}</span>
    <span class="hidden sm:inline">|</span>
    <span>{{ time }}</span>
  </div>
</template>
