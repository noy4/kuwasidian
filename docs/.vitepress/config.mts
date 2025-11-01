import type { DefaultTheme, PageData } from 'vitepress'
import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import process from 'node:process'
import fastglob from 'fast-glob'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { cesium } from './cesium'
import { descriptionExtractor, insertDateIfBlog, insertH1IfMissing, wikilinks } from './markdown'
import { Router } from './router'
import { autoSidebar } from './sidebar'
import { defaultExcludePattern } from './vitepress.extend'

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
      md.use(wikilinks())
      md.use(insertH1IfMissing())
      md.use(insertDateIfBlog())
      md.use(descriptionExtractor())
    },
  },

  vite: {
    resolve: {
      alias: {
        // [Updating mermaid to 9.2.0 reported an error](https://github.com/emersonbottero/vitepress-plugin-mermaid/issues/24#issuecomment-1379779295)
        'mermaid': 'mermaid/dist/mermaid.esm.mjs',
        // [[Docs] Explain how to use TypeScript in a VitePress project · Issue #1047 · vuejs/vitepress](https://github.com/vuejs/vitepress/issues/1047)
        '@': path.resolve(__dirname, './'),
      },
    },
    plugins: [
      Inspect(),
      UnoCSS(),
      cesium({ siteBase }),
    ],
  },

  sitemap: {
    hostname: siteUrl,
  },

  transformPageData,

  // [Delivering static assets from source directory · vuejs/vitepress · Discussion #3708](https://github.com/vuejs/vitepress/discussions/3708)
  async buildEnd({ srcDir, outDir }) {
    const files = await fastglob.glob([
      '**/*',
      '!**/*.md',
      '!**/*.ts',
      '!**/*.vue',
      '!public/**',
    ], { cwd: srcDir, absolute: true })
    await Promise.all(
      files.map(async (file) => {
        const destFile = file.replace(srcDir, outDir)
        await fs.mkdir(dirname(destFile), { recursive: true })
        await fs.copyFile(file, destFile)
      }),
    )
  },
}))

// markdown to html → transformPageData
function transformPageData(pageData: PageData) {
  const router = new Router()
    .add('index.md', () => {
      pageData.title = homeTitle
    })
    .add('quests/(?!index)*', () => {
      pageData.title = `${pageData.title} | ${siteTitle} Quests`

      if (pageData.frontmatter.status === 'cleared') {
        pageData.title = `（Cleared）${pageData.title}`
        ;(pageData.frontmatter.head ??= []).push(
          ['meta', { property: 'og:title', content: pageData.title }],
          ['meta', { property: 'og:image', content: `${siteUrl}quest_cleared.png` }],
        )
      }
    })
    .add('blog/(?!index)*', () => {
      pageData.title = `${pageData.title} | ${siteTitle} Blog`
    })
    .add('earth/(?!index)*', () => {
      pageData.title = `${pageData.title} | ${siteTitle} Earth`
    })
    .add('*', () => {
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
}

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
          text: '📅 月次レポート',
          collapsed: true,
          items: autoSidebar('monthly-reports', {
            desc: true,
          }).sort((a, b) => {
            // 数字から始まらないファイルを最後に移動
            if (!a.text?.match(/^\d+/))
              return 1
            if (!b.text?.match(/^\d+/))
              return -1
            return 0
          }),
        },
      ],
    },
    {
      items: [
        { text: '📄 ブログ', link: '/blog/' },
        { text: '🌏 Earth', link: '/earth/' },
        {
          text: '🤖 プロンプト',
          collapsed: true,
          items: autoSidebar('prompts'),
        },
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
