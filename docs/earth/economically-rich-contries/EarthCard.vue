<script setup lang="ts">
import type { Earth } from './Earth'
import { withBase } from 'vitepress'
import { ref } from 'vue'
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
      経済的に豊かな国々（2025）
    </h3>

    <div
      :class="open ? 'rows-[1fr]' : 'rows-[0fr]'"
      class="grid"
      style="transition: grid-template-rows .2s ease-in-out;"
    >
      <div class="overflow-hidden">
        <div class="text-gray-300 text-xs mt-2 mb-4">
          <b>一人当たりGDP（PPP）</b>（物価の違いを考慮した生活水準を測る指標）を元にしたランキング
        </div>

        <div class="flex flex-col gap-1 h-80 overflow-scroll">
          <LocationItem
            v-for="(location, index) in earth.locations.slice(0, -1)"
            :key="index"
            :earth
            :location
            :index
          />
        </div>
        <LocationItem
          :earth
          :location="earth.locations.at(-1)!"
          :index="earth.locations.length - 1"
          class="mt-1"
        />

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

        <div class="text-gray-300 text-xs mt-4">
          データ出典：
          <a
            href="https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)_per_capita"
            class="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            List of countries by GDP (PPP) per capita - Wikipedia
          </a>
        </div>
      </div>
    </div>

    <label class="btn btn-xs btn-ghost text-white/50 mt-1">
      <input v-model="open" type="checkbox" hidden>
      <i :class="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
      {{ open ? '閉じる' : '開く' }}
    </label>
  </div>
</template>
