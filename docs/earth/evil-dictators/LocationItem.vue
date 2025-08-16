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
        （{{ location.country }}）
      </div>

      <div class="text-xs text-white/70">
        {{ location.description }}
      </div>

      <div class="text-right">
        {{
          [
            formatNumber(location.min_death_count),
            location.min_death_count !== location.max_death_count
              && `-${formatNumber(location.max_death_count)}`,
            '人',
          ].filter(Boolean).join('')
        }}
      </div>
    </div>
  </button>
</template>
