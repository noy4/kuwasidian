<script setup lang="ts">
import type { Quest } from '../theme/quest.data'
import { md } from '../utils'

defineProps<{ quest: Quest }>()
</script>

<template>
  <div class="p-4 bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)] rounded-lg flex flex-col gap-4">
    <div class="relative">
      <div class="text-6xl py-3">
        {{ quest.icon }}
      </div>
      <div class="font-semibold text-lg">
        {{ quest.title }}
      </div>
      <div class="text-[var(--vp-c-text-2)] text-xs mt-1">
        {{ quest.target }}
      </div>
      <img
        v-if="quest.status === 'cleared'"
        src="../theme/quest_cleared.png" class="absolute top-0 right-0 w-30"
      >
    </div>

    <div
      v-if="quest.description"
      class="flex-1 text-sm bg-[var(--vp-c-bg)] border-0.5 border-[var(--vp-c-divider)] px-4 rounded-lg"
    >
      <div v-html="md.render(quest.description || '')" />
    </div>
  </div>
</template>
