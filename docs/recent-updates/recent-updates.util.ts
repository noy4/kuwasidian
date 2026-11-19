import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { basename } from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import { minimatch } from 'minimatch'
import { createMd } from '../.vitepress/markdown'
import { getSiteConfig } from '../.vitepress/vitepress.extend'

export interface RecentUpdate {
  date: string
  status: string
  filePath: string
  title: string
  link: string
  html: string
}

interface FileRecord {
  date: string
  status: string
  filePath: string
}

interface Options {
  root?: string
  pattern?: string
  limit?: number
  previewLength?: number
}

export async function getRecentUpdates(options: Options = {}): Promise<RecentUpdate[]> {
  const {
    root = process.argv[3],
    pattern = `${root ? `${root}/` : ''}**/*.md`,
    limit = 30,
    previewLength = 600,
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
  for (const file of allFiles) {
    if (!minimatch(file.filePath, pattern))
      continue
    if (seen.has(file.filePath))
      continue
    seen.add(file.filePath)
    targetFiles.push(file)
    if (targetFiles.length >= limit)
      break
  }

  const md = await createMd()
  const recentUpdates: RecentUpdate[] = []

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
      : (await md.renderAsync(previewSource(content, previewLength))).replace(
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

function previewSource(content: string, max: number) {
  const text = content.trimStart()
  if (text.length <= max)
    return text
  const paragraphBreak = text.lastIndexOf('\n\n', max)
  let source = text.slice(0, paragraphBreak > 0 ? paragraphBreak : max)
  if ((source.match(/^```/gm) ?? []).length % 2)
    source = source.slice(0, source.lastIndexOf('```'))
  return source
}
