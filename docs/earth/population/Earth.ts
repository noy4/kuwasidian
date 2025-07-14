import * as Cesium from 'cesium'

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
      terrain: Cesium.Terrain.fromWorldTerrain(),
      // globe: false,
      geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
      // timeline: false,
      // animation: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      // navigationHelpButton: false,
      fullscreenButton: false,
      // homeButton: false,
    })
    this.viewer.scene.skyAtmosphere.show = true
    // const tileset = await Cesium.createGooglePhotorealistic3DTileset()
    // this.viewer.scene.primitives.add(tileset)

    // GeoJsonDataSource のサンプル
    // const geoJsonData = {
    //   type: 'FeatureCollection',
    //   features: [
    //     {
    //       type: 'Feature',
    //       geometry: {
    //         type: 'Point',
    //         coordinates: [139.6917, 35.6895], // Tokyo
    //       },
    //       properties: {
    //         name: 'Tokyo',
    //       },
    //     },
    //   ],
    // }
    // const geoJsonDataSource = await Cesium.GeoJsonDataSource.load(geoJsonData, {
    //   stroke: Cesium.Color.HOTPINK,
    //   fill: Cesium.Color.PINK,
    //   strokeWidth: 3,
    //   markerSymbol: '?',
    // })
    // this.viewer.dataSources.add(geoJsonDataSource)
    // this.viewer.flyTo(geoJsonDataSource)

    // KmlDataSource のサンプル
    // const kmlUrl = 'https://www.gsi.go.jp/KOKUJYOHO/MENKYO/volcano/fujisan/data/vbm_fujisan_kml.kmz'
    // const kmlDataSource = await Cesium.KmlDataSource.load(kmlUrl, {
    //   camera: this.viewer.scene.camera,
    //   canvas: this.viewer.scene.canvas,
    // })
    //
    // await this.viewer.dataSources.add(kmlDataSource)
    // await this.viewer.flyTo(kmlDataSource)

    // CzmlDataSource のサンプル
    const czml = [{
      id: 'document',
      name: 'name',
      version: '1.0',
    }, {
      id: '1',
      name: 'animation',
      description: '動きます',
      availability: '2018-03-13T12:00:00Z/2018-03-13T12:01:00Z',
      // billboard: {
      //   image: 'imageURL.png',
      //   scale: 0.3,
      // },
      point: {
        color: {
          rgba: [255, 0, 0, 255],
        },
        pixelSize: 8,
      },
      position: {
        epoch: '2018-03-13T12:00:00Z',
        cartographicDegrees: [0, 139, 35, 0, 5, 141.064, 38.366, 0, 6, 140.94532, 38.337405, 0, 7, 141.061363, 38.238789, 0, 8, 141.215858, 38.341713, 0, 9, 141.099129, 38.439652, 0, 10, 140.94532, 38.337405, 0, 15, 135.190, 35.567, 0, 16, 135.14831542968753, 35.58920198716242, 0, 17, 135.14488220214847, 35.54619518601583, 0, 18, 135.20942687988284, 35.544519165584674, 0, 19, 135.21080017089847, 35.586968406786504, 0, 20, 135.14831542968753, 35.58920198716242, 0, 25, 132.318, 34.297, 0, 26, 132.24929809570315, 34.31650345811414, 0, 27, 132.24826812744143, 34.225704902867896, 0, 28, 132.38250732421878, 34.22769216967081, 0, 29, 132.38216400146487, 34.31650194389378, 0, 30, 132.24929809570315, 34.31650345811414, 0],
      },
    }]

    const czmlDataSource = new Cesium.CzmlDataSource()
    await czmlDataSource.load(czml)
    await this.viewer.dataSources.add(czmlDataSource)
    await this.viewer.flyTo(czmlDataSource, { duration: 0 })
  }
}
