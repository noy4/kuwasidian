---
title: 虐殺数ランキング
description: 多くの人々を死亡させた独裁者の地を訪れましょう。
layout: page
sidebar: false
navbar: false
---

<script setup lang="ts">
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'
import locations from './evil-dictators.json'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const earth = new Earth(locations)
onMounted(earth.mount)
</script>

<div class="relative w-full h-screen z-1000">
  <div id="cesiumContainer" class="w-full h-full" />
  <EarthCard :earth />
</div>
