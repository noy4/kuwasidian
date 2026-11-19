// Entry format
//
// Example:
// Entries {hidden: true}
// ---
// - 🎙️ Chant; Objective; Description; 2026/04/28; cleared: 2026/04/29
//
// Rules:
// - Sections: a title line followed by a `---` underline. Optional props: `Title {key: value; ...}`
// - Entries: `- part; part; ...` (semicolon separated, may span multiple lines)
// - Part parsers: register handlers by part index in `partParsers`
// - Unspecified indexes are parsed as metadata (`parseMetadata`)
// - Metadata: `key: value` pairs; a bare value is treated as the added date

import dedent from 'dedent'

export interface EntrySection {
  title: string
  items: Entry[]
  [key: string]: string | Entry[] | undefined
}

export type Entry = Record<string, string | undefined>
export type PartParser = (part: string) => Partial<Entry> | undefined

export interface ParseOptions {
  partParsers?: Record<number, PartParser>
}

export const parseIconTitle: PartParser = (part) => {
  const m = part.match(/^(\S+)\s+(\S.*)$/)
  return m ? { icon: m[1], title: m[2] } : { title: part }
}

export const parseTitle: PartParser = part => ({ title: part })
export const parseObjective: PartParser = part => ({ objective: part })

export function createDescriptionParser(
  render?: (content: string) => string,
): PartParser {
  return (part) => {
    const text = dedent(part)
    return { description: render ? render(text) : text }
  }
}

const parseKeyValue: PartParser = (part) => {
  // `key: value` pair
  const m = part.match(/^(\w+):\s*(\S.*)$/)
  return m ? { [m[1]]: m[2] } : undefined
}

export const parseAddedDate: PartParser = part =>
  /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/.test(part) ? { added: part } : undefined

export const parseMetadata: PartParser = part =>
  parseKeyValue(part) ?? parseAddedDate(part)

export function parseEntries(
  src: string,
  options: ParseOptions = {},
): EntrySection[] {
  const partParsers = options.partParsers ?? {}

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
        .map(b => b.trim().replace(/^- /, ''))
        .filter(b => b)

      return {
        title: sectionTitle,
        items: blocks.map(block => parseEntry(block, partParsers)),
        ...props,
      }
    })
  return sections
}

function parseEntry(
  block: string,
  partParsers: Record<number, PartParser>,
): Entry {
  const parts = block.split(';').map(p => p.trim())
  const entry: Entry = { title: '' }

  parts.forEach((part, index) => {
    const parser = partParsers[index] ?? parseMetadata
    const parsed = parser(part)
    if (parsed)
      Object.assign(entry, parsed)
  })

  return entry
}
