// ASCII-анімація, інтегрована у контейнер #logo3D
// Використовує three.js (ESM) та AsciiEffect
import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, effect;
let container;
let model = null;
let baseScale = 1; // базовий масштаб моделі без десктопних модифікацій
let modelMaxDim = 1; // максимальний розмір моделі у world units (для екранної оцінки ширини)
// Управління обертанням мишкою з інерцією
let isDragging = false;
let lastX = 0, lastY = 0;
let velX = 0, velY = 0;
const dragSensitivity = 0.003; // чутливість перетягування
const easeFactor = 0.15;       // плавний старт
const friction = 0.92;         // плавний фініш (інерція)
// Автооберт: базова плавна швидкість, яка м’яко змішується з керуванням
let spinBlend = 1;              // 0..1: 0 при перетягуванні, 1 у стані спокою
const autoSpinY = 0.003;        // базовий автоспін навколо Y
const autoSpinX = 0.001;        // базовий автоспін навколо X

// Зсув моделі по вертикалі у пікселях (буде конвертовано у world units)
const yOffsetPixels = 0;
// Десктопні налаштування: масштаб +50% і зсув вліво на 100px
const desktopBreakpoint = 1024;           // ширина екрана для десктопу
const desktopScaleMultiplier = 1.5;       // +50% до базового масштабу
const desktopXOffsetPixels = 100;         // зсув вліво на 100px
const mobileScaleMultiplier = 1.3;        // +30% масштаб на мобільних

function getYOffsetWorld(pixels) {
  const h = container ? (container.clientHeight || window.innerHeight) : window.innerHeight;
  const distance = camera ? (camera.position.z - (model ? model.position.z : 0)) : 36;
  const vFOV = THREE.MathUtils.degToRad(camera ? camera.fov : 70);
  const frustumHeight = 2 * Math.tan(vFOV / 2) * distance;
  const unitsPerPixel = frustumHeight / h;
  return pixels * unitsPerPixel;
}

function applyModelOffset() {
  if (!model || !camera) return;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const offsetPixels = isMobile ? 30 : yOffsetPixels;
  model.position.y = getYOffsetWorld(offsetPixels);
}

function getXOffsetWorld(pixels) {
  const w = container ? (container.clientWidth || window.innerWidth) : window.innerWidth;
  const h = container ? (container.clientHeight || window.innerHeight) : window.innerHeight;
  const distance = camera ? (camera.position.z - (model ? model.position.z : 0)) : 36;
  const vFOV = THREE.MathUtils.degToRad(camera ? camera.fov : 70);
  const frustumHeight = 2 * Math.tan(vFOV / 2) * distance;
  const frustumWidth = frustumHeight * (camera ? camera.aspect : (w / h));
  const unitsPerPixelX = frustumWidth / w;
  return pixels * unitsPerPixelX;
}

function applyResponsiveLayout() {
  if (!model || !camera) return;
  const isDesktop = (window.innerWidth || (container ? container.clientWidth : 0)) >= desktopBreakpoint;

  // Адаптація масштабу до ширини поточного контейнера: заповнення ~70% на десктопі, ~85% на мобільних
  const contW = container.clientWidth || window.innerWidth;
  const contH = container.clientHeight || window.innerHeight;
  const distance = camera.position.z - (model ? model.position.z : 0);
  const vFOV = THREE.MathUtils.degToRad(camera.fov);
  const frustumHeight = 2 * Math.tan(vFOV / 2) * distance;
  const frustumWidth = frustumHeight * camera.aspect;
  const fill = isDesktop ? 0.7 : 0.85;
  const targetWorldWidth = frustumWidth * fill;
  const targetScale = targetWorldWidth / modelMaxDim;
  model.scale.setScalar(targetScale * (isDesktop ? 1 : mobileScaleMultiplier));

  // Центруємо модель по X всередині поточного контейнера (ліва половина на десктопі)
  model.position.x = 0;
}

function init() {
  container = document.getElementById('logo3D-left') || document.getElementById('logo3D');
  if (!container) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
  camera.position.set(0, 0, 36);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const light1 = new THREE.PointLight(0xffffff, 2.2, 0, 0);
  light1.position.set(50, 50, 50);
  scene.add(light1);

  const light2 = new THREE.PointLight(0x88aaff, 1.6, 0, 0);
  light2.position.set(-50, -20, 40);
  scene.add(light2);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(width, height);

  // ASCII-ефект (знижена роздільність для кращої продуктивності на мобільних)
  effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true, resolution: 0.15 });
  effect.setSize(width, height);
  effect.domElement.style.position = 'absolute';
  effect.domElement.style.inset = '0';
  effect.domElement.style.zIndex = '1';
  effect.domElement.style.pointerEvents = 'none';
  effect.domElement.style.userSelect = 'none';
  container.appendChild(effect.domElement);

  // Завантаження GLB-моделі
  const loader = new GLTFLoader();
  loader.load(
    'ascii/my_logo.glb',
    (gltf) => {
      model = gltf.scene;
      // Центрування моделі
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      // Масштабування під камеру
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      modelMaxDim = maxDim;
      // Цільовий розмір у кадрі
      const target = 20; // налаштовувано: 20 одиниць у ширину/висоту
      // Зменшення поточного розміру моделі на 50%
      const scale = (target / maxDim) * 1.5;
      baseScale = scale;
      model.scale.setScalar(scale);

      scene.add(model);
      applyModelOffset();
      applyResponsiveLayout();
    },
    undefined,
    (err) => {
      console.warn('Не вдалося завантажити GLB, показую торус-кнот:', err);
      // Фолбек: торус-кнот
      const geometry = new THREE.TorusKnotGeometry(8, 2.4, 128, 32);
      const material = new THREE.MeshPhongMaterial({ color: 0x4169e1, shininess: 70 });
      model = new THREE.Mesh(geometry, material);
      // Оцінка maxDim для фолбека
      const fbBox = new THREE.Box3().setFromObject(model);
      const fbSize = fbBox.getSize(new THREE.Vector3());
      modelMaxDim = Math.max(fbSize.x, fbSize.y, fbSize.z) || 1;
      // Узгоджуємо: зменшуємо фолбек-об'єкт на 50%
      model.scale.setScalar(0.5);
      baseScale = 0.5;
      scene.add(model);
      applyModelOffset();
      applyResponsiveLayout();
    }
  );

  // Легка анімація та керування обертанням
  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      // Інерція: плавний старт/фініш
      if (!isDragging) {
        velX *= friction;
        velY *= friction;
      }
      // Плавне змішування автоспіну залежно від перетягування
      spinBlend = THREE.MathUtils.lerp(spinBlend, isDragging ? 0 : 1, 0.05);
      // Загальна швидкість: інерція користувача + автоспін із плавним міксом
      model.rotation.y += velX + autoSpinY * spinBlend;
      model.rotation.x += velY + autoSpinX * spinBlend;
    }
    effect.render(scene, camera);
  }
  animate();

  // Обробники для миші/пойнтера
  function onPointerDown(e) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    const inputVX = dx * dragSensitivity;
    const inputVY = dy * dragSensitivity;
    // плавний старт: лерпимо до нової швидкості
    velX = THREE.MathUtils.lerp(velX, inputVX, easeFactor);
    velY = THREE.MathUtils.lerp(velY, inputVY, easeFactor);
  }

  function onPointerUp() {
    isDragging = false;
  }

  container.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  container.addEventListener('pointerleave', onPointerUp);

  // Реакція на зміну розміру контейнера/вікна
  let resizeScheduled = false;
  function scheduleResize() {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      resizeScheduled = false;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      effect.setSize(w, h);
      applyModelOffset();
      applyResponsiveLayout();
    });
  }
  window.addEventListener('resize', scheduleResize);
}

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', init);