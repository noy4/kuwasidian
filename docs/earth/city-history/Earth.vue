<script setup lang="ts">
import { $ref } from '@vue-macros/reactivity-transform/macros'
import * as Cesium from 'cesium'
import { onMounted } from 'vue'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const cities = [
  { year: 1998, name: '広島・福山', longitude: 133.36709945519166, latitude: 34.48121901629059 },
  { year: 1998, name: '埼玉・大宮', longitude: 139.61697096710148, latitude: 35.94446389018784 },
  { year: 2005, name: '島根・松江', longitude: 133.07209744986676, latitude: 35.47512971396031 },
  { year: 2008, name: '大阪・枚方', longitude: 135.664640267663, latitude: 34.83626989287535 },
  { year: 2011, name: '愛媛・松山', longitude: 132.780117639121, latitude: 33.84188377853939 },
  { year: 2017, name: '福岡・大橋', longitude: 130.43027813106573, latitude: 33.56095413278243 },
]

let viewer: Cesium.Viewer
let currentCityIndex = $ref(0)
let isRotating = $ref(false)
let cameraRotationHandler: (() => void) | null = null
const RANGE = 1000 // カメラの距離

async function initializeCesium() {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjdlYzkxZC1kNTM5LTRlNWItYmM4MC1hMGUyY2VmZDFlYWQiLCJpZCI6MzEyMTEyLCJpYXQiOjE3NDk4OTEyMDF9.Krcs6xfVbGbfMuxORnoMA4iF-mLfcvudZfLy9EBAwGQ'

  viewer = new Cesium.Viewer('cesiumContainer', {
    globe: false,
    geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    homeButton: false,
  })
  viewer.scene.skyAtmosphere.show = true

  // add Google Photorealistic 3D Tileset
  const tileset = await Cesium.createGooglePhotorealistic3DTileset()
  viewer.scene.primitives.add(tileset)

  flyToCity(0, { duration: 0 })
}

// 指定された都市に移動する関数
function flyToCity(
  cityIndex: number,
  options?: Parameters<Cesium.Camera['flyToBoundingSphere']>[1],
) {
  const city = cities[cityIndex]
  const boundingSphere = new Cesium.BoundingSphere(
    Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude),
  )

  viewer.camera.flyToBoundingSphere(boundingSphere, {
    offset: new Cesium.HeadingPitchRange(
      0,
      Cesium.Math.toRadians(-15.0),
      RANGE,
    ),
    pitchAdjustHeight: 0,
    ...options,
  })
}

// 指定された都市に移動
function goToCity(index: number) {
  stopCameraRotation()
  currentCityIndex = index
  flyToCity(index, {
    complete: () => startCameraRotation(),
  })
}

// 次の都市に移動
function moveToNextCity() {
  goToCity((currentCityIndex + 1) % cities.length)
}

// カメラを都市中心の円周上で回転させる
function startCameraRotation() {
  if (isRotating)
    return

  isRotating = true
  const city = cities[currentCityIndex]
  const rotationSpeed = 0.005

  const center = Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude)
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center)
  viewer.camera.lookAtTransform(
    transform,
    new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-15), RANGE),
  )
  cameraRotationHandler = () => viewer.camera.rotateRight(rotationSpeed)
  viewer.clock.onTick.addEventListener(cameraRotationHandler)
}

// カメラの回転を停止
function stopCameraRotation() {
  isRotating = false
  if (cameraRotationHandler) {
    viewer.clock.onTick.removeEventListener(cameraRotationHandler)
    cameraRotationHandler = null
  }
  // カメラロック解除
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
}

// 回転の開始/停止を切り替え
function toggleCameraRotation() {
  if (isRotating) {
    stopCameraRotation()
  }
  else {
    startCameraRotation()
  }
}

onMounted(async () => {
  await initializeCesium()
  startCameraRotation()
  return () => {
    stopCameraRotation()
    viewer.destroy()
  }
})
</script>

<template>
  <div class="relative w-full h-screen">
    <div id="cesiumContainer" class="w-full h-full" />

    <!-- タイムライン -->
    <div class="absolute left-2 top-2 bg-black/70 rounded p-3">
      <h3 class="text-white text-lg font-bold mb-2">
        都市履歴
      </h3>

      <ul class="timeline timeline-vertical">
        <li v-for="(city, index) in cities" :key="index">
          <hr v-if="index !== 0" class="bg-gray-600">

          <div
            class="timeline-start text-sm"
            :class="[
              currentCityIndex === index
                ? 'text-base-100'
                : 'text-gray-400',
            ]"
          >
            {{ city.year }}
          </div>

          <div class="timeline-middle">
            <div
              class="i-tabler-circle-check-filled w-4 h-4 cursor-pointer transition-colors duration-200"
              :class="[
                currentCityIndex === index
                  ? 'bg-green-500'
                  : 'bg-gray-400 hover:bg-gray-300',
              ]"
              @click="goToCity(index)"
            />
          </div>

          <button
            class="timeline-end text-sm transition-colors duration-200"
            :class="[
              currentCityIndex === index
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300',
            ]"
            @click="goToCity(index)"
          >
            {{ city.name }}
          </button>

          <hr v-if="index < cities.length - 1" class="bg-gray-600">
        </li>
      </ul>

      <button
        class="btn btn-primary mt-4 w-full"
        @click="moveToNextCity"
      >
        次の都市へ
      </button>

      <button
        class="btn mt-2 w-full"
        :class="isRotating ? 'btn-error' : 'btn-success'"
        @click="toggleCameraRotation"
      >
        {{ isRotating ? '回転停止' : '回転開始' }}
      </button>
    </div>
  </div>
</template>
