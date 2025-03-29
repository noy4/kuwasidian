import markdownit from 'markdown-it'

export function extractDescription(content: string): string {
  const plainText = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/\s+/g, ' ')
    .trim()

  const escapedText = plainText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  return escapedText.length > 120
    ? `${escapedText.slice(0, 120)}...`
    : escapedText
}

export const md = markdownit({ breaks: true })
