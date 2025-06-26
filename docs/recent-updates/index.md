# 最近の更新

<script setup>
import { data as fileUpdates } from './recent-updates.data.ts'
import { formatDate } from '../.vitepress/utils'
</script>

<ol>
  <li v-for="(file, index) in fileUpdates" :key="file.filePath">
    <a :href="file.link">{{ file.title }}</a>
    <!--  -->
    <Badge v-if="file.status === 'A'" type="tip" text="Added" />
    <Badge v-else-if="file.status === 'D'" type="danger" text="Deleted" />
    <Badge v-else-if="file.status.startsWith('R')" type="warning" text="Renamed" />
    <!--  -->
    <span
      v-if="index === 0 || formatDate(file.date) !== formatDate(fileUpdates[index - 1].date)"
      class="text-xs text-[var(--vp-c-text-2)]"
    >
      - {{ formatDate(file.date) }}
    </span>
  </li>
</ol>
