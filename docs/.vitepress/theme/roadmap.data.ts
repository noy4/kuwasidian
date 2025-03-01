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
  render: true,
  transform(data) {
    const html = data[0]?.html || ''

    // HTML を各セクションごとに分割
    const sections = html
      .split('<h2')
      .slice(1)
      .map((section) => {
        const [titleHtml, ...contentHtmlParts] = section.split('</h2>')
        const contentHtml = contentHtmlParts.join('</h2>')

        // タイトルを抽出（HTMLタグを除去）
        const title = titleHtml
          .replace(/^[^>]*>/, '')
          .trim()

        // 項目を抽出（h3タグを含むHTMLのまま）
        const items = contentHtml
          .split('<h3')
          .slice(1)
          .map(item => ({
            content: `<h3${item}`,
          }))

        return {
          title,
          items,
        }
      })

    return sections
  },
})
