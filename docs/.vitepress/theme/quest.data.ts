import { createContentLoader } from 'vitepress'

export interface Quest {
  icon?: string
  title: string
  target?: string
  description?: string
}

declare const data: Quest[]
export { data }

export default createContentLoader('+quest.md', {
  includeSrc: true,
  transform(data) {
    const src = data[0]?.src || ''
    const items = src.split(/\n\n\n/).map(v => v.trim())
    // 1行目：タイトル
    // 2行目：ターゲット
    // 3行目以降：説明
    return items.map((item) => {
      const lines = item.split(/\n/)
      const [first, target, ...rest] = lines
      const [icon, ..._title] = first.split(/\s+/)
      const title = _title.join(' ')
      const description = rest.join('\n')

      return {
        icon,
        title,
        target,
        description,
      }
    })
  },
})
