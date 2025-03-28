<script setup lang="ts">
import { data } from '../theme/quest.data'
import QuestCard from './QuestCard.vue'
</script>

<template>
  <div class="grid sm:cols-2 gap-2 mt-4">
    <QuestCard
      v-for="quest in data"
      :key="quest.title"
      :quest="quest"
    />
  </div>
</template>
