<script setup lang="ts">
import type { RoadmapItem } from '../theme/roadmap.data'

defineProps<{ item: RoadmapItem }>()
</script>

<template>
  <div class="vp-raw rounded-lg overflow-hidden bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)]">
    <div class="p-6">
      <h3 class="text-lg font-semibold text-[var(--vp-c-text-1)]">
        {{ item.title }}
      </h3>
      <p
        v-if="item.content"
        class="text-sm text-[var(--vp-c-text-2)] whitespace-pre-line mt-1"
      >
        {{ item.content }}
      </p>
    </div>
  </div>
</template>
