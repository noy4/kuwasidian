import { presetDaisy } from '@ameinhardt/unocss-preset-daisy'
// @ts-expect-error no_types
import theme from 'daisyui/functions/variables.js'
import { defineConfig, presetIcons, presetTypography, presetWind4, transformerVariantGroup } from 'unocss'

// [unocss-preset-daisy](https://github.com/ameinhardt/unocss-preset-daisy)

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
    presetTypography(),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
  theme,
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
