(function () {
  const container = document.getElementById('logo-container');
  if (!container) {
    console.error('Не знайдено #logo-container');
    return;
  }

  // Сцена
  const scene = new THREE.Scene();

  // Камера
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 2);

  // Рендерер
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // прозорий фон
  container.appendChild(renderer.domElement);

  // Контроли
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  // Обмеження обертання
  controls.minPolarAngle = Math.PI / 2 - 0.5; // 30 градусів
  controls.maxPolarAngle = Math.PI / 2 + 0.5; // 30 градусів
  controls.minAzimuthAngle = -0.5; // 30 градусів
  controls.maxAzimuthAngle = 0.5; // 30 градусів

  // Світло
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Завантажувач GLB
  const loader = new THREE.GLTFLoader();
  loader.load(
    'my_logo.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.rotation.y = Math.PI;
      scene.add(model);
    },
    undefined,
    (error) => console.error('Помилка завантаження GLB:', error)
  );

  // Функція для ресету позиції
  function resetPosition() {
    controls.reset();
  }

  // Анімація
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Ресайз
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const headerHeight = window.innerHeight * 0.8;
    const size = Math.min(w, headerHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    container.style.height = `${headerHeight}px`;
  }
  window.addEventListener('resize', onResize);
  onResize(); // Викликаємо для встановлення початкового розміру

  // Якщо контейнер змінює розмір — слідкуємо
  if ('ResizeObserver' in window) {
    new ResizeObserver(onResize).observe(container);
  } else {
    console.warn('ResizeObserver не підтримується в цьому браузері.');
  }
})();
