import { createContentLoader } from 'vitepress'
import { createMd } from '../../.vitepress/markdown'

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

      const items = sectionContent
        .trim()
        .split(/\n{3,}/)
        .map((item) => {
          const [title, ..._description] = item.split('\n')
          let description = _description.join('\n')
          description = render?.(description) || description
          return { title, description }
        })

      return {
        title: sectionTitle,
        items,
      }
    })

  return sections
}
