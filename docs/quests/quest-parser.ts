// Structure: sections separated by H2 (hyphen-style; title followed by `-` line),
// quests separated by lines starting with `- `
//
// Section title
// ---
// - icon + title; objective; description; metadata
//
// Section title can include props in curly braces:
// Archive {hidden: true}
//
// Quest format (semicolon-delimited):
// - 0: icon (emoji) + title
// - 1: objective
// - 2: description (can be multiline)
// - 3: metadata (comma-delimited) — bare date for added, "cleared: YYYY/MM/DD" for cleared
//
// Example:
// - 🎙️ Chant; Voice-controlled PC operation research; Make PC operation a language learning opportunity; 2026/04/28
//
// Escape literal hyphens in descriptions with backslash: \-

export interface Section {
  title: string
  items: Quest[]
  dateHeader?: boolean
  props: Record<string, string>
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
  2: 'archived',
  3: 'cleared',
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
      const props: Record<string, string> = {}

      // get section title
      const chunks = section.split('\n')

      // check if has title
      if (chunks[1]?.match(/^-+$/)) {
        const [titleLine, _underline, ...contentLines] = chunks
        const regex_section_title_props = /^([^{]+)(?:\{([^}]+)\})?$/
        const [, rawTitle = '', rawProps] = titleLine.match(regex_section_title_props) || []
        sectionTitle = rawTitle.trim()

        // parse section props
        if (rawProps) {
          for (const pair of rawProps.split(';')) {
            const [key, value] = pair.split(':').map(s => s.trim())
            if (key && value)
              props[key] = value
          }
        }
        sectionContent = contentLines.join('\n')
      }

      // parse quest blocks (- separated)
      const blocks = sectionContent.trim()
        .split(/(?=^- )/m)
        .filter(b => b.trim())

      return {
        title: sectionTitle,
        items: blocks.map(block => parseQuestBlock(block, status, render)),
        dateHeader: status === 'cleared',
        props,
      }
    })
  return sections
}

function parseQuestBlock(
  block: string,
  status: string,
  render?: (content: string) => string,
): Quest {
  // handle escaped hyphens
  const unescapedBlock = block.replaceAll('\\-', '-')
  const [
    titlePart,
    objective,
    description = '',
    metaStr = '',
  ] = unescapedBlock.split(';')
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
