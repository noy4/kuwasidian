<script setup lang="ts">
import { data } from '../theme/quest.data'
import QuestCard from './QuestCard.vue'
</script>

<template>
  <div v-for="section in data" :key="section.title">
    <div class="text-2xl font-semibold mt-8 mb-4">
      {{ section.title }}
    </div>

    <div class="grid sm:cols-2 gap-2 mt-4">
      <QuestCard
        v-for="quest in section.items"
        :key="quest.title"
        :quest="quest"
      />
    </div>
  </div>
</template>
