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
            
            // Створення сцени
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x002366);
            this.scene.fog = new THREE.Fog(0x002366, 10, 20);
            
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
                alpha: true,
                powerPreference: "high-performance"
            });
            
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.outputColorSpace = THREE.SRGBColorSpace;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1;
            
            container.appendChild(this.renderer.domElement);
            
            // Додавання loading індикатора
            this.showLoadingIndicator();
            
            // Освітлення
            this.setupLighting();
            
            // Завантаження моделі
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
            if (!gl) {
                console.warn('⚠️ WebGL не підтримується браузером');
                return false;
            }
            return true;
        } catch (e) {
            console.warn('⚠️ WebGL викликав помилку:', e);
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
                        <p style="opacity: 0.8; font-size: 0.9rem; margin-bottom: 15px;">WebGL не підтримується вашим браузером</p>
                        <p style="opacity: 0.6; font-size: 0.8rem;">Спробуйте оновити браузер або використати Chrome/Firefox</p>
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
        // Ambient light - загальне освітлення
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light - основним джерело світла
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        // Fill light - заповнювальне світло
        const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
        fillLight.position.set(-5, -3, 5);
        this.scene.add(fillLight);
        
        // Rim light - контурне світло
        const rimLight = new THREE.DirectionalLight(0x4169E1, 0.4);
        rimLight.position.set(0, 0, -5);
        this.scene.add(rimLight);
        
        // Point light - додаткове точкове світло
        const pointLight = new THREE.PointLight(0x5072A7, 0.5, 20);
        pointLight.position.set(0, 3, 3);
        this.scene.add(pointLight);
    }
    
    loadLogo() {
        const loader = new THREE.GLTFLoader();
        const modelPath = './assets/my_logo.glb';
        
        console.log('📥 Завантаження моделі:', modelPath);
        
        loader.load(modelPath, 
            // Успішне завантаження
            (gltf) => {
                console.log('✅ Модель успішно завантажена', gltf);
                this.hideLoadingIndicator();
                
                this.logo = gltf.scene;
                this.isModelLoaded = true;
                
                // Налаштування моделі
                this.setupModel();
                
                // Центрування камери
                this.centerCamera();
                
                // Додаткові налаштування для анімації
                this.setupModelAnimations(gltf);
                
            }, 
            // Прогрес завантаження
            (progress) => {
                const percent = (progress.loaded / progress.total * 100).toFixed(2);
                console.log(`📊 Завантаження моделі: ${percent}%`);
                
                // Оновлення індикатора завантаження
                if (this.loadingIndicator) {
                    const percentText = this.loadingIndicator.querySelector('p');
                    if (percentText) {
                        percentText.textContent = `Завантаження 3D... ${percent}%`;
                    }
                }
            },
            // Помилка завантаження
            (error) => {
                console.error('❌ Помилка завантаження моделі:', error);
                this.hideLoadingIndicator();
                this.createFallbackLogo();
            }
        );
    }
    
    setupModel() {
        // Масштабування моделі
        this.logo.scale.set(1, 1, 1);
        this.logo.position.set(0, 0, 0);
        this.logo.rotation.set(0, 0, 0);
        
        // Включення тіней для всіх мешів
        this.logo.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Покращення матеріалів
                if (child.material) {
                    child.material.metalness = 0.1;
                    child.material.roughness = 0.5;
                    child.material.envMapIntensity = 1;
                }
            }
        });
        
        this.scene.add(this.logo);
    }
    
    setupModelAnimations(gltf) {
        // Якщо в моделі є анімації, налаштувати їх
        if (gltf.animations && gltf.animations.length > 0) {
            console.log('🎬 Знайдено анімації моделі:', gltf.animations.length);
            this.mixer = new THREE.AnimationMixer(this.logo);
            
            gltf.animations.forEach((clip) => {
                const action = this.mixer.clipAction(clip);
                action.play();
            });
        }
    }
    
    centerCamera() {
        if (!this.logo) return;
        
        const box = new THREE.Box3().setFromObject(this.logo);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
        
        // Фіксований зум з регулюванням
        cameraZ = cameraZ * 1.8;
        this.camera.position.z = cameraZ;
        
        // Налаштування камери для кращого вигляду
        this.camera.lookAt(center);
        
        console.log('🎯 Камера відцентрована, зум:', cameraZ.toFixed(2));
        console.log('📐 Розміри моделі:', {
            width: size.x.toFixed(2),
            height: size.y.toFixed(2),
            depth: size.z.toFixed(2)
        });
    }
    
    createFallbackLogo() {
        console.log('🔄 Створення запасного лого...');
        
        // Група для запасного лого
        const group = new THREE.Group();
        
        // Основна геометрія - ікосаедр
        const geometry = new THREE.IcosahedronGeometry(1.5, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x5072A7,
            transparent: true,
            opacity: 0.9,
            shininess: 100,
            specular: 0x1188ff,
            flatShading: false
        });
        
        const mainMesh = new THREE.Mesh(geometry, material);
        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;
        group.add(mainMesh);
        
        // Додавання контурних ліній
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00308F,
            transparent: true,
            opacity: 0.6,
            linewidth: 2
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        group.add(wireframe);
        
        // Додавання частинок навколо
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 50;
        const posArray = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 8;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.6
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        group.add(particlesMesh);
        
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
        
        // Обробка помилок WebGL
        this.renderer.domElement.addEventListener('webglcontextlost', (event) => {
            console.error('🔴 WebGL context lost');
            event.preventDefault();
            this.handleContextLost();
        }, false);
        
        this.renderer.domElement.addEventListener('webglcontextrestored', () => {
            console.log('🟢 WebGL context restored');
            this.handleContextRestored();
        }, false);
        
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
    
    handleContextLost() {
        // Зупинити анімацію при втраті контексту
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    handleContextRestored() {
        // Перезапустити анімацію при відновленні контексту
        this.animate();
    }
    
    onWindowResize() {
        const container = document.getElementById('logo3d-container');
        if (!container || !this.camera || !this.renderer) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        console.log('🔄 Розмір контейнера оновлено:', width, 'x', height);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        try {
            // Оновлення анімацій моделі (якщо є)
            if (this.mixer) {
                this.mixer.update(0.016); // delta time ~60fps
            }
            
            if (this.logo) {
                // Плавне слідкування за курсором з обмеженням
                this.targetRotationY = this.mouseX * 0.5; // ±45 градусів
                this.targetRotationX = this.mouseY * 0.3; // ±27 градусів
                
                // Плавна інтерполяція з різними швидкостями для природного руху
                this.logo.rotation.y += (this.targetRotationY - this.logo.rotation.y) * 0.05;
                this.logo.rotation.x += (this.targetRotationX - this.logo.rotation.x) * 0.05;
                
                // Додаткове плавне обертання навколо осі Y
                this.logo.rotation.y += 0.001;
                
                // Легке хитавання для живості
                this.logo.position.y = Math.sin(Date.now() * 0.001) * 0.05;
                
                // Обмеження обертання для запобігання екстремальних кутів
                this.logo.rotation.x = Math.max(-0.8, Math.min(0.8, this.logo.rotation.x));
                this.logo.rotation.y = Math.max(-1.2, Math.min(1.2, this.logo.rotation.y));
                this.logo.rotation.z = Math.max(-0.3, Math.min(0.3, this.logo.rotation.z));
            }
            
            // Оновлення частинок (якщо є)
            if (this.logo && this.isModelLoaded === false) {
                // Анімація частинок для запасного лого
                this.logo.children.forEach((child, index) => {
                    if (child.isPoints) {
                        child.rotation.y += 0.002;
                        child.rotation.x += 0.001;
                    }
                });
            }
            
            this.renderer.render(this.scene, this.camera);
            
        } catch (error) {
            console.error('❌ Помилка в анімації:', error);
            // Спробувати перезапустити анімацію
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            setTimeout(() => this.animate(), 1000);
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
            this.renderer.forceContextLoss();
        }
        
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.isMesh) {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                }
            });
        }
        
        console.log('🧹 Ресурси 3D очищено');
    }
}

// Глобальна функція для дебагу
window.debugLogo3D = function() {
    console.log('🔍 Дебаг інформація 3D лого:');
    console.log('- WebGL підтримка:', !!window.WebGLRenderingContext);
    console.log('- Контейнер:', document.getElementById('logo3d-container'));
    console.log('- Three.js версія:', THREE.REVISION);
    console.log('- GLTFLoader доступний:', typeof THREE.GLTFLoader !== 'undefined');
    console.log('- Розміри вікна:', window.innerWidth, 'x', window.innerHeight);
    
    const container = document.getElementById('logo3d-container');
    if (container) {
        console.log('- Розміри контейнера:', container.clientWidth, 'x', container.clientHeight);
        console.log('- Діти контейнера:', container.children.length);
    }
};

// Функція для перевірки стану Three.js
window.getThreeJSInfo = function() {
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не завантажено');
        return null;
    }
    
    return {
        version: THREE.REVISION,
        supported: {
            webgl: !!window.WebGLRenderingContext,
            webgl2: !!window.WebGL2RenderingContext
        },
        renderer: window.threeApp?.renderer?.info || 'Не ініціалізовано'
    };
};

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Сторінка завантажена, ініціалізація 3D лого...');
    
    // Затримка для гарантії завантаження DOM та Three.js
    setTimeout(() => {
        if (typeof THREE === 'undefined') {
            console.error('❌ Three.js не завантажено! Перевірте посилання на скрипти.');
            const container = document.getElementById('logo3d-container');
            if (container) {
                container.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; 
                                background: linear-gradient(135deg, #002366, #00308F); border-radius: 20px; color: white;
                                font-family: 'Poppins', sans-serif; text-align: center; padding: 20px;">
                        <div>
                            <h3 style="margin-bottom: 10px; font-size: 1.2rem;">Помилка завантаження</h3>
                            <p style="opacity: 0.8; font-size: 0.9rem;">Three.js не завантажено</p>
                        </div>
                    </div>
                `;
            }
            return;
        }
        
        // Ініціалізація 3D додатку
        window.threeApp = new Logo3D();
        
    }, 100);
});

// Обробка виходу з сторінки для очищення ресурсів
window.addEventListener('beforeunload', () => {
    if (window.threeApp) {
        window.threeApp.dispose();
    }
});

// Обробка прихованості сторінки (Page Visibility API)
document.addEventListener('visibilitychange', () => {
    if (window.threeApp) {
        if (document.hidden) {
            // Сторінка прихована - можна зменшити частоту кадрів
            console.log('⏸️ Сторінка прихована');
        } else {
            // Сторінка знову видима
            console.log('▶️ Сторінка видима');
        }
    }
});

// Додаткові утиліти для розробки
if (process.env.NODE_ENV === 'development') {
    // Автоматичний дебаг при розробці
    window.addEventListener('load', () => {
        setTimeout(() => {
            debugLogo3D();
        }, 2000);
    });
}
