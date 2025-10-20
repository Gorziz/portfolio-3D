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
            
            // Камера
            this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
            this.camera.position.set(0, 0, 8);
            
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
    
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    showWebGLError() {
        const container = document.getElementById('logo3d-container');
        if (container) {
            container.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; 
                            background: linear-gradient(135deg, #002366, #00308F); border-radius: 20px; color: white;
                            font-family: 'Poppins', sans-serif; text-align: center; padding: 20px;">
                    <div>
                        <h3 style="margin-bottom: 10px; font-size: 1.2rem;">3D Logo</h3>
                        <p style="opacity: 0.8; font-size: 0.9rem; margin-bottom: 15px;">WebGL не підтримується</p>
                    </div>
                </div>
            `;
        }
    }
    
    showLoadingIndicator() {
        const container = document.getElementById('logo3d-container');
        if (container) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'logo-loading';
            loadingDiv.innerHTML = `
                <div style="text-align: center;">
                    <div style="width: 40px; height: 40px; border: 3px solid transparent; border-top: 3px solid #F0F8FF; 
                                border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">Завантаження 3D...</p>
                </div>
            `;
            container.appendChild(loadingDiv);
            this.loadingIndicator = loadingDiv;
        }
    }
    
    hideLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.remove();
            this.loadingIndicator = null;
        }
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
        fillLight.position.set(-5, -3, 5);
        this.scene.add(fillLight);
    }
    
    loadLogo() {
        // Спроба використати GLTFLoader якщо доступний
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.warn('⚠️ GLTFLoader не доступний, створюю запасне лого');
            this.hideLoadingIndicator();
            this.createFallbackLogo();
            return;
        }
        
        try {
            const loader = new THREE.GLTFLoader();
            const modelPath = './assets/my_logo.glb';
            
            console.log('📥 Завантаження моделі:', modelPath);
            
            loader.load(modelPath, 
                // Успішне завантаження
                (gltf) => {
                    console.log('✅ Модель успішно завантажена');
                    this.hideLoadingIndicator();
                    
                    this.logo = gltf.scene;
                    this.isModelLoaded = true;
                    
                    // Налаштування моделі
                    this.setupModel();
                    
                    // Центрування камери
                    this.centerCamera();
                    
                }, 
                // Прогрес завантаження
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(2);
                    console.log(`📊 Завантаження моделі: ${percent}%`);
                },
                // Помилка завантаження
                (error) => {
                    console.error('❌ Помилка завантаження моделі:', error);
                    this.hideLoadingIndicator();
                    this.createFallbackLogo();
                }
            );
        } catch (error) {
            console.error('❌ Помилка в loadLogo:', error);
            this.hideLoadingIndicator();
            this.createFallbackLogo();
        }
    }
    
    setupModel() {
        this.logo.scale.set(1, 1, 1);
        this.logo.position.set(0, 0, 0);
        this.logo.rotation.set(0, 0, 0);
        
        this.scene.add(this.logo);
    }
    
    centerCamera() {
        if (!this.logo) return;
        
        const box = new THREE.Box3().setFromObject(this.logo);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
        
        cameraZ = cameraZ * 1.8;
        this.camera.position.z = cameraZ;
        
        this.camera.lookAt(center);
    }
    
    createFallbackLogo() {
        console.log('🔄 Створення запасного лого...');
        
        // Група для запасного лого
        const group = new THREE.Group();
        
        // Основна геометрія
        const geometry = new THREE.IcosahedronGeometry(1.5, 1);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x5072A7,
            transparent: true,
            opacity: 0.9,
            shininess: 100
        });
        
        const mainMesh = new THREE.Mesh(geometry, material);
        group.add(mainMesh);
        
        // Контурні лінії
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
        
        console.log('✅ Запасне лого створено');
    }
    
    createFallbackDisplay() {
        const container = document.getElementById('logo3d-container');
        if (container) {
            container.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; 
                            background: linear-gradient(135deg, #002366, #00308F); border-radius: 20px; color: white;
                            font-family: 'Poppins', sans-serif; text-align: center; padding: 20px;">
                    <div>
                        <div style="font-size: 3rem; margin-bottom: 15px;">🎨</div>
                        <h3 style="margin-bottom: 10px; font-size: 1.2rem;">3D Artist</h3>
                        <p style="opacity: 0.8; font-size: 0.9rem;">Blender3D • UE5 • Clo3D</p>
                    </div>
                </div>
            `;
        }
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
        
        // Touch events для мобільних пристроїв
        document.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
                event.preventDefault();
            }
        }, { passive: false });
    }
    
    onWindowResize() {
        const container = document.getElementById('logo3d-container');
        if (!container || !this.camera || !this.renderer) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        try {
            if (this.logo) {
                // Плавне слідкування за курсором
                this.targetRotationY = this.mouseX * 0.5;
                this.targetRotationX = this.mouseY * 0.3;
                
                // Плавна інтерполяція
                this.logo.rotation.y += (this.targetRotationY - this.logo.rotation.y) * 0.05;
                this.logo.rotation.x += (this.targetRotationX - this.logo.rotation.x) * 0.05;
                
                // Додаткове плавне обертання
                this.logo.rotation.y += 0.001;
                
                // Обмеження обертання
                this.logo.rotation.x = Math.max(-0.8, Math.min(0.8, this.logo.rotation.x));
                this.logo.rotation.y = Math.max(-1.2, Math.min(1.2, this.logo.rotation.y));
            }
            
            this.renderer.render(this.scene, this.camera);
            
        } catch (error) {
            console.error('❌ Помилка в анімації:', error);
        }
    }
    
    // Метод для очищення ресурсів
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Сторінка завантажена, ініціалізація 3D лого...');
    
    // Затримка для гарантії завантаження DOM
    setTimeout(() => {
        window.threeApp = new Logo3D();
    }, 100);
});

// Обробка виходу з сторінки для очищення ресурсів
window.addEventListener('beforeunload', () => {
    if (window.threeApp) {
        window.threeApp.dispose();
    }
});
