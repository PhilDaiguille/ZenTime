<!-- components/ZenPagination.vue -->
<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
    <!-- Bouton Précédent -->
    <button
        @click="$emit('prev')"
        :disabled="currentPage === 1 || loading"
        class="px-4 py-2 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      ← Précédent
    </button>

    <!-- Numéros de pages -->
    <div class="flex gap-1">
      <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('goto', page)"
          :disabled="loading"
          :class="{
          'bg-amber-500 text-white': page === currentPage,
          'bg-white hover:bg-amber-50 border border-amber-200': page !== currentPage
        }"
          class="w-10 h-10 rounded-lg transition-colors disabled:opacity-50"
      >
        {{ page }}
      </button>
    </div>

    <!-- Bouton Suivant -->
    <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages || loading"
        class="px-4 py-2 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      Suivant →
    </button>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="ml-4 flex items-center gap-2 text-amber-600">
      <div class="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
      <span class="text-sm">Chargement...</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['prev', 'next', 'goto'])

// Calculer les pages visibles (max 5 pages)
const visiblePages = computed(() => {
  const maxVisible = 5
  const total = props.totalPages
  const current = props.currentPage

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>