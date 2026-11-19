<script setup lang="ts">
import { withBase } from 'vitepress'
import { data } from '../.vitepress/data/home.data'

const reports = data.reports
</script>

<template>
  <div class="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
    <a
      v-for="report in reports"
      :key="report.link"
      :href="withBase(report.link)"
      class="report-card group"
    >
      <img
        v-if="report.cover"
        :src="withBase(report.cover)"
        :alt="report.title"
        class="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      >
      <div
        v-else
        class="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[var(--vp-c-brand-1)] to-[var(--vp-c-brand-3)] text-white text-lg font-semibold"
      >
        桑記 {{ report.volume }}巻{{ report.chapter }}章
      </div>
      <div class="p-3">
        <div class="font-semibold text-sm text-[var(--vp-c-text-1)] line-clamp-2">
          {{ report.title }}
        </div>
        <div class="text-[var(--vp-c-text-2)] text-xs mt-1">
          {{ report.month }}
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
.report-card {
  display: block;
  border-radius: 0.5rem;
  border: 0.5px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  overflow: hidden;
  text-decoration: none;
  transition: border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.report-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@media (hover: hover) {
  .report-card:hover {
    border-color: var(--vp-c-brand-1);
  }
}
</style>
