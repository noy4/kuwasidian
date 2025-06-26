import type { DefaultTheme, SiteConfig } from 'vitepress'
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types'
import fs from 'node:fs'
import process from 'node:process'
import { createMarkdownRenderer } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

function parseGitignore(filePath = '.gitignore') {
  return fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
}

export const defaultExcludePattern = parseGitignore()

export function autoSidebar(
  folderPath: string,
  options?: VitePressSidebarOptions & {
    desc?: boolean
  },
) {
  const { desc, ...opts } = options || {}

  const generated = generateSidebar({
    documentRootPath: process.argv[3],
    scanStartPath: folderPath,
    useFolderLinkFromIndexFile: true,
    sortMenusByName: true,
    sortMenusOrderByDescending: desc,
    excludePattern: defaultExcludePattern,
    ...opts,
  }) as DefaultTheme.SidebarItem[]

  return addBase(generated, `/${folderPath}/`)
}

type SidebarItem = DefaultTheme.SidebarItem

function addBase(items: SidebarItem[], base: string): SidebarItem[] {
  return [...items].map((_item) => {
    const item = { ..._item }
    if (item.link)
      item.link = base + item.link
    if (item.items)
      item.items = addBase(item.items, base)
    return item
  })
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
