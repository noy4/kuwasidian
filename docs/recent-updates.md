# 最近の更新

<script setup>
import { data as fileUpdates } from './recent-updates-2.data.ts'
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
  <li v-for="(file, index) in fileUpdates" :key="file.filePath">
    <a :href="withBase(file.url)">{{ file.title }}</a>
    <Badge v-if="file.status === 'A'" type="tip" text="Added" />
    <Badge v-else-if="file.status === 'D'" type="danger" text="Deleted" />
    <span v-if="index === 0 || formatDate(file.lastUpdated) !== formatDate(fileUpdates[index - 1].lastUpdated)">
      - {{ formatDate(file.lastUpdated) }}
    </span>
  </li>
</ul>