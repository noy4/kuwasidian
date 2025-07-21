<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{
  publishedAt?: string
  updatedAt?: string
}>()
</script>

<template>
  <p class="flex justify-end gap-1 text-[var(--vp-c-text-2)] text-sm">
    <span v-if="publishedAt">{{ dayjs(publishedAt).format('YYYY/MM/DD') }}</span>
    <span v-if="updatedAt">({{ dayjs(updatedAt).format('YYYY/MM/DD') }} 更新)</span>
  </p>
</template>
