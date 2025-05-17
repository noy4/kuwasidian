import type { DefaultTheme, HeadConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { extractDescription } from './utils'
import { getSidebarItems, insertH1IfMissing } from './utils.server'

const siteBase = '/kuwasidian/'
const siteTitle = 'Kuwasidian'
const siteDescription = '彼の Obsidian（メモアプリ）のメモ'
const siteUrl = `https://noy4.github.io${siteBase}`
const siteImage = 'obsidian.png'
const homeTitle = 'Kuwasidian（クワシディアン） | 彼の Obsidian（メモアプリ）のメモ'

const sidebar: DefaultTheme.Sidebar = [
  { text: 'メモ', link: '/' },
  { text: 'クエスト', link: '/quest' },
  { text: '記事一覧', link: '/posts' },
  { text: '最近の更新', link: '/recent-updates' },
  {
    items: [
      {
        text: 'プロンプト',
        collapsed: true,
        items: getSidebarItems('prompts'),
      },
      {
        text: '検索履歴レポート',
        link: '/search-history-reports/',
        collapsed: true,
        items: getSidebarItems('search-history-reports', { desc: true }),
      },
      {
        text: 'YouTube履歴レポート',
        link: '/youtube-history-reports/',
        collapsed: true,
        items: getSidebarItems('youtube-history-reports', { desc: true }),
      },
    ],
  },
  {
    items: [
      {
        text: 'プロジェクト',
        collapsed: true,
        items: getSidebarItems('projects'),
      },
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
  titleTemplate: false,
  description: siteDescription,
  base: siteBase,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${siteBase}${siteImage}` }],
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
      md.use(insertH1IfMissing())
      md.use(BiDirectionalLinks({ dir: 'docs' }))
    },
  },

  rewrites: {
    '\\+memo.md': 'index.md',
  },

  transformPageData(pageData) {
    const home = pageData.relativePath === 'index.md'
    const fullPath = path.resolve('docs', pageData.filePath)

    pageData.title = home
      ? homeTitle
      : `${pageData.title} | ${siteTitle}`

    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      pageData.description ||= extractDescription(content)
    }

    ;((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
      ['meta', { property: 'og:title', content: pageData.title }],
      ['meta', { property: 'og:description', content: pageData.description }],
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
