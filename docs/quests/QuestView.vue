<script setup lang="ts">
import dayjs from 'dayjs'
import { withBase } from 'vitepress'
import { data as sections } from './quest.data'
import QuestClearedIcon from './QuestClearedIcon.vue'
</script>

<template>
  <div v-for="section in sections" :key="section.title">
    <!-- Section title -->
    <div
      v-if="section.title"
      class="text-2xl font-semibold mt-8 mb-4"
    >
      {{ section.title }}
    </div>

    <!-- Section items -->
    <div class="grid sm:cols-2 gap-2 mt-4">
      <template
        v-for="(quest, index) in section.items"
        :key="quest.title"
      >
        <!-- Date Header -->
        <h4
          v-if="
            section.dateHeader
              && quest.date
              && (index === 0
                || dayjs(quest.date).format('YYYY/MM') !== dayjs(section.items[index - 1]?.date).format('YYYY/MM'))
          "
          class="col-[1/-1] mt-4!"
        >
          {{ dayjs(quest.date).format('YYYY年M月') }}
        </h4>

        <!-- Card -->
        <div
          class="p-4 bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)] rounded-lg flex flex-col gap-4"
        >
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
            <template v-if="quest.status === 'cleared'">
              <QuestClearedIcon :date="quest.date" />
            </template>
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
    </div>
  </div>
</template>
