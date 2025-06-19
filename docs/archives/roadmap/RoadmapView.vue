<script setup lang="ts">
import { data } from './roadmap.data'
import RoadmapCard from './RoadmapCard.vue'
</script>

<template>
  <template v-for="section in data" :key="section.title">
    <h2 v-if="section.title">
      {{ section.title }}
    </h2>
    <div v-else class="h-4" />
    <div class="space-y-4">
      <RoadmapCard
        v-for="item in section.items"
        :key="item.title"
        :item="item"
      />
    </div>
  </template>
</template>
