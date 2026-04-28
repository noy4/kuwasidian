<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{ clearedDate?: string }>()
</script>

<template>
  <div class="absolute top-0 right-0 w-30 pointer-events-none">
    <div class="relative">
      <img
        src="/quest_cleared.png"
        class="w-full"
      >
      <span
        v-if="clearedDate"
        class="absolute top-[calc(100%-14px)] right-2 font-serif text-sm"
      >
        {{ dayjs(clearedDate).format('YYYY.M.D') }}
      </span>
    </div>
  </div>
</template>
