import { createContentLoader } from 'vitepress'

export interface RoadmapItem {
  title: string
  content?: string
}

export interface RoadmapSection {
  title: string
  items: RoadmapItem[]
}

declare const data: RoadmapSection[]
export { data }

export default createContentLoader('+roadmap.md', {
  includeSrc: true,
  transform(data) {
    const content = data[0]?.src || ''

    const sections = content
      .split(/^## /m)
      .slice(1)
      .map((sectionContent) => {
        const [sectionTitle, ...sectionLines] = sectionContent.split('\n')
        const items = sectionLines.join('\n')
          .split(/^### /m)
          .slice(1)
          .map((itemContent) => {
            const [itemTitle, ...contentLines] = itemContent.split('\n')
            return {
              title: itemTitle,
              content: contentLines.filter(line => line.trim()).join('\n'),
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
