<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{
  publishedAt?: string
  updatedAt?: string
}>()
</script>

<template>
  <p style="display: flex; justify-content: flex-end; gap: 0.25rem; color: var(--vp-c-text-2); font-size: 0.875rem;">
    <span v-if="publishedAt">{{ dayjs(publishedAt).format('YYYY/MM/DD') }}</span>
    <span v-if="updatedAt">({{ dayjs(updatedAt).format('YYYY/MM/DD') }} 更新)</span>
  </p>
</template>
