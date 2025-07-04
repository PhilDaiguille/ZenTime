<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
  entries: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['clear'])

const currentPage = ref(0)

const currentEntry = computed(() => {
  if (props.entries.length === 0) return null
  const index = props.entries.length - 1 - currentPage.value
  return index >= 0 ? props.entries[index] : null
})

const nextEntry = computed(() => {
  if (props.entries.length === 0) return null
  const index = props.entries.length - 1 - (currentPage.value + 1)
  return index >= 0 ? props.entries[index] : null
})

function getMoodLabel(mood) {
  const labels = {
    '😢': 'Triste',
    '😐': 'Neutre',
    '🙂': 'Content',
    '😁': 'Joyeux',
  }
  return labels[mood] || ''
}

function nextPage() {
  if (currentPage.value + 1 < props.entries.length) {
    currentPage.value += 2
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value -= 2
  }
}
</script>

<template>
  <div class="relative">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-medium text-base-content opacity-80">Ton Journal</h2>
      <button
          @click="$emit('clear')"
          class="text-red-500 hover:text-red-700 text-xs transition-colors opacity-60 hover:opacity-100"
      >
        Supprimer l'historique
      </button>
    </div>

    <div class="max-w-2xl mx-auto">
      <div class="relative bg-base-200 rounded-lg p-1 shadow-2xl">
        <div class="flex bg-base-100 rounded overflow-hidden h-[60vw] sm:h-[340px] lg:h-[280px]">
          <div class="flex-1 bg-white relative">
            <div class="absolute inset-0 p-4">
              <div
                  v-for="n in 9"
                  :key="n"
                  class="absolute w-full border-b border-base-300"
                  :style="{ top: (n * 24 + 20) + 'px', left: '20px', right: '20px' }"
              ></div>
            </div>
            <div class="absolute left-6 top-4 bottom-4 w-px bg-red-300"></div>
            <div class="relative z-10 p-4 pl-10 overflow-y-auto">
              <div v-if="currentEntry" class="space-y-3">
                <div class="text-right text-xs text-base-content opacity-60 mb-4">
                  {{ currentEntry.date }}
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ currentEntry.mood }}</span>
                  <span class="text-xs text-base-content opacity-80">{{ getMoodLabel(currentEntry.mood) }}</span>
                </div>
                <div class="text-base-content text-sm leading-relaxed break-words">
                  {{ currentEntry.note }}
                </div>
              </div>
              <div v-else class="flex items-center justify-center h-full text-base-content opacity-40">
                <div class="text-center">
                  <div class="text-lg mb-1">📝</div>
                  <p class="text-xs">Page vide</p>
                </div>
              </div>
            </div>
          </div>
          <div class="w-3 bg-gradient-to-b from-base-300 via-base-200 to-base-300 shadow-inner relative hidden md:block">
            <div class="absolute inset-0 flex flex-col justify-center items-center gap-4">
              <div v-for="n in 6" :key="n" class="w-px h-3 bg-base-content opacity-30"></div>
            </div>
          </div>
          <div class="flex-1 bg-white relative">
            <div class="absolute inset-0 p-4">
              <div
                  v-for="n in 9"
                  :key="n"
                  class="absolute w-full border-b border-base-300"
                  :style="{ top: (n * 24 + 20) + 'px', left: '20px', right: '20px' }"
              ></div>
            </div>
            <div class="absolute right-6 top-4 bottom-4 w-px bg-red-300"></div>
            <div class="relative z-10 p-4 pr-10 overflow-y-auto">
              <div v-if="nextEntry" class="space-y-3">
                <div class="text-left text-xs text-base-content opacity-60 mb-4">
                  {{ nextEntry.date }}
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ nextEntry.mood }}</span>
                  <span class="text-xs text-base-content opacity-80">{{ getMoodLabel(nextEntry.mood) }}</span>
                </div>
                <div class="text-base-content text-sm leading-relaxed break-words">
                  {{ nextEntry.note }}
                </div>
              </div>
              <div v-else class="flex items-center justify-center h-full text-base-content opacity-40">
                <div class="text-center">
                  <div class="text-lg mb-1">📖</div>
                  <p class="text-xs">Page vide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="entries.length > 0" class="flex justify-center mt-4">
        <div class="flex items-center gap-4 bg-base-200 px-4 py-2 rounded-full">
          <button
              @click="prevPage"
              :disabled="currentPage === 0"
              class="text-base-content opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity text-xs"
          >
            ← Précédent
          </button>
          <span class="text-xs text-base-content opacity-60">
            {{ Math.floor(currentPage / 2) + 1 }} / {{ Math.ceil(entries.length / 2) }}
          </span>
          <button
              @click="nextPage"
              :disabled="currentPage + 1 >= entries.length"
              class="text-base-content opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity text-xs"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
