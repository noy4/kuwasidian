---
title: インフルエンサー・ベスト10
description: 人類史に多大な影響を与えた偉大な人物たち
layout: page
sidebar: false
navbar: false
---

<script setup lang="ts">
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'
import locations from './influencers.json'
import RotateButton from './RotateButton.vue'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const earth = new Earth(locations)
onMounted(earth.mount)
</script>

<div class="relative w-full h-screen z-1000">
  <div id="cesiumContainer" class="w-full h-full" />
  <EarthCard :earth />
  <RotateButton :earth />
</div>
