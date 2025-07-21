// [Extending the Default Theme | VitePress](https://vitepress.dev/guide/extending-default-theme)

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DateCard from '../components/DateCard.vue'
import 'virtual:uno.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DateCard', DateCard)
  },
} satisfies Theme
