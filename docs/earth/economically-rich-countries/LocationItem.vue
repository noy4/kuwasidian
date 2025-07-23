<script setup lang="ts">
import type { Earth, GDPLocation } from './Earth'

defineProps<{
  earth: Earth
  location: GDPLocation
  index: number
}>()
</script>

<template>
  <button
    class="text-sm transition-colors duration-100 px-2 py-1 rounded w-full flex text-start"
    :class="[
      earth.currentLocationIndex.value === index
        ? 'text-white bg-white/20'
        : 'text-white/60 hover:bg-white/10 hover:text-white',
    ]"
    @click="earth.goToLocation(index)"
  >
    {{ index + 1 }}. {{ location.name }}
    <div class="flex-1" />
    <template v-if="location.gdp_ppp !== -1">
      ${{ location.gdp_ppp.toLocaleString() }}
    </template>
  </button>
</template>
