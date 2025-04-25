import type { DefaultTheme, SiteConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createMarkdownRenderer } from 'vitepress'

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
    exclude = ['_.*'],
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
