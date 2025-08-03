---
title: 学校の分布
description: 日本の学校の分布
layout: page
sidebar: false
navbar: false
---

<script setup lang="ts">
import { onMounted } from 'vue'
import { Earth } from './Earth'
import EarthCard from './EarthCard.vue'

const earth = new Earth()

onMounted(earth.init)
</script>

<div class="relative w-full h-screen z-1000">
  <div id="map" class="w-full h-full" />
  <EarthCard :earth />
</div>
