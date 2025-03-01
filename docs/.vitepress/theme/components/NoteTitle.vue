<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()

const title = computed(() =>
  page.value.title
  || page.value.filePath
    .split('/')
    .pop()
    .replace(/\.md$/, ''),
)
</script>

<template>
  <div class="vp-doc">
    <h1>{{ title }}</h1>
  </div>
</template>
