import type { DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { extractDescription } from './utils'
import { getSidebarItems } from './utils.server'

const siteBase = '/kuwasidian/'
const siteTitle = 'Kuwasidian'
const siteDescription = 'クワシディアン - 彼の Obsidian（メモアプリ）のメモ'
const siteUrl = `https://noy4.github.io${siteBase}`
const siteImage = 'obsidian.png'

const sidebar: DefaultTheme.Sidebar = [
  { text: 'メモ', link: '/' },
  { text: 'クエスト', link: '/quest' },
  { text: '記事一覧', link: '/posts' },
  {
    items: [
      {
        text: 'プロンプト',
        collapsed: true,
        items: getSidebarItems('prompts'),
      },
      {
        text: '検索履歴レポート',
        collapsed: true,
        items: getSidebarItems('search-history-reports', {
          desc: true,
        }),
      },
    ],
  },
  {
    items: [
      {
        text: 'notes',
        collapsed: true,
        items: getSidebarItems('notes'),
      },
    ],
  },
]

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
    const home = pageData.relativePath === 'index.md'
    const fullPath = path.resolve('docs', pageData.filePath)
    let ogTitle = siteTitle
    let ogDescription = siteDescription

    if (!home) {
      pageData.title ||= pageData.filePath.split('/').pop()!.replace(/\.md$/, '')

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        pageData.description ||= extractDescription(content)
      }

      ogTitle = `${pageData.title} | ${siteTitle}`
      ogDescription = pageData.description
    }

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: ogTitle }],
      ['meta', { property: 'og:description', content: ogDescription }],
      ['meta', { property: 'og:url', content: `${siteUrl}${pageData.relativePath.replace(/\.md$/, '.html')}` }],
    )
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: `/${siteImage}`,
    outline: [2, 3],
    externalLinkIcon: true,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/noy4/kuwasidian' },
    ],
  },

  sitemap: {
    hostname: siteUrl,
  },
})
