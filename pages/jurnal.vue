<script setup>
  import {ref, computed, watch, onMounted} from 'vue'
  import {useRuntimeConfig} from '#app'
  import ZenWave from '~/components/ZenWave.vue'
  import MoodChart from '~/components/MoodChart.vue'

  const moods = ['😢', '😐', '🙂', '😁']
  const selectedMood = ref('')
  const note = ref('')
  const history = ref([])

  const moodScores = {
    '😢': 1,
    '😐': 2,
    '🙂': 3,
    '😁': 4
  }

  const chartLabels = computed(() => history.value.map(e => e.date))
  const chartDataPoints = computed(() => history.value.map(e => moodScores[e.mood] || 0))

  const chartKey = ref(0)

  watch(history, () => {
    chartKey.value++
  }, {deep: true})

  const weather = ref('Chargement...')
  const time = ref('')

  const config = useRuntimeConfig()
  const apiKey = config.public.openWeatherApiKey

  async function fetchWeather() {
    try {
      const lat = 48.8566
      const lon = 2.3522
      const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`)
      const data = await res.json()
      const temp = Math.round(data.current.temp)
      const desc = data.current.weather[0].description
      weather.value = `${temp}°C, ${desc}`
    } catch {
      weather.value = 'Météo indisponible'
    }
  }

  function saveEntry() {
    if (!selectedMood.value) {
      alert('Choisissez votre humeur !')
      return
    }

    history.value.push({
      date: new Date().toLocaleDateString(),
      mood: selectedMood.value,
      note: note.value.trim() || '(Pas de note)'
    })

    selectedMood.value = ''
    note.value = ''
  }

  function updateTime() {
    const now = new Date()
    time.value = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  onMounted(() => {
    const saved = localStorage.getItem('zen-history')
    if (saved) {
      history.value = JSON.parse(saved)
    }
    fetchWeather()
    updateTime()
    setInterval(updateTime, 60000)
    setInterval(fetchWeather, 3600000)
  })

  watch(history, (newVal) => {
    localStorage.setItem('zen-history', JSON.stringify(newVal))
  }, {deep: true})

  function clearHistory() {
    history.value = []
    localStorage.removeItem('zen-history')
  }
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-base-100 text-base-content">
    <ZenWave class="absolute inset-0"/>

    <main class="relative mt-20 z-10 flex flex-col space-y-10 min-h-screen">
      <div class="flex items-center justify-center gap-4 text-sm opacity-70 mt-4 mb-2">
        <span>🌤️ {{ weather }}</span>
        <span>|</span>
        <span>{{ time }}</span>
      </div>

      <header class="text-center mt-8">
        <h1 class="text-4xl font-bold text-primary mb-2">ZenTime</h1>
        <p class="text-lg opacity-80">Exprime ton humeur et tes pensées</p>
      </header>

      <section class="flex flex-col items-center px-6 mt-10 space-y-8">
        <h2 class="text-2xl text-primary">Comment tu te sens aujourd’hui ?</h2>
        <div class="flex gap-4 text-4xl">
          <button
              v-for="mood in moods"
              :key="mood"
              @click="selectedMood = mood"
              :class="selectedMood === mood ? 'scale-125 transition text-accent' : 'opacity-60 hover:opacity-100 transition'"
          >
            {{ mood }}
          </button>
        </div>
        <textarea
            v-model="note"
            class="textarea textarea-bordered w-full max-w-lg rounded-xl bg-base-100 bg-opacity-70 shadow-inner"
            placeholder="Écris librement tes pensées, tes gratitudes, tes ressentis..."
            rows="5"
        ></textarea>
        <button class="btn btn-primary btn-lg w-full max-w-xs shadow-lg" @click="saveEntry">
          Enregistrer mon humeur
        </button>
      </section>

      <section v-if="history.length" class="px-6 md:px-20 my-12 space-y-6 text-center">
        <h2 class="text-2xl font-bold text-primary mb-8">Mon Humeur au fil du temps</h2>
        <div class="grid md:grid-cols-2 gap-24 py-10">
          <div class="relative border-l-2 border-accent pl-10 space-y-8 text-left">
            <div
                v-for="(entry, index) in history"
                :key="index"
                class=" flex flex-row items-center gap-4"
            >
              <div
                  class=" -left-6 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-3xl shadow">
                {{ entry.mood }}
              </div>
              <div>
                <p class="text-sm text-gray-400">{{ entry.date }}</p>
                <p class="text-base italic text-base-content opacity-80">{{ entry.note }}</p>
              </div>
            </div>
          </div>
          <div class="bg-base-200 bg-opacity-90 rounded-xl shadow p-6 flex items-center justify-center">
            <MoodChart :labels="chartLabels" :dataPoints="chartDataPoints" :key="chartKey"/>
          </div>
        </div>
        <button class="btn btn-error btn-sm mx-auto" @click="clearHistory">
          Supprimer l'historique
        </button>
      </section>
    </main>
  </div>
</template>
