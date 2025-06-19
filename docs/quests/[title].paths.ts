import type { Quest, Section } from './quest-parser'
import fs from 'node:fs'
import { parseQuestDataSync } from './quest-parser'

export default {
  async paths() {
    const src = fs.readFileSync('docs/quests/quest.data.md', 'utf-8')
    const questData = parseQuestDataSync(src)
    const paths: { params: { title: string }, content: string }[] = []

    for (const section of questData) {
      for (const quest of section.items) {
        // 各クエストの詳細コンテンツをMarkdownで生成
        const content = generateQuestMarkdown(quest, section)

        paths.push({
          params: { title: quest.title },
          content, // Raw contentとして渡す
        })
      }
    }

    return paths
  },
}

function generateQuestMarkdown(quest: Quest, section: Section): string {
  const statusBadge = quest.status === 'cleared'
    ? '✅ **クリア済み**'
    : quest.status === 'active'
      ? '🔄 **進行中**'
      : '📋 **未着手**'

  const targetSection = quest.target
    ? `## ターゲット\n\n${quest.target}\n`
    : ''

  const descriptionSection = quest.description
    ? `## 説明\n\n${quest.description}\n`
    : ''

  const sectionInfo = section.title
    ? `## セクション\n\n${section.title}\n`
    : ''

  return `# ${quest.icon || '📝'} ${quest.title}

${statusBadge}

${targetSection}
${descriptionSection}
${sectionInfo}

---

[← クエスト一覧に戻る](/quests/)
`
}
