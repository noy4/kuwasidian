import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
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
} satisfies Theme
