import * as Cesium from 'cesium'
import { tinykeys } from 'tinykeys'
import { ref } from 'vue'

export interface City {
  year: number
  name: string
  longitude: number
  latitude: number
}

export class Earth {
  RANGE = 1000
  PITCH = Cesium.Math.toRadians(-15)
  OFFSET = new Cesium.HeadingPitchRange(0, this.PITCH, this.RANGE)
  ROTATION_SPEED = 0.005

  viewer!: Cesium.Viewer
  currentCityIndex = ref(0)
  isRotating = ref(false)
  cities: City[]
  unsubKeys: (() => void) | null = null

  constructor(cities: City[]) {
    this.cities = cities
  }

  async mount() {
    await this.initialize()
    // this.startCameraRotation()
    this.unsubKeys = tinykeys(window, {
      'Space': () => this.toggleCameraRotation(),
      'Enter': () => this.goToNextCity(),
      'ArrowRight': () => this.goToNextCity(),
      'Shift+Enter': () => this.goToPrevCity(),
      'ArrowLeft': () => this.goToPrevCity(),
    })
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
      terrain: Cesium.Terrain.fromWorldTerrain(),
      // globe: false,
      geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      // navigationHelpButton: false,
      fullscreenButton: false,
      homeButton: false,
    })
    this.viewer.scene.skyAtmosphere.show = true
    // const tileset = await Cesium.createGooglePhotorealistic3DTileset()
    // this.viewer.scene.primitives.add(tileset)
    this.flyToCityView(0, { duration: 0 })
  }

  async goToCity(cityIndex: number) {
    this.stopCameraRotation()

    await this.flyAboveCity(this.currentCityIndex.value, {
      duration: 0.5,
      easingFunction: Cesium.EasingFunction.QUARTIC_OUT,
    })
    this.currentCityIndex.value = cityIndex
    await this.flyAboveCity(cityIndex)
    await this.flyToCityView(cityIndex, {
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN,
      duration: 0.5,
    })

    this.startCameraRotation()
  }

  goToNextCity() {
    return this.goToCity((this.currentCityIndex.value + 1) % this.cities.length)
  }

  goToPrevCity() {
    const len = this.cities.length
    const prev = (this.currentCityIndex.value - 1 + len) % len
    return this.goToCity(prev)
  }

  async flyToCityView(
    cityIndex: number,
    options?: Parameters<Cesium.Camera['flyToBoundingSphere']>[1],
  ) {
    const sphere = new Cesium.BoundingSphere(
      Cesium.Cartesian3.fromDegrees(
        this.cities[cityIndex].longitude,
        this.cities[cityIndex].latitude,
      ),
    )
    await this.flyToBoundingSphereAsync(sphere, {
      offset: this.OFFSET,
      ...options,
    })
  }

  flyAboveCity(
    cityIndex: number,
    options?: Partial<Parameters<Cesium.Camera['flyTo']>[0]>,
  ) {
    return this.flyToAsync({
      destination: Cesium.Cartesian3.fromDegrees(
        this.cities[cityIndex].longitude,
        this.cities[cityIndex].latitude,
        this.RANGE,
      ),
      ...options,
    })
  }

  cameraRotationHandler = () => this.viewer.camera.rotateRight(this.ROTATION_SPEED)

  startCameraRotation() {
    if (this.isRotating.value)
      return
    this.isRotating.value = true
    const city = this.cities[this.currentCityIndex.value]
    const center = Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude)
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center)
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
