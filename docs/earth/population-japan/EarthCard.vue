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

    <div
      class="text-xs prose"
      v-html="mdrender(`
        総人口：${Math.floor(earth.totalPopulation.value).toLocaleString()} 人
        データ出典：[WorldPop :: Population Counts](https://hub.worldpop.org/geodata/summary?id=31939)
      `)"
    />
  </div>
</template>
