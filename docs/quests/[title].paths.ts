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
    lastUpdated: false
    ---
    # ${quest.icon} ${quest.title}

    ${quest.objective}

    ${quest.status === 'cleared'
        ? dedent`
            <script setup>
            import QuestClearedIcon from './QuestClearedIcon.vue'
            </script>
            <QuestClearedIcon date="${quest.date}" />
          `
        : ''
    }

    ${quest.description}

    <br>

    [← クエスト一覧に戻る](/quests/)
  `
}
