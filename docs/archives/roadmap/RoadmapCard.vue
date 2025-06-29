<script setup lang="ts">
import type { RoadmapItem } from './roadmap.data'

defineProps<{ item: RoadmapItem }>()
</script>

<template>
  <div class="p-4 rounded-lg bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)]">
    <h3 class="mt-0! text-lg!">
      {{ item.title }}
    </h3>
    <div
      class="[&>*:first-child]:mt-1 [&>*:last-child]:mb-0 [&>:not(h3)]:text-[var(--vp-c-text-2)] text-sm"
      v-html="item.description"
    />
  </div>
</template>
