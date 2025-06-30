<script setup lang="ts">
import dayjs from 'dayjs'
import { data as sections } from './roadmap.data'
</script>

<template>
  <template v-for="section in sections" :key="section.title">
    <!-- section title -->
    <h2 v-if="section.title">
      {{ section.title }}
    </h2>

    <!-- section items -->
    <div
      v-for="(item, index) in section.items"
      :key="item.title"
      class="my-4"
    >
      <h4
        v-if="
          section.dateHeader
            && item.date
            && (index === 0
              || dayjs(item.date).format('YYYY/MM') !== dayjs(section.items[index - 1]?.date).format('YYYY/MM'))"
        class="mb-2!"
      >
        {{ dayjs(item.date).format('YYYY年M月') }}
      </h4>

      <div
        class="p-4 rounded-lg bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)]"
      >
        <h3 class="mt-0! text-lg!">
          {{ item.title }}
        </h3>
        <div
          class="[&>*:first-child]:mt-1 [&>*:last-child]:mb-0 [&>:not(h3)]:text-[var(--vp-c-text-2)] text-sm"
          v-html="item.description"
        />
      </div>
    </div>
  </template>
</template>
