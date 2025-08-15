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
    class="text-sm transition-colors duration-100 px-2 py-1 rounded w-full text-start"
    :class="[
      earth.currentLocationIndex.value === index
        ? 'text-white bg-white/20'
        : 'text-white/60 hover:bg-white/10 hover:text-white',
    ]"
    @click="earth.goToLocation(index)"
  >
    {{ index + 1 }}. {{ location.name }}

    <div class="flex">
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
  </button>
</template>
