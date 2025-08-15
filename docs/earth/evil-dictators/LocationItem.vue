<script setup lang="ts">
import type { DictatorLocation, Earth } from './Earth'

defineProps<{
  earth: Earth
  location: DictatorLocation
  index: number
}>()

function formatNumber(num: number): string {
  if (num == null || Number.isNaN(num))
    return ''
  let result = ''
  if (num >= 1_0000) {
    result += `${Math.floor(num / 1_0000)}万`
    num = num % 1_0000
  }
  if (num > 0 || result === '') {
    result += num.toString()
  }
  return result
}
</script>

<template>
  <button
    class="text-sm transition-colors duration-100 px-2 py-1 rounded flex items-center text-start"
    :class="[
      earth.currentLocationIndex.value === index
        ? 'text-white bg-white/20'
        : 'text-white/60 hover:bg-white/10 hover:text-white',
    ]"
    @click="earth.goToLocation(index)"
  >
    <div class="w-4">
      {{ index + 1 }}.
    </div>

    <div class="w-9 h-9 bg-red rounded-full mr-2 relative overflow-hidden">
      <img :src="location.icon" class="absolute inset-0 object-cover">
    </div>

    <div class="flex-1">
      <div class="flex flex-wrap">
        <span class="font-semibold">{{ location.name }}</span>
        <span>（{{ location.country }}）</span>
        <span class="ml-auto">
          {{
            [
              formatNumber(location.min_death_count),
              location.min_death_count !== location.max_death_count
                && `-${formatNumber(location.max_death_count)}`,
              '人',
            ].filter(Boolean).join('')
          }}
        </span>
      </div>
    </div>
  </button>
</template>
