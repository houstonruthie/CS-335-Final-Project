import { setupScene } from './scene/setupScene'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw new Error('No canvas found')

const { scene, camera, renderer, cube, controls } = setupScene(canvas)

function animate() {
  requestAnimationFrame(animate)
  
  controls.update()  // Update control state each frame
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
})