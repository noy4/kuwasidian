<script setup lang="ts">
import { data } from '../theme/roadmap.data'
import RoadmapCard from './RoadmapCard.vue'
</script>

<template>
  <div class="space-y-12">
    <div v-for="section in data" :key="section.title" class="space-y-6">
      <h2 class="text-xl font-bold">
        {{ section.title }}
      </h2>
      <div class="space-y-4">
        <RoadmapCard
          v-for="item in section.items"
          :key="item.title"
          :title="item.title"
          :content="item.content"
        />
      </div>
    </div>
  </div>
</template>
