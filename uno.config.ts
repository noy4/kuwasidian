import type { Preset } from 'unocss'
import { presetDaisy } from '@ameinhardt/unocss-preset-daisy'
import { defineConfig, presetIcons, presetWind4, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    daisy(),
    presetIcons({
      cdn: 'https://esm.sh/',
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})

// presetDaisy は `.VPContent` 以下のみに適用（VitePressのスタイルとの競合を防ぐ）
// ref. unocss > packages-presets/preset-wind4/src/postprocess/important.ts
async function daisy(): Promise<Preset> {
  return {
    ...await presetDaisy(),
    postprocess: (util) => {
      // --un-text-opacity などは無視
      if (util.layer === 'properties')
        return
      util.selector = `.VPContent > :not(.NotFound) ${util.selector}`
    },
  }
}
