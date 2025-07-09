import type { DefaultTheme } from 'vitepress'
import process from 'node:process'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { cesium } from './cesium'
import { descriptionExtractor, insertDateIfBlog, insertH1IfMissing, wikilinks } from './markdown'
import { Router } from './router'
import { autoSidebar } from './sidebar'
import { defaultExcludePattern } from './utils.server'

const prod = process.env.NODE_ENV === 'production'

const siteTitle = 'Kuwasidian'
const siteDescription = '彼の Obsidian（メモアプリ）のメモ'
const siteOrigin = 'https://kuwasidian.com'
const siteBase = prod ? '/' : '/kuwasidian/'
const siteUrl = `${siteOrigin}${siteBase}`
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
      { icon: 'youtube', link: 'https://www.youtube.com/@kuwamu' },
      { icon: 'github', link: 'https://github.com/noy4/kuwasidian' },
    ],
    search: {
      provider: 'local',
    },
  },

  markdown: {
    breaks: true,
    image: {
      lazyLoading: true,
    },
    config(md) {
      md.use(insertH1IfMissing())
      md.use(descriptionExtractor())
      md.use(wikilinks())
      md.use(insertDateIfBlog())
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
      ReactivityTransform(),
      UnoCSS(),
      cesium({ siteBase }),
    ],
  },

  sitemap: {
    hostname: siteUrl,
  },

  // markdown to html → transformPageData
  transformPageData(pageData) {
    const router = new Router()
      .add('index.md', () => {
        pageData.title = homeTitle
      })
      .add('quests/!(index)*', () => {
        pageData.title = `${pageData.title} | ${siteTitle} Quests`

        if (pageData.frontmatter.status === 'cleared') {
          pageData.title = `（Cleared）${pageData.title}`
          ;(pageData.frontmatter.head ??= []).push(
            ['meta', { property: 'og:title', content: pageData.title }],
            ['meta', { property: 'og:image', content: `${siteUrl}quest_cleared.png` }],
          )
        }
      })
      .add('blog/!(index)*', () => {
        pageData.title = `${pageData.title} | ${siteTitle} Blog`
      })
      .add('earth/*/**', () => {
        pageData.title = `${pageData.title} | ${siteTitle} Earth`
      })
      .add('**', () => {
        pageData.title = `${pageData.title} | ${siteTitle}`
      })
    router.handle(pageData.relativePath)

    // set ogp
    const pageUrl = `${siteUrl}${pageData.relativePath.replace(/(index)?\.md$/, '')}`

    ;(pageData.frontmatter.head ??= []).push(
      ['meta', { property: 'og:title', content: pageData.title }],
      ['meta', { property: 'og:description', content: pageData.description }],
      ['meta', { property: 'og:url', content: pageUrl }],
    )
  },
}))

function sidebar(): DefaultTheme.Sidebar {
  return [
    { text: '✏️ メモ', link: '/' },
    { text: '⚔️ クエスト', link: '/quests/' },
    { text: '🔄 最近の更新', link: '/recent-updates/' },
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
        { text: '📄 ブログ', link: '/blog/' },
        { text: '🌏 Earth', link: '/earth/' },
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
          text: '🗒️ その他メモ',
          collapsed: true,
          items: autoSidebar('notes'),
        },
      ],
    },
  ]
}
