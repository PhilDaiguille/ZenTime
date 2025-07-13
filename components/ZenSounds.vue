<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  soundOptions: Array,
});

const emit = defineEmits(["play", "stop"]);

const currentSound = ref(null);

function selectSound(sound) {
  if (currentSound.value?.name === sound.name) {
    stop();
  } else {
    currentSound.value = sound;
    emit("play", sound);
  }
}

function stop() {
  emit("stop");
  currentSound.value = null;
}

const hasCurrent = computed(() => !!currentSound.value);
</script>

<template>
  <section class="my-8 text-center">
    <p class="text-sm opacity-70 mb-6 max-w-2xl mx-auto">
      Vous pouvez choisir un son de fond pour accompagner votre écriture et
      créer une atmosphère apaisante.
    </p>

    <div class="flex flex-wrap justify-center gap-5 mb-10">
      <button
        v-for="sound in soundOptions"
        :key="sound.name"
        @click="selectSound(sound)"
        :class="[
          'w-fit px-5 py-3 rounded-full border shadow backdrop-blur-sm transition-all',
          currentSound?.name === sound.name
            ? 'bg-green-100/50 border-green-300 hover:bg-green-200/50'
            : 'bg-white/40 border-white/30 hover:bg-white/60',
        ]"
      >
        <span
          class="text-sm sm:text-base font-medium text-base-content opacity-90"
        >
          {{ sound.name }}
        </span>
      </button>
    </div>

    <div
      v-if="hasCurrent"
      class="mx-auto max-w-md bg-white/50 backdrop-blur-md border border-base-300 rounded-3xl shadow-xl p-4 flex items-center gap-4 transition-all"
    >
      <img
        :src="currentSound.image"
        :alt="currentSound.name"
        class="w-16 h-16 object-cover rounded-2xl shadow"
      />
      <div class="flex-1 text-left">
        <h3 class="text-base-content font-bold">{{ currentSound.name }}</h3>
        <p class="text-sm opacity-70">En cours de lecture...</p>
      </div>
      <button
        @click="stop"
        class="px-3 py-1 rounded-full text-sm shadow transition-all bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 border border-red-300 text-red-800 opacity-90 hover:opacity-100"
      >
        Stop
      </button>
    </div>
  </section>
</template>
