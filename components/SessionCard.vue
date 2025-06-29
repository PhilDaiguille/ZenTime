<template>
  <div>
    <!-- CARD -->
    <div class="relative aspect-video rounded-3xl overflow-hidden shadow-md group bg-[#fefae0]">
      <img
          :src="video.thumbnail || fallbackThumb"
          :alt="video.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div class="backdrop-blur-md bg-black/50 rounded-xl p-4 space-y-2">
          <h3 class="text-white text-sm font-semibold line-clamp-2">{{ video.title }}</h3>
          <p class="text-white/70 text-xs">{{ video.channel }}</p>
          <button
              class="mt-2 px-4 py-1.5 bg-white text-[#285d67] text-sm font-semibold rounded-full hover:bg-[#f2eed0] transition"
              @click="openPlayer"
          >
            Commencer
          </button>
        </div>
      </div>
      <div
          v-if="video.duration"
          class="absolute top-2 left-2 bg-white/80 text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-md z-10"
      >
        {{ video.duration }}
      </div>
    </div>

    <!-- MODAL PLAYER -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-xl">
        <iframe
            ref="iframeRef"
            class="w-full h-full"
            :src="playerSrc"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
        <button
            class="absolute top-3 right-3 px-3 py-1 bg-white/90 text-red-500 rounded-full text-xs font-bold hover:bg-white"
            @click="closePlayer"
        >
          ✕ Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue'

const props = defineProps({ video: Object })

const showModal = ref(false)
const player = ref(null)
const iframeRef = ref(null)

const fallbackThumb = 'https://via.placeholder.com/480x270?text=ZenTime'
const playerSrc = computed(() =>
    `https://www.youtube.com/embed/${props.video.id}?enablejsapi=1&autoplay=1&modestbranding=1&controls=0`
)

function loadYT() {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT)
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.onload = () => resolve(window.YT)
    document.head.appendChild(tag)
  })
}

function openPlayer() {
  showModal.value = true
  nextTick(async () => {
    const YT = await loadYT()
    player.value = new YT.Player(iframeRef.value, {
      events: {
        onReady: () => {},
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) closePlayer()
        },
      },
    })
  })
}

function closePlayer() {
  if (player.value?.stopVideo) player.value.stopVideo()
  player.value = null
  showModal.value = false
}

onUnmounted(closePlayer)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
