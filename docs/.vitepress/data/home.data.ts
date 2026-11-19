import matter from 'gray-matter'
import { createContentLoader } from 'vitepress'
import { createMd } from '../markdown'

export interface MonthlyReport {
  title: string
  month: string
  volume: number
  chapter: number
  link: string
  cover?: string
}

export interface HomeData {
  reports: MonthlyReport[]
  memo: string
}

declare const data: HomeData
export { data }

const reportTitlePattern = /^桑記 (\d+)巻(\d+)章/

export default createContentLoader(
  ['monthly-reports/**/*.md', '+note.md'],
  {
    includeSrc: true,
    async transform(pages) {
      const md = await createMd()
      const reports: MonthlyReport[] = []
      let memo = ''

      for (const page of pages) {
        const { content } = matter(page.src || '')

        if (page.url.startsWith('/monthly-reports/')) {
          const title = content.match(/^#\s+(.*)/m)?.[1]?.trim()
          const matched = title?.match(reportTitlePattern)
          if (!title || !matched)
            continue

          const coverSrc = content.match(/<img[^>]+src=['"]([^'"]*attachments\/[^'"]+)['"]/)?.[1]
          const dir = page.url.endsWith('/') ? page.url : page.url.replace(/[^/]+$/, '')

          reports.push({
            title,
            month: content.match(/^(\d{4}年\d{1,2}月)/m)?.[1] ?? '',
            volume: Number(matched[1]),
            chapter: Number(matched[2]),
            link: page.url,
            cover: coverSrc ? dir + coverSrc.replace(/^\.\//, '') : undefined,
          })
        }
        else if (page.url === '/+note') {
          memo = await md.renderAsync(content)
        }
      }

      reports.sort((a, b) => b.volume * 100 + b.chapter - (a.volume * 100 + a.chapter))

      return { reports, memo }
    },
  },
)
