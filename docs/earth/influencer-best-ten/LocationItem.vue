<script setup lang="ts">
import type { Earth, InfluencerLocation } from './Earth'

defineProps<{
  earth: Earth
  location: InfluencerLocation
  index: number
}>()
</script>

<template>
  <button
    class="text-sm duration-100 px-2 py-1 rounded flex text-start text-white"
    :class="[
      earth.currentLocationIndex.value === index
        ? 'bg-white/20'
        : 'opacity-60 hover:opacity-100 hover:bg-white/10',
    ]"
    @click="earth.goToLocation(index)"
  >
    <div class="w-12 h-12 bg-red rounded mr-2 relative overflow-hidden">
      <img :src="location.icon" class="absolute inset-0 object-cover">
    </div>

    <div class="flex-1">
      <div>
        {{ index + 1 }}.
        <span class="font-semibold">{{ location.name }}</span>
        （{{ location.field }}）
      </div>

      <div class="text-xs text-white/70">
        {{ location.description }}
      </div>

      <div class="text-right text-xs">
        {{
          location.birth_year < 0
            ? `前${Math.abs(location.birth_year)}`
            : location.birth_year
        }}{{
          location.death_year
            ? (location.death_year < 0
              ? `-前${Math.abs(location.death_year)}`
              : `-${location.death_year}`)
            : ''
        }}年
      </div>
    </div>
  </button>
</template>
