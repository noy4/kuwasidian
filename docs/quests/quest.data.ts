import { createContentLoader } from 'vitepress'
import { createMd } from '../.vitepress/utils.server'

export interface Section {
  title: string
  items: Quest[]
}

export interface Quest {
  icon?: string
  title: string
  target?: string
  description?: string
  status?: Status
}

export type Status = 'active' | 'cleared'

const statusMap = {
  0: 'active',
  1: undefined,
  2: 'cleared',
}

declare const data: Section[]
export { data }

export default createContentLoader('quests/quest.data.md', {
  includeSrc: true,
  async transform(data) {
    const src = data[0]?.src || ''
    const md = await createMd()

    // ## で始まるセクションで分割
    // 1行目：タイトル
    // 2行目：ターゲット
    // 3行目以降：説明

    const sections = src
      .split(/(?=^##)/m)
      .map((section, sectionIdx) => {
        let sectionTitle = ''
        let sectionContent = section

        if (section.startsWith('## ')) {
          const chunks = section.split(/\n/)
          sectionTitle = chunks[0].replace(/^## /, '')
          sectionContent = chunks.slice(1).join('\n')
        }

        const items = sectionContent
          .trim()
          .split(/\n\n\n/)
          .map(v => v.trim())
          .map((item) => {
            const itemLines = item.split(/\n/)
            const [_title, target, ..._description] = itemLines
            const [icon, ...__title] = _title.split(/\s+/)
            const title = __title.join(' ')
            const description = md.render(_description.join('\n'))

            return {
              icon,
              title,
              target,
              description,
              status: statusMap[sectionIdx],
            }
          })

        return {
          title: sectionTitle,
          items,
        }
      })

    return sections
  },
})
