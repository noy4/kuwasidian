import type { MarkdownItAsync } from 'markdown-it-async'
import dedent from 'dedent'
import markdownit from 'markdown-it-async'

function externalLinkPlugin(md: MarkdownItAsync) {
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrs?.find(([name]: [string, string]) => name === 'href')?.[1] || ''
    if (/^https?:\/\//.test(href)) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noopener')
    }
    return self.renderToken(tokens, idx, options)
  }
}

const md = markdownit({
  breaks: true,
})
md.use(externalLinkPlugin)

export function mdrender(text: string) {
  return md.render(dedent(text))
}
