import type { Quest } from './quest-parser'
import fs from 'node:fs'
import dedent from 'dedent'
import { defineRoutes } from 'vitepress'
import { parseQuestData } from './quest-parser'

export default defineRoutes({
  async paths() {
    const src = fs.readFileSync('docs/quests/quest.data.md', 'utf-8')
    const questData = parseQuestData(src)
    const paths: {
      params: { title: string }
      content: string
    }[] = []

    for (const section of questData) {
      for (const quest of section.items) {
        const content = generateQuestMarkdown(quest)

        paths.push({
          params: { title: quest.title },
          content,
        })
      }
    }

    return paths
  },
})

function generateQuestMarkdown(quest: Quest) {
  return dedent`
    ---
    status: ${quest.status}
    ---
    # ${quest.icon} ${quest.title}

    ${quest.target}

    ${quest.status === 'cleared'
        ? '<img src="/quest_cleared.png" class="absolute top-0 right-0 w-30" >'
        : ''
    }

    ${quest.description}

    <br>

    [← クエスト一覧に戻る](/quests/)
  `
}
