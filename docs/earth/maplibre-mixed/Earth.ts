import type { TerrainLayerProps } from '@deck.gl/geo-layers'
import type { Color, PickingInfo } from 'deck.gl'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox'
import { load } from '@loaders.gl/core'
import { CSVLoader } from '@loaders.gl/csv'
import { HexagonLayer, TerrainLayer } from 'deck.gl'
import maplibregl from 'maplibre-gl'
import { withBase } from 'vitepress'
import { ref } from 'vue'
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

// https://docs.mapbox.com/help/troubleshooting/access-elevation-data/#mapbox-terrain-rgb
// Note - the elevation rendered by this example is greatly exagerated!
const ELEVATION_DECODER: TerrainLayerProps['elevationDecoder'] = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000,
}

export class Earth {
  totalPopulation = ref(0)

  init() {
    loadMap().then((result) => {
      this.totalPopulation.value = result.totalPopulation
    })
  }
}

export async function loadMap() {
  const _data = (await load(DATA_URL, CSVLoader)).data as Record<string, number>[]
  const data = _data.map(d => [d.X, d.Y, d.Z] as DataPoint)
  const totalPopulation = data.reduce((sum, d) => sum + d[2], 0)

  const map = new maplibregl.Map({
    container: 'map',
    style: MAP_STYLE,
    // japan
    center: [137, 36],
    zoom: 5.5,
    pitch: 40.5,
    bearing: -27,
  })

  const radius = 1000
  const upperPercentile = 100
  const coverage = 0.8

  const deckOverlay = new DeckOverlay({
    // interleaved: true,
    getTooltip,
    layers: [
      new TerrainLayer({
        id: 'terrain',
        minZoom: 0,
        maxZoom: 23,
        strategy: 'no-overlap',
        elevationDecoder: ELEVATION_DECODER,
        elevationData: TERRAIN_IMAGE,
        texture: SURFACE_IMAGE,
        wireframe: false,
        color: [255, 255, 255],
      }),
      new HexagonLayer<DataPoint>({
        id: 'heatmap',
        gpuAggregation: true,
        colorRange,
        coverage,
        data,
        elevationRange: [0, 3000],
        elevationScale: data && data.length ? 50 : 0,
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
      }),
    ],
  })

  await map.once('load')
  map.addControl(deckOverlay)
  map.addControl(new maplibregl.NavigationControl())

  return { totalPopulation }
}
