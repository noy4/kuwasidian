<script setup lang="ts">
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const earth = new Earth()

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
