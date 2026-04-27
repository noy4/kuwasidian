export interface Section {
  title: string
  items: Quest[]
  dateHeader?: boolean
}

export interface Quest {
  icon?: string
  title: string
  objective?: string
  description?: string
  status?: string
  addedDate?: string
  clearedDate?: string
}

const statusMap: Record<number, string> = {
  0: 'active',
  1: 'open',
  2: 'cleared',
}

// タイトル\n--- で始まるセクションで分割
// 1行目：タイトル
// 2行目：目的
// 3行目以降：説明
export function parseQuestData(
  src: string,
  render?: (content: string) => string,
): Section[] {
  const sections = src
    .split(/(?=^.+\n---$)/m)
    .map((section, sectionIdx) => {
      let sectionTitle = ''
      let sectionContent = section
      const status = statusMap[sectionIdx]

      const chunks = section.split('\n')
      if (chunks[1]?.trimEnd() === '---') {
        sectionTitle = chunks[0]
        sectionContent = chunks.slice(2).join('\n')
      }

      const dateHeader = status === 'cleared'

      const items = sectionContent
        .trim()
        .split(/\n{3,}/)
        .map((item) => {
          const [firstLine, objective, ...rest] = item.split('\n')
          const [icon, ...firstLineRest] = firstLine.split(/\s+/)
          const title = firstLineRest.join(' ')

          const fields: Record<string, string> = {}
          const descRest = rest.join('\n')
            .replace(/^(\w+): *(\S.*)$/gm, (_, key, value) => {
              fields[key] = value.trimEnd()
              return ''
            })

          return {
            icon,
            title,
            objective,
            description: render?.(descRest) || descRest,
            status,
            addedDate: fields.added || fields.cleared,
            clearedDate: fields.cleared,
          }
        })

      return {
        title: sectionTitle,
        items,
        dateHeader,
      }
    })

  return sections
}
