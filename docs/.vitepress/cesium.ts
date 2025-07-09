// [Configuring Vite or Webpack for CesiumJS – Cesium](https://cesium.com/blog/2024/02/13/configuring-vite-or-webpack-for-cesiumjs/)

import type { Plugin } from 'vitepress'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// Copy Cesium static files
export function cesium(options: { siteBase?: string } = {}): Plugin[] {
  const { siteBase = '/' } = options

  const cesiumSource = 'node_modules/cesium/Build/Cesium'
  const cesiumBaseUrl = 'cesiumStatic'

  const copies = viteStaticCopy({
    targets: [
      { src: `../${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
      { src: `../${cesiumSource}/Workers`, dest: cesiumBaseUrl },
      { src: `../${cesiumSource}/Assets`, dest: cesiumBaseUrl },
      { src: `../${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
    ],
  })

  const _cesium: Plugin = {
    name: 'vite-plugin-cesium',
    config() {
      return {
        define: {
          CESIUM_BASE_URL: JSON.stringify(`${siteBase}${cesiumBaseUrl}`),
        },
      }
    },
  }

  return [...copies, _cesium]
}
