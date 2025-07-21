<script setup lang="ts">
import type { Earth } from './Earth'
import { withBase } from 'vitepress'

defineProps<{
  earth: Earth
}>()
</script>

<template>
  <div class="absolute left-2 top-2 bg-black/70 rounded p-3">
    <div class="breadcrumbs text-xs text-gray-400 pt-0 pb-1">
      <ul>
        <li><a :href="withBase('/')">Kuwasidian</a></li>
        <li><a :href="withBase('/earth/')">Earth</a></li>
      </ul>
    </div>

    <h3 class="text-white text-lg font-bold mb-2">
      都市履歴
    </h3>

    <ul class="timeline timeline-vertical">
      <li v-for="(city, index) in earth.cities" :key="index">
        <hr v-if="index !== 0" class="bg-gray-600">

        <div
          class="timeline-start text-sm"
          :class="[
            earth.currentCityIndex.value === index
              ? 'text-white'
              : 'text-gray-400',
          ]"
        >
          {{ city.year }}
        </div>

        <div class="timeline-middle">
          <div
            class="i-tabler-circle-check-filled w-4 h-4 cursor-pointer transition-colors duration-200"
            :class="[
              earth.currentCityIndex.value === index
                ? 'bg-green-500'
                : 'bg-gray-400 hover:bg-gray-300',
            ]"
            @click="earth.goToCity(index)"
          />
        </div>

        <button
          class="timeline-end text-sm transition-colors duration-200"
          :class="[
            earth.currentCityIndex.value === index
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-300',
          ]"
          @click="earth.goToCity(index)"
        >
          {{ city.name }}
        </button>

        <hr v-if="index < earth.cities.length - 1" class="bg-gray-600">
      </li>
    </ul>

    <button
      class="btn btn-primary mt-4 w-full"
      @click="earth.goToNextCity()"
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
