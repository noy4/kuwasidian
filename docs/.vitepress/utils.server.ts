import type { DefaultTheme, MarkdownRenderer, SiteConfig } from 'vitepress'
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createMarkdownRenderer } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

const defaultExcludePattern = fs.readFileSync('.gitignore', 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#'))

export function getSidebarItemsV2(
  folderPath: string,
  options?: VitePressSidebarOptions & {
    desc?: boolean
  },
) {
  const { desc, ...opts } = options || {}

  return generateSidebar({
    documentRootPath: process.argv[3],
    scanStartPath: folderPath,
    sortMenusByName: true,
    sortMenusOrderByDescending: desc,
    excludePattern: defaultExcludePattern,
    ...opts,
  }) as DefaultTheme.SidebarItem[]
}

export function getSidebarItems(
  targetDir: string,
  options: {
    rootDir?: string
    exclude?: string[]
    desc?: boolean
  } = {},
): DefaultTheme.SidebarItem[] {
  const {
    rootDir = 'docs',
    exclude = ['_.*', 'attachments'],
    desc = false,
  } = options
  const rootPath = path.join(process.cwd(), rootDir)
  const dirPath = path.join(rootPath, targetDir)

  if (!fs.existsSync(dirPath))
    return []

  const files = fs.readdirSync(dirPath)
  if (desc)
    files.sort((a, b) => b.localeCompare(a))

  const items: DefaultTheme.SidebarItem[] = []

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (exclude.some(e => new RegExp(e).test(file)))
      continue

    if (stat.isDirectory()) {
      items.push({
        text: file,
        link: `/${path.join(targetDir, file)}/`,
        collapsed: true,
        items: getSidebarItems(path.join(targetDir, file), {
          rootDir,
          exclude,
          desc,
        }),
      })
    }
    else if (file.endsWith('.md') && file !== 'index.md') {
      const text = file.replace(/\.md$/, '')
      const link = `/${path.join(targetDir, text)}`
      items.push({ text, link })
    }
  }

  return items
}

// [How to interpolate markdown into markdown? #2921](https://github.com/vuejs/vitepress/discussions/2921#discussioncomment-7023589)
const config: SiteConfig = (globalThis as any).VITEPRESS_CONFIG

export function createMd() {
  return createMarkdownRenderer(
    config.srcDir,
    config.markdown,
    config.site.base,
    config.logger,
  )
}

// [title · Issue #4629 · vuejs/vitepress](https://github.com/vuejs/vitepress/issues/4629)
export function insertH1IfMissing() {
  return (md: MarkdownRenderer) => {
    md.core.ruler.after('block', 'insert_h1_if_missing', (state) => {
      const { env, tokens, Token } = state

      if (env.h1Handled || !env.path)
        return

      const fileName = path.basename(env.path, path.extname(env.path))

      // index.md はタイトルを表示しない
      if (env.relativePath === 'index.md')
        return

      const hasH1 = tokens.some(token =>
        token.type === 'heading_open' && token.tag === 'h1',
      )

      if (!hasH1) {
        const title = env.frontmatter?.title || fileName
        const h1Open = new Token('heading_open', 'h1', 1)
        const h1Text = new Token('inline', '', 0)
        const h1Close = new Token('heading_close', 'h1', -1)
        h1Text.content = title
        h1Text.children = []

        tokens.unshift(h1Open, h1Text, h1Close)
      }

      // 2回目以降は処理しない（BiDirectionalLinks.getLink で [[]] ごとに markdown-it が呼び出される）
      env.h1Handled = true
    })
  }
}
