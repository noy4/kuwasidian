<script setup lang="ts">
import { data } from '../theme/roadmap.data'
import RoadmapCard from './RoadmapCard.vue'
</script>

<template>
  <template v-for="section in data" :key="section.title">
    <div v-html="section.title" />
    <div class="space-y-4">
      <RoadmapCard
        v-for="item in section.items"
        :key="item.title"
        :item="item"
      />
    </div>
  </template>
</template>
