// Quest Format
//
// **Example**:
// Quests {hidden: true}
// ---
// - 🎙️ Chant; Research voice-controlled PC; Make PC operation a language learning opportunity; 2026/04/28; cleared: 2026/04/29
//
// **Rules**:
// Sections: Delimited by H2 (title followed by `-` line). Optional props: `Title {key: value; ...}`
// Quests: `- icon + title; objective; description; ...metadata`. Starts with '- ', semicolon-delimited, can span multiple lines.
// Metadata: `key: value` pairs. Bare dates are treated as added date.

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

      // parse quest blocks (- separated, only lines with ; are new quests)
      const blocks = sectionContent.trim()
        .split(/(?=^- .*;)/m)
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
  const parts = block.split(';').map(p => p.trim())
  const [titlePart, objective, description = '', ...metaParts] = parts

  // get icon and title
  const iconTitle = (titlePart || '').replace(/^- /, '')
  const regex_icon_title = /^(\S+)\s+(\S.*)$/
  const [, icon, title] = iconTitle.match(regex_icon_title) || []

  // parse metadata
  let defaultMeta: string | undefined
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
