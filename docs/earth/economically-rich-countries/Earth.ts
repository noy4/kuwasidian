import * as Cesium from 'cesium'
import { tinykeys } from 'tinykeys'
import { ref } from 'vue'

export interface Location {
  name: string
  longitude: number
  latitude: number
}

export type GDPLocation = Location & {
  gdp_ppp: number
}

export class Earth {
  RANGE = 1000
  PITCH = Cesium.Math.toRadians(-15)
  OFFSET = new Cesium.HeadingPitchRange(0, this.PITCH, this.RANGE)
  ROTATION_SPEED = 0.005

  viewer!: Cesium.Viewer
  terrainProvider!: Cesium.TerrainProvider
  currentLocationIndex = ref(0)
  currentPoint = ref<Cesium.Cartesian3 | null>(null)
  isRotating = ref(false)
  locations: GDPLocation[]
  unsubKeys: (() => void) | null = null

  constructor(locations: GDPLocation[]) {
    this.locations = locations
  }

  mount = () => {
    this.initialize()
    this.unsubKeys = tinykeys(window, {
      'Space': preventDefault(() => this.toggleCameraRotation()),
      'Enter': preventDefault(() => this.goToNextLocation()),
      'ArrowRight': preventDefault(() => this.goToNextLocation()),
      'Shift+Enter': preventDefault(() => this.goToPrevLocation()),
      'ArrowLeft': preventDefault(() => this.goToPrevLocation()),
    })
    return () => this.destroy()
  }

  destroy() {
    this.stopCameraRotation()
    this.viewer.destroy()
    this.unsubKeys?.()
    this.unsubKeys = null
  }

  async initialize() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjdlYzkxZC1kNTM5LTRlNWItYmM4MC1hMGUyY2VmZDFlYWQiLCJpZCI6MzEyMTEyLCJpYXQiOjE3NDk4OTEyMDF9.Krcs6xfVbGbfMuxORnoMA4iF-mLfcvudZfLy9EBAwGQ'
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      // The globe does not need to be displayed,
      // since the Photorealistic 3D Tiles include terrain
      globe: false,
      // terrain: Cesium.Terrain.fromWorldTerrain(),
      geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
      timeline: false,
      animation: false,
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
    await this.flyToLocationView(0, { duration: 0 })
    this.startCameraRotation()
  }

  async goToLocation(locationIndex: number) {
    this.stopCameraRotation()

    await this.flyAboveLocation(this.currentLocationIndex.value, {
      duration: 0.5,
      easingFunction: Cesium.EasingFunction.QUARTIC_OUT,
    })
    this.currentLocationIndex.value = locationIndex
    await this.flyAboveLocation(locationIndex)
    await this.flyToLocationView(locationIndex, {
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN,
      duration: 0.5,
    })

    this.startCameraRotation()
  }

  goToNextLocation() {
    return this.goToLocation((this.currentLocationIndex.value + 1) % this.locations.length)
  }

  goToPrevLocation() {
    const len = this.locations.length
    const prev = (this.currentLocationIndex.value - 1 + len) % len
    return this.goToLocation(prev)
  }

  async flyToLocationView(
    locationIndex: number,
    options?: Parameters<Cesium.Camera['flyToBoundingSphere']>[1],
  ) {
    const [terrainPosition] = await Cesium.sampleTerrainMostDetailed(
      this.terrainProvider,
      [Cesium.Cartographic.fromDegrees(
        this.locations[locationIndex].longitude,
        this.locations[locationIndex].latitude,
      )],
    )
    console.log('height:', terrainPosition.height)
    const center = Cesium.Cartesian3.fromDegrees(
      this.locations[locationIndex].longitude,
      this.locations[locationIndex].latitude,
      terrainPosition.height,
    )
    this.currentPoint.value = center
    const sphere = new Cesium.BoundingSphere(center)
    await this.flyToBoundingSphereAsync(sphere, {
      offset: this.OFFSET,
      ...options,
    })
  }

  flyAboveLocation(
    locationIndex: number,
    options?: Partial<Parameters<Cesium.Camera['flyTo']>[0]>,
  ) {
    return this.flyToAsync({
      destination: Cesium.Cartesian3.fromDegrees(
        this.locations[locationIndex].longitude,
        this.locations[locationIndex].latitude,
        this.RANGE,
      ),
      ...options,
    })
  }

  cameraRotationHandler = () => this.viewer.camera.rotateRight(this.ROTATION_SPEED)

  // [Control the Camera – Cesium](https://cesium.com/learn/cesiumjs-learn/cesiumjs-camera/#orbit-around-a-point)
  startCameraRotation() {
    if (this.isRotating.value)
      return
    this.isRotating.value = true
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(this.currentPoint.value!)
    this.viewer.camera.lookAtTransform(transform, this.OFFSET)
    this.viewer.clock.onTick.addEventListener(this.cameraRotationHandler)
  }

  stopCameraRotation() {
    this.isRotating.value = false
    this.viewer.clock.onTick.removeEventListener(this.cameraRotationHandler)
    this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
  }

  toggleCameraRotation() {
    if (this.isRotating.value)
      this.stopCameraRotation()
    else
      this.startCameraRotation()
  }

  flyToAsync(...args: Parameters<Cesium.Camera['flyTo']>) {
    return flyToAsync(this.viewer, ...args)
  }

  flyToBoundingSphereAsync(...args: Parameters<Cesium.Camera['flyToBoundingSphere']>) {
    return flyToBoundingSphereAsync(this.viewer, ...args)
  }
}

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
