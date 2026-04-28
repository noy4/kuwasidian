<script setup lang="ts">
import type { Quest } from './quest.data'
import dayjs from 'dayjs'
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
          class="quest-drawer-panel relative w-[calc(100%-48px)] max-w-[360px] h-full bg-[var(--vp-c-bg)] border-l border-[var(--vp-c-divider)] overflow-y-auto flex flex-col pointer-events-auto"
        >
          <!-- Header -->
          <div class="flex items-start gap-4 mt-6 mb-3 px-4">
            <div class="text-5xl">
              {{ quest.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-l leading-tight">
                {{ quest.title }}
              </div>
              <div class="text-[var(--vp-c-text-2)] text-sm mt-1">
                {{ quest.objective }}
              </div>
            </div>
            <button
              class="absolute top-1 right-1 bg-transparent border-none text-[var(--vp-c-text-2)] text-lg cursor-pointer px-2 py-1 leading-none rounded hover:text-[var(--vp-c-text-1)] hover:bg-[var(--vp-c-bg-alt)] transition-colors shrink-0"
              aria-label="閉じる"
              @click="emit('close')"
            >
              ✕
            </button>
          </div>

          <!-- Badges -->
          <div v-if="quest.status === 'active'" class="px-4">
            <Badge v-if="quest.status === 'active'" text="進行中" />
          </div>

          <!-- Description -->
          <div
            class="flex-1 text-[0.9rem] bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)] rounded-lg mx-4 my-3 p-4 sm:px-5 leading-[1.75]"
          >
            <div
              class="prose [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              v-html="quest.description"
            />
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
