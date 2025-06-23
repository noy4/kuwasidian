<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
})

const containerRef = ref(null)

let scene, camera, renderer
let nodes = []
let edges = []
let nodeGroup, edgeGroup
let animationId

// マウスコントロール用
let isMouseDown = false
let mouseX = 0
let mouseY = 0
let targetRotationX = 0
let targetRotationY = 0
let rotationX = 0
let rotationY = 0

async function loadThreeJS() {
  if (window.THREE)
    return

  // Three.jsを動的にロード
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
  script.async = true

  return new Promise((resolve) => {
    script.onload = () => {
      resolve()
    }
    document.head.appendChild(script)
  })
}

let cleanupMouseControls

function init() {
  // シーンの作成
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xFFFFFF, 100, 250)

  // カメラの作成
  camera = new THREE.PerspectiveCamera(75, props.width / props.height, 0.1, 1000)
  camera.position.set(0, 0, 50)

  // レンダラーの作成
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(props.width, props.height)
  renderer.setClearColor(0x000000, 0)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  containerRef.value.appendChild(renderer.domElement)

  // ライトの調整（立体感を残しつつ白く）
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.7)
  directionalLight.position.set(50, 50, 50)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  // 複数方向からの柔らかい照明
  const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
  directionalLight2.position.set(-30, -30, 30)
  scene.add(directionalLight2)

  // グループの作成
  nodeGroup = new THREE.Group()
  edgeGroup = new THREE.Group()
  scene.add(nodeGroup)
  scene.add(edgeGroup)

  // ネットワークの生成
  generateNetwork()

  // マウスイベントの設定
  cleanupMouseControls = setupMouseControls()

  // アニメーション開始
  animate()
}

function generateNetwork() {
  // 既存のノードとエッジをクリア
  clearNetwork()

  const nodeCount = 45 + Math.floor(Math.random() * 25)
  const positions = []

  // より密集した塊状の配置
  const clusters = 3 + Math.floor(Math.random() * 3)

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

      // 様々なサイズのノード
      const size = (0.8 + Math.random() * 1.5)
      const geometry = new THREE.SphereGeometry(size, 16, 16)
      const material = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
      })
      const node = new THREE.Mesh(geometry, material)
      node.position.copy(position)

      // 影を受ける・落とす設定
      node.castShadow = true
      node.receiveShadow = true

      nodes.push(node)
      nodeGroup.add(node)
    }
  }

  // より複雑で密な接続パターン
  for (let i = 0; i < positions.length; i++) {
    const connectionsCount = 4 + Math.floor(Math.random() * 6)

    // 距離でソートして近い順に接続
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

  // 接続線の太さにバリエーション
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

  nodeGroup.rotation.x = rotationX
  nodeGroup.rotation.y = rotationY
  edgeGroup.rotation.x = rotationX
  edgeGroup.rotation.y = rotationY

  renderer.render(scene, camera)
}

onMounted(async () => {
  await loadThreeJS()
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
}

.network-visualization-container:active {
  cursor: grabbing;
}
</style>
