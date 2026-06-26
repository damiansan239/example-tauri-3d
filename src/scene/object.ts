import * as THREE from 'three';

export function createFloatingObject() {
  const group = new THREE.Group();

  // 1. Torus Knot Geometry
  // radius: 1.2, tube: 0.4, tubularSegments: 120, radialSegments: 16, p: 2, q: 3
  const geometry = new THREE.TorusKnotGeometry(1.2, 0.38, 150, 20, 2, 3);

  // 2. Solid material - Glassmorphism + Metallic look
  const physicalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1f0d3d,
    roughness: 0.15,
    metalness: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.4, // semi-transparent glass
    thickness: 1.5,
    side: THREE.DoubleSide,
    flatShading: false,
  });

  const solidMesh = new THREE.Mesh(geometry, physicalMaterial);
  solidMesh.castShadow = true;
  solidMesh.receiveShadow = true;
  group.add(solidMesh);

  // 3. Neon Wireframe overlay for glowing tech aesthetics
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
  });

  const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
  wireframeMesh.scale.setScalar(1.02); // slightly larger
  group.add(wireframeMesh);

  // 4. Floating neon particle field
  const particleCount = 60;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorTeal = new THREE.Color(0x00f0ff);
  const colorPink = new THREE.Color(0xff00b7);

  for (let i = 0; i < particleCount; i++) {
    // Random position in a spherical volume
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 2.0 + Math.random() * 1.5; // distance from center

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Interpolate color between Teal and Pink
    const mixedColor = colorTeal.clone().lerp(colorPink, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Small square particles
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  group.add(particles);

  // Keep references to animate them individually
  return {
    group,
    solidMesh,
    wireframeMesh,
    particles,
  };
}
