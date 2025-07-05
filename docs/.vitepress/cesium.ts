// [Configuring Vite or Webpack for CesiumJS – Cesium](https://cesium.com/blog/2024/02/13/configuring-vite-or-webpack-for-cesiumjs/)

import { viteStaticCopy } from 'vite-plugin-static-copy'

export const cesiumSource = 'node_modules/cesium/Build/Cesium'
export const cesiumBaseUrl = 'cesiumStatic'

// Copy Cesium static files
export function cesium() {
  return viteStaticCopy({
    targets: [
      { src: `../${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
      { src: `../${cesiumSource}/Workers`, dest: cesiumBaseUrl },
      { src: `../${cesiumSource}/Assets`, dest: cesiumBaseUrl },
      { src: `../${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
    ],
  })
}
