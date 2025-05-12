# 最近の更新

<script setup>
import { data as fileUpdates } from './recent-updates.data.ts'
import { withBase } from 'vitepress'

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
}
</script>

<ul>
  <li v-for="file in fileUpdates" :key="file.path">
    <a :href="withBase(file.linkPath)">{{ file.displayPath }}</a> ({{ file.status }}) - 最終更新: {{ formatDate(file.lastUpdated) }}
  </li>
</ul>