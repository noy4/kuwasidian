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
} as const

export interface ParseOptions {
  render?: (content: string) => string
}

export function parseQuestData(src: string, options: ParseOptions = {}): Section[] {
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
          const rawDescription = _description.join('\n')
          const description = options.render?.(rawDescription) || rawDescription

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
}
