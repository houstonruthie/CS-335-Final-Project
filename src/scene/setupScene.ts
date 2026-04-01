import * as THREE from 'three'

export function setupScene(canvas: HTMLCanvasElement) {
  // Create scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a)
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(
    75,                                    // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1,                                   // Near clipping plane
    1000                                   // Far clipping plane
  )
  camera.position.z = 3
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  // Create cube
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)
  
  return { scene, camera, renderer, cube }
}