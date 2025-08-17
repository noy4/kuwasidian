---
title: 史上最も影響を与えた人物ベスト10
description: 人類史上最も大きな影響を与えた偉大な人物たちの足跡を辿りましょう。
layout: page
sidebar: false
navbar: false
---

<script setup lang="ts">
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'
import locations from './influencers.json'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const earth = new Earth(locations)
onMounted(earth.mount)
</script>

<div class="relative w-full h-screen z-1000">
  <div id="cesiumContainer" class="w-full h-full" />
  <EarthCard :earth />
</div>
