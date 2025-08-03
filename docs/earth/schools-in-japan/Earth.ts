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
const DATA_URL = withBase('/schools-japan-2013.csv')
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

  const count = object.count
  return `${count} Schools`
}

type DataPoint = [longitude: number, latitude: number]

export class Earth {
  totalSchoolCount = ref(0)
  deckOverlay!: DeckOverlay
  isSchoolLayerVisible = ref(false)
  data: DataPoint[] = []

  constructor() {
    watchEffect(() => {
      const props = {
        layers: [
          this.isSchoolLayerVisible.value && this.createSchoolLayer(),
        ],
      }
      this.deckOverlay?.setProps(props)
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

    loadData().then((result) => {
      this.totalSchoolCount.value = result.data.length
      this.data = result.data
      this.isSchoolLayerVisible.value = true
    })
  }

  toggleSchoolLayer = () => {
    this.isSchoolLayerVisible.value = !this.isSchoolLayerVisible.value
  }

  // 同じ HexagonLayer インスタンスを再利用するとエラーになる？ので都度作成
  createSchoolLayer = () => {
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

export async function loadData() {
  const records = (await load(DATA_URL, CSVLoader)).data as Record<string, number>[]
  const data = records.map(d => [d.X, d.Y] as DataPoint)

  return {
    data,
  }
}
