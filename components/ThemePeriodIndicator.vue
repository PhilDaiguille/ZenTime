<script setup lang="ts">
const { getCurrentPeriod } = useTimeBasedTheme();
const currentPeriod = ref(getCurrentPeriod());

const periodColors = {
  dawn: "bg-gradient-to-r from-pink-400 to-orange-400",
  day: "bg-gradient-to-r from-blue-400 to-teal-400",
  dusk: "bg-gradient-to-r from-purple-400 to-pink-500",
  night: "bg-gradient-to-r from-indigo-900 to-gray-900",
};
const periodTime = computed(() => {
  const period = getCurrentPeriod();
  return `${period.start}h - ${period.end}h`;
});

type PeriodKey = "dawn" | "day" | "dusk" | "night";

const periodColor = computed(() => {
  const period = getCurrentPeriod();
  const { timeThemes } = useTimeBasedTheme();
  const key = (Object.keys(timeThemes) as PeriodKey[]).find(
    (k) => timeThemes[k].theme === period.theme,
  );
  if (key && key in periodColors) {
    return periodColors[key as keyof typeof periodColors];
  }
  return "bg-base-content";
});

let updateInterval: ReturnType<typeof setInterval> | null = null;

const updatePeriod = () => {
  currentPeriod.value = getCurrentPeriod();
};

const handleThemeChange = () => {
  updatePeriod();
};

onMounted(() => {
  updateInterval = setInterval(updatePeriod, 60000);

  if (import.meta.client) {
    window.addEventListener("theme-changed", handleThemeChange);
  }
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  if (import.meta.client) {
    window.removeEventListener("theme-changed", handleThemeChange);
  }
});
</script>

<template>
  <div class="flex items-center gap-2 text-sm">
    <div
      class="w-2 h-2 rounded-full transition-all duration-500"
      :class="periodColor"
    />
    <span class="text-base-content/70 font-medium">{{
      currentPeriod?.name
    }}</span>
    <span class="text-base-content/50">{{ periodTime }}</span>
  </div>
</template>
