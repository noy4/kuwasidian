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
      経済豊かさランキング（2025）
    </h3>

    <p class="text-gray-300 text-xs mb-4">
      <b>一人当たりGDP（PPP）</b>（物価の違いを考慮した生活水準を測る指標）を元にしたランキング
    </p>

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
        </button>
      </li>
    </ul>

    <button
      class="btn btn-primary mt-4 w-full"
      @click="earth.goToNextLocation()"
    >
      次の都市へ
    </button>

    <button
      class="btn mt-2 w-full"
      :class="earth.isRotating.value ? 'btn-error' : 'btn-success'"
      @click="earth.toggleCameraRotation()"
    >
      {{ earth.isRotating.value ? '回転停止' : '回転開始' }}
    </button>
  </div>
</template>
