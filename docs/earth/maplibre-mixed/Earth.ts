import type { Color, PickingInfo } from 'deck.gl'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox'
import { load } from '@loaders.gl/core'
import { CSVLoader } from '@loaders.gl/csv'
import { HexagonLayer } from 'deck.gl'
import maplibregl from 'maplibre-gl'
import { withBase } from 'vitepress'
import { ref, watchEffect } from 'vue'
import 'maplibre-gl/dist/maplibre-gl.css'

// Source data CSV
// [WorldPop :: Population Counts](https://hub.worldpop.org/geodata/summary?id=31939)
const DATA_URL = withBase('/ppp_JPN_2020_1km_Aggregated.csv')
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'

export const colorRange: Color[] = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
]

function getTooltip({ object }: PickingInfo) {
  if (!object)
    return null

  const count = object.elevationValue
  return `${count.toFixed()}人`
}

type DataPoint = [longitude: number, latitude: number, elevation: number]

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1Ijoibm95NCIsImEiOiJjbWRtczZmMzExcTMzMmtwdXUxcWZidG80In0.TgOdgcBfCZHIdcYqHk4nIw'
const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`
const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${MAPBOX_TOKEN}`

export class Earth {
  totalPopulation = ref(0)
  deckOverlay!: DeckOverlay
  isPopulationLayerVisible = ref(false)
  data: DataPoint[] = []

  constructor() {
    watchEffect(() => {
      const _deps = [this.isPopulationLayerVisible.value]
      this.deckOverlay?.setProps({
        layers: [
          this.isPopulationLayerVisible.value && this.createPopulationLayer(),
        ],
      })
    })
  }

  init = () => {
    const map = new maplibregl.Map({
      container: 'map',
      style: MAP_STYLE,
      // japan
      center: [137, 36],
      zoom: 5.5,
      pitch: 40.5,
      bearing: -27,
    })

    this.deckOverlay = new DeckOverlay({
      // interleaved: true,
      getTooltip,
    })

    map.addControl(this.deckOverlay)
    map.addControl(new maplibregl.NavigationControl())
    map.addControl(new maplibregl.GlobeControl())

    map.on('load', () => {
      // add sources
      map.addSource('terrain', {
        type: 'raster-dem',
        tiles: [TERRAIN_IMAGE],
        tileSize: 512,
      })
      map.addSource('surface', {
        type: 'raster',
        tiles: [SURFACE_IMAGE],
        tileSize: 512,
      })

      // add layers
      map.addLayer({
        id: 'surface',
        type: 'raster',
        source: 'surface',
        layout: { visibility: 'visible' },
      })

      // set terrain
      map.setTerrain({ source: 'terrain', exaggeration: 1.5 })
    })

    loadMap().then((result) => {
      this.totalPopulation.value = result.totalPopulation
      this.data = result.data
      this.isPopulationLayerVisible.value = true
    })
  }

  togglePopulationLayer = () => {
    this.isPopulationLayerVisible.value = !this.isPopulationLayerVisible.value
  }

  // 同じ HexagonLayer インスタンスを再利用するとエラーになる？ので都度作成
  createPopulationLayer = () => {
    const data = this.data
    const radius = 1000
    const upperPercentile = 100
    const coverage = 0.8

    return new HexagonLayer<DataPoint>({
      id: 'heatmap',
      gpuAggregation: true,
      colorRange,
      coverage,
      data,
      elevationRange: [0, 3000],
      elevationScale: data.length ? 50 : 0,
      extruded: true,
      getPosition: d => d,
      getElevationWeight: d => d[2],
      getColorWeight: d => d[2],
      pickable: true,
      radius,
      upperPercentile,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51],
      },
      transitions: {
        elevationScale: 3000,
      },
    })
  }
}

export async function loadMap() {
  const records = (await load(DATA_URL, CSVLoader)).data as Record<string, number>[]
  const data = records.map(d => [d.X, d.Y, d.Z] as DataPoint)
  const totalPopulation = data.reduce((sum, d) => sum + d[2], 0)

  return {
    totalPopulation,
    data,
  }
}
