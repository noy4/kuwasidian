<script setup lang="ts">
import type { City } from './Earth'
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'
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
  <div class="relative w-full h-screen z-1000">
    <div id="cesiumContainer" class="w-full h-full" />
    <EarthCard :earth="earth" />
  </div>
</template>
