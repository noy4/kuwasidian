<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { Earth } from './Earth'
import { withBase } from 'vitepress'
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { mdrender } from '@/utils'
import LocationItem from './LocationItem.vue'

const { earth } = defineProps<{
  earth: Earth
}>()

const open = ref(true)
const locationItemRefs = ref<HTMLElement[]>([])
const locationListRef = useTemplateRef('locationListRef')

watch(earth.currentLocationIndex, (newIndex) => {
  // nextTick で DOM が更新された後にスクロール
  nextTick(() => {
    const targetElement = locationItemRefs.value[newIndex]
    if (targetElement && locationListRef.value) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  })
})
</script>

<template>
  <div class="absolute left-2 top-2 bg-black/70 rounded px-3 max-w-76 w-full">
    <div class="breadcrumbs text-xs text-gray-400 pt-3 pb-1">
      <ul>
        <li><a :href="withBase('/')">Kuwasidian</a></li>
        <li><a :href="withBase('/earth/')">Earth</a></li>
      </ul>
    </div>

    <h3 class="text-white text-lg font-bold">
      インフルエンサー・ベスト10
    </h3>

    <div
      :class="open ? 'rows-[1fr]' : 'rows-[0fr]'"
      class="grid"
      style="transition: grid-template-rows .2s ease;"
    >
      <div class="overflow-hidden">
        <div class="text-white/80 text-xs mt-2 mb-4">
          人類史に影響を与えた偉大な人物たち。そのゆかりの地を巡る。
        </div>

        <div ref="locationListRef" class="flex flex-col gap-1 h-80 overflow-scroll">
          <LocationItem
            v-for="(location, index) in earth.locations"
            :key="index"
            :ref="(el) => { if (el) locationItemRefs[index] = (el as ComponentPublicInstance).$el }"
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
          @click="earth.rotation.toggle()"
        >
          <i :class="earth.isRotating.value ? 'i-lucide-refresh-cw-off' : 'i-lucide-refresh-cw'" />
          {{ earth.isRotating.value ? '回転停止' : '回転開始' }}
        </button>

        <div class="prose text-xs text-white/50">
          <div
            v-html="mdrender(`
              ソース：[史上最も影響を与えた人物ベスト100ランキング; M.H.ハート氏の本より　～aokiuva](https://www.aokiuva.com/b100influpers.html)
            `)"
          />
        </div>
      </div>
    </div>

    <label
      class="btn btn-xs btn-ghost mb-2"
      style="--btn-color: #fff2; --btn-fg: #fff8;"
    >
      <input v-model="open" type="checkbox" hidden>
      <i :class="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
      {{ open ? '閉じる' : '開く' }}
    </label>
  </div>
</template>
