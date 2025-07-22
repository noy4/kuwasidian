<script setup lang="ts">
import type { City } from './Earth'
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'
import locations from './gdp-per-capita.json'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const earth = new Earth(locations as City[])

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
