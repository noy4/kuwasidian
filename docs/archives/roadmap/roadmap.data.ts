import { createContentLoader } from 'vitepress'
import { createMd } from '../../.vitepress/utils.server'

export interface RoadmapItem {
  title: string
  description: string
}

export interface RoadmapSection {
  title: string
  items: RoadmapItem[]
}

declare const data: RoadmapSection[]
export { data }

export default createContentLoader('archives/roadmap/roadmap.data.md', {
  includeSrc: true,
  async  transform(data) {
    const src = data[0]?.src || ''
    const md = await createMd()
    return parseRoadmapData(src, md.render)
  },
})

export function parseRoadmapData(
  src: string,
  render?: (content: string) => string,
): RoadmapSection[] {
  // ## で始まるセクションで分割
  // 1行目：タイトル
  // 2行目以降：説明

  const sections = src
    .split(/(?=^##)/m)
    .map((section) => {
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
          const [title, ..._description] = itemLines
          const rawDescription = _description.join('\n')
          const description = render?.(rawDescription) || rawDescription

          return {
            title,
            description,
          }
        })

      return {
        title: sectionTitle,
        items,
      }
    })

  return sections
}
