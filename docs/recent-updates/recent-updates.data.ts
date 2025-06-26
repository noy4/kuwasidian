import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { basename } from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import { minimatch } from 'minimatch'
import { defineLoader } from 'vitepress'
import { globalSiteConfig } from '../.vitepress/utils.server'

interface Options {
  root?: string
  pattern?: string
  limit?: number
}

interface FileRecord {
  date: string
  status: string
  filePath: string
}

type RecentUpdate = FileRecord & {
  title: string
  link: string
}

declare const data: RecentUpdate[]
export { data }

export default defineLoader({
  load() {
    return getRecentUpdates()
  },
})

function getRecentUpdates(options: Options = {}): RecentUpdate[] {
  const {
    root = process.argv[3],
    pattern = `${root ? `${root}/` : ''}**/*.md`,
    limit = 30,
  } = options

  const log = execSync(
    `git log --pretty="format:%cd" --name-status --date=iso -n ${limit * 3}`,
    { encoding: 'utf-8' },
  ).trim()

  // Example git log output:
  /*
    2025-06-26 11:34:32 +0900
    M       docs/.vitepress/config.mts
    A       docs/.vitepress/markdown.ts
    M       docs/.vitepress/utils.ts

    2025-06-26 11:09:41 +0900
    M       docs/+memo.archive.md
    M       docs/+memo.md
  */

  const allFiles: FileRecord[] = []
  const targetFiles: FileRecord[] = []
  const recentUpdates: RecentUpdate[] = []
  const seen = new Set<string>()
  const logChunks = log.split('\n\n')

  // Parse git log output
  for (const chunk of logChunks) {
    const [date, ...fileLines] = chunk.split('\n')
    for (const line of fileLines) {
      const [status, filePath, renamedFilePath] = line.split('\t')
      allFiles.push({
        date,
        status,
        filePath: renamedFilePath || filePath,
      })
    }
  }

  // Filter files (pattern, unique file, limit)
  for (const { date, status, filePath } of allFiles) {
    if (!minimatch(filePath, pattern))
      continue
    if (seen.has(filePath))
      continue
    seen.add(filePath)
    targetFiles.push({ date, status, filePath })
    if (recentUpdates.length >= limit)
      break
  }

  // convert to recentUpdates
  for (const { date, status, filePath } of targetFiles) {
    let markdown = ''
    if (fs.existsSync(filePath))
      markdown = fs.readFileSync(filePath, 'utf-8')
    const { content, data } = matter(markdown)
    const title = data.title // title in frontmatter
      || content.match(/^#\s+(.*)/m)?.[1] // h1 in content
      || basename(filePath).replace(/\.md$/, '') // file name
    let page = filePath.replace(`${root ? `${root}/` : ''}`, '')
    page = globalSiteConfig.rewrites.map[page] || page
    const link = `${globalSiteConfig.site.base}${page.replace(/(index)?\.md$/, '')}`
    recentUpdates.push({
      date,
      status,
      filePath,
      title,
      link,
    })
  }

  return recentUpdates
}
