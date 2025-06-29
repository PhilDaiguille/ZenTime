<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useYouTubeSearch } from '@/composables/useYouTubeSearch'
import SessionCard from '@/components/SessionCard.vue'
import UFilterBar from '@/components/UFilterBar.vue'
import SessionBackground from '@/components/ZenWave.vue'

const filters = reactive({ theme: 'tous', duration: 'tous', type: 'tous' })
const { sessions, isLoading: loading, search } = useYouTubeSearch()
const error = ref('')
const lastSearch = ref('')
const fromCache = ref(false)

const audioResults = ref([])
const videoResults = ref([])

onMounted(() => {
  loadDefaultContent()
})

function updateFilters(next) {
  Object.assign(filters, next)
  if (lastSearch.value) {
    setTimeout(() => {
      fetchVideos()
    }, 300)
  }
}

function buildKeyword(type = null) {
  const selectedType = type || filters.type
  let baseKeyword = ''

  if (filters.theme !== 'tous') {
    baseKeyword = filters.theme
  }

  if (selectedType === 'audio') {
    baseKeyword = `${baseKeyword} relaxing music ambient calm sleep focus meditation music`.trim()
  } else if (selectedType === 'video') {
    baseKeyword = `${baseKeyword} guided meditation relaxation hypnosis mindfulness yoga zen breathing`.trim()
  } else {
    baseKeyword = baseKeyword || 'relaxation meditation nature'
  }

  return baseKeyword
}

const CACHE_KEY = 'ytCacheZenTime'
function readCache(q) {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null
  const cache = JSON.parse(raw)
  const entry = cache[q]
  if (!entry) return null
  if (Date.now() - entry.time > 6 * 60 * 60 * 1000) {
    delete cache[q]
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    return null
  }
  return entry.data
}
function writeCache(q, data) {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  cache[q] = { time: Date.now(), data }
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

function applyDurationFilter(videos) {
  if (filters.duration === 'tous') return videos

  return videos.filter(video => {
    if (!video.duration) {
      const title = video.title.toLowerCase()
      switch (filters.duration) {
        case 'court':
          return title.includes('5 min') || title.includes('3 min') ||
              title.includes('short') || title.includes('court')
        case 'moyen':
          return title.includes('10 min') || title.includes('15 min') ||
              title.includes('20 min') || title.includes('medium')
        case 'long':
          return title.includes('30 min') || title.includes('1 hour') ||
              title.includes('2 hour') || title.includes('3 hour') ||
              title.includes('long') || title.includes('extended')
        default:
          return true
      }
    }

    const durationInSeconds = video.duration
    switch (filters.duration) {
      case 'court':
        return durationInSeconds < 300 // < 5 minutes
      case 'moyen':
        return durationInSeconds >= 300 && durationInSeconds <= 1200 // 5-20 minutes
      case 'long':
        return durationInSeconds > 1200 // > 20 minutes
      default:
        return true
    }
  })
}

async function fetchVideos() {
  const q = buildKeyword()
  lastSearch.value = q
  fromCache.value = false
  error.value = ''

  try {
    if (filters.type === 'tous') {
      await Promise.all([
        fetchAudioVideos(),
        fetchVideoContent()
      ])
    } else if (filters.type === 'audio') {
      await fetchAudioVideos()
      videoResults.value = []
    } else if (filters.type === 'video') {
      await fetchVideoContent()
      audioResults.value = []
    }
  } catch (e) {
    console.error('Erreur YouTube API', e)
    error.value = 'Erreur de chargement. Veuillez réessayer.'
  }
}

async function loadDefaultContent() {
  try {
    const defaultAudioQuery = 'relaxing music ambient calm sleep'

    const queries = [
      'guided meditation mindfulness',
      'relaxation breathing zen',
      'hypnosis sleep therapy',
      'yoga relaxation',
      'ASMR sleep meditation'
    ]

    const allVideoResults = []
    for (const query of queries) {
      await search(query, '', 'video')
      allVideoResults.push(...sessions.value.slice(0, 2))
    }

    await loadDefaultAudio(defaultAudioQuery)

    videoResults.value = allVideoResults.slice(0, 12)
    lastSearch.value = 'Contenu par défaut'
  } catch (e) {
    console.error('Erreur chargement par défaut', e)
    await fetchVideos()
  }
}

async function loadDefaultAudio(query) {
  const cached = readCache(`default_audio_${query}`)

  if (cached) {
    audioResults.value = cached
    fromCache.value = true
    return
  }

  await search(query, '', 'audio')
  const results = sessions.value.slice(0, 6)
  audioResults.value = results
  writeCache(`default_audio_${query}`, results)
}

async function fetchAudioVideos() {
  const q = buildKeyword('audio')
  const cached = readCache(`audio_${q}_${filters.duration}`)

  if (cached) {
    audioResults.value = cached
    fromCache.value = true
    return
  }

  await search(q, '', 'audio')
  const filteredResults = applyDurationFilter(sessions.value)
  audioResults.value = filteredResults
  writeCache(`audio_${q}_${filters.duration}`, filteredResults)
}

async function fetchVideoContent() {
  const q = buildKeyword('video')
  const cached = readCache(`video_${q}_${filters.duration}`)

  if (cached) {
    videoResults.value = cached
    fromCache.value = true
    return
  }

  await search(q, '', 'video')
  const filteredResults = applyDurationFilter(sessions.value)
  videoResults.value = filteredResults
  writeCache(`video_${q}_${filters.duration}`, filteredResults)
}

const audioVideos = computed(() => {
  if (filters.type === 'video') return []
  return audioResults.value
})

const guidedVideos = computed(() => {
  if (filters.type === 'audio') return []
  return videoResults.value
})
</script>

<template>
  <div class="relative min-h-screen bg-[#fff9f0] pt-24 pb-32">
    <SessionBackground />
    <section class="relative z-10 max-w-6xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row sm:items-end gap-4">
        <UFilterBar :model-value="filters" @update:model-value="updateFilters" />
        <button
            class="btn btn-primary self-start sm:self-auto"
            :disabled="loading"
            @click="fetchVideos"
        >
          🔍 Rechercher
        </button>
      </div>
    </section>
    <section
        v-if="filters.type === 'audio' || filters.type === 'tous'"
        class="relative z-10 max-w-6xl mx-auto px-4 mt-10"
    >
      <h2 class="text-2xl font-bold mb-4">Musique relaxante 🎵</h2>
      <div v-if="loading" class="text-center py-16 text-xl font-medium">Chargement de la musique relaxante…</div>
      <div v-else-if="error" class="text-center py-16 text-error">{{ error }}</div>
      <div v-else-if="audioVideos.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SessionCard v-for="v in audioVideos" :key="v.id" :video="v" />
      </div>
      <div v-else-if="!audioVideos.length && !loading && (filters.type === 'audio' || filters.type === 'tous')" class="text-center py-16 text-neutral">
        {{ lastSearch ? 'Aucune musique trouvée pour cette recherche.' : 'Cliquez sur "Rechercher" pour découvrir de la musique relaxante.' }}
      </div>
    </section>
    <section
        v-if="filters.type === 'video' || filters.type === 'tous'"
        class="relative z-10 max-w-6xl mx-auto px-4 mt-12"
    >
      <h2 class="text-2xl font-bold mb-4">Vidéos YouTube 🧘‍♀️</h2>
      <div v-if="loading" class="text-center py-16 text-xl font-medium">Chargement des vidéos guidées…</div>
      <div v-else-if="error" class="text-center py-16 text-error">{{ error }}</div>
      <div v-else-if="guidedVideos.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SessionCard v-for="v in guidedVideos" :key="v.id" :video="v" />
      </div>
      <div v-else-if="!guidedVideos.length && !loading && (filters.type === 'video' || filters.type === 'tous')" class="text-center py-16 text-neutral">
        {{ lastSearch ? 'Aucune vidéo ne correspond à vos filtres.' : 'Cliquez sur "Rechercher" pour découvrir des vidéos de méditation.' }}
      </div>
    </section>
  </div>
</template>