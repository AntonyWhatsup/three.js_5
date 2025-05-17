import * as THREE from 'https://unpkg.com/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.castShadow = true;
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const floorGeometry = new THREE.PlaneGeometry(5, 5);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

camera.position.z = 5;

let isPaused = false;
const rotationSpeed = 0.05;
const keyState = {};

window.addEventListener('keydown', (event) => {
  if (!event.repeat) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      keyState[event.key] = true;
    } else {
      isPaused = !isPaused;
    }
  }
});

window.addEventListener('keyup', (event) => {
  if (keyState[event.key]) {
    keyState[event.key] = false;
  }
});

window.addEventListener('mousedown', () => {
  const objectTypes = ["box", "sphere", "cone"];
  const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
  const size = Math.random() * 0.5 + 0.2;
  const color = Math.random() * 0xffffff;

  let geometry;
  if (type === "box") {
    geometry = new THREE.BoxGeometry(1, 1, 1);
  } else if (type === "sphere") {
    geometry = new THREE.SphereGeometry(0.5, 16, 16);
  } else if (type === "cone") {
    geometry = new THREE.ConeGeometry(0.5, 1, 16);
  }

  const material = new THREE.MeshLambertMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.position.set(
    (Math.random() - 0.5) * 4,
    Math.random() * 2,
    (Math.random() - 0.5) * 4
  );
  mesh.scale.set(size, size, size);

  scene.add(mesh);
});

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  if (keyState["ArrowLeft"]) cube.rotation.y -= rotationSpeed;
  if (keyState["ArrowRight"]) cube.rotation.y += rotationSpeed;
  if (keyState["ArrowUp"]) cube.rotation.x -= rotationSpeed;
  if (keyState["ArrowDown"]) cube.rotation.x += rotationSpeed;

  renderer.render(scene, camera);
}

animate();
