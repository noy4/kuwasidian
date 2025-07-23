<script setup lang="ts">
import type { Earth } from './Earth'
import { withBase } from 'vitepress'

defineProps<{
  earth: Earth
}>()
</script>

<template>
  <div class="absolute left-2 top-2 bg-black/70 rounded p-3 max-w-72">
    <div class="breadcrumbs text-xs text-gray-400 pt-0 pb-1">
      <ul>
        <li><a :href="withBase('/')">Kuwasidian</a></li>
        <li><a :href="withBase('/earth/')">Earth</a></li>
      </ul>
    </div>

    <h3 class="text-white text-lg font-bold mb-2">
      経済的に豊かな国々（2025）
    </h3>

    <div class="text-gray-300 text-xs mb-4">
      <b>一人当たりGDP（PPP）</b>（物価の違いを考慮した生活水準を測る指標）を元にしたランキング
    </div>

    <div class="flex flex-col gap-1">
      <div v-for="(city, index) in earth.locations" :key="index">
        <button
          class="text-sm transition-colors duration-100 px-2 py-1 rounded w-full flex text-start"
          :class="[
            earth.currentLocationIndex.value === index
              ? 'text-white bg-white/20'
              : 'text-gray-400 hover:bg-white/10 hover:text-white',
          ]"
          @click="earth.goToLocation(index)"
        >
          {{ index + 1 }}. {{ city.name }}
          <div class="flex-1" />
          <template v-if="city.gdp_ppp !== -1">
            ${{ city.gdp_ppp.toLocaleString() }}
          </template>
        </button>
      </div>
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
</template>
