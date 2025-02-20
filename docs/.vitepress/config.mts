import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import { defineConfig } from 'vitepress'
import { getSidebarItems } from './utils'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vitepress Obsidian',
  description: 'A VitePress Site',
  base: '/vitepress-obsidian-docs/',
  srcExclude: ['**/_*'],
  lastUpdated: true,

  markdown: {
    breaks: true,
    config(md) {
      md.use(BiDirectionalLinks({ dir: 'docs' }))
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          {
            text: 'notes',
            collapsed: false,
            items: getSidebarItems('notes'),
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
