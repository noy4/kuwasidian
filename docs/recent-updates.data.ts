import { execSync } from 'node:child_process'

export interface ProcessedFileUpdate {
  path: string // 元のフルパス (例: docs/notes/example.md)
  displayPath: string // 表示用のパス (例: notes/example.md)
  linkPath: string // リンク生成用のパス (例: /notes/example)
  lastUpdated: string // コミット日時
  status: string // 変更の種類 (A: 追加, M: 変更, D: 削除など)
}

export default {
  load(_watchedFiles: string[]): ProcessedFileUpdate[] {
    try {
      const log = execSync(
        'git log -30 --pretty="format:%cd" --name-status --date=iso', // --name-status を追加
        { encoding: 'utf-8' },
      )

      const lines = log.trim().split('\n')
      // Map の値を { lastUpdated: string, status: string } に変更
      const fileUpdatesMap = new Map<string, { lastUpdated: string, status: string }>()
      let currentCommitDate = ''

      for (const line of lines) {
        if (!line.trim())
          continue

        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{4}$/.test(line)) {
          currentCommitDate = line
        }
        // status と path を取得するように変更
        else if (currentCommitDate && /^[A-Z]\s+docs\//.test(line)) {
          const [status, filePath] = line.split(/\s+/, 2)
          if (filePath && filePath.startsWith('docs/')) {
            // 既存のファイル情報がないか、新しいコミットの方が新しい場合に更新
            const existingEntry = fileUpdatesMap.get(filePath)
            if (!existingEntry || new Date(currentCommitDate) > new Date(existingEntry.lastUpdated)) {
              fileUpdatesMap.set(filePath, { lastUpdated: currentCommitDate, status })
            }
          }
        }
      }

      const processedFiles: ProcessedFileUpdate[] = Array.from(fileUpdatesMap.entries())
        // map の引数を [path, { lastUpdated, status }] に変更
        .map(([path, { lastUpdated, status }]) => {
          const displayPath = path.replace(/^docs\//, '')
          const linkPath = `/${displayPath.replace(/\.md$/, '')}`
          // status を返すように変更
          return { path, displayPath, linkPath, lastUpdated, status }
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
