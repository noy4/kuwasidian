import { createRecentUpdatesLoader } from '@nolebase/vitepress-plugin-index/vitepress'

export default createRecentUpdatesLoader({
  dir: 'docs',
  rewrites: [
    { from: /^docs\//, to: '' },
  ],
})
