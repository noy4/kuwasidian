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

// VitePress のスタイルと競合するクラスを除外
async function daisy() {
  const daisy = await presetDaisy()
  const exclude = ['link', 'divider', 'menu']
  daisy.rules = daisy.rules!.filter(rule =>
    !exclude.some(e => rule[0].toString().includes(e)),
  )
  return daisy
}
