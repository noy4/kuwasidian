import { presetDaisy } from '@ameinhardt/unocss-preset-daisy'
import { defineConfig, presetIcons, presetWind4, transformerVariantGroup } from 'unocss'

const daisy = await presetDaisy()
const exclude = ['link', 'divider', 'menu'] // conflict with VitePress styles
daisy.rules = daisy.rules!.filter(rule =>
  !exclude.some(e => rule[0].toString().includes(e)),
)

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    daisy,
    presetIcons({
      cdn: 'https://esm.sh/',
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})
