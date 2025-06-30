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
  date?: string
}

const statusMap: Record<number, string> = {
  0: 'active',
  1: 'open',
  2: 'cleared',
}

// ## で始まるセクションで分割
// 1行目：タイトル
// 2行目：目的
// 3行目以降：説明
export function parseQuestData(
  src: string,
  render?: (content: string) => string,
): Section[] {
  const sections = src
    .split(/(?=^##)/m)
    .map((section, sectionIdx) => {
      let sectionTitle = ''
      let sectionContent = section
      const status = statusMap[sectionIdx]

      if (section.startsWith('## ')) {
        const chunks = section.split('\n')
        sectionTitle = chunks[0].replace(/^## /, '')
        sectionContent = chunks.slice(1).join('\n')
      }

      const dateHeader = status === 'cleared'

      const items = sectionContent
        .trim()
        .split(/\n{3,}/)
        .map((item) => {
          const [firstLine, objective, ...rest] = item.split('\n')
          const [icon, ...firstLineRest] = firstLine.split(/\s+/)
          const title = firstLineRest.join(' ')
          let description = rest.join('\n')
          let date: string | undefined
          if (dateHeader) {
            const date_regex = /^\d{4}\/\d{2}\/\d{2}/m
            description = description.replace(date_regex, (match) => {
              date = match
              return ''
            })
          }
          description = render?.(description) || description

          return {
            icon,
            title,
            objective,
            description,
            status,
            date,
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
