<script setup lang="ts">
const _props = defineProps({
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

const _emit = defineEmits(["update:mood", "update:note", "save"]);
</script>

<template>
  <div
    class="bg-base-100 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-primary max-w-lg w-full"
  >
    <h2
      class="text-xl sm:text-2xl font-bold text-base-content mb-6 text-center"
    >
      Quel est ton ressenti aujourd'hui?
    </h2>

    <div class="flex justify-center gap-3 sm:gap-4 mb-6 flex-wrap">
      <button
        v-for="mood in moods"
        :key="mood.value"
        :class="[
          'p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 border-1',
          selectedMood === mood.value
            ? 'scale-125 bg-base-200 shadow-lg border-base'
            : 'opacity-60 hover:opacity-100 border-transparent',
        ]"
        @click="$emit('update:mood', mood.value)"
      >
        <img
          :src="mood.image"
          alt=""
          class="w-10 h-10 sm:w-12 sm:h-12 object-contain"
        />
      </button>
    </div>

    <textarea
      :value="note"
      class="w-full p-3 sm:p-4 rounded-2xl bg-base-200 border border-primary focus:border-primary focus:outline-none resize-none transition-colors text-sm sm:text-base"
      placeholder="Écris librement tes pensées, tes gratitudes, tes émotions..."
      rows="4"
      maxLength="250"
      @input="$emit('update:note', $event.target.value)"
    />

    <button
      class="w-full mt-6 bg-primary hover:bg-base-300 text-base-content font-semibold py-3 px-6 rounded-2xl transition-colors shadow-lg text-sm sm:text-base"
      @click="$emit('save')"
    >
      Enregistrer mon humeur
    </button>
  </div>
</template>
