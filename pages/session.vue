<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useYouTubeSearch } from '~/composables/useYouTubeSearch'
import SessionCard from '~/components/SessionCard.vue'
import UFilterBar from '~/components/UFilterBar.vue'
import ZenWave from '~/components/ZenWave.vue'

const filters      = reactive({ theme: 'tous', duration: 'tous', type: 'tous' })
const { sessions, isLoading: loading, search } = useYouTubeSearch()

const error        = ref('')
const lastSearch   = ref('')
const fromCache    = ref(false)

const audioResults = ref([])
const videoResults = ref([])

onMounted(loadDefaultContent)

function updateFilters (next) {
  Object.assign(filters, next)
  if (lastSearch.value) setTimeout(fetchVideos, 300)
}

function buildKeyword (type = null) {
  const t = type || filters.type
  const base = filters.theme !== 'tous' ? filters.theme : ''
  if (t === 'audio')  return `${base} relaxing music ambient calm sleep focus meditation music`.trim()
  if (t === 'video')  return `${base} guided meditation relaxation hypnosis mindfulness yoga zen breathing`.trim()
  return base || 'relaxation meditation nature'
}

const CACHE_KEY = 'ytCacheZenTime'
const readCache = q => {
  const all = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  const e   = all[q]
  if (!e) return null
  if (Date.now() - e.time > 6*60*60*1000) { delete all[q]; localStorage.setItem(CACHE_KEY, JSON.stringify(all)); return null }
  return e.data
}
const writeCache = (q,data) => {
  const all = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  all[q] = { time: Date.now(), data }
  localStorage.setItem(CACHE_KEY, JSON.stringify(all))
}

function applyDurationFilter (arr) {
  if (filters.duration === 'tous') return arr
  return arr.filter(v => {
    const d = v.duration || 0
    if (!d) return true
    if (filters.duration==='court') return d<300
    if (filters.duration==='moyen') return d>=300 && d<=1200
    if (filters.duration==='long')  return d>1200
    return true
  })
}

async function fetchAudioVideos () {
  const q = buildKeyword('audio')
  const c = readCache(`audio_${q}_${filters.duration}`)
  if (c) { audioResults.value = c; fromCache.value = true; return }
  await search(q,'','audio')
  const res = applyDurationFilter(sessions.value)
  audioResults.value = res
  writeCache(`audio_${q}_${filters.duration}`,res)
}

async function fetchVideoContent () {
  const q = buildKeyword('video')
  const c = readCache(`video_${q}_${filters.duration}`)
  if (c) { videoResults.value = c; fromCache.value = true; return }
  await search(q,'','video')
  const res = applyDurationFilter(sessions.value)
  videoResults.value = res
  writeCache(`video_${q}_${filters.duration}`,res)
}

async function fetchVideos () {
  error.value=''; fromCache.value=false; lastSearch.value = buildKeyword()
  try {
    if (filters.type==='audio') { await fetchAudioVideos(); videoResults.value=[] }
    else if (filters.type==='video'){ await fetchVideoContent(); audioResults.value=[] }
    else { await Promise.all([fetchAudioVideos(),fetchVideoContent()]) }
  } catch(e){ console.error(e); error.value='Erreur de chargement.' }
}

async function loadDefaultContent () {
  try {
    await fetchAudioVideos()
    await fetchVideoContent()
    lastSearch.value = 'Contenu par défaut'
  } catch(e){ await fetchVideos() }
}

const audioVideos  = computed(() => filters.type==='video' ? [] : audioResults.value)
const guidedVideos = computed(() => filters.type==='audio' ? [] : videoResults.value)
</script>

<template>
  <div class="relative min-h-screen bg-[#fff9f0] pt-24 pb-32">
    <ZenWave />
    <section class="relative z-10 max-w-6xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row sm:items-end gap-4">
        <UFilterBar :model-value="filters" @update:model-value="updateFilters" />
        <button
            class="btn bg-base-200 text-base-content border-none hover:bg-base-300 transition"
            :disabled="loading"
            @click="fetchVideos"
        >
          🔍 Rechercher
        </button>
      </div>
    </section>
    <section v-if="filters.type==='audio'||filters.type==='tous'"
             class="relative z-10 max-w-6xl mx-auto px-4 mt-10">
      <h2 class="text-2xl font-bold mb-4">Musique relaxante 🎵</h2>

      <div v-if="loading"      class="text-center py-16">Chargement…</div>
      <div v-else-if="error"   class="text-center py-16 text-error">{{ error }}</div>

      <div v-else-if="audioVideos.length"
           class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SessionCard v-for="v in audioVideos" :key="v.id" :video="v" />
      </div>

      <div v-else class="text-center py-16 text-neutral">
        {{ lastSearch ? 'Aucune musique trouvée.' : 'Cliquez sur « Rechercher ».' }}
      </div>
    </section>
    <section v-if="filters.type==='video'||filters.type==='tous'"
             class="relative z-10 max-w-6xl mx-auto px-4 mt-12">
      <h2 class="text-2xl font-bold mb-4">Vidéos YouTube 🧘‍♀️</h2>
      <div v-if="loading"      class="text-center py-16">Chargement…</div>
      <div v-else-if="error"   class="text-center py-16 text-error">{{ error }}</div>
      <div v-else-if="guidedVideos.length"
           class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SessionCard v-for="v in guidedVideos" :key="v.id" :video="v" />
      </div>
      <div v-else class="text-center py-16 text-neutral">
        {{ lastSearch ? 'Aucune vidéo trouvée.' : 'Cliquez sur « Rechercher ».' }}
      </div>
    </section>
  </div>
</template>
