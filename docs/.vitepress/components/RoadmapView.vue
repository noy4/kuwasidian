<script setup lang="ts">
import { data } from '../theme/roadmap.data'
import RoadmapCard from './RoadmapCard.vue'
</script>

<template>
  <div v-for="section in data" :key="section.title">
    <h2>{{ section.title }}</h2>
    <div class="space-y-4">
      <RoadmapCard
        v-for="item in section.items"
        :key="item.title"
        :item="item"
      />
    </div>
  </div>
</template>
