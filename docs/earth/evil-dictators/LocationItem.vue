<script setup lang="ts">
import type { DictatorLocation, Earth } from './Earth'

defineProps<{
  earth: Earth
  location: DictatorLocation
  index: number
}>()
</script>

<template>
  <button
    class="text-sm transition-colors duration-100 px-2 py-1 rounded flex flex-wrap w-full text-start"
    :class="[
      earth.currentLocationIndex.value === index
        ? 'text-white bg-white/20'
        : 'text-white/60 hover:bg-white/10 hover:text-white',
    ]"
    @click="earth.goToLocation(index)"
  >
    {{ index + 1 }}. {{ location.name }}（{{ location.country }}）
    <div class="flex-1" />
    <span class="ml-auto">{{ location.min_death_count.toLocaleString() }}</span>
  </button>
</template>
