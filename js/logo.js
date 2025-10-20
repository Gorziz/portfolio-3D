const container = document.getElementById('logo-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

const loader = new THREE.GLTFLoader();
let logo, initialRotation;
let autoRotate = true;
let mouseActive = false;

loader.load('my_logo.glb', gltf => {
  logo = gltf.scene;
  scene.add(logo);
  initialRotation = logo.rotation.clone();
}, undefined, error => {
  console.error('Помилка завантаження GLB:', error);
});

function clampAngle(angle, maxDegrees) {
  const max = THREE.MathUtils.degToRad(maxDegrees);
  return Math.max(-max, Math.min(max, angle));
}

function animate() {
  requestAnimationFrame(animate);

  if (logo && autoRotate && !mouseActive) {
    logo.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}

animate();

container.addEventListener('mousemove', e => {
  if (!logo) return;
  mouseActive = true;
  autoRotate = false;

  const rect = container.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

  const targetRotationY = clampAngle(x * Math.PI / 6, 30);
  const targetRotationX = clampAngle(-y * Math.PI / 6, 30);

  logo.rotation.x = targetRotationX;
  logo.rotation.y = targetRotationY;
});

container.addEventListener('mouseleave', () => {
  if (!logo) return;
  mouseActive = false;

  const duration = 0.5;
  const start = performance.now();
  const fromX = logo.rotation.x;
  const fromY = logo.rotation.y;

  function resetAnimation(time) {
    const t = Math.min((time - start) / (duration * 1000), 1);
    logo.rotation.x = THREE.MathUtils.lerp(fromX, initialRotation.x, t);
    logo.rotation.y = THREE.MathUtils.lerp(fromY, initialRotation.y, t);
    if (t < 1) {
      requestAnimationFrame(resetAnimation);
    } else {
      autoRotate = true;
    }
  }

  requestAnimationFrame(resetAnimation);
});