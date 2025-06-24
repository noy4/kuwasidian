<script setup>
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'

const {
  width = 600,
  height = 400,
} = defineProps({
  width: Number,
  height: Number,
})

const containerRef = ref(null)

let scene, camera, renderer
let nodes = []
let edges = []
let networkGroup, nodeGroup, edgeGroup
let animationId

// マウスコントロール用
let isMouseDown = false
let mouseX = 0
let mouseY = 0
let targetRotationX = 0
let targetRotationY = 0
let rotationX = 0
let rotationY = 0

let cleanupMouseControls

function init() {
  // シーンの作成
  scene = new THREE.Scene()

  // コンテナの実際のサイズを取得
  const containerWidth = containerRef.value.clientWidth
  const containerHeight = containerRef.value.clientHeight

  // カメラの作成
  camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000)
  camera.position.set(0, 0, 50)

  // レンダラーの作成
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(containerWidth, containerHeight)
  renderer.setClearColor(0x000000, 0)
  containerRef.value.appendChild(renderer.domElement)

  // ライトの設定
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
  directionalLight.position.set(50, 50, 50)
  scene.add(directionalLight)

  // グループの作成
  networkGroup = new THREE.Group()
  nodeGroup = new THREE.Group()
  edgeGroup = new THREE.Group()
  networkGroup.add(nodeGroup)
  networkGroup.add(edgeGroup)
  scene.add(networkGroup)

  // ネットワークの生成
  generateNetwork()

  // カメラ位置を調整してネットワーク全体が見えるようにする
  adjustCameraToFitNetwork()

  // マウスイベントの設定
  cleanupMouseControls = setupMouseControls()

  // アニメーション開始
  animate()
}

function generateNetwork() {
  clearNetwork()

  const nodeCount = 45 + Math.floor(Math.random() * 25)
  const clusters = 3 + Math.floor(Math.random() * 3)

  const positions = generateNodes(nodeCount, clusters)
  generateEdges(positions)
}

function generateNodes(nodeCount, clusters) {
  const positions = []

  for (let cluster = 0; cluster < clusters; cluster++) {
    const clusterCenter = new THREE.Vector3(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
    )

    const nodesInCluster = Math.floor(nodeCount / clusters) + Math.floor(Math.random() * 5)

    for (let i = 0; i < nodesInCluster && positions.length < nodeCount; i++) {
      const position = new THREE.Vector3(
        clusterCenter.x + (Math.random() - 0.5) * 25,
        clusterCenter.y + (Math.random() - 0.5) * 25,
        clusterCenter.z + (Math.random() - 0.5) * 25,
      )
      positions.push(position)

      const size = (0.8 + Math.random() * 1.5)
      const geometry = new THREE.SphereGeometry(size, 16, 16)
      const material = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
      })
      const node = new THREE.Mesh(geometry, material)
      node.position.copy(position)

      nodes.push(node)
      nodeGroup.add(node)
    }
  }

  return positions
}

function generateEdges(positions) {
  for (let i = 0; i < positions.length; i++) {
    const connectionsCount = 4 + Math.floor(Math.random() * 6)

    const distances = []
    for (let j = 0; j < positions.length; j++) {
      if (i !== j) {
        distances.push({
          index: j,
          distance: positions[i].distanceTo(positions[j]),
        })
      }
    }
    distances.sort((a, b) => a.distance - b.distance)

    for (let k = 0; k < Math.min(connectionsCount, distances.length); k++) {
      if (distances[k].distance < 20) {
        createEdge(positions[i], positions[distances[k].index])
      }
    }
  }
}

function createEdge(start, end) {
  const length = start.distanceTo(end)

  const thickness = 0.08 + Math.random() * 0.15

  const geometry = new THREE.CylinderGeometry(thickness, thickness, length, 8)
  const material = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
  })

  const edge = new THREE.Mesh(geometry, material)
  edge.position.copy(start).add(end).multiplyScalar(0.5)
  edge.lookAt(end)
  edge.rotateX(Math.PI / 2)

  edges.push(edge)
  edgeGroup.add(edge)
}

function adjustCameraToFitNetwork() {
  if (nodes.length === 0)
    return

  // ネットワーク全体の境界ボックスを計算
  const boundingBox = new THREE.Box3()

  // 全ノードの位置から境界ボックスを計算
  nodes.forEach((node) => {
    boundingBox.expandByPoint(node.position)
  })

  // 境界ボックスのサイズを取得
  const size = boundingBox.getSize(new THREE.Vector3())
  const center = boundingBox.getCenter(new THREE.Vector3())

  // ネットワーク全体を原点中心に移動（回転の中心をオブジェクトの中心にするため）
  networkGroup.position.copy(center).negate()

  // ネットワークの最大サイズ（幅、高さ、奥行きの最大値）
  const maxDimension = Math.max(size.x, size.y, size.z)

  // カメラの視野角（FOV）を考慮して適切な距離を計算
  const fov = camera.fov * (Math.PI / 180) // ラジアンに変換
  const distance = (maxDimension / 2) / Math.tan(fov / 2)

  // 余裕を持たせるため距離を1.5倍にする
  const adjustedDistance = distance * 1.5

  // カメラ位置を調整（原点を見るように）
  camera.position.set(0, 0, adjustedDistance)
  camera.lookAt(0, 0, 0)
}

function clearNetwork() {
  // ノードのクリア
  nodes.forEach((node) => {
    nodeGroup.remove(node)
    node.geometry.dispose()
    node.material.dispose()
  })
  nodes = []

  // エッジのクリア
  edges.forEach((edge) => {
    edgeGroup.remove(edge)
    edge.geometry.dispose()
    edge.material.dispose()
  })
  edges = []
}

function setupMouseControls() {
  const container = containerRef.value

  const handleMouseDown = (event) => {
    isMouseDown = true
    mouseX = event.clientX
    mouseY = event.clientY
  }

  const handleMouseMove = (event) => {
    if (isMouseDown) {
      const deltaX = event.clientX - mouseX
      const deltaY = event.clientY - mouseY

      targetRotationY += deltaX * 0.01
      targetRotationX += deltaY * 0.01

      mouseX = event.clientX
      mouseY = event.clientY
    }
  }

  const handleMouseUp = () => {
    isMouseDown = false
  }

  const handleWheel = (event) => {
    event.preventDefault() // ページのスクロールを停止
    if (event.deltaY > 0) {
      camera.position.multiplyScalar(1.1)
    }
    else {
      camera.position.multiplyScalar(0.9)
    }
    // ズーム範囲の制限
    const distance = camera.position.length()
    if (distance < 20)
      camera.position.setLength(20)
    if (distance > 150)
      camera.position.setLength(150)
  }

  container.addEventListener('mousedown', handleMouseDown)
  container.addEventListener('mousemove', handleMouseMove)
  container.addEventListener('mouseup', handleMouseUp)
  container.addEventListener('wheel', handleWheel)

  // クリーンアップ関数を返す
  return () => {
    container.removeEventListener('mousedown', handleMouseDown)
    container.removeEventListener('mousemove', handleMouseMove)
    container.removeEventListener('mouseup', handleMouseUp)
    container.removeEventListener('wheel', handleWheel)
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)

  // マウスによる回転の適用
  rotationX += (targetRotationX - rotationX) * 0.05
  rotationY += (targetRotationY - rotationY) * 0.05

  networkGroup.rotation.x = rotationX
  networkGroup.rotation.y = rotationY

  renderer.render(scene, camera)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (animationId)
    cancelAnimationFrame(animationId)

  if (renderer && containerRef.value)
    containerRef.value.removeChild(renderer.domElement)

  cleanupMouseControls?.()
  clearNetwork()
})
</script>

<template>
  <div
    ref="containerRef"
    class="network-visualization-container"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
  />
</template>

<style scoped>
.network-visualization-container {
  overflow: hidden;
  cursor: grab;
  border-radius: 8px;
  max-width: 100%;
}

.network-visualization-container:active {
  cursor: grabbing;
}
</style>
