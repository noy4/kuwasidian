import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import RoadmapCard from '../components/RoadmapCard.vue'
import RoadmapView from '../components/RoadmapView.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RoadmapCard', RoadmapCard)
    app.component('RoadmapView', RoadmapView)
  },
} satisfies Theme
