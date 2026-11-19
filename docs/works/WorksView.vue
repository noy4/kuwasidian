<script setup lang="ts">
import dayjs from 'dayjs'
import { withBase } from 'vitepress'
import { data as sections } from './work.data'

const works = sections
  .filter(section => section.hidden !== 'true')
  .flatMap(section => section.items)

function isImageIcon(icon?: string) {
  return !!icon && /^(?:https?:\/\/|\/|\.\/)|\.(?:png|jpe?g|webp|svg|avif)$/i.test(icon)
}

function formatReleased(released?: string) {
  return released ? dayjs(released).format('YYYY.MM') : ''
}

function iconSrc(icon?: string) {
  if (!icon)
    return ''
  if (/^(?:https?:\/\/|\/)/.test(icon))
    return icon
  return withBase(`/${icon.replace(/^\.\//, '')}`)
}
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2">
    <div
      v-for="work in works"
      :key="work.title"
      class="works-card group"
      :title="work.description"
    >
      <img
        v-if="isImageIcon(work.icon)"
        :src="iconSrc(work.icon)"
        :alt="work.title"
        class="w-14 h-14 rounded-lg object-contain"
        loading="lazy"
      >
      <div v-else class="text-5xl">
        {{ work.icon }}
      </div>

      <div class="flex items-baseline justify-between gap-2 mt-3">
        <a
          v-if="work.url"
          :href="work.url"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold text-[var(--vp-c-text-1)] no-underline! hover:text-[var(--vp-c-brand-1)] transition-colors"
        >
          {{ work.title }}
        </a>
        <div v-else class="font-semibold">
          {{ work.title }}
        </div>
        <span
          v-if="work.released"
          class="text-xs text-[var(--vp-c-text-2)] shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {{ formatReleased(work.released) }}
        </span>
      </div>

      <div class="text-[var(--vp-c-text-2)] text-xs mt-1">
        {{ work.objective }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.works-card {
  padding: 1rem;
  border-radius: 0.5rem;
  border: 0.5px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  transition: border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) {
  .works-card:hover {
    border-color: var(--vp-c-brand-1);
  }
}
</style>
