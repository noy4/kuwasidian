<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{ clearedDate?: string }>()
</script>

<template>
  <img
    src="/quest_cleared.png"
    class="absolute top-0 right-0 w-30"
  >
  <span
    v-if="clearedDate"
    class="absolute top-24 right-0 font-serif"
  >
    {{ dayjs(clearedDate).format('YYYY.M.D') }}
  </span>
</template>
