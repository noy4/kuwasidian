import type { Quest, Section } from './quest-parser'
import { createContentLoader } from 'vitepress'
import { createMd } from '../.vitepress/markdown'
import { parseQuestData } from './quest-parser'

export type { Quest, Section }

declare const data: Section[]
export { data }

export default createContentLoader('quests/quest.data.md', {
  includeSrc: true,
  async transform(data) {
    const src = data[0]?.src || ''
    const md = await createMd()
    return parseQuestData(src, md.render)
  },
})
