import * as Cesium from 'cesium'
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

  viewer!: Cesium.Viewer
  cameraRotationHandler: (() => void) | null = null
  currentCityIndex = ref(0)
  isRotating = ref(false)
  cities: City[]

  constructor(cities: City[]) {
    this.cities = cities
  }

  async mount() {
    await this.initialize()
    this.startCameraRotation()
  }

  destroy() {
    this.stopCameraRotation()
    this.viewer.destroy()
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
      navigationHelpButton: false,
      fullscreenButton: false,
      homeButton: false,
    })
    this.viewer.scene.skyAtmosphere.show = true
    // const tileset = await Cesium.createGooglePhotorealistic3DTileset()
    // this.viewer.scene.primitives.add(tileset)
    this.lookAtCity(0, { duration: 0 })
  }

  async lookAtCity(
    cityIndex: number,
    options?: Parameters<Cesium.Camera['flyToBoundingSphere']>[1],
  ) {
    const city = this.cities[cityIndex]
    const boundingSphere = new Cesium.BoundingSphere(
      Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude),
    )
    await this.flyToBoundingSphereAsync(boundingSphere, {
      offset: new Cesium.HeadingPitchRange(
        0,
        Cesium.Math.toRadians(-15.0),
        this.RANGE,
      ),
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN,
      duration: 0.5,
      ...options,
    })
  }

  async goToCity(nextIndex: number) {
    this.stopCameraRotation()
    const currentCity = this.cities[this.currentCityIndex.value]
    await this.lookDownCity(currentCity, {
      duration: 0.5,
      easingFunction: Cesium.EasingFunction.QUARTIC_OUT,
    })
    this.currentCityIndex.value = nextIndex
    const nextCity = this.cities[nextIndex]
    await this.lookDownCity(nextCity)
    await this.lookAtCity(nextIndex)
    this.startCameraRotation()
  }

  lookDownCity(
    city: City,
    options?: Partial<Parameters<Cesium.Camera['flyTo']>[0]>,
  ) {
    return this.flyToAsync({
      destination: Cesium.Cartesian3.fromDegrees(
        city.longitude,
        city.latitude,
        this.RANGE,
      ),
      ...options,
    })
  }

  moveToNextCity() {
    this.goToCity((this.currentCityIndex.value + 1) % this.cities.length)
  }

  startCameraRotation() {
    if (this.isRotating.value)
      return
    this.isRotating.value = true
    const city = this.cities[this.currentCityIndex.value]
    const rotationSpeed = 0.005
    const center = Cesium.Cartesian3.fromDegrees(city.longitude, city.latitude)
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center)
    this.viewer.camera.lookAtTransform(
      transform,
      new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-15), this.RANGE),
    )
    this.cameraRotationHandler = () => this.viewer.camera.rotateRight(rotationSpeed)
    this.viewer.clock.onTick.addEventListener(this.cameraRotationHandler)
  }

  stopCameraRotation() {
    this.isRotating.value = false
    if (this.cameraRotationHandler) {
      this.viewer.clock.onTick.removeEventListener(this.cameraRotationHandler)
      this.cameraRotationHandler = null
    }
    this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
  }

  toggleCameraRotation() {
    if (this.isRotating.value) {
      this.stopCameraRotation()
    }
    else {
      this.startCameraRotation()
    }
  }

  flyToAsync(
    options: Parameters<Cesium.Camera['flyTo']>[0],
  ): Promise<void> {
    return flyToAsync(this.viewer, options)
  }

  flyToBoundingSphereAsync(
    boundingSphere: Cesium.BoundingSphere,
    options?: Parameters<Cesium.Camera['flyToBoundingSphere']>[1],
  ): Promise<void> {
    return flyToBoundingSphereAsync(this.viewer, boundingSphere, options)
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
