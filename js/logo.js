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

  // Світло
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Завантажувач GLB
  const loader = new THREE.GLTFLoader();
  let model;

  loader.load(
    'my_logo.glb',
    (gltf) => {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      scene.add(model);
    },
    undefined,
    (error) => console.error('Помилка завантаження GLB:', error)
  );

  // Відстеження позиції мишки
  const mouse = new THREE.Vector2();

  function onMouseMove(event) {
    // Нормалізуємо позицію миші до діапазону [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  window.addEventListener('mousemove', onMouseMove, false);

  // Анімація
  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      // Оновлюємо обертання лого на основі позиції миші
      model.rotation.y = mouse.x * Math.PI * 0.2;
      model.rotation.x = mouse.y * Math.PI * 0.2;
    }

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

    if (model) {
      const scale = (headerHeight / 100) * 0.8;
      model.scale.set(scale, scale, scale);
    }
  }
  window.addEventListener('resize', onResize);
  onResize(); // Викликаємо для встановлення початкового розміру
})();
