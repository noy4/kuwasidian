import dedent from 'dedent'
import markdownit from 'markdown-it-async'

const md = markdownit({
  breaks: true,
})

export function mdrender(text: string) {
  return md.render(dedent(text))
}
