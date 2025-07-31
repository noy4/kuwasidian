import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'

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

  map.on('load', () => {
    map.addControl(new maplibregl.NavigationControl())
  })
}
