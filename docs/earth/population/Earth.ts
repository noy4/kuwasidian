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
      timeline: false,
      animation: false,
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
      name: 'Nihon Sankei',
      version: '1.0',
    }, {
      id: '1',
      name: 'Matsusima',
      description: 'ここは松島です',
      position: {
        cartographicDegrees: [141.064, 38.366, 100],
      },
      point: {
        color: {
          rgba: [255, 0, 0, 255],
        },
        pixelSize: 8,
      },
    }, {
      id: '2',
      name: 'Amanohashidate',
      description: 'ここは天橋立です',
      position: {
        cartographicDegrees: [135.190, 35.567, 100],
      },
      point: {
        color: {
          rgba: [0, 255, 0, 255],
        },
        pixelSize: 8,
      },
    }, {
      id: '3',
      name: 'Miyajima',
      description: 'ここは宮島です',
      position: {
        cartographicDegrees: [132.318, 34.297, 100],
      },
      point: {
        color: {
          rgba: [0, 0, 255, 255],
        },
        pixelSize: 8,
      },
    }]

    const czmlDataSource = new Cesium.CzmlDataSource()
    await czmlDataSource.load('1.czml')
    await this.viewer.dataSources.add(czmlDataSource)
    await this.viewer.flyTo(czmlDataSource)
  }
}
