<script setup lang="ts">
import type { RecentUpdate } from './recent-updates.util'
import dayjs from 'dayjs'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  items: RecentUpdate[]
  limit?: number
  showStatus?: boolean
}>(), {
  limit: 0,
  showStatus: false,
})

const updates = computed(() => props.limit > 0 ? props.items.slice(0, props.limit) : props.items)

function formatDate(date: string) {
  return dayjs(date).format('YYYY/MM/DD')
}

function badge(status: string) {
  if (status === 'A')
    return { type: 'tip' as const, text: 'Added' }
  if (status === 'D')
    return { type: 'danger' as const, text: 'Deleted' }
  if (status.startsWith('R'))
    return { type: 'warning' as const, text: 'Renamed' }
  return null
}
</script>

<template>
  <div
    v-if="updates.length"
    class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2"
  >
    <div
      v-for="item in updates"
      :key="item.filePath"
      class="update-card"
    >
      <div
        class="update-preview h-[160px] overflow-y-auto border-b-0.5 border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] p-3"
        tabindex="0"
      >
        <div
          class="prose prose-sm max-w-none! [&>*:first-child]:mt-0"
          v-html="item.html"
        />
      </div>
      <div class="p-3">
        <a
          :href="item.link"
          class="block text-sm text-[var(--vp-c-text-1)] no-underline! hover:text-[var(--vp-c-brand-1)] transition-colors line-clamp-2"
        >
          {{ item.title }}
        </a>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs text-[var(--vp-c-text-2)]">
            {{ formatDate(item.date) }}
          </span>
          <Badge
            v-if="showStatus && badge(item.status)"
            :type="badge(item.status)?.type"
            :text="badge(item.status)?.text"
          />
        </div>
      </div>
    </div>
  </div>
  <p v-else class="text-sm text-[var(--vp-c-text-2)] my-0!">
    更新はありません。
  </p>
</template>

<style scoped>
.update-card {
  display: block;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 0.5px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  transition: border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.update-preview {
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-divider) transparent;
}

.update-preview::-webkit-scrollbar {
  width: 6px;
}

.update-preview::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: var(--vp-c-divider);
}

.update-preview:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

@media (hover: hover) {
  .update-card:hover {
    border-color: var(--vp-c-brand-1);
  }
}
</style>
