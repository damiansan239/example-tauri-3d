import * as THREE from 'three';
import { listen } from '@tauri-apps/api/event';
import { enableDrag, setClickThrough } from './window';
import { setupLights } from './scene/lights';
import { createFloatingObject } from './scene/object';

// --- Three.js Setup ---
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 4.5);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  alpha: true, // Enables transparent canvas background
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
renderer.setClearColor(0x000000, 0); // Fully transparent
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Load Scene Components
const lights = setupLights(scene);
const floatingObject = createFloatingObject();
scene.add(floatingObject.group);

// --- Window Interactivity & Tauri API ---
let interactive = false;
const dragRegion = document.getElementById('drag-region')!;
const modeBadge = document.getElementById('mode-badge')!;

async function setInteractiveState(state: boolean) {
  interactive = state;
  // Click-through: ignore cursor events when NOT in interactive mode
  await setClickThrough(!interactive);

  if (interactive) {
    dragRegion.style.pointerEvents = 'auto';
    modeBadge.classList.add('visible');
  } else {
    dragRegion.style.pointerEvents = 'none';
    modeBadge.classList.remove('visible');
  }
}

// Initialize default state: click-through ON (passive overlay)
setInteractiveState(false);

// Enable window dragging on mousedown in the drag-region
dragRegion.addEventListener('mousedown', async (e) => {
  if (e.button === 0) { // Left click
    await enableDrag();
  }
});

// Toggle interactive mode with Escape key
window.addEventListener('keydown', async (e) => {
  if (e.key === 'Escape') {
    await setInteractiveState(!interactive);
  }
});

// Listen to system tray menu toggle interaction event
listen('toggle-interaction', async () => {
  await setInteractiveState(!interactive);
});

// --- Mouse Tracking for Hover Physics ---
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
  // Normalize coordinates between -1 and 1
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// --- Window Resize Handler ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // 1. Slow, elegant object rotations using delta/elapsed time
  floatingObject.solidMesh.rotation.y += delta * 0.45;
  floatingObject.solidMesh.rotation.x += delta * 0.15;

  floatingObject.wireframeMesh.rotation.y += delta * 0.45;
  floatingObject.wireframeMesh.rotation.x += delta * 0.15;

  floatingObject.particles.rotation.y -= delta * 0.08;

  // 2. Interactive tilting effect - group responds to mouse positions (lerping for smoothness)
  // Even in click-through mode, mouse position updates since forward is true
  const targetRotX = mouseY * 0.4;
  const targetRotY = mouseX * 0.4;
  floatingObject.group.rotation.x += (targetRotX - floatingObject.group.rotation.x) * 0.08;
  floatingObject.group.rotation.y += (targetRotY - floatingObject.group.rotation.y) * 0.08;

  // 3. Floating wave movement (bobbing effect)
  floatingObject.group.position.y = Math.sin(time * 1.5) * 0.08;

  // 4. Animate point lights for dynamic specular reflections
  lights.cyanLight.position.x = Math.sin(time * 0.7) * 3;
  lights.cyanLight.position.z = Math.cos(time * 0.7) * 3;

  lights.magentaLight.position.x = -Math.sin(time * 0.5) * 3;
  lights.magentaLight.position.z = -Math.cos(time * 0.5) * 3;

  renderer.render(scene, camera);
}

// Start loop
animate();
