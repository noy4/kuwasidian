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

export default createContentLoader('+roadmap.md', {
  includeSrc: true,
  render: true,
  transform(data) {
    const html = data[0]?.html || ''

    // HTML を各セクションごとに分割
    const sections = html
      .split(/<h2[^>]*>/)
      .slice(1)
      .map((section) => {
        // セクションのタイトルと残りのコンテンツを分割
        const [titleHtml, ...rest] = section.split('</h2>')
        const title = titleHtml.replace(/<[^>]+>/g, '').trim()
        const sectionContent = rest.join('</h2>')

        // h3 要素で分割して各アイテムを取得
        const items = sectionContent
          .split(/<h3[^>]*>/)
          .slice(1)
          .map((itemContent) => {
            // 次の h3 要素までのコンテンツを抽出
            const endIndex = itemContent.indexOf('<h3')
            const content = endIndex === -1
              ? itemContent
              : itemContent.slice(0, endIndex)

            return { content }
          })
          .filter(item => item.content.trim() !== '')

        return {
          title,
          items,
        }
      })

    return sections
  },
})
