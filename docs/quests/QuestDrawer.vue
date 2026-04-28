<script setup lang="ts">
import type { Quest } from './quest.data'
import dayjs from 'dayjs'
import { withBase } from 'vitepress'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  quest: Quest | null
}>()

const emit = defineEmits<{
  close: []
}>()

function handleGlobalClick(e: MouseEvent) {
  if (!props.quest)
    return

  const target = e.target as HTMLElement
  const isQuestClick = target.closest('.quest-card')
  const isDrawerClick = target.closest('.quest-drawer-panel')

  if (!isQuestClick && !isDrawerClick) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[9999] pointer-events-none flex justify-end overflow-hidden"
    >
      <!-- Overlay: Independent Fade -->
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-300 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="quest"
          class="absolute inset-0 bg-black/45 sm:bg-transparent pointer-events-auto sm:pointer-events-none"
          @click="emit('close')"
        />
      </Transition>

      <!-- Drawer: Independent Slide -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="quest"
          class="quest-drawer-panel relative w-[calc(100%-48px)] max-w-[360px] h-full bg-[var(--vp-c-bg)] border-l border-[var(--vp-c-divider)] p-6 sm:p-8 overflow-y-auto flex flex-col pointer-events-auto"
        >
          <!-- Header -->
          <div class="flex items-start gap-4 mb-3">
            <div class="text-5xl">
              {{ quest.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-xl leading-tight">
                {{ quest.title }}
              </div>
              <div class="text-[var(--vp-c-text-2)] text-sm mt-1">
                {{ quest.objective }}
              </div>
            </div>
            <button
              class="bg-transparent border-none text-[var(--vp-c-text-2)] text-lg cursor-pointer px-2 py-1 leading-none rounded hover:text-[var(--vp-c-text-1)] hover:bg-[var(--vp-c-bg-alt)] transition-colors shrink-0"
              aria-label="閉じる"
              @click="emit('close')"
            >
              ✕
            </button>
          </div>

          <!-- Badges -->
          <div class="flex items-center gap-2 mb-5">
            <Badge v-if="quest.status === 'active'" text="進行中" />
            <span
              v-if="quest.status === 'cleared' && quest.clearedDate"
              class="text-[var(--vp-c-text-2)] text-xs"
            >
              ✅ {{ dayjs(quest.clearedDate).format('YYYY年M月D日') }} クリア
            </span>
          </div>

          <!-- Description -->
          <div
            v-if="quest.description"
            class="flex-1 text-[0.9rem] bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)] rounded-lg p-4 sm:px-5 leading-[1.75]"
          >
            <div
              class="prose [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              v-html="quest.description"
            />
          </div>
          <div v-else class="text-[var(--vp-c-text-3)] text-sm">
            説明なし
          </div>

          <!-- Link -->
          <div class="mt-6">
            <a
              :href="withBase(`/quests/${quest.title}`)"
              class="inline-block px-5 py-2 bg-[var(--vp-c-brand-1)] text-white! rounded-md text-[0.9rem] font-medium decoration-none! transition-colors hover:bg(--vp-c-brand-2)"
              @click="emit('close')"
            >
              クエストページへ →
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
