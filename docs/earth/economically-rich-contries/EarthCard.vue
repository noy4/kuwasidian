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

    <ul>
      <li v-for="(city, index) in earth.locations" :key="index">
        <button
          class="text-sm transition-colors duration-200"
          :class="[
            earth.currentLocationIndex.value === index
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-300',
          ]"
          @click="earth.goToLocation(index)"
        >
          {{ index + 1 }}. {{ city.name }}
          <template v-if="city.gdp_ppp !== -1">
            (${{ city.gdp_ppp.toLocaleString() }})
          </template>
        </button>
      </li>
    </ul>

    <button
      class="btn btn-primary mt-4 w-full"
      @click="earth.goToNextLocation()"
    >
      次の場所へ
    </button>

    <button
      class="btn mt-2 w-full"
      :class="earth.isRotating.value ? 'btn-error' : 'btn-success'"
      @click="earth.toggleCameraRotation()"
    >
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
