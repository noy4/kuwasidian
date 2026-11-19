// Quest format

import type { Entry, EntrySection } from '../.vitepress/entry-parser'
import { createDescriptionParser, parseEntries, parseIconTitle, parseObjective } from '../.vitepress/entry-parser'

export type Quest = Entry & {
  title: string
  icon?: string
  objective?: string
  description?: string
  status?: string
  added?: string
  cleared?: string
}

export type Section = EntrySection & {
  items: Quest[]
}

export function parseQuestData(
  src: string,
  render?: (content: string) => string,
): Section[] {
  return parseEntries(src, {
    partParsers: {
      0: parseIconTitle,
      1: parseObjective,
      2: createDescriptionParser(render),
    },
  }) as Section[]
}
