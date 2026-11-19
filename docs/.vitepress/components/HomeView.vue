<script setup lang="ts">
import dayjs from 'dayjs'
import { withBase } from 'vitepress'
import { data as sections } from '../../quests/quest.data'
import QuestClearedIcon from '../../quests/QuestClearedIcon.vue'
import UpdateCards from '../../recent-updates/UpdateCards.vue'
import { data as updateData } from '../data/home-updates.data'
import { data as homeData } from '../data/home.data'
import HomeSection from './HomeSection.vue'

const visibleSections = sections.filter(section => section.hidden !== 'true')
const quests = visibleSections.flatMap(section => section.items)

const mainQuests = visibleSections[0]?.items ?? []

const clearedQuests = quests
  .filter(quest => quest.cleared)
  .sort((a, b) => dayjs(b.cleared).valueOf() - dayjs(a.cleared).valueOf())
  .slice(0, 6)

const reports = homeData.reports.slice(0, 3)

const quickLinks = [
  { text: '✏️ メモ', link: '/+note' },
  { text: '⚔️ クエスト', link: '/quests/' },
  { text: '📅 桑記', link: '/monthly-reports/' },
  { text: '📄 ブログ', link: '/blog/' },
]
</script>

<template>
  <div class="max-w-[688px] mx-auto">
    <section class="pt-6 pb-2 sm:pt-12 text-center">
      <img
        :src="withBase('/obsidian.png')"
        alt="Kuwasidian"
        class="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg-alt)] object-contain p-1"
      >
      <h1 class="mt-4! mb-0! text-3xl! sm:text-5xl! font-bold! leading-tight!">
        Kuwasidian
      </h1>
      <p class="mt-2! mb-0! text-[var(--vp-c-text-2)]">
        彼の Obsidian（メモアプリ）のメモ
      </p>

      <nav class="flex flex-wrap justify-center gap-2 mt-6">
        <a
          v-for="item in quickLinks"
          :key="item.link"
          :href="withBase(item.link)"
          class="home-chip"
        >
          {{ item.text }}
        </a>
      </nav>
    </section>

    <HomeSection title="⚔️ クエスト" :link="withBase('/quests/')">
      <div v-if="mainQuests.length" class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
        <a
          v-for="quest in mainQuests"
          :key="quest.title"
          :href="withBase(`/quests/${quest.title}`)"
          class="home-card no-underline!"
        >
          <div class="relative">
            <div class="text-5xl pt-1">
              {{ quest.icon }}
            </div>
            <Badge text="進行中" class="absolute top-0 right-0" />
          </div>
          <div class="mt-3 font-semibold text-sm text-[var(--vp-c-text-1)]">
            {{ quest.title }}
          </div>
          <div class="text-[var(--vp-c-text-2)] text-xs mt-1">
            {{ quest.objective }}
          </div>
        </a>
      </div>
      <p v-else class="text-sm text-[var(--vp-c-text-2)] my-0!">
        クエストはありません。
      </p>
    </HomeSection>

    <HomeSection title="🏅 クリア済みのクエスト" :link="withBase('/quests/')">
      <div v-if="clearedQuests.length" class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
        <a
          v-for="quest in clearedQuests"
          :key="quest.title"
          :href="withBase(`/quests/${quest.title}`)"
          class="home-card no-underline!"
        >
          <div class="relative">
            <div class="text-5xl pt-1">
              {{ quest.icon }}
            </div>
            <QuestClearedIcon
              :cleared-date="quest.cleared"
              class="w-20!"
            />
          </div>
          <div class="mt-3 font-semibold text-sm text-[var(--vp-c-text-1)]">
            {{ quest.title }}
          </div>
          <div class="text-[var(--vp-c-text-2)] text-xs mt-1">
            {{ quest.objective }}
          </div>
        </a>
      </div>
      <p v-else class="text-sm text-[var(--vp-c-text-2)] my-0!">
        クリア済みのクエストはありません。
      </p>
    </HomeSection>

    <HomeSection title="📅 桑記" :link="withBase('/monthly-reports/')">
      <div v-if="reports.length" class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
        <a
          v-for="report in reports"
          :key="report.link"
          :href="withBase(report.link)"
          class="home-card group no-underline! overflow-hidden p-0!"
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
      <p v-else class="text-sm text-[var(--vp-c-text-2)] my-0!">
        桑記はまだありません。
      </p>
    </HomeSection>

    <HomeSection title="✏️ メモ" :link="withBase('/+note')" link-text="メモを開く →">
      <div class="home-card memo-card" tabindex="0">
        <div
          class="prose prose-sm max-w-none! [&>*:first-child]:mt-0"
          v-html="homeData.memo"
        />
      </div>
    </HomeSection>

    <HomeSection title="🔄 最近の更新" :link="withBase('/recent-updates/')">
      <UpdateCards :items="updateData" />
    </HomeSection>
  </div>
</template>

<style scoped>
.home-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  text-decoration: none;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.home-chip:focus-visible,
.home-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@media (hover: hover) {
  .home-chip:hover {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  .home-card:hover {
    border-color: var(--vp-c-brand-1);
  }
}

.memo-card {
  max-height: 280px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-divider) transparent;
}

.memo-card::-webkit-scrollbar {
  width: 6px;
}

.memo-card::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: var(--vp-c-divider);
}

.memo-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

@media (min-width: 640px) {
  .memo-card {
    max-height: 340px;
  }
}

.home-card {
  display: block;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 0.5px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  transition: border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
</style>
