import type { EntrySection } from '../.vitepress/entry-parser'
import { createContentLoader } from 'vitepress'
import { parseEntries } from '../.vitepress/entry-parser'

declare const data: EntrySection[]
export { data }

export default createContentLoader('works/work.data.md', {
  includeSrc: true,
  transform(data) {
    return parseEntries(data[0]?.src || '')
  },
})
