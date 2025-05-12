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

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)
  return `${year}/${month}/${day}`
}
