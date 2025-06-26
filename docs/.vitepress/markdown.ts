import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import path from 'node:path'

// [title · Issue #4629 · vuejs/vitepress](https://github.com/vuejs/vitepress/issues/4629)
export function insertH1IfMissing() {
  return (md: MarkdownRenderer) => {
    md.core.ruler.after('block', 'insert_h1_if_missing', (state) => {
      const { env, tokens, Token } = state

      if (env.h1Handled || !env.path)
        return

      const fileName = path.basename(env.path, path.extname(env.path))

      // index.md はタイトルを表示しない
      if (env.relativePath === 'index.md')
        return

      const hasH1 = tokens.some(token =>
        token.type === 'heading_open' && token.tag === 'h1',
      )

      if (!hasH1) {
        const title = env.frontmatter?.title || fileName
        const h1Open = new Token('heading_open', 'h1', 1)
        const h1Text = new Token('inline', '', 0)
        const h1Close = new Token('heading_close', 'h1', -1)
        h1Text.content = title
        h1Text.children = []

        tokens.unshift(h1Open, h1Text, h1Close)
      }

      // 2回目以降は処理しない（BiDirectionalLinks.getLink で [[]] ごとに markdown-it が呼び出される）
      env.h1Handled = true
    })
  }
}

export function descriptionExtractor(md: MarkdownRenderer) {
  const originalRender = md.render.bind(md)

  md.render = function (src: string, env?: MarkdownEnv) {
    const html = originalRender(src, env)

    if (!env)
      return html

    env.frontmatter ||= {}
    env.frontmatter.description ||= extractDescription(env.content)

    return html
  }

  function extractDescription(src = '') {
    let content = src
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')
      .trim()

    content = content.length > 120
      ? `${content.slice(0, 120)}...`
      : content

    return content
  }
}
