import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import RoadmapCard from '../components/RoadmapCard.vue'
import RoadmapView from '../components/RoadmapView.vue'
import NoteTitle from './components/NoteTitle.vue'
import 'virtual:uno.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => {
        return h(NoteTitle)
      },
    })
  },
  enhanceApp({ app }) {
    app.component('RoadmapCard', RoadmapCard)
    app.component('RoadmapView', RoadmapView)
  },
} satisfies Theme
