import type { SiteConfig } from 'vitepress'
import fs from 'node:fs'

// [How to interpolate markdown into markdown? #2921](https://github.com/vuejs/vitepress/discussions/2921#discussioncomment-7023589)
export function getSiteConfig(): SiteConfig {
  return (globalThis as any).VITEPRESS_CONFIG
}

export const defaultExcludePattern = parseGitignore()

function parseGitignore(filePath = '.gitignore') {
  return fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
}
