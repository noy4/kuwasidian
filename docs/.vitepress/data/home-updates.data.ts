import { defineLoader } from 'vitepress'
import { getRecentUpdates } from '../../recent-updates/recent-updates.util'

declare const data: import('../../recent-updates/recent-updates.util').RecentUpdate[]
export { data }

export default defineLoader({
  async load() {
    return await getRecentUpdates({ limit: 6 })
  },
})
