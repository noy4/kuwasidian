---
title: その他メモ
lastUpdated: false
---

## 最近の更新

<script setup>
import { data } from '../recent-updates/recent-updates.data'
import UpdateCards from '../recent-updates/UpdateCards.vue'
</script>

<UpdateCards :items="data" :limit="10" show-status />
