import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { basename } from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import { minimatch } from 'minimatch'
import { defineLoader } from 'vitepress'
import { createMd } from '../.vitepress/markdown'
import { getSiteConfig } from '../.vitepress/vitepress.extend'

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
  html: string
}

declare const data: RecentUpdate[]
export { data }

export default defineLoader({
  async load() {
    return await getRecentUpdates()
  },
})

async function getRecentUpdates(options: Options = {}): Promise<RecentUpdate[]> {
  const {
    root = process.argv[3],
    pattern = `${root ? `${root}/` : ''}**/*.md`,
    limit = 30,
  } = options
  const siteConfig = getSiteConfig()

  const log = execSync(
    `git -c core.quotepath=false log --pretty="format:%cd" --name-status --date=iso -n ${limit * 3}`,
    { encoding: 'utf-8' },
  ).trim()

  // Example git log output:
  /*
    2025-06-26 11:34:32 +0900
    M       docs/.vitepress/config.mts
    A       docs/.vitepress/markdown.ts
    M       docs/.vitepress/utils.ts

    2025-06-26 11:09:41 +0900
    M       docs/+note.archive.md
    M       docs/+note.md
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

  const md = await createMd()

  // convert to recentUpdates
  for (const { date, status, filePath } of targetFiles) {
    let markdown = ''
    if (fs.existsSync(filePath))
      markdown = fs.readFileSync(filePath, 'utf-8')
    const { content, data } = matter(markdown)
    const firstLine = content.trimStart().split('\n', 1)[0]
    const title = data.title // title in frontmatter
      || firstLine.match(/^#\s+(.*)/)?.[1] // h1 at the top of content
      || basename(filePath.replace(/(\/index)?\.md$/, '')) // file name
    const relativePath = filePath.replace(`${root ? `${root}/` : ''}`, '')
    const dir = relativePath.replace(/[^/]*$/, '')
    const html = data.layout
      ? ''
      : (await md.renderAsync(content)).replace(
          /(<img[^>]*\ssrc=")(?!https?:|data:|\/)([^"]*)"/g,
          (_, prefix, src) => `${prefix}${siteConfig.site.base}${dir}${src.replace(/^\.\//, '')}"`,
        )
    const page = siteConfig.rewrites.map[relativePath] || relativePath
    const link = `${siteConfig.site.base}${page.replace(/(index)?\.md$/, '')}`
    recentUpdates.push({
      date,
      status,
      filePath,
      title,
      link,
      html,
    })
  }

  return recentUpdates
}
