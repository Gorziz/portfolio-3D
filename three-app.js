// Three.js додаток для 3D лого
class Logo3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.logo = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        
        this.init();
    }
    
    init() {
        // Створення сцени
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x002366);
        
        // Камера
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Рендерер
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(300, 300);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const container = document.getElementById('logo3d-container');
        container.appendChild(this.renderer.domElement);
        
        // Освітлення
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Завантаження моделі
        this.loadLogo();
        
        // Обробники подій
        this.setupEventListeners();
        
        // Анімація
        this.animate();
    }
    
    loadLogo() {
        const loader = new THREE.GLTFLoader();
        
        loader.load('./assets/my_logo.glb', (gltf) => {
            this.logo = gltf.scene;
            
            // Налаштування моделі
            this.logo.scale.set(1, 1, 1);
            this.logo.position.set(0, 0, 0);
            
            // Обмеження обертання
            this.logo.rotation.x = 0;
            this.logo.rotation.y = 0;
            
            this.scene.add(this.logo);
            
            // Центрування камери
            const box = new THREE.Box3().setFromObject(this.logo);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = this.camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
            
            // Фіксований зум
            cameraZ = cameraZ * 1.2; // Можна регулювати
            this.camera.position.z = cameraZ;
            
        }, undefined, (error) => {
            console.error('Error loading model:', error);
            this.createFallbackLogo();
        });
    }
    
    createFallbackLogo() {
        // Запасний варіант якщо модель не завантажиться
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x5072A7,
            transparent: true,
            opacity: 0.8
        });
        this.logo = new THREE.Mesh(geometry, material);
        this.scene.add(this.logo);
    }
    
    setupEventListeners() {
        // Відстеження позиції курсору
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Адаптація до розміру вікна
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    onWindowResize() {
        const container = document.getElementById('logo3d-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.logo) {
            // Плавне слідкування за курсором з обмеженням
            this.targetRotationY = this.mouseX * 0.3; // Обмеження ±30 градусів
            this.targetRotationX = this.mouseY * 0.3;
            
            // Плавна інтерполяція
            this.logo.rotation.y += (this.targetRotationY - this.logo.rotation.y) * 0.05;
            this.logo.rotation.x += (this.targetRotationX - this.logo.rotation.x) * 0.05;
            
            // Додаткове плавне обертання
            this.logo.rotation.y += 0.001;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    new Logo3D();
});