import type { TerrainLayerProps } from '@deck.gl/geo-layers'
import { TerrainLayer } from '@deck.gl/geo-layers'
import { MapboxOverlay } from '@deck.gl/mapbox'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'

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
  init = () => {
    loadMap()
  }
}

export async function loadMap() {
  const map = new maplibregl.Map({
    container: 'map',
    style: MAP_STYLE,
    center: [137, 36],
    zoom: 5.5,
    pitch: 40.5,
    bearing: -27,
  })

  const deckOverlay = new MapboxOverlay({
    // interleaved: true,
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
    ],
  })

  map.on('load', () => {
    map.addControl(deckOverlay)
    map.addControl(new maplibregl.NavigationControl())
  })
}
