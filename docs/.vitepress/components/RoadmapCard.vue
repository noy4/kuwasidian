<script setup lang="ts">
defineProps<{
  title: string
  content?: string
}>()
</script>

<template>
  <div class="vp-raw rounded-lg overflow-hidden bg-[var(--vp-c-bg-alt)] border-0.5 border-[var(--vp-c-divider)]">
    <div class="p-6">
      <h3 class="text-lg font-semibold text-[var(--vp-c-text-1)]">
        {{ title }}
      </h3>
      <p
        v-if="content"
        class="text-sm text-[var(--vp-c-text-2)] whitespace-pre-line mt-1"
      >
        {{ content }}
      </p>
    </div>
  </div>
</template>
