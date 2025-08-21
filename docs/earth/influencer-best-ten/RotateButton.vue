<script setup lang="ts">
import type { Earth } from './Earth'

defineProps<{
  earth: Earth
}>()
</script>

<template>
  <div class="absolute bottom-3 right-4">
    <button
      title="回転（Space）"
      class="btn btn-circle flex flex-col gap-1 shadow"
      :class="earth.isRotating.value ? 'text-primary' : 'text-base-content/50!'"
      @click="earth.rotation.toggle()"
    >
      <i
        :class="earth.isRotating.value ? 'i-lucide-refresh-cw' : 'i-lucide-refresh-cw-off'"
        class="w-5 h-5 shrink-0"
      />
      <span class="text-2 line-height-none">回転</span>
    </button>
  </div>
</template>
