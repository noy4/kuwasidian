export interface Section {
  title: string
  items: Quest[]
}

export interface Quest {
  icon?: string
  title: string
  objective?: string
  description?: string
  status?: string
}

const statusMap = {
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

      if (section.startsWith('## ')) {
        const chunks = section.split('\n')
        sectionTitle = chunks[0].replace(/^## /, '')
        sectionContent = chunks.slice(1).join('\n')
      }

      const items = sectionContent
        .trim()
        .split(/\n{3,}/)
        .map((item) => {
          const [firstLine, objective, ...rest] = item.split('\n')
          const [icon, ...firstLineRest] = firstLine.split(/\s+/)
          const title = firstLineRest.join(' ')
          let description = rest.join('\n')
          description = render?.(description) || description

          return {
            icon,
            title,
            objective,
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
