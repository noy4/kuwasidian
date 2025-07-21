import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import path from 'node:path'
import process from 'node:process'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import dedent from 'dedent'
import matter from 'gray-matter'
import { createMarkdownRenderer } from 'vitepress'
import { getSiteConfig } from './vitepress.extend'

export function createMd() {
  const siteConfig = getSiteConfig()
  return createMarkdownRenderer(
    siteConfig.srcDir,
    {
      ...siteConfig.markdown,
      config(md) {
        md.use(wikilinks())
      },
    },
    siteConfig.site.base,
    siteConfig.logger,
  )
}

// --- plugins ---

export function wikilinks() {
  return BiDirectionalLinks({
    dir: process.argv[3],
  })
}

// [title · Issue #4629 · vuejs/vitepress](https://github.com/vuejs/vitepress/issues/4629)
export function insertH1IfMissing() {
  return (md: MarkdownRenderer) => {
    const originalRender = md.render.bind(md)

    md.render = function (src, env?: MarkdownEnv) {
      const { data, content } = matter(src)
      if (
        env
        && (!data.layout || data.layout === 'doc') // 'doc' layout
        && env.relativePath !== 'index.md' // not in index.md
      ) {
        const hasH1 = content.startsWith('# ')
        if (!hasH1) {
          const title = data.title || path.basename(env.path.replace(/(\/index)?\.md$/, ''))
          src = matter.stringify(`# ${title}\n\n${content}`, data)
        }
      }

      return originalRender(src, env)
    }
  }
}

export function insertDateIfBlog() {
  return (md: MarkdownRenderer) => {
    const originalRender = md.render.bind(md)

    md.render = function (src: string, env?: MarkdownEnv) {
      if (env?.relativePath.match(/^blog\/[^index]/)) {
        const { data, content } = matter(src)
        const { published_at, updated_at } = data

        const dateHtml = dedent`
          <DateCard
            :published-at='${JSON.stringify(published_at)}'
            :updated-at='${JSON.stringify(updated_at)}'
          />
        `
        src = matter.stringify(`${dateHtml}\n\n${content}`, data)
      }

      return originalRender(src, env)
    }
  }
}

export function descriptionExtractor() {
  return (md: MarkdownRenderer) => {
    const originalRender = md.render.bind(md)

    md.render = function (src: string, env?: MarkdownEnv) {
      if (env) {
        const { data, content } = matter(src)
        const description = data.description || extractDescription(content)
        src = matter.stringify(content, { ...data, description })
      }
      return originalRender(src, env)
    }

    function extractDescription(src = '') {
      let content = src
        .replace(/^#.*/, '') // Remove if it starts with a heading
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ')
        .trim()

      content = content.length > 120
        ? `${content.slice(0, 120)}...`
        : content

      return content
    }
  }
}
