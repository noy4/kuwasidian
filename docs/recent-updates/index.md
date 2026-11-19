# 最近の更新

<script setup>
import { data } from './recent-updates.data'
import UpdateCards from './UpdateCards.vue'
</script>

<div class="mt-6">
  <UpdateCards :items="data" show-status />
</div>
