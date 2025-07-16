import * as Cesium from 'cesium'
import populationData from './population909500.json'

export class Earth {
  viewer!: Cesium.Viewer

  async mount() {
    await this.initialize()
  }

  destroy() {
    this.viewer.destroy()
  }

  async initialize() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjdlYzkxZC1kNTM5LTRlNWItYmM4MC1hMGUyY2VmZDFlYWQiLCJpZCI6MzEyMTEyLCJpYXQiOjE3NDk4OTEyMDF9.Krcs6xfVbGbfMuxORnoMA4iF-mLfcvudZfLy9EBAwGQ'
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      // terrain: Cesium.Terrain.fromWorldTerrain(),
      globe: false,
      geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      // navigationHelpButton: false,
      fullscreenButton: false,
      // homeButton: false,
    })
    this.viewer.scene.skyAtmosphere.show = true
    const tileset = await Cesium.createGooglePhotorealistic3DTileset()
    this.viewer.scene.primitives.add(tileset)

    // src: [dataarts/webgl-globe: WebGL Globe is a platform for visualizing latitude longitude based information using WebGL.](https://github.com/dataarts/webgl-globe)
    const populations = populationData[2][1] as number[] // population in 2000
    const heightScale = 500_0000

    for (let i = 0; i < populations.length; i += 3) {
      const latitude = populations[i]
      const longitude = populations[i + 1]
      const height = populations[i + 2]

      if (height === 0)
        continue

      const color = Cesium.Color.fromHsl(0.6 - height * 0.5, 1.0, 0.5)
      this.viewer.entities.add({
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
            Cesium.Cartesian3.fromDegrees(longitude, latitude, height * heightScale),
          ],
          width: 2,
          material: new Cesium.ColorMaterialProperty(color),
        },
      })

      // const length = height * 1000_000
      // this.viewer.entities.add({
      //   position: Cesium.Cartesian3.fromDegrees(longitude, latitude, length / 2),
      //   cylinder: {
      //     length,
      //     topRadius: 10000,
      //     bottomRadius: 10000,
      //     material: color,
      //   },
      // })
    }
  }
}
