import * as Cesium from 'cesium'
import { tinykeys } from 'tinykeys'
import { withBase } from 'vitepress'
import { ref } from 'vue'

export interface InfluencerLocation {
  name: string
  longitude: number
  latitude: number
  birth_year: number
  death_year?: number
  field: string // 分野（宗教、科学、哲学、発明など）
  icon: string
  description: string
  major_achievement: string // 主な功績
  model?: string // 3Dモデルのパス（オプショナル）
  modelScale?: number // 3Dモデルのスケール（オプショナル、デフォルト: 10.0）
  modelHeight?: number // 地面からの高さ（オプショナル、デフォルト: 50）
  modelRotation?: {
    heading?: number // ヨー角（度単位、オプショナル、デフォルト: 0）
    pitch?: number // ピッチ角（度単位、オプショナル、デフォルト: 0）
    roll?: number // ロール角（度単位、オプショナル、デフォルト: 0）
  }
}

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjdlYzkxZC1kNTM5LTRlNWItYmM4MC1hMGUyY2VmZDFlYWQiLCJpZCI6MzEyMTEyLCJpYXQiOjE3NDk4OTEyMDF9.Krcs6xfVbGbfMuxORnoMA4iF-mLfcvudZfLy9EBAwGQ'

export class Earth {
  RANGE = 1000
  PITCH = Cesium.Math.toRadians(-15)
  OFFSET = new Cesium.HeadingPitchRange(0, this.PITCH, this.RANGE)

  viewer!: Cesium.Viewer
  terrainProvider!: Cesium.TerrainProvider
  locations: InfluencerLocation[]
  models: Cesium.Model[] = [] // 3Dモデルの配列
  rotation = new Rotation(this)
  unsubKeys: (() => void) | null = null

  currentLocationIndex = ref(0)
  currentPoint = ref<Cesium.Cartesian3 | null>(null)
  isRotating = ref(false)

  constructor(locations: InfluencerLocation[]) {
    this.locations = locations
  }

  mount = () => {
    this.initialize()
    this.unsubKeys = tinykeys(window, {
      'Space': preventDefault(() => this.rotation.toggle()),
      'Enter': preventDefault(() => this.goToNextLocation()),
      'ArrowRight': preventDefault(() => this.goToNextLocation()),
      'Shift+Enter': preventDefault(() => this.goToPrevLocation()),
      'ArrowLeft': preventDefault(() => this.goToPrevLocation()),
    })
    return () => this.destroy()
  }

  destroy() {
    this.rotation.stop()
    remove3DModels(this)
    this.viewer.destroy()
    this.unsubKeys?.()
    this.unsubKeys = null
  }

  async initialize() {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      // The globe does not need to be displayed,
      // since the Photorealistic 3D Tiles include terrain
      globe: false,
      // terrain: Cesium.Terrain.fromWorldTerrain(),
      geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
      timeline: false,
      animation: false,
      shouldAnimate: true,
      baseLayerPicker: false,
      sceneModePicker: false,
      // navigationHelpButton: false,
      fullscreenButton: false,
      homeButton: false,
    })
    // 標高の取得に使いたいが、`globe: false` だと viewer から取得できないようで、別で定義
    this.terrainProvider = await Cesium.createWorldTerrainAsync()
    this.viewer.scene.skyAtmosphere.show = true
    const tileset = await Cesium.createGooglePhotorealistic3DTileset({
      onlyUsingWithGoogleGeocoder: true, // needed to hide warning
    })
    this.viewer.scene.primitives.add(tileset)
    await load3DModels(this)
    await flyToLocationView(this, this.currentLocationIndex.value, { duration: 0 })
    this.rotation.start()
  }

  async goToLocation(locationIndex: number) {
    this.rotation.stop()

    await flyAboveLocation(this, this.currentLocationIndex.value, {
      duration: 0.5,
      easingFunction: Cesium.EasingFunction.QUARTIC_OUT,
    })
    this.currentLocationIndex.value = locationIndex
    await flyAboveLocation(this, locationIndex)
    await flyToLocationView(this, locationIndex, {
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN,
      duration: 0.5,
    })

    this.rotation.start()
  }

  goToNextLocation() {
    return this.goToLocation((this.currentLocationIndex.value + 1) % this.locations.length)
  }

  goToPrevLocation() {
    const len = this.locations.length
    const prev = (this.currentLocationIndex.value - 1 + len) % len
    return this.goToLocation(prev)
  }
}

async function flyToLocationView(
  earth: Earth,
  locationIndex: number,
  options?: Parameters<Cesium.Camera['flyToBoundingSphere']>[1],
) {
  const [terrainPosition] = await Cesium.sampleTerrainMostDetailed(
    earth.terrainProvider,
    [Cesium.Cartographic.fromDegrees(
      earth.locations[locationIndex].longitude,
      earth.locations[locationIndex].latitude,
    )],
  )
  const center = Cesium.Cartesian3.fromDegrees(
    earth.locations[locationIndex].longitude,
    earth.locations[locationIndex].latitude,
    terrainPosition.height,
  )
  earth.currentPoint.value = center
  const sphere = new Cesium.BoundingSphere(center)
  await flyToBoundingSphereAsync(earth.viewer, sphere, {
    offset: earth.OFFSET,
    ...options,
  })
}

function flyAboveLocation(
  earth: Earth,
  locationIndex: number,
  options?: Partial<Parameters<Cesium.Camera['flyTo']>[0]>,
) {
  return flyToAsync(earth.viewer, {
    destination: Cesium.Cartesian3.fromDegrees(
      earth.locations[locationIndex].longitude,
      earth.locations[locationIndex].latitude,
      earth.RANGE,
    ),
    ...options,
  })
}

class Rotation {
  ROTATION_SPEED = 0.005
  constructor(public earth: Earth) {}

  cameraRotationHandler = () => this.earth.viewer.camera.rotateRight(this.ROTATION_SPEED)

  // [Control the Camera – Cesium](https://cesium.com/learn/cesiumjs-learn/cesiumjs-camera/#orbit-around-a-point)
  start() {
    if (this.earth.isRotating.value)
      return
    this.earth.isRotating.value = true
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(this.earth.currentPoint.value!)
    this.earth.viewer.camera.lookAtTransform(transform, this.earth.OFFSET)
    this.earth.viewer.clock.onTick.addEventListener(this.cameraRotationHandler)
  }

  stop() {
    this.earth.isRotating.value = false
    this.earth.viewer.clock.onTick.removeEventListener(this.cameraRotationHandler)
    this.earth.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
  }

  toggle() {
    if (this.earth.isRotating.value)
      this.stop()
    else
      this.start()
  }
}

// 3Dモデルを読み込んで配置する
async function load3DModels(earth: Earth) {
  for (const location of earth.locations) {
    if (!location.model)
      continue

    try {
      // 地形の高さを取得
      const [terrainPosition] = await Cesium.sampleTerrainMostDetailed(
        earth.terrainProvider,
        [Cesium.Cartographic.fromDegrees(location.longitude, location.latitude)],
      )

      // 3Dモデルの位置を設定（地面から少し浮かせる）
      const modelHeight = location.modelHeight || 0
      const position = Cesium.Cartesian3.fromDegrees(
        location.longitude,
        location.latitude,
        terrainPosition.height + modelHeight,
      )

      // 3Dモデルを読み込み
      const modelScale = location.modelScale || 10.0 // デフォルトスケール

      // 回転角度の設定（度をラジアンに変換）
      const heading = Cesium.Math.toRadians(location.modelRotation?.heading || 0)
      const pitch = Cesium.Math.toRadians(location.modelRotation?.pitch || 0)
      const roll = Cesium.Math.toRadians(location.modelRotation?.roll || 0)

      // 回転を含むモデルマトリックスの作成
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)
      const modelMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
        position,
        orientation,
        new Cesium.Cartesian3(modelScale, modelScale, modelScale),
      )

      const model = await Cesium.Model.fromGltfAsync({
        url: withBase(location.model),
        modelMatrix,
      })

      model.readyEvent.addEventListener(() => {
        model.activeAnimations.addAll({
          loop: Cesium.ModelAnimationLoop.REPEAT, // ループ再生
        })
      })

      earth.viewer.scene.primitives.add(model)
      earth.models.push(model)
    }
    catch (error) {
      console.warn(`Failed to load 3D model for ${location.name}:`, error)
    }
  }
}

// 3Dモデルを削除する
function remove3DModels(earth: Earth) {
  earth.models.forEach((model) => {
    earth.viewer.scene.primitives.remove(model)
  })
  earth.models = []
}

// --- utils ---

// Function to fly to a specific camera position asynchronously
function flyToAsync(
  viewer: Cesium.Viewer,
  options: Parameters<Cesium.Camera['flyTo']>[0],
): Promise<void> {
  return new Promise((resolve, reject) => {
    viewer.camera.flyTo({
      ...options,
      complete: resolve,
      cancel: reject,
    })
  })
}

function flyToBoundingSphereAsync(
  viewer: Cesium.Viewer,
  boundingSphere: Cesium.BoundingSphere,
  options: Parameters<Cesium.Camera['flyToBoundingSphere']>[1],
): Promise<void> {
  return new Promise((resolve, reject) => {
    viewer.camera.flyToBoundingSphere(boundingSphere, {
      ...options,
      complete: resolve,
      cancel: reject,
    })
  })
}

function preventDefault(fn: (e: KeyboardEvent) => void) {
  return (e: KeyboardEvent) => {
    e.preventDefault()
    fn(e)
  }
}
