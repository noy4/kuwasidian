import { createContentLoader } from 'vitepress'

export interface RoadmapItem {
  content: string
}

export interface RoadmapSection {
  title: string
  items: RoadmapItem[]
}

declare const data: RoadmapSection[]
export { data }

export default createContentLoader('archives/roadmap/+roadmap.md', {
  render: true,
  transform(data) {
    const html = data[0]?.html || ''

    const sections = html
      .split(/(?=<h2)/)
      .map((section) => {
        const [title, ...contents] = section.split(/(?=<h3)/)
        return {
          title,
          items: contents.map(content => ({ content })),
        }
      })

    return sections
  },
})
