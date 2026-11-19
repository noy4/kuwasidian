import { defineLoader } from 'vitepress'
import { getRecentUpdates } from './recent-updates.util'

export type { RecentUpdate } from './recent-updates.util'

declare const data: import('./recent-updates.util').RecentUpdate[]
export { data }

export default defineLoader({
  async load() {
    return await getRecentUpdates()
  },
})
