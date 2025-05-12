import { execSync } from 'node:child_process'

export interface ProcessedFileUpdate {
  path: string // 元のフルパス (例: docs/notes/example.md)
  displayPath: string // 表示用のパス (例: notes/example.md)
  linkPath: string // リンク生成用のパス (例: /notes/example)
  lastUpdated: string // コミット日時
}

export default {
  load(_watchedFiles: string[]): ProcessedFileUpdate[] {
    try {
      const log = execSync(
        'git log -30 --pretty="format:%cd" --name-only --date=iso',
        { encoding: 'utf-8' },
      )

      const lines = log.trim().split('\n')
      const fileUpdatesMap = new Map<string, string>()
      let currentCommitDate = ''

      for (const line of lines) {
        if (!line.trim())
          continue

        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{4}$/.test(line)) {
          currentCommitDate = line
        }
        else if (currentCommitDate && line.startsWith('docs/')) {
          if (!fileUpdatesMap.has(line) || new Date(currentCommitDate) > new Date(fileUpdatesMap.get(line)!)) {
            fileUpdatesMap.set(line, currentCommitDate)
          }
        }
      }

      const processedFiles: ProcessedFileUpdate[] = Array.from(fileUpdatesMap.entries())
        .map(([path, lastUpdated]) => {
          const displayPath = path.replace(/^docs\//, '')
          const linkPath = `/${displayPath.replace(/\.md$/, '')}`
          return { path, displayPath, linkPath, lastUpdated }
        })
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 15)

      return processedFiles
    }
    catch (e) {
      console.error('Failed to load git log for recent file updates:', e)
      return []
    }
  },
}
