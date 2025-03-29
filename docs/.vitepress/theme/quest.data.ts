import { createContentLoader } from 'vitepress'

export interface Section {
  title: string
  items: Quest[]
}

export interface Quest {
  icon?: string
  title: string
  target?: string
  description?: string
}

declare const data: Section[]
export { data }

export default createContentLoader('+quest.md', {
  includeSrc: true,
  transform(data) {
    const src = data[0]?.src || ''

    // ## で始まるセクションで分割
    // 1行目：タイトル
    // 2行目：ターゲット
    // 3行目以降：説明

    const sections = src
      .split(/(?=^##)/m)
      .slice(1)
      .map((section) => {
        const [sectionTitle, ..._sectionContent] = section.split(/\n/)

        const items = _sectionContent
          .join('\n')
          .trim()
          .split(/\n\n\n/)
          .map(v => v.trim())
          .map((item) => {
            const itemLines = item.split(/\n/)

            const [_title, target, ..._description] = itemLines
            const [icon, ...__title] = _title
              .replace(/^## /, '')
              .split(/\s+/)
            const title = __title.join(' ')
            const description = _description.join('\n')
            return {
              icon,
              title,
              target,
              description,
            }
          })

        return {
          title: sectionTitle.replace(/^## /, ''),
          items,
        }
      })

    return sections
  },
})
