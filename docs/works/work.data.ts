// Works data loader
// Part parsers: title, objective, description (plain text)
import type { EntrySection } from '../.vitepress/entry-parser'
import { createContentLoader } from 'vitepress'
import { createDescriptionParser, parseEntries, parseObjective, parseTitle } from '../.vitepress/entry-parser'

declare const data: EntrySection[]
export { data }

export default createContentLoader('works/work.data.md', {
  includeSrc: true,
  transform(data) {
    return parseEntries(data[0]?.src || '', {
      partParsers: {
        0: parseTitle,
        1: parseObjective,
        2: createDescriptionParser(),
      },
    })
  },
})
