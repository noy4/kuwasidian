<script setup lang="ts">
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'

const earth = new Earth()

onMounted(earth.init)
</script>

<template>
  <div class="relative w-full h-screen z-1000">
    <div id="map" class="w-full h-full" />
    <EarthCard :earth />
  </div>
</template>
