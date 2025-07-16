<script setup lang="ts">
type ThemeName = "ZenTimeLight" | "ZenTimeDawn" | "ZenTimeDusk" | "ZenTimeDark";
type PeriodKey = "dawn" | "day" | "dusk" | "night";

const {
  timeThemes,
  startAutoTheme,
  stopAutoTheme,
  applyTheme,
  getCurrentPeriod,
  getTimeToNextChange,
} = useTimeBasedTheme();

const themeStore = useThemeStore();

const currentPeriod = ref(getCurrentPeriod());
const timeToNext = ref(getTimeToNextChange());
const currentTime = ref(new Date());

let displayTimer: ReturnType<typeof setInterval> | null = null;

const periodColors = {
  dawn: "bg-gradient-to-r from-pink-400 to-orange-400",
  day: "bg-gradient-to-r from-blue-400 to-teal-400",
  dusk: "bg-gradient-to-r from-purple-400 to-pink-500",
  night: "bg-gradient-to-r from-indigo-900 to-gray-900",
} as const;

const periodColor = computed(() => {
  const period = getCurrentPeriod();
  const key = (Object.keys(timeThemes) as PeriodKey[]).find(
    (k) => timeThemes[k].theme === period.theme,
  );
  return key ? periodColors[key] : "bg-base-content";
});

const currentTimePosition = computed(() => {
  const hour = currentTime.value.getHours();
  return (hour / 24) * 100;
});

const toggleAutoMode = () => {
  themeStore.setAutoMode(!themeStore.isAutoMode.value);

  if (themeStore.isAutoMode.value) {
    startAutoTheme();
  } else {
    stopAutoTheme();
  }
};

const selectTheme = (theme: ThemeName) => {
  themeStore.setManualTheme(theme);
  stopAutoTheme();
  applyTheme(theme);
};

const getThemeColor = (key: PeriodKey) => {
  return periodColors[key] || "bg-base-content";
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const updateDisplay = () => {
  currentTime.value = new Date();
  currentPeriod.value = getCurrentPeriod();
  if (themeStore.isAutoMode.value) {
    timeToNext.value = getTimeToNextChange();
  }
};

const handleThemeChange = () => {
  currentPeriod.value = getCurrentPeriod();
};

onMounted(() => {
  displayTimer = setInterval(updateDisplay, 1000);

  if (import.meta.client) {
    window.addEventListener("theme-changed", handleThemeChange);
  }

  updateDisplay();
});

onUnmounted(() => {
  if (displayTimer) {
    clearInterval(displayTimer);
  }

  if (import.meta.client) {
    window.removeEventListener("theme-changed", handleThemeChange);
  }
});
</script>

<template>
  <div
    class="theme-controller bg-base-200 p-4 rounded-lg shadow-lg max-w-xl mx-auto container"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full" :class="periodColor" />
        <div>
          <h3 class="font-semibold text-base-content">
            {{ currentPeriod?.name }}
          </h3>
          <p class="text-sm text-base-content/70">
            {{ formatTime(new Date()) }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="btn btn-sm"
          :class="themeStore.isAutoMode.value ? 'btn-primary' : 'btn-outline'"
          @click="toggleAutoMode"
        >
          {{ themeStore.isAutoMode.value ? "Auto" : "Manuel" }}
        </button>
      </div>
    </div>

    <div v-if="themeStore.isAutoMode.value && timeToNext" class="mb-4">
      <div class="flex items-center gap-2 text-sm text-base-content/70">
        <span
          >Prochain: {{ timeToNext.nextPeriod }} dans {{ timeToNext.hours }}h
          {{ timeToNext.minutes }}m</span
        >
      </div>
    </div>

    <div v-if="!themeStore.isAutoMode.value" class="grid grid-cols-2 gap-2">
      <button
        v-for="(period, key) in timeThemes"
        :key="key"
        class="btn btn-sm"
        :class="
          themeStore.selectedTheme.value === period.theme
            ? 'btn-primary'
            : 'btn-outline'
        "
        @click="selectTheme(period.theme)"
      >
        <div
          class="w-2 h-2 rounded-full mr-2"
          :class="getThemeColor(key as PeriodKey)"
        />
        {{ period.name }}
      </button>
    </div>

    <div class="mt-4">
      <div
        class="flex items-center justify-between text-xs text-base-content/50 mb-2"
      >
        <span>5h</span>
        <span>8h</span>
        <span>17h</span>
        <span>20h</span>
      </div>
      <div class="h-2 bg-base-300 rounded-full overflow-hidden flex">
        <div class="bg-gradient-to-r from-pink-400 to-orange-400 w-1/4" />
        <div class="bg-gradient-to-r from-blue-400 to-teal-400 w-1/2" />
        <div class="bg-gradient-to-r from-purple-400 to-pink-500 w-1/8" />
        <div class="bg-gradient-to-r from-indigo-900 to-gray-900 w-1/8" />
      </div>
      <div class="flex justify-center mt-1">
        <div
          class="w-1 h-4 bg-base-content rounded-full transition-all duration-300"
          :style="{ marginLeft: `${currentTimePosition}%` }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-controller {
  transition: all 0.3s ease;
}

.theme-controller:hover {
  transform: translateY(-2px);
}
</style>
