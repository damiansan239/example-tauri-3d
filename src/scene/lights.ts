import * as THREE from 'three';

export function setupLights(scene: THREE.Scene) {
  // Soft ambient light to fill shadows
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Main directional light for sharp highlight reflections
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(5, 10, 7);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 25;
  scene.add(dirLight);

  // Neon Teal Point Light
  const cyanLight = new THREE.PointLight(0x00f0ff, 3, 15);
  cyanLight.position.set(-3, 2, 2);
  scene.add(cyanLight);

  // Neon Magenta Point Light
  const magentaLight = new THREE.PointLight(0xff00b7, 3, 15);
  magentaLight.position.set(3, -2, 2);
  scene.add(magentaLight);

  // Return lights so we can animate their positions for dynamic shading
  return {
    ambientLight,
    dirLight,
    cyanLight,
    magentaLight,
  };
}
