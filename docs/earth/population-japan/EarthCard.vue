<script setup lang="ts">
import type { Earth } from './Earth'
import { withBase } from 'vitepress'
import { mdrender } from '@/utils'

defineProps<{
  earth: Earth
}>()
</script>

<template>
  <div class="absolute left-2 top-2 bg-black/70 rounded px-3 max-w-72 w-full z-10">
    <div class="breadcrumbs text-xs text-gray-400 pt-3 pb-1">
      <ul>
        <li><a :href="withBase('/')">Kuwasidian</a></li>
        <li><a :href="withBase('/earth/')">Earth</a></li>
      </ul>
    </div>

    <h3 class="text-white text-lg font-bold">
      人口分布（2020）
    </h3>

    <div class="text-xs prose">
      <div
        v-html="mdrender(`
          総人口：**${Math.floor(earth.totalPopulation.value).toLocaleString()}** 人
        `)"
      />

      <label class="block">
        📊 人口表示：
        <input
          type="checkbox"
          :checked="earth.isPopulationLayerVisible.value"
          class="toggle"
          @change="earth.togglePopulationLayer"
        >
      </label>

      <label class="block">
        🛰️ 航空写真：
        <input
          type="checkbox"
          :checked="earth.isSurfaceLayerVisible.value"
          class="toggle"
          @change="earth.toggleSurfaceLayer"
        >
      </label>

      <div
        v-html="mdrender(`
          *100人以下の区画はグラフ表示から除外
          データ出典：[WorldPop :: Population Counts](https://hub.worldpop.org/geodata/summary?id=31939)
        `)"
      />
    </div>
  </div>
</template>
