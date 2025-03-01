<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<template>
  <div class="vp-doc">
    <h1>{{ page.title }}</h1>
  </div>
</template>
