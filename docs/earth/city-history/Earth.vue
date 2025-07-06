<script setup lang="ts">
import type { City } from './Earth'
import { onMounted } from 'vue'
import { Earth } from './Earth'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const cities: City[] = [
  { year: 1998, name: '広島・福山', longitude: 133.36709945519166, latitude: 34.48121901629059 },
  { year: 1998, name: '埼玉・大宮', longitude: 139.61697096710148, latitude: 35.94446389018784 },
  { year: 2005, name: '島根・松江', longitude: 133.07209744986676, latitude: 35.47512971396031 },
  { year: 2008, name: '大阪・枚方', longitude: 135.664640267663, latitude: 34.83626989287535 },
  { year: 2011, name: '愛媛・松山', longitude: 132.780117639121, latitude: 33.84188377853939 },
  { year: 2017, name: '福岡・大橋', longitude: 130.43027813106573, latitude: 33.56095413278243 },
]

const earth = new Earth(cities)

onMounted(() => {
  earth.mount()
  return () => {
    earth.destroy()
  }
})
</script>

<template>
  <div class="relative w-full h-screen">
    <div id="cesiumContainer" class="w-full h-full" />

    <!-- タイムライン -->
    <div class="absolute left-2 top-2 bg-black/70 rounded p-3">
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
                ? 'text-base-100'
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

          <hr v-if="index < cities.length - 1" class="bg-gray-600">
        </li>
      </ul>

      <button
        class="btn btn-primary mt-4 w-full"
        @click="earth.moveToNextCity()"
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
  </div>
</template>
