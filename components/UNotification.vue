<script setup lang="ts">
defineProps({
  visible: Boolean,
  message: String,
});
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 scale-95"
    leave-to-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-from-class="opacity-100 scale-100"
  >
    <div
      v-if="visible"
      class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md"
    >
      <div
        class="bg-base-200 text-base-content px-6 py-3 rounded-2xl shadow-lg"
      >
        {{ message }}
      </div>
    </div>
  </Transition>
</template>
