<script setup lang="ts">
import { onMounted } from 'vue'
import { loadEarth } from './Earth'
import EarthCard from './EarthCard.vue'
import 'cesium/Build/Cesium/Widgets/widgets.css'

onMounted(() => {
  loadEarth()
})
</script>

<template>
  <div class="relative w-full h-screen z-1000">
    <div id="map" class="w-full h-full" />
    <!-- <EarthCard :earth /> -->
  </div>
</template>
