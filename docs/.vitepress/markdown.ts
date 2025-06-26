import type { HeadConfig, MarkdownEnv, MarkdownRenderer } from 'vitepress'

export function descriptionExtractor(md: MarkdownRenderer) {
  const originalRender = md.render.bind(md)

  md.render = function (src: string, env?: MarkdownEnv) {
    const html = originalRender(src, env)

    if (!env || env.frontmatter?.description)
      return html

    const description = extractDescription(env.content)
    env.frontmatter ||= {}
    ;((env.frontmatter.head ??= []) as HeadConfig[]).push(
      ['meta', { name: 'description', content: description }],
    )

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
