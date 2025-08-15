<script setup lang="ts">
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'
import locations from './evil-dictators.json'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const earth = new Earth(locations)
onMounted(earth.mount)
</script>

<template>
  <div class="relative w-full h-screen z-1000">
    <div id="cesiumContainer" class="w-full h-full" />
    <EarthCard :earth />
  </div>
</template>
