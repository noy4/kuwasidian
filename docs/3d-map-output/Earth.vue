<script setup lang="ts">
import { $ref } from '@vue-macros/reactivity-transform/macros'
import * as Cesium from 'cesium'
import { onMounted } from 'vue'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const cities = [
  { name: '広島/福山', longitude: 133.3716565649084, latitude: 34.48419596526299 },
  { name: '埼玉', longitude: 139.6489, latitude: 35.8617 },
  { name: '島根', longitude: 133.0505, latitude: 35.4723 },
  { name: '大阪', longitude: 135.5023, latitude: 34.6937 },
  { name: '愛媛', longitude: 132.7657, latitude: 33.8416 },
  { name: '福岡', longitude: 130.4017, latitude: 33.5904 },
]

let viewer: Cesium.Viewer
let currentCityIndex = 0
let currentCity = $ref(cities[0].name)

async function initializeCesium() {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjdlYzkxZC1kNTM5LTRlNWItYmM4MC1hMGUyY2VmZDFlYWQiLCJpZCI6MzEyMTEyLCJpYXQiOjE3NDk4OTEyMDF9.Krcs6xfVbGbfMuxORnoMA4iF-mLfcvudZfLy9EBAwGQ'

  viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    sceneModePicker: false,
    navigationHelpButton: false,
  })

  // 3D建物レイヤーを追加
  const buildingTileset = await Cesium.createOsmBuildingsAsync()
  viewer.scene.primitives.add(buildingTileset)

  // 初期位置を広島に設定
  flyToCity(0, { duration: 0 })
}

// 指定された都市に移動する関数
function flyToCity(
  cityIndex: number,
  options?: {
    duration?: number
  },
) {
  const city = cities[cityIndex]
  currentCity = city.name

  const boundingSphere = new Cesium.BoundingSphere(
    Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude),
  )

  viewer.camera.flyToBoundingSphere(boundingSphere, {
    offset: new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(0.0),
      Cesium.Math.toRadians(-15.0),
      3000,
    ),
    ...options,
  })
}

// 次の都市に移動
function moveToNextCity() {
  currentCityIndex = (currentCityIndex + 1) % cities.length
  flyToCity(currentCityIndex)
}

onMounted(async () => {
  await initializeCesium()
})
</script>

<template>
  <div class="relative w-full h-screen">
    <div id="cesiumContainer" class="w-full h-full" />

    <!-- 都市情報表示 -->
    <div class="absolute top-2.5 left-2.5 bg-black bg-opacity-70 text-white px-2.5 py-2.5 rounded text-lg font-sans z-1000">
      現在の場所: {{ currentCity }}
    </div>

    <!-- コントロールパネル -->
    <div class="absolute top-15 left-2.5 flex flex-col gap-2.5 z-1000">
      <button
        class="px-3.75 py-2.5 text-sm bg-green-500 hover:bg-green-600 text-white border-none rounded cursor-pointer transition-colors duration-300"
        @click="moveToNextCity"
      >
        次の都市へ
      </button>
    </div>
  </div>
</template>
