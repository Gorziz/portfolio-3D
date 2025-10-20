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
        this.animationId = null;
        this.isModelLoaded = false;
        
        this.init();
    }
    
    init() {
        console.log('🔄 Ініціалізація 3D лого...');
        
        try {
            // Перевірка підтримки WebGL
            if (!this.checkWebGLSupport()) {
                this.showWebGLError();
                return;
            }
            
            // Перевірка наявності Three.js
            if (typeof THREE === 'undefined') {
                console.error('❌ Three.js не завантажено');
                this.createFallbackDisplay();
                return;
            }
            
            // Створення сцени - АБСОЛЮТНО ПРОЗОРИЙ ФОН
            this.scene = new THREE.Scene();
            this.scene.background = null;
            
            // Камера - оптимізована для дуже великого лого
            this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000); // Широкий кут огляду
            this.camera.position.set(0, 0, 4); // Ще ближче для більшого розміру
            
            // Рендерер - максимально прозорий
            const container = document.getElementById('logo3d-container');
            if (!container) {
                console.error('❌ Контейнер для лого не знайдено!');
                this.createFallbackDisplay();
                return;
            }
            
            // Додаємо клас для дуже великого розміру
            container.classList.add('massive');
            
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true, // Прозорість
                powerPreference: "high-performance"
            });
            
            // Максимальний розмір
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Прозорість та якість
            this.renderer.setClearColor(0x000000, 0); // Повністю прозорий
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Видаляємо будь-які стилі, які можуть бути додані Three.js
            this.renderer.domElement.style.background = 'transparent';
            this.renderer.domElement.style.boxShadow = 'none';
            this.renderer.domElement.style.border = 'none';
            
            container.appendChild(this.renderer.domElement);
            
            // Освітлення
            this.setupLighting();
            
            // Спроба завантажити модель
            this.loadLogo();
            
            // Обробники подій
            this.setupEventListeners();
            
            // Анімація
            this.animate();
            
            console.log('✅ 3D лого ініціалізовано успішно - ДУЖЕ ВЕЛИКИЙ РОЗМІР');
            
        } catch (error) {
            console.error('❌ Помилка ініціалізації 3D:', error);
            this.createFallbackLogo();
        }
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(3, 5, 3);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.4);
        fillLight.position.set(-3, -2, 4);
        this.scene.add(fillLight);
    }
    
    centerCamera() {
        if (!this.logo) return;
        
        const box = new THREE.Box3().setFromObject(this.logo);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
        
        // Мінімальний множник для максимального розміру
        cameraZ = cameraZ * 1.1;
        this.camera.position.z = cameraZ;
        
        this.camera.lookAt(center);
        
        console.log('🎯 Камера відцентрована для великого лого, зум:', cameraZ.toFixed(2));
    }
    
    createFallbackLogo() {
        console.log('🔄 Створення запасного лого...');
        
        if (!this.scene) return;
        
        const group = new THREE.Group();
        
        // Максимальна геометрія для великого відображення
        const geometry = new THREE.IcosahedronGeometry(3.0, 3); // Дуже великий і детальний
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x5072A7,
            transparent: true,
            opacity: 0.95,
            shininess: 120,
            specular: 0x2288ff
        });
        
        const mainMesh = new THREE.Mesh(geometry, material);
        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;
        group.add(mainMesh);
        
        // Тонкі контурні лінії
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00308F,
            transparent: true,
            opacity: 0.4,
            linewidth: 1
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        group.add(wireframe);
        
        this.logo = group;
        this.scene.add(this.logo);
        
        console.log('✅ Запасне лого створено (дуже велике)');
    }
    
    // ... решта методів без змін ...
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.threeApp = new Logo3D();
    }, 100);
});
