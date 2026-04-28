<script setup lang="ts">
import type { Quest } from './quest.data'
import dayjs from 'dayjs'
import { withBase } from 'vitepress'
import { ref } from 'vue'
import { data as sections } from './quest.data'
import QuestClearedIcon from './QuestClearedIcon.vue'
import QuestDrawer from './QuestDrawer.vue'

const selectedQuest = ref<Quest | null>(null)

function openDrawer(quest: Quest) {
  selectedQuest.value = quest
}

function closeDrawer() {
  selectedQuest.value = null
}
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
    <div class="grid cols-2 sm:cols-3 xl:cols- gap-2 mt-4">
      <template
        v-for="(quest, index) in section.items"
        :key="quest.title"
      >
        <!-- Date Header -->
        <h4
          v-if="
            section.dateHeader
              && quest.clearedDate
              && (index === 0
                || dayjs(quest.clearedDate).format('YYYY/MM') !== dayjs(section.items[index - 1]?.clearedDate).format('YYYY/MM'))
          "
          class="col-[1/-1] mt-4!"
        >
          {{ dayjs(quest.clearedDate).format('YYYY年M月') }}
        </h4>

        <!-- Card -->
        <div
          class="quest-card p-4 bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)] rounded-lg flex flex-col gap-4 cursor-pointer hover:border-[var(--vp-c-brand-1)] transition-colors"
          @click="openDrawer(quest)"
        >
          <div class="relative">
            <div class="text-5xl pt-3">
              {{ quest.icon }}
            </div>
            <div class="mt-3">
              <a
                :href="withBase(`/quests/${quest.title}`)"
                class="font-semibold! text-sm text-inherit! no-underline! hover:underline!"
                @click.stop
              >
                {{ quest.title }}
              </a>
            </div>
            <div class="text-[var(--vp-c-text-2)] text-xs mt-1">
              {{ quest.objective }}
            </div>
            <template v-if="quest.status === 'cleared'">
              <QuestClearedIcon :cleared-date="quest.clearedDate" />
            </template>
            <Badge
              v-if="quest.status === 'active'"
              text="進行中"
              class="absolute top-0 right-0"
            />
          </div>
        </div>
      </template>
    </div>
  </div>

  <QuestDrawer :quest="selectedQuest" @close="closeDrawer" />
</template>
