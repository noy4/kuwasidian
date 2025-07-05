<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

// Cesium CDN scripts
function loadCesium() {
  return new Promise((resolve, reject) => {
    // CesiumJS CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.131/Build/Cesium/Widgets/widgets.css'
    document.head.appendChild(link)

    // CesiumJS JavaScript
    const script = document.createElement('script')
    script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.131/Build/Cesium/Cesium.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// リアクティブデータ
const cesiumContainer = ref(null)
const currentCity = ref('広島')
const currentCityIndex = ref(0)
const isAutoMoving = ref(false)

// Cesium関連の変数
let viewer = null
let autoMoveInterval = null

// 都市データ
const cities = [
  { name: '広島', longitude: 132.4596, latitude: 34.3853, height: 50000 },
  { name: '埼玉', longitude: 139.6489, latitude: 35.8617, height: 50000 },
  { name: '島根', longitude: 133.0505, latitude: 35.4723, height: 50000 },
  { name: '大阪', longitude: 135.5023, latitude: 34.6937, height: 50000 },
  { name: '愛媛', longitude: 132.7657, latitude: 33.8416, height: 50000 },
  { name: '福岡', longitude: 130.4017, latitude: 33.5904, height: 50000 },
]

// 指定された都市に移動する関数
function flyToCity(cityIndex) {
  if (!viewer)
    return

  const city = cities[cityIndex]
  currentCity.value = city.name

  viewer.camera.flyTo({
    destination: window.Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude, city.height),
    orientation: {
      heading: window.Cesium.Math.toRadians(0.0),
      pitch: window.Cesium.Math.toRadians(-45.0),
    },
    duration: 3.0,
  })
}

// 次の都市に移動
function moveToNextCity() {
  currentCityIndex.value = (currentCityIndex.value + 1) % cities.length
  flyToCity(currentCityIndex.value)
}

// 自動移動のトグル
function toggleAutoMove() {
  if (autoMoveInterval) {
    clearInterval(autoMoveInterval)
    autoMoveInterval = null
    isAutoMoving.value = false
  }
  else {
    autoMoveInterval = setInterval(moveToNextCity, 5000) // 5秒ごとに移動
    isAutoMoving.value = true
  }
}

// Cesiumビューアーの初期化
async function initializeCesium() {
  try {
    // Cesium Ion access token
    window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjdlYzkxZC1kNTM5LTRlNWItYmM4MC1hMGUyY2VmZDFlYWQiLCJpZCI6MzEyMTEyLCJpYXQiOjE3NDk4OTEyMDF9.Krcs6xfVbGbfMuxORnoMA4iF-mLfcvudZfLy9EBAwGQ'

    // Cesium Viewerの初期化
    viewer = new window.Cesium.Viewer(cesiumContainer.value, {
      terrain: window.Cesium.Terrain.fromWorldTerrain(),
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      navigationHelpButton: false,
    })

    // 3D建物レイヤーを追加
    const buildingTileset = await window.Cesium.createOsmBuildingsAsync()
    viewer.scene.primitives.add(buildingTileset)

    // 初期位置を広島に設定
    flyToCity(0)
  }
  catch (error) {
    console.error('Cesium initialization failed:', error)
  }
}

// マウント時の処理
onMounted(async () => {
  try {
    await loadCesium()
    await initializeCesium()
  }
  catch (error) {
    console.error('Failed to load Cesium:', error)
  }
})

// アンマウント時の処理
onUnmounted(() => {
  if (autoMoveInterval) {
    clearInterval(autoMoveInterval)
  }
  if (viewer) {
    viewer.destroy()
  }
})
</script>

<template>
  <div class="relative w-full h-screen">
    <!-- Cesium 3D地球コンテナ -->
    <div id="cesiumContainer" ref="cesiumContainer" class="w-full h-full" />

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

      <button
        class="px-3.75 py-2.5 text-sm text-white border-none rounded cursor-pointer transition-colors duration-300" :class="[
          isAutoMoving
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600',
        ]"
        @click="toggleAutoMove"
      >
        {{ isAutoMoving ? '自動移動停止' : '自動移動開始' }}
      </button>
    </div>
  </div>
</template>
