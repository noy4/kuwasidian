import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { getSidebarItems } from './utils'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [Inspect()],
  },

  title: 'Kuwasidian',
  description: '彼の Obsidian（メモアプリ）のメモ',
  base: '/kuwasidian/',
  srcExclude: ['**/_*'],
  lastUpdated: true,

  markdown: {
    breaks: true,
    config(md) {
      md.use(BiDirectionalLinks({ dir: 'docs' }))
    },
  },

  // [Can I directly read the filename as title like docusaurus? Instead of needing to configure frontmatter or define Level1 Heading as title #3735](https://github.com/vuejs/vitepress/issues/3735#issuecomment-2031879231)
  // transformPageData(pageData) {
  //   pageData.title = pageData.filePath.split('/').pop()!.replace(/\.md$/, '')
  // },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      { text: 'メモ', link: '/+memo' },
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
      { icon: 'github', link: 'https://github.com/noy4/kuwasidian' },
    ],
  },
})
