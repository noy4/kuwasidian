import { execSync } from 'node:child_process'
import process from 'node:process'
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
  )

  const commits: Commit[] = []
  const entries: RecentUpdateEntry[] = []
  const seen = new Set<string>()
  const chunks = log.split('\n\n')

  for (const chunk of chunks) {
    const [date, ...fileLines] = chunk.split('\n')
    fileLines.forEach((line) => {
      const [status, filePath] = line.split('\t')
      commits.push({ date, status, filePath })
    })
  }

  for (const { date, status, filePath } of commits) {
    // if (pattern && !filePath.includes(pattern.replace(/\*\*\/\*\.md$/, '').replace(/\*/, '')))
    //   continue
    if (seen.has(filePath))
      continue
    seen.add(filePath)
    const title = filePath.split('/').pop()?.replace(/\.md$/, '') || filePath
    const url = `/${filePath.replace(/\.md$/, '').replace(/^docs\//, '')}`
    entries.push({
      lastUpdated: date,
      status,
      filePath,
      title,
      url,
    })
    if (entries.length >= limit)
      break
  }

  return entries
}
