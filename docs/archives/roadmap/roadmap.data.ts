import { createContentLoader } from 'vitepress'
import { createMd } from '../../.vitepress/markdown'

export interface RoadmapItem {
  title: string
  description: string
  date?: string // YYYY/MM/DD
}

export interface RoadmapSection {
  title: string
  items: RoadmapItem[]
  dateHeader?: boolean
}

declare const data: RoadmapSection[]
export { data }

export default createContentLoader('archives/roadmap/roadmap.data.md', {
  includeSrc: true,
  async transform(data) {
    const src = data[0]?.src || ''
    const md = await createMd()
    return parseRoadmapData(src, md.render)
  },
})

// ## で始まるセクションで分割
// 1行目：タイトル
// 2行目以降：説明
export function parseRoadmapData(
  src: string,
  render?: (content: string) => string,
): RoadmapSection[] {
  const sections = src
    .split(/(?=^##)/m)
    .map((section) => {
      let sectionTitle = ''
      let sectionContent = section

      // split section into title and content
      if (section.startsWith('## ')) {
        const chunks = section.split('\n')
        sectionTitle = chunks[0].replace(/^## /, '')
        sectionContent = chunks.slice(1).join('\n')
      }

      const dateHeader = sectionTitle.toLowerCase() === 'done'

      const items = sectionContent
        .trim()
        .split(/\n{3,}/)
        .map((item) => {
          const [title, ..._description] = item.split('\n')
          let description = _description.join('\n')
          let date: string | undefined
          if (dateHeader) {
            const date_regex = /^\d{4}\/\d{2}\/\d{2}/m
            ;[date] = description.match(date_regex) || []
            description = description.replace(date_regex, '')
          }
          description = render?.(description) || description
          return { title, description, date }
        })

      return {
        title: sectionTitle,
        items,
        dateHeader,
      }
    })

  return sections
}
