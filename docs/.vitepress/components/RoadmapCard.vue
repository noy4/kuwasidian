<script setup lang="ts">
import type { RoadmapItem } from '../theme/roadmap.data'

defineProps<{ item: RoadmapItem }>()
</script>

<template>
  <div class="p-6 rounded-lg bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)]">
    <div
      class="[&>h3]:mt-0 [&>*:last-child]:mb-0 [&>:not(h3)]:text-[var(--vp-c-text-2)]"
      v-html="item.content"
    />
  </div>
</template>
