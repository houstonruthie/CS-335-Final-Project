import { setupScene } from './scene/setupScene'

// Get or create canvas element
const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw new Error('No canvas found')

// Initialize scene (returns scene, camera, renderer, cube)
const { scene, camera, renderer, cube } = setupScene(canvas)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  
  // Rotate cube for visualization
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  
  renderer.render(scene, camera)
}
animate()

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
})