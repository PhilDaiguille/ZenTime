<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJournalStore } from '@/stores/journalStore'
import { useRuntimeConfig } from '#imports'

const weather = ref("Chargement...")
const time = ref("")

const journal = useJournalStore()

const moods = ["😢", "😐", "🙂", "😁"]
const selectedMood = ref("")
const note = ref("")
const showNotification = ref(false)
const notificationMessage = ref("")

const config = useRuntimeConfig()
const apiKey = config.public.openWeatherApiKey

const chartLabels = computed(() => journal.chartLabels)
const chartDataPoints = computed(() => journal.chartDataPoints)

const journalPageRef = ref(null)

const soundOptions = [
  { name: 'Forêt (oiseaux)', file: '/sounds/birds-forest.wav', image: '/images/forest.jpg' },
  { name: 'Cicadas', file: '/sounds/cicadas.wav', image: '/images/cicadas.jpg' },
  { name: 'Campagne', file: '/sounds/countryside.wav', image: '/images/countryside.jpg' },
  { name: 'Feu de cheminée', file: '/sounds/fireplace.wav', image: '/images/fireplace.jpg' },
  { name: 'Océan', file: '/sounds/ocean-waves.mp3', image: '/images/ocean.jpg' },
  { name: 'Pluie en forêt', file: '/sounds/rain-forest.mp3', image: '/images/rain.jpg' },
  { name: 'Vagues', file: '/sounds/sea-waves.wav', image: '/images/sea-waves.jpg' }
]


const currentAudio = ref(null)
const currentSound = ref(null)

function playSound(sound) {
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
  }

  currentAudio.value = new Audio(sound.file)
  currentAudio.value.loop = true
  currentAudio.value.volume = 0.3
  currentAudio.value.play()
  currentSound.value = sound
}

function stopSound() {
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
  }
  currentSound.value = null
}


async function fetchWeather() {
  try {
    const lat = 48.8566
    const lon = 2.3522
    const data = await $fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`
    )
    const temp = Math.round(data.current.temp)
    const desc = data.current.weather[0].description
    weather.value = `${temp}°C, ${desc}`
  } catch {
    weather.value = "Météo indisponible"
  }
}

function updateTime() {
  const now = new Date()
  time.value = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function saveEntry() {
  if (!selectedMood.value) {
    notificationMessage.value = "Choisissez votre humeur d'abord"
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 1000)
    return
  }

  journal.addEntry({
    date: new Date().toLocaleDateString(),
    mood: selectedMood.value,
    note: note.value.trim() || "(Pas de note)",
  })

  selectedMood.value = ""
  note.value = ""

  journalPageRef.value?.goToLastPage()
}

function clearHistory() {
  journal.clearEntries()
}

onMounted(() => {
  journal.loadFromLocalStorage()
  fetchWeather()
  updateTime()
  setInterval(updateTime, 1000)
  setInterval(fetchWeather, 3600000)
})
</script>

<template>
  <div class="hero bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 min-h-screen relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div class="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div class="absolute top-1/2 right-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse delay-2000" />
    </div>
    <UNotification :visible="showNotification" :message="notificationMessage" />
    <main class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
      <WeatherTime />
      <header class="text-center">
        <div class="text-4xl sm:text-6xl mb-4">📖</div>
        <h1 class="text-2xl sm:text-4xl font-bold text-base-content mb-2">
          Commence ton journal
        </h1>
        <p class="text-base sm:text-lg text-base-content opacity-80">
          Exprime ton humeur pour voir ton évolution au fil du temps
        </p>
      </header>

      <ZenSounds
          :soundOptions="soundOptions"
          @play="playSound"
          @stop="stopSound"
      />

      <div
          :class="
          journal.entries.length
            ? 'grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-2'
            : 'flex justify-center'
        "
      >
        <JournalForm
            :moods="moods"
            :selectedMood="selectedMood"
            :note="note"
            @update:mood="selectedMood = $event"
            @update:note="note = $event"
            @save="saveEntry"
        />

        <div
            v-if="journal.entries.length"
            class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
        >
          <h2 class="text-xl sm:text-2xl font-bold text-base-content mb-6 text-center">
            Évolution de ton humeur
          </h2>
          <div class="h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96">
            <MoodChart
                :labels="chartLabels"
                :data-points="chartDataPoints"
            />
          </div>
        </div>

        <div v-if="journal.entries.length" class="lg:col-span-2">
          <JournalPage
              :entries="journal.entries"
              @clear="clearHistory"
              ref="journalPageRef"
          />
        </div>
      </div>
    </main>
  </div>
</template>

