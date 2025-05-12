import { execSync } from 'node:child_process'
import { defineLoader } from 'vitepress'

export interface DataEntry {
  path: string // 元のフルパス (例: docs/notes/example.md)
  displayPath: string // 表示用のパス (例: notes/example.md)
  linkPath: string // リンク生成用のパス (例: /notes/example)
  lastUpdated: string // コミット日時
  status: string // 変更の種類 (A: 追加, M: 変更, D: 削除など)
}

declare const data: DataEntry[]
export { data }

export default defineLoader({
  // docs ディレクトリ以下の .md ファイルを監視対象とする
  // これにより、.md ファイルの変更時に load 関数が再実行されることを期待
  watch: ['docs/**/*.md'],
  load(_watchedFiles: string[]): DataEntry[] { // _watchedFiles は現状利用しない
    // console.warn('recent-updates.data.ts: load() called with _watchedFiles:', _watchedFiles) // デバッグ用
    try {
      const log = execSync(
        'git log -30 --pretty="format:%cd" --name-status --date=iso',
        { encoding: 'utf-8' },
      )
      // console.warn('recent-updates.data.ts: git log output:', log) // デバッグ用

      const lines = log.trim().split('\n')
      const fileUpdatesMap = new Map<string, { lastUpdated: string, status: string }>()
      let currentCommitDate = ''

      for (const line of lines) {
        if (!line.trim())
          continue

        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{4}$/.test(line)) {
          currentCommitDate = line
        }
        else if (currentCommitDate && /^[A-Z]\s+"?docs\//.test(line)) {
          let [status, filePath] = line.split('\t', 2)
          if (filePath) {
            if (filePath.startsWith('"') && filePath.endsWith('"')) {
              filePath = filePath.substring(1, filePath.length - 1)
            }
            if (filePath.startsWith('docs/') && filePath.endsWith('.md')) {
              const existingEntry = fileUpdatesMap.get(filePath)
              if (!existingEntry || new Date(currentCommitDate) > new Date(existingEntry.lastUpdated)) {
                fileUpdatesMap.set(filePath, { lastUpdated: currentCommitDate, status })
              }
            }
          }
        }
      }
      // console.warn('recent-updates.data.ts: fileUpdatesMap:', fileUpdatesMap) // デバッグ用

      const processedFiles: DataEntry[] = Array.from(fileUpdatesMap.entries())
        .map(([path, { lastUpdated, status }]) => {
          const displayPath = path.replace(/^docs\//, '')
          const linkPath = `/${displayPath.replace(/\.md$/, '')}`
          return { path, displayPath, linkPath, lastUpdated, status }
        })
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 15)
      // console.warn('recent-updates.data.ts: processedFiles:', processedFiles) // デバッグ用

      return processedFiles
    }
    catch (e) {
      console.error('Failed to load git log for recent file updates:', e)
      return []
    }
  },
})
