---
title: 学校の分布
description: 日本の学校の分布
layout: page
sidebar: false
navbar: false
---

<script setup lang="ts">
import { onMounted } from 'vue'
import { loadEarth } from './Earth'
import EarthCard from './EarthCard.vue'

onMounted(() => {
  loadEarth()
})
</script>

<div class="relative w-full h-screen z-1000">
  <div id="map" class="w-full h-full" />
  <EarthCard />
</div>
