import { execSync } from 'node:child_process'
import fs from 'node:fs'
import process from 'node:process'
import { minimatch } from 'minimatch'
import { defineLoader } from 'vitepress'

export interface RecentUpdateEntry {
  lastUpdated: string
  status: string
  filePath: string
  title: string
  url: string
}

interface Options {
  root?: string
  pattern?: string
  limit?: number
}

interface Commit {
  date: string
  status: string
  filePath: string
}

declare const data: RecentUpdateEntry[]
export { data }

export default defineLoader({
  load() {
    return getRecentUpdates()
  },
})

function getRecentUpdates(options: Options = {}): RecentUpdateEntry[] {
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

  const allCommits: Commit[] = []
  const targetCommits: Commit[] = []
  const entries: RecentUpdateEntry[] = []
  const seen = new Set<string>()
  const logChunks = log.split('\n\n')

  // Parse git log output
  for (const chunk of logChunks) {
    const [date, ...fileLines] = chunk.split('\n')
    for (const line of fileLines) {
      const [status, filePath] = line.split('\t')
      allCommits.push({ date, status, filePath })
    }
  }

  // Filter commits (pattern, unique file, limit)
  for (const { date, status, filePath } of allCommits) {
    if (!minimatch(filePath, pattern))
      continue
    if (seen.has(filePath))
      continue
    seen.add(filePath)
    targetCommits.push({ date, status, filePath })
    if (entries.length >= limit)
      break
  }

  // convert to entries
  for (const { date, status, filePath } of targetCommits) {
    let content = ''
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8')
    }
    const title = content.match(/^#\s+(.*)/m)?.[1] // h1 in content
      || filePath.split('/').pop()!.replace(/\.md$/, '') // file name
    const url = `/${filePath
      .replace(`${root ? `${root}/` : ''}`, '')
      .replace(/(index)?\.md$/, '')}`
    entries.push({
      lastUpdated: date,
      status,
      filePath,
      title,
      url,
    })
  }

  return entries
}
