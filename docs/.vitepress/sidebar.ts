import type { DefaultTheme } from 'vitepress'
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types'
import process from 'node:process'
import { generateSidebar } from 'vitepress-sidebar'
import { defaultExcludePattern } from './vitepress.extend'

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
    collapsed: true,
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
