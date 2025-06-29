<script setup>
import { ref, computed, nextTick, onUnmounted } from 'vue'

const props = defineProps({ video: Object })

const showModal  = ref(false)
const player     = ref(null)
const iframeRef  = ref(null)

const fallbackThumb = 'https://via.placeholder.com/480x270?text=ZenTime'
const playerSrc = computed(() =>
    `https://www.youtube.com/embed/${props.video.id}?enablejsapi=1&autoplay=1&modestbranding=1&controls=0`
)

function loadYT () {
  return new Promise(res=>{
    if (window.YT?.Player) return res(window.YT)
    const tag = document.createElement('script')
    tag.src   = 'https://www.youtube.com/iframe_api'
    tag.onload = () => res(window.YT)
    document.head.appendChild(tag)
  })
}

function openPlayer(){
  showModal.value = true
  nextTick(async ()=> {
    const YT = await loadYT()
    player.value = new YT.Player(iframeRef.value,{
      events:{ onStateChange:e=>{ if(e.data===YT.PlayerState.ENDED) closePlayer() } }
    })
  })
}
function closePlayer(){
  player.value?.stopVideo?.(); player.value=null; showModal.value=false
}
onUnmounted(closePlayer)
</script>

<template>
  <div>
    <div class="relative aspect-video rounded-3xl overflow-hidden shadow-md group bg-[#fefae0]">
      <img :src="video.thumbnail || fallbackThumb"
           :alt="video.title"
           class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
      <div class="absolute bottom-0 inset-x-0 p-4 z-10">
        <div class="backdrop-blur-md bg-black/50 rounded-xl p-4 space-y-2">
          <h3 class="text-white text-sm font-semibold line-clamp-2">{{ video.title }}</h3>
          <p  class="text-white/70 text-xs">{{ video.channel }}</p>

          <button class="btn btn-sm bg-base-200 text-base-content border-none hover:bg-base-300"
                  @click="openPlayer">
            Commencer
          </button>
        </div>
      </div>
      <div v-if="video.duration"
           class="absolute top-2 left-2 bg-white/80 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
        {{ video.durationText }}
      </div>
    </div>
    <div v-if="showModal" class="modal modal-open">
      <div class="modal-box p-0 relative max-w-5xl w-full aspect-video">
        <iframe ref="iframeRef"
                class="w-full h-full"
                :src="playerSrc"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen/>
        <button class="btn btn-sm btn-circle bg-base-200 text-base-content hover:bg-base-300 absolute right-2 top-2"
                @click="closePlayer"
                aria-label="Fermer">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>