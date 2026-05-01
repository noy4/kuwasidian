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

function unescape(s: string): string {
  return s.replaceAll('\\-', '-')
}

function parseBlock(
  block: string,
  status: string,
  render?: (content: string) => string,
): Quest {
  const escapedBlock = unescape(block)
  const [
    titlePart,
    objective,
    description = '',
    metaStr = '',
  ] = escapedBlock.split(';')
    .map(p => p.trim())

  // get icon and title
  const iconTitle = (titlePart || '').replace(/^- /, '')
  const regex_icon_title = /^(\S+)\s+(\S.*)$/
  const [, icon, title] = iconTitle.match(regex_icon_title) || []

  // parse metadata
  let defaultMeta: string | undefined
  const metaParts = metaStr.split(',').map(p => p.trim())
  const metadata: Record<string, string> = {}
  for (const part of metaParts) {
    const regex_key_value = /^(\w+):\s*(\S.*)$/
    const kv = part.match(regex_key_value)
    if (kv)
      metadata[kv[1]] = kv[2].trim()
    else
      defaultMeta = part
  }

  return {
    icon,
    title,
    objective,
    description: render?.(description) || description,
    status,
    addedDate: metadata.added || defaultMeta,
    clearedDate: metadata.cleared,
  }
}

export function parseQuestData(
  src: string,
  render?: (content: string) => string,
): Section[] {
  const sections = src
    // split by section title
    .split(/(?=^.+\n-+$)/m)
    .filter(s => s.trim())
    .map((section, sectionIdx) => {
      let sectionTitle = ''
      let sectionContent = section
      const status = statusMap[sectionIdx]

      // get section title
      const chunks = section.split('\n')
      if (chunks[1]?.match(/^-+$/)) {
        sectionTitle = chunks[0]
        sectionContent = chunks.slice(2).join('\n')
      }

      // parse quest blocks (- separated)
      const blocks = sectionContent.trim()
        .split(/(?=^- )/m)
        .filter(b => b.trim())

      return {
        title: sectionTitle,
        items: blocks.map(block => parseBlock(block, status, render)),
        dateHeader: status === 'cleared',
      }
    })
  return sections
}
