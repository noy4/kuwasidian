<script setup lang="ts">
import { withBase } from 'vitepress'
import { mdrender } from '@/utils'
</script>

<template>
  <div class="absolute left-2 top-2 bg-black/70 rounded p-3 max-w-72 w-full z-10">
    <div class="breadcrumbs text-xs text-gray-400 pt-0 pb-1">
      <ul>
        <li><a :href="withBase('/')">Kuwasidian</a></li>
        <li><a :href="withBase('/earth/')">Earth</a></li>
      </ul>
    </div>

    <h3 class="text-white text-lg font-bold">
      学校の分布（2013）
    </h3>

    <div class="text-gray-300 text-xs mt-4">
      <div
        v-html="mdrender(`
          データ出典：[国土数値情報 | 学校データ](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P29.html#prefecture00)
        `)"
      />
    </div>
  </div>
</template>
