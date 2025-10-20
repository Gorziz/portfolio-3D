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
            
            // Створення сцени
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x002366);
            
            // Камера - збільшено поле зору для більшого лого
            this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000); // Збільшено FOV
            this.camera.position.set(0, 0, 6); // Зменшено відстань
            
            // Рендерер
            const container = document.getElementById('logo3d-container');
            if (!container) {
                console.error('❌ Контейнер для лого не знайдено!');
                this.createFallbackDisplay();
                return;
            }
            
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true
            });
            
            // Збільшений розмір рендерера
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            container.appendChild(this.renderer.domElement);
            
            // Додавання loading індикатора
            this.showLoadingIndicator();
            
            // Освітлення
            this.setupLighting();
            
            // Спроба завантажити модель
            this.loadLogo();
            
            // Обробники подій
            this.setupEventListeners();
            
            // Анімація
            this.animate();
            
            console.log('✅ 3D лого ініціалізовано успішно');
            
        } catch (error) {
            console.error('❌ Помилка ініціалізації 3D:', error);
            this.createFallbackLogo();
        }
    }
    
    // ... інші методи залишаються без змін, крім centerCamera ...
    
    centerCamera() {
        if (!this.logo) return;
        
        const box = new THREE.Box3().setFromObject(this.logo);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
        
        // Зменшено множник для більшого лого
        cameraZ = cameraZ * 1.2; // Зменшено з 1.8
        this.camera.position.z = cameraZ;
        
        this.camera.lookAt(center);
        
        console.log('🎯 Камера відцентрована, зум:', cameraZ.toFixed(2));
    }
    
    createFallbackLogo() {
        console.log('🔄 Створення запасного лого...');
        
        const group = new THREE.Group();
        
        // Збільшена геометрія
        const geometry = new THREE.IcosahedronGeometry(2.0, 2); // Збільшено радіус
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x5072A7,
            transparent: true,
            opacity: 0.9,
            shininess: 100
        });
        
        const mainMesh = new THREE.Mesh(geometry, material);
        group.add(mainMesh);
        
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00308F,
            transparent: true,
            opacity: 0.6
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        group.add(wireframe);
        
        this.logo = group;
        this.scene.add(this.logo);
        
        console.log('✅ Запасне лого створено (збільшене)');
    }
    
    // ... решта методів без змін ...
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.threeApp = new Logo3D();
    }, 100);
});
