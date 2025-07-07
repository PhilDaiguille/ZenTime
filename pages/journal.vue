<script setup lang="ts">
const moods = ["😢", "😐", "🙂", "😁"];
const selectedMood = ref("");
const note = ref("");
const history = ref([]);

const moodScores = {
  "😢": 1,
  "😐": 2,
  "🙂": 3,
  "😁": 4,
};

const chartLabels = computed(() => history.value.map((e) => e.date));
const chartDataPoints = computed(() =>
  history.value.map((e) => moodScores[e.mood] || 0),
);
const chartKey = ref(0);

watch(
  history,
  () => {
    chartKey.value++;
  },
  { deep: true },
);

const weather = ref("Chargement...");
const time = ref("");

const config = useRuntimeConfig();
const apiKey = config.public.openWeatherApiKey;

const showNotification = ref(false);
const notificationMessage = ref("");

async function fetchWeather() {
  try {
    const lat = 48.8566;
    const lon = 2.3522;
    const res = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`,
    );
    const data = await res.json();
    const temp = Math.round(data.current.temp);
    const desc = data.current.weather[0].description;
    weather.value = `${temp}°C, ${desc}`;
  } catch {
    weather.value = "Météo indisponible";
  }
}

function saveEntry() {
  if (!selectedMood.value) {
    notificationMessage.value = "Choisissez votre humeur d'abord";
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, 1000);
    return;
  }
  history.value.push({
    date: new Date().toLocaleDateString(),
    mood: selectedMood.value,
    note: note.value.trim() || "(Pas de note)",
  });

  selectedMood.value = "";
  note.value = "";
}

function updateTime() {
  const now = new Date();
  time.value = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(() => {
  const saved = localStorage.getItem("zen-history");
  if (saved) {
    history.value = JSON.parse(saved);
  }
  fetchWeather();
  updateTime();
  setInterval(updateTime, 60000);
  setInterval(fetchWeather, 3600000);
});

watch(
  history,
  (newVal) => {
    localStorage.setItem("zen-history", JSON.stringify(newVal));
  },
  { deep: true },
);

function clearHistory() {
  history.value = [];
  localStorage.removeItem("zen-history");
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-base-100">
    <Notification :visible="showNotification" :message="notificationMessage" />
    <ZenWave class="absolute inset-0" />
    <main
      class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20"
    >
      <div
        class="flex flex-wrap items-center justify-center gap-3 text-sm text-base-content opacity-70 mb-8"
      >
        <span>🌤️ {{ weather }}</span>
        <span class="hidden sm:inline">|</span>
        <span>{{ time }}</span>
      </div>
      <header class="text-center mb-8 sm:mb-12">
        <div class="text-4xl sm:text-6xl mb-4">📖</div>
        <h1 class="text-2xl sm:text-4xl font-bold text-base-content mb-2">
          Commence ton journal
        </h1>
        <p class="text-base sm:text-lg text-base-content opacity-80">
          Exprime ton humeur pour voir ton évolution au fil du temps
        </p>
      </header>
      <div
        :class="
          history.length
            ? 'grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-2'
            : 'flex justify-center'
        "
      >
        <div
          :class="
            history.length
              ? 'bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20'
              : 'bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 max-w-md w-full'
          "
        >
          <h2
            class="text-xl sm:text-2xl font-bold text-base-content mb-6 text-center"
          >
            Quel est ton ressenti aujourd'hui?
          </h2>
          <div class="flex justify-center gap-3 sm:gap-4 mb-6 flex-wrap">
            <button
              v-for="mood in moods"
              :key="mood"
              @click="selectedMood = mood"
              :class="[
                'text-3xl sm:text-4xl lg:text-5xl p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110',
                selectedMood === mood
                  ? 'scale-125 bg-base-200 shadow-lg'
                  : 'opacity-60 hover:opacity-100',
              ]"
            >
              {{ mood }}
            </button>
          </div>
          <textarea
            v-model="note"
            class="w-full p-3 sm:p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-base-content focus:outline-none resize-none transition-colors text-sm sm:text-base"
            placeholder="Écris librement tes pensées, tes gratitudes, tes émotions..."
            rows="4"
          ></textarea>
          <button
            @click="saveEntry"
            class="w-full mt-6 bg-base-200 hover:bg-base-300 text-base-content font-semibold py-3 px-6 rounded-2xl transition-colors shadow-lg text-sm sm:text-base"
          >
            Enregistrer mon humeur
          </button>
        </div>
        <div
          v-if="history.length"
          class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
        >
          <h2
            class="text-xl sm:text-2xl font-bold text-base-content mb-6 text-center"
          >
            Évolution de ton humeur
          </h2>
          <div class="h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96">
            <MoodChart
              :labels="chartLabels"
              :dataPoints="chartDataPoints"
              :key="chartKey"
            />
          </div>
        </div>
        <div v-if="history.length" class="lg:col-span-2">
          <JournalPage :entries="history" @clear="clearHistory" />
        </div>
      </div>
    </main>
  </div>
</template>
