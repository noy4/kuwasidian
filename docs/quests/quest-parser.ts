// Quest Format
//
// 汎用の ../.vitepress/entry-parser.ts をクエスト用の名前で公開しているだけ。
// 書式・ルールは docs/.vitepress/entry-parser.ts を参照。

export type { Entry as Quest, EntrySection as Section } from '../.vitepress/entry-parser'
export { parseEntries as parseQuestData } from '../.vitepress/entry-parser'
