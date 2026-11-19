// Entry Format
//
// **Example**:
// Entries {hidden: true}
// ---
// - 🎙️ Chant; Objective; Description; 2026/04/28; cleared: 2026/04/29
//
// **Rules**:
// - Sections: Delimited by H2 (title followed by `-` line). Optional props: `Title {key: value; ...}`
// - Entries: `- icon + title; objective; description; ...metadata`. Starts with '- ', semicolon-delimited, can span multiple lines.
// - Metadata: `key: value` pairs. Bare dates are treated as added date.
// - `render` を渡すと description がHTML化される（未指定なら生テキスト）

import dedent from 'dedent'

export interface EntrySection {
  title: string
  items: Entry[]
  [key: string]: string | Entry[] | undefined
}

export interface Entry {
  icon?: string
  title: string
  objective?: string
  description?: string
  [key: string]: string | undefined
}

export function parseEntries(
  src: string,
  render?: (content: string) => string,
): EntrySection[] {
  const sections = src
    // split by section title
    .split(/(?=^.+\n-+$)/m)
    .filter(s => s.trim())
    .map((section) => {
      let sectionTitle = ''
      let sectionContent = section
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

      // parse entry blocks (- separated, only lines with ; are new entries)
      const blocks = sectionContent.trim()
        .split(/(?=^- .*;)/m)
        .filter(b => b.trim())

      return {
        title: sectionTitle,
        items: blocks.map(block => parseEntry(block, render)),
        ...props,
      }
    })
  return sections
}

function parseEntry(
  block: string,
  render?: (content: string) => string,
): Entry {
  const parts = block.split(';').map(p => p.trim())
  const [titlePart, objective, descriptionPart = '', ...metaParts] = parts

  // get icon and title
  const iconTitle = (titlePart || '').replace(/^- /, '')
  const regex_icon_title = /^(\S+)\s+(\S.*)$/
  const [, icon, title] = iconTitle.match(regex_icon_title) || []

  // description
  let description = dedent(descriptionPart)
  description = render?.(description) || description

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
    description,
    ...metadata,
    added: metadata.added || defaultMeta,
  }
}
