<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{ date?: string }>()
</script>

<template>
  <img
    src="/quest_cleared.png"
    class="absolute top-0 right-0 w-30"
  >
  <span
    v-if="date"
    class="absolute top-24 right-0 font-serif"
  >
    {{ dayjs(date).format('YYYY.M.D') }}
  </span>
</template>
