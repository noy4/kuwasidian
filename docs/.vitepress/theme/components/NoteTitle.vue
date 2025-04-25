<script setup>
import { useData, useRoute } from 'vitepress'
import { nextTick, onMounted, ref, watch } from 'vue'

const { page } = useData()
const route = useRoute()
const hasH1 = ref(true)

function checkH1() {
  hasH1.value = !!document.querySelector('h1')
}

onMounted(checkH1)

watch(() => route.path, async () => {
  hasH1.value = true
  await nextTick()
  checkH1()
})
</script>

<template>
  <div
    v-if="!hasH1 && page.title"
    class="vp-doc"
  >
    <h1>{{ page.title }}</h1>
  </div>
</template>
