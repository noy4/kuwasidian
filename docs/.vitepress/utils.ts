import type { DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

export function getSidebarItems(
  targetDir: string,
  rootDir = 'docs',
  exclude: string[] = ['_.*'],
): DefaultTheme.SidebarItem[] {
  const rootPath = path.join(process.cwd(), rootDir)
  const dirPath = path.join(rootPath, targetDir)

  if (!fs.existsSync(dirPath))
    return []

  const files = fs.readdirSync(dirPath)
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
        items: getSidebarItems(path.join(targetDir, file), rootDir, exclude),
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

export function extractDescription(content: string): string {
  const plainText = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/\s+/g, ' ')
    .trim()

  return plainText.length > 120
    ? `${plainText.slice(0, 120)}...`
    : plainText
}
