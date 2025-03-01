import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { getSidebarItems } from './utils'

const base = '/kuwasidian/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [Inspect(), UnoCSS()],
  },

  title: 'Kuwasidian',
  description: '彼の Obsidian（メモアプリ）のメモ',
  base,
  head: [
    ['link', { rel: 'icon', href: `${base}obsidian.png` }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Kuwasidian' }],
    ['meta', { property: 'og:description', content: '彼の Obsidian（メモアプリ）のメモ' }],
    ['meta', { property: 'og:image', content: `${base}obsidian.png` }],
    ['meta', { property: 'twitter:card', content: 'summary' }],
  ],
  lastUpdated: true,
  ignoreDeadLinks: true,
  srcExclude: [
    '**/_*',
    'daily notes/**',
  ],

  markdown: {
    breaks: true,
    config(md) {
      md.use(BiDirectionalLinks({ dir: 'docs' }))
    },
  },

  rewrites: {
    '\\+memo.md': 'index.md',
  },

  transformPageData(pageData) {
    // ページタイトルがない場合はファイル名をタイトルとして使用
    if (!pageData.title) {
      pageData.title = pageData.filePath.split('/').pop()!.replace(/\.md$/, '')
    }

    return {
      ...pageData,
      frontmatter: {
        ...pageData.frontmatter,
        head: [
          ...(pageData.frontmatter?.head || []),
          ['meta', { property: 'og:title', content: pageData.title }],
          ['meta', { property: 'og:description', content: pageData.description || '彼の Obsidian（メモアプリ）のメモ' }],
        ],
      },
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: `/obsidian.png`,
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      { text: 'メモ', link: '/' },
      { text: '記事一覧', link: '/notes/articles' },
      {
        text: 'Notes',
        items: [
          {
            text: 'notes',
            collapsed: true,
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
