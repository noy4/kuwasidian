<script setup lang="ts">
import type { RoadmapItem } from '../theme/roadmap.data'

defineProps<{ item: RoadmapItem }>()
</script>

<template>
  <div class="p-6 rounded-lg bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)]">
    <div v-html="item.content" />
  </div>
</template>
