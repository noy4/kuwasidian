import fs from 'node:fs'

function parseGitignore(filePath = '.gitignore') {
  return fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
}

export const defaultExcludePattern = parseGitignore()
