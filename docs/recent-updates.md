# 最近の更新

<script setup>
import { data as fileUpdates } from './recent-updates.data.ts'
import { withBase } from 'vitepress'

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>

<ul>
  <li v-for="file in fileUpdates" :key="file.path">
    <a :href="withBase(file.linkPath)">{{ file.displayPath }}</a> - 最終更新: {{ formatDate(file.lastUpdated) }}
  </li>
</ul>