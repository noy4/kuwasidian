<script setup lang="ts">
import type { Quest } from './quest.data'
import { withBase } from 'vitepress'

defineProps<{ quest: Quest }>()
</script>

<template>
  <div class="p-4 bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)] rounded-lg flex flex-col gap-4">
    <div class="relative">
      <div class="text-6xl pt-3">
        {{ quest.icon }}
      </div>
      <a :href="withBase(`/quests/${quest.title}`)" class="font-semibold text-lg mt-3 decoration-none! block text-inherit!">
        {{ quest.title }}
      </a>
      <div class="text-[var(--vp-c-text-2)] text-xs mt-1">
        {{ quest.objective }}
      </div>

      <img
        v-if="quest.status === 'cleared'"
        src="/quest_cleared.png"
        class="absolute top-0 right-0 w-30"
      >

      <Badge
        v-if="quest.status === 'active'"
        text="進行中"
        class="absolute top-0 right-0"
      />
    </div>

    <div
      v-if="quest.description"
      class="flex-1 text-sm bg-[var(--vp-c-bg)] border-0.5 border-[var(--vp-c-divider)] px-4 rounded-lg"
    >
      <div v-html="quest.description" />
    </div>
  </div>
</template>
