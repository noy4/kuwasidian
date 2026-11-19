<script setup lang="ts">
defineProps<{
  title: string
  link?: string
  linkText?: string
}>()
</script>

<template>
  <section class="mt-12">
    <div class="flex items-baseline justify-between gap-4 border-b border-[var(--vp-c-divider)] pb-2">
      <div class="text-xl sm:text-2xl font-semibold">
        {{ title }}
      </div>
      <a
        v-if="link"
        :href="link"
        class="text-xs sm:text-sm text-[var(--vp-c-text-2)] no-underline! hover:text-[var(--vp-c-brand-1)] transition-colors shrink-0"
      >
        {{ linkText ?? 'すべて見る →' }}
      </a>
    </div>
    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>
