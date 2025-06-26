import type { DefaultTheme, HeadConfig } from 'vitepress'
import process from 'node:process'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import { presetWind4 } from 'unocss'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { descriptionExtractor, insertH1IfMissing } from './markdown'
import { autoSidebar, defaultExcludePattern } from './utils.server'

const siteBase = '/kuwasidian/'
const siteTitle = 'Kuwasidian'
const siteDescription = '彼の Obsidian（メモアプリ）のメモ'
const siteUrl = `https://noy4.github.io${siteBase}`
const siteImage = 'obsidian.png'
const homeTitle = 'Kuwasidian（クワシディアン） | 彼の Obsidian（メモアプリ）のメモ'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: siteTitle,
  titleTemplate: false,
  description: siteDescription,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${siteBase}${siteImage}` }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: `${siteUrl}${siteImage}` }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'twitter:card', content: 'summary' }],
  ],
  base: siteBase,
  cleanUrls: true,
  rewrites: {
    '\\+memo.md': 'index.md',
  },
  srcExclude: defaultExcludePattern,
  ignoreDeadLinks: true,
  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: `/${siteImage}`,
    outline: [2, 3],
    externalLinkIcon: true,
    sidebar: sidebar(),
    socialLinks: [
      { icon: 'x', link: 'https://x.com/kuwappi_' },
      { icon: 'instagram', link: 'https://www.instagram.com/instakuwamu/' },
      { icon: 'youtube', link: 'https://www.youtube.com/@kuwamu' },
      { icon: 'github', link: 'https://github.com/noy4/kuwasidian' },
    ],
    search: {
      provider: 'local',
    },
  },

  markdown: {
    breaks: true,
    config(md) {
      md.use(insertH1IfMissing())
      md.use(BiDirectionalLinks({ dir: process.argv[3] }))
      md.use(descriptionExtractor)
    },
  },

  vite: {
    resolve: {
      alias: {
        // [Updating mermaid to 9.2.0 reported an error](https://github.com/emersonbottero/vitepress-plugin-mermaid/issues/24#issuecomment-1379779295)
        mermaid: 'mermaid/dist/mermaid.esm.mjs',
      },
    },
    plugins: [
      Inspect(),
      UnoCSS({
        presets: [
          presetWind4({
            preflights: {
              reset: true,
            },
          }),
        ],
      }),
    ],
  },

  sitemap: {
    hostname: siteUrl,
  },

  // markdown to html → transformPageData
  transformPageData(pageData) {
    // set title
    const home = pageData.relativePath === 'index.md'
    pageData.title = home
      ? homeTitle
      : `${pageData.title} | ${siteTitle}`

    // set ogp
    const pageUrl = `${siteUrl}${pageData.relativePath.replace(/(index)?\.md$/, '')}`

    ;((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
      ['meta', { property: 'og:title', content: pageData.title }],
      ['meta', { property: 'og:description', content: pageData.description }],
      ['meta', { property: 'og:url', content: pageUrl }],
    )
  },
}))

function sidebar(): DefaultTheme.Sidebar {
  return [
    { text: '📝 メモ', link: '/' },
    { text: '⚔️ クエスト', link: '/quests/' },
    { text: '📄 記事一覧', link: '/posts/' },
    { text: '🔄 最近の更新', link: '/recent-updates' },
    {
      items: [
        { text: '💭 生存理念', link: '/me/philosophy-of-life' },
        { text: '🎁 ほしい物リスト', link: '/me/wish-list' },
        { text: '🎵 各期テーマソング', link: '/me/theme-songs' },
        {
          text: '🔍 検索履歴レポート',
          link: '/search-history-reports/',
          collapsed: true,
          items: autoSidebar('search-history-reports', {
            desc: true,
          }),
        },
      ],
    },
    {
      items: [
        {
          text: '🚀 プロジェクト',
          collapsed: true,
          items: autoSidebar('projects'),
        },
        {
          text: '📦 アーカイブ',
          collapsed: true,
          items: autoSidebar('archives'),
        },
        {
          text: '📋 その他メモ',
          collapsed: true,
          items: autoSidebar('notes'),
        },
      ],
    },
  ]
}
