import fs from 'node:fs'
import path from 'node:path'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { extractDescription, getSidebarItems } from './utils'

const siteBase = '/kuwasidian/'
const siteTitle = 'Kuwasidian'
const siteDescription = '彼の Obsidian（メモアプリ）のメモ'
const siteUrl = `https://noy4.github.io${siteBase}`
const siteImage = 'obsidian.png'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [Inspect(), UnoCSS()],
  },

  title: siteTitle,
  description: siteDescription,
  base: siteBase,
  head: [
    ['link', { rel: 'icon', href: `${siteBase}${siteImage}` }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: `${siteUrl}${siteImage}` }],
    ['meta', { property: 'og:url', content: siteUrl }],
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
    pageData.title ||= pageData.filePath.split('/').pop()!.replace(/\.md$/, '')

    const fullPath = path.resolve('docs', pageData.filePath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      pageData.description ||= extractDescription(content)
    }

    const home = pageData.relativePath === 'index.md'
    const title = home ? siteTitle : `${pageData.title} | ${siteTitle}`
    const description = home ? siteDescription : pageData.description

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: `${siteUrl}${pageData.relativePath.replace(/\.md$/, '.html')}` }],
    )
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: `/${siteImage}`,
    outline: [2, 3],
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      { text: 'メモ', link: '/' },
      { text: 'ロードマップ', link: '/roadmap' },
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
