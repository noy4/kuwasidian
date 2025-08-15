<script setup lang="ts">
import type { Earth } from './Earth'
import { withBase } from 'vitepress'
import { ref } from 'vue'
import { mdrender } from '@/utils'
import LocationItem from './LocationItem.vue'

defineProps<{
  earth: Earth
}>()

const open = ref(true)
</script>

<template>
  <div class="absolute left-2 top-2 bg-black/70 rounded p-3 max-w-72 w-full">
    <div class="breadcrumbs text-xs text-gray-400 pt-0 pb-1">
      <ul>
        <li><a :href="withBase('/')">Kuwasidian</a></li>
        <li><a :href="withBase('/earth/')">Earth</a></li>
      </ul>
    </div>

    <h3 class="text-white text-lg font-bold">
      虐殺数ランキング
    </h3>

    <div
      :class="open ? 'rows-[1fr]' : 'rows-[0fr]'"
      class="grid"
      style="transition: grid-template-rows .2s ease;"
    >
      <div class="overflow-hidden">
        <div class="text-gray-300 text-xs mt-2 mb-4">
          殺害数順に独裁者を表示
        </div>

        <div class="flex flex-col gap-1 h-80 overflow-scroll">
          <LocationItem
            v-for="(location, index) in earth.locations"
            :key="index"
            :earth
            :location
            :index
          />
        </div>

        <button
          class="btn btn-primary mt-4 w-full"
          @click="earth.goToNextLocation()"
        >
          <i class="i-lucide-arrow-right" />
          次の地点へ
        </button>

        <button
          class="btn mt-2 w-full"
          :class="earth.isRotating.value ? 'btn-error' : 'btn-success'"
          @click="earth.toggleCameraRotation()"
        >
          <i :class="earth.isRotating.value ? 'i-lucide-refresh-cw-off' : 'i-lucide-refresh-cw'" />
          {{ earth.isRotating.value ? '回転停止' : '回転開始' }}
        </button>

        <div class="prose text-xs">
          <div
            v-html="mdrender(`
              ソース：[Top Ten Most Evil Dictators of All Time (in order of kill count) – Popten](https://www.popten.net/2010/05/top-ten-most-evil-dictators-of-all-time-in-order-of-kill-count/)
            `)"
          />
        </div>
      </div>
    </div>

    <label
      class="btn btn-xs btn-ghost"
      style="--btn-color: #fff2; --btn-fg: #fff8;"
    >
      <input v-model="open" type="checkbox" hidden>
      <i :class="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
      {{ open ? '閉じる' : '開く' }}
    </label>
  </div>
</template>
