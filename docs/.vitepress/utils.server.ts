import fs from 'node:fs'

export const defaultExcludePattern = parseGitignore()

function parseGitignore(filePath = '.gitignore') {
  return fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
}
