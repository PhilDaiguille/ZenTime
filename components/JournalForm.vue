<script setup lang="ts">
const props = defineProps({
  moods: {
    type: Array,
    required: true,
  },
  selectedMood: {
    type: String,
    default: "",
  },
  note: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:mood", "update:note", "save"]);
</script>

<template>
  <div
    class="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 max-w-md w-full"
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
        :class="[
          'text-3xl sm:text-4xl lg:text-5xl p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110',
          selectedMood === mood
            ? 'scale-125 bg-base-200 shadow-lg'
            : 'opacity-60 hover:opacity-100',
        ]"
        @click="$emit('update:mood', mood)"
      >
        {{ mood }}
      </button>
    </div>

    <textarea
      :value="note"
      @input="$emit('update:note', $event.target.value)"
      class="w-full p-3 sm:p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-base-content focus:outline-none resize-none transition-colors text-sm sm:text-base"
      placeholder="Écris librement tes pensées, tes gratitudes, tes émotions..."
      rows="4"
    />

    <button
      class="w-full mt-6 bg-base-200 hover:bg-base-300 text-base-content font-semibold py-3 px-6 rounded-2xl transition-colors shadow-lg text-sm sm:text-base"
      @click="$emit('save')"
    >
      Enregistrer mon humeur
    </button>
  </div>
</template>
