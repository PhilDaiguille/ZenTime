<script setup>
import { computed } from 'vue'
const props = defineProps({ modelValue: Object })
const emit  = defineEmits(['update:modelValue'])
const local = computed({
  get: () => props.modelValue,
  set: v  => emit('update:modelValue', structuredClone(v))
})
</script>

<template>
  <div class="flex flex-wrap justify-center gap-4">
    <!-- Thème -->
    <div class="form-control w-44">
      <label class="label"><span class="label-text text-sm font-medium">Thème</span></label>
      <select v-model="local.theme" class="select select-bordered glass rounded-xl shadow-md text-sm">
        <option value="tous">Tous</option><option value="sommeil">Sommeil</option>
        <option value="relaxation">Relaxation</option><option value="méditation">Méditation</option>
      </select>
    </div>

    <!-- Durée -->
    <div class="form-control w-44">
      <label class="label"><span class="label-text text-sm font-medium">Durée</span></label>
      <select v-model="local.duration" class="select select-bordered glass rounded-xl shadow-md text-sm">
        <option value="tous">Toutes</option><option value="court">Courte (&lt;5 min)</option>
        <option value="moyen">Moyenne (5–20 min)</option><option value="long">Longue (&gt;20 min)</option>
      </select>
    </div>

    <!-- Type -->
    <div class="form-control w-44">
      <label class="label"><span class="label-text text-sm font-medium">Type</span></label>
      <select v-model="local.type" class="select select-bordered glass rounded-xl shadow-md text-sm">
        <option value="tous">Tous</option><option value="video">Vidéo</option><option value="audio">Audio</option>
      </select>
    </div>
  </div>
</template>
