// DOM Elements
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const portfolioMosaic = document.querySelector('.portfolio-mosaic');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.querySelector('.portfolio-modal');
const closeModal = document.querySelector('.close-modal');
const modalBody = document.querySelector('.modal-body');
const contactForm = document.getElementById('contactForm');
const carouselTrack = document.querySelector('.carousel-track');
const prevArrow = document.querySelector('.prev-arrow');
const nextArrow = document.querySelector('.next-arrow');
const langSwitcher = document.getElementById('lang-switch'); // legacy dropdown (may be absent)
const langSlider = document.getElementById('lang-slider'); // new slider UI
const langToggle = document.getElementById('lang-toggle'); // segmented toggle UI

// I18n dictionary
let currentLang = 'uk';
const i18n = {
    en: {
        document_title: 'Bilousko Volodymyr | 3D Artist',
        hero: {
            name: 'Bilousko Volodymyr',
            role: '3D Artist & Animator',
            tagline: 'Creating immersive digital experiences through 3D art and animation',
            cta: 'View My Work'
        },
        nav: { home: 'Home', about: 'About', portfolio: 'Portfolio', contact: 'Contact' },
        about: {
            title: 'About Me',
            text: 'I am a professional 3D artist with expertise in creating stunning visual experiences. My passion lies in bringing ideas to life through detailed 3D modeling, animation, and interactive design.',
            skills: 'My Skills'
        },
        portfolio: { title: 'My Portfolio', videos: 'Featured Videos' },
        contact: { title: 'Get In Touch' },
        footer: { text: '© 2025 Bilousko Volodymyr. All Rights Reserved.' },
        aria: { prev: 'Previous', next: 'Next' },
        categories: { characters: 'Characters', environments: 'Environments', products: 'Products' },
        modal: { description: 'Portfolio work' }
    },
    uk: {
        document_title: 'Білоусько Володимир | 3D Художник',
        hero: {
            name: 'Білоусько Володимир',
            role: '3D художник і аніматор',
            tagline: 'Створюю захопливі цифрові враження за допомогою 3D мистецтва та анімації',
            cta: 'Переглянути роботи'
        },
        nav: { home: 'Головна', about: 'Про мене', portfolio: 'Портфоліо', contact: 'Контакти' },
        about: {
            title: 'Про мене',
            text: 'Я професійний 3D-художник, що створює вражаючі візуальні досвіди. Моя пристрасть — втілювати ідеї в життя завдяки детальному 3D-моделюванню, анімації та інтерактивному дизайну.',
            skills: 'Мої навички'
        },
        portfolio: { title: 'Моє портфоліо', videos: 'Вибрані відео' },
        contact: { title: 'Зв’язатися' },
        footer: { text: '© 2025 Білоусько Володимир. Усі права захищено.' },
        aria: { prev: 'Попередній', next: 'Наступний' },
        categories: { characters: 'Персонажі', environments: 'Середовища', products: 'Продукти' },
        modal: { description: 'Робота з портфоліо' }
    }
}; 

function getNested(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function t(key) {
    const val = getNested(i18n[currentLang], key);
    return typeof val === 'string' ? val : key;
}

function applyTranslations() {
    // Update html lang
    document.documentElement.setAttribute('lang', currentLang === 'uk' ? 'uk' : 'en');
    // Update document title
    document.title = t('document_title');
    // Update all data-i18n nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = t(key);
        if (translated) {
            el.textContent = translated;
        }
    });
    // Update carousel arrows aria-labels
    if (prevArrow) prevArrow.setAttribute('aria-label', t('aria.prev'));
    if (nextArrow) nextArrow.setAttribute('aria-label', t('aria.next'));
}

function setLanguage(lang) {
    currentLang = lang === 'uk' ? 'uk' : 'en';
    try { localStorage.setItem('lang', currentLang); } catch (_) {}
    // Update dropdown UI if present
    if (langSwitcher) {
        const currentEl = langSwitcher.querySelector('.lang-current');
        const options = langSwitcher.querySelectorAll('.lang-option');
        if (currentEl) currentEl.textContent = currentLang.toUpperCase();
        options.forEach(opt => opt.setAttribute('aria-selected', opt.dataset.value === currentLang ? 'true' : 'false'));
    }
    // Update slider UI if present
    updateLangSliderUI();
    // Update segmented toggle UI if present
    updateLangToggleUI();
    applyTranslations();
    // Re-render portfolio mosaic to apply translated categories
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const cat = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
    populatePortfolio(cat);
}

// Базове значення положення моделі по вертикалі (після центрування)
let baseModelY = 0;
// Поточний індекс каруселі
let currentCarouselIndex = 0;

// YouTube videos from user-provided links
const youtubeVideos = [
    {
        id: 7,
        title: 'Drons_Ukraine',
        videoId: 'e7vSVe7NVOg',
    },
    {
        id: 2,
        title: '3D Animation Demo 2',
        videoId: 'P6txqQepIAo',
    },
    {
        id: 3,
        title: '3D Animation Demo 3',
        videoId: '17iTKiINxeI',
    },
    {
        id: 4,
        title: '3D Animation Demo 4',
        videoId: 'qTsKHPwVHTE',
    },
    {
        id: 5,
        title: '3D Animation Demo 5',
        videoId: '_CAfOHE8CNk',
    },
    {
        id: 6,
        title: '3D Animation Demo 6',
        videoId: 'CB-NdCaasvY',
    },
    {
        id: 1,
        title: '3D Animation Demo 1',
        videoId: 'nju54URHj1o',
    },
    {
        id: 8,
        title: '3D Animation Demo 8',
        videoId: '8fhFvZ2CpD4',
    },
    {
        id: 9,
        title: '3D Animation Demo 9',
        videoId: 'BPol_uyzz9E',
    },
    {
        id: 10,
        title: '3D Animation Demo 10',
        videoId: 'TAkGXAFx0bo',
    },
    {
        id: 11,
        title: '3D Animation Demo 11',
        videoId: '86g436oyWR0',
    },
    {
        id: 12,
        title: '3D Animation Demo 12',
        videoId: 'IY_g_TP-D-s',
    },
    {
        id: 13,
        title: '3D Animation Demo 13',
        videoId: 'fMYJDM-90J4',
    },
    {
        id: 14,
        title: '3D Animation Demo 14',
        videoId: 'H81BJ8wbVec',
    },
    {
        id: 15,
        title: '3D Animation Demo 15',
        videoId: 'UKv7AuvLSRk',
    },
    {
        id: 16,
        title: '3D Animation Demo 16',
        videoId: 'gC0dEPs26PQ',
    },
    {
        id: 17,
        title: '3D Animation Demo 17',
        videoId: 'C3hkMcEh0ng',
    },
    {
        id: 18,
        title: '3D Animation Demo 18',
        videoId: 'NZ5izvyyDyA',
    },
    {
        id: 19,
        title: '3D Animation Demo 19',
        videoId: 'DAfdNaCM048',
    },
    {
        id: 20,
        title: '3D Animation Demo 20',
        videoId: 'cF0xEL5GSW0',
    },
    {
        id: 21,
        title: '3D Animation Demo 21',
        videoId: 'eADFJMA_tYw',
    },
    {
        id: 22,
        title: '3D Animation Demo 22',
        videoId: 'aFrGm6SgtfI',
    },
    {
        id: 23,
        title: '3D Animation Demo 23',
        videoId: 'jZWjJB8dZnU',
    }
];

// Portfolio data filled from img/portfolio
const portfolioItems = [
    { id: 1,  title: 'Bad',                 category: 'products',     image: 'img/portfolio/Bad.jpg',                 description: 'Portfolio work', size: 'normal' },
    { id: 2,  title: 'Budda 1',            category: 'characters',   image: 'img/portfolio/Budda_Character_1.jpg',    description: 'Portfolio work', size: 'normal' },
    { id: 3,  title: 'Budda 2',            category: 'characters',   image: 'img/portfolio/Budda_Character_2.jpg',    description: 'Portfolio work', size: 'normal' },
    { id: 4,  title: 'Cafe 1',             category: 'environments', image: 'img/portfolio/Cafe1.jpg',               description: 'Portfolio work', size: 'wide'   },
    { id: 5,  title: 'Cafe 2',             category: 'environments', image: 'img/portfolio/Cafe2.jpg',               description: 'Portfolio work', size: 'normal' },
    { id: 6,  title: 'Cat',                category: 'characters',   image: 'img/portfolio/Cat.jpg',                 description: 'Portfolio work', size: 'normal' },
    { id: 7,  title: 'Coin C4',            category: 'products',     image: 'img/portfolio/Coin_C4.jpg',             description: 'Portfolio work', size: 'normal' },
    { id: 8,  title: 'Farmer',             category: 'characters',   image: 'img/portfolio/Farmer.jpg',              description: 'Portfolio work', size: 'tall'   },
    { id: 9,  title: 'Girls 2',            category: 'characters',   image: 'img/portfolio/Girls2.jpg',              description: 'Portfolio work', size: 'normal' },
    { id:10,  title: 'Rabbit',             category: 'characters',   image: 'img/portfolio/Rabbit.jpg',              description: 'Portfolio work', size: 'normal' },
    { id:11,  title: 'Sofa 2',             category: 'products',     image: 'img/portfolio/Sofa_2.jpg',              description: 'Portfolio work', size: 'normal' },
    { id:12,  title: 'Sofa Blue',          category: 'products',     image: 'img/portfolio/Sofa_Blue.jpg',           description: 'Portfolio work', size: 'normal' },
    { id:13,  title: 'Vent',               category: 'products',     image: 'img/portfolio/Vent.jpg',                description: 'Portfolio work', size: 'normal' },
    { id:14,  title: 'Bodybuilder',        category: 'characters',   image: 'img/portfolio/bodybuilder.jpg',         description: 'Portfolio work', size: 'large'  },
    { id:15,  title: 'Cottage',            category: 'environments', image: 'img/portfolio/cottage.jpg',             description: 'Portfolio work', size: 'wide'   },
    { id:16,  title: 'Equipment for Parks',category: 'products',     image: 'img/portfolio/equipment_for_park_areas.jpg', description: 'Portfolio work', size: 'normal' },
    { id:17,  title: 'Mattresses',         category: 'products',     image: 'img/portfolio/mattresses.jpg',          description: 'Portfolio work', size: 'normal' },
    { id:18,  title: 'Miro Chair',         category: 'products',     image: 'img/portfolio/miro_chair.jpg',          description: 'Portfolio work', size: 'normal' },
];

// 3D Logo Setup
let scene, camera, renderer, model, controls;
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
// Декларації для зоряного неба
let starCanvas = null;
let starCtx = null;
let stars = [];
let comets = [];
let starfieldAnimId = null;
let nextCometAt = 0;
let lastStarframeTime = 0;

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    // 3D-логотип вимкнено (замінюємо на ASCII-анімацію окремим модулем)
    
    // Initialize language from storage or default
    try {
        const saved = localStorage.getItem('lang');
        if (saved) currentLang = saved;
    } catch (_) {}
    if (langSwitcher) {
        // Initialize current label and selection
        const currentEl = langSwitcher.querySelector('.lang-current');
        const options = langSwitcher.querySelectorAll('.lang-option');
        if (currentEl) currentEl.textContent = currentLang.toUpperCase();
        options.forEach(opt => opt.setAttribute('aria-selected', opt.dataset.value === currentLang ? 'true' : 'false'));

        // Hover to open/close
        langSwitcher.addEventListener('mouseenter', () => langSwitcher.classList.add('open'));
        langSwitcher.addEventListener('mouseleave', () => langSwitcher.classList.remove('open'));
        // Focus/blur for keyboard accessibility
        langSwitcher.addEventListener('focus', () => langSwitcher.classList.add('open'));
        langSwitcher.addEventListener('blur', () => langSwitcher.classList.remove('open'));
        // Click/touch: toggle on trigger; select on option
        langSwitcher.addEventListener('click', (e) => {
            const opt = e.target.closest('.lang-option');
            if (opt && opt.dataset.value) {
                setLanguage(opt.dataset.value);
                langSwitcher.classList.remove('open');
                return;
            }
            // On touch devices, clicking the trigger toggles open
            const isCoarse = window.matchMedia('(hover: none)').matches;
            if (isCoarse) {
                langSwitcher.classList.toggle('open');
            }
        });
        // Close when clicking/tapping outside
        document.addEventListener('click', (evt) => {
            if (!langSwitcher.contains(evt.target)) {
                langSwitcher.classList.remove('open');
            }
        });
        document.addEventListener('touchstart', (evt) => {
            if (!langSwitcher.contains(evt.target)) {
                langSwitcher.classList.remove('open');
            }
        }, { passive: true });
        // Close on Escape key
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') {
                langSwitcher.classList.remove('open');
            }
        });
    }

    // Initialize slider UI and controls
    if (langSlider) {
        // Build slides/dots from i18n keys
        buildLangSlider();
        // Sync slider to current language
        updateLangSliderUI();

        const slides = langSlider.querySelectorAll('.lang-slide');
        const track = langSlider.querySelector('.lang-track');
        const prevBtn = langSlider.querySelector('.lang-nav.prev');
        const nextBtn = langSlider.querySelector('.lang-nav.next');
        const count = slides.length;

        const navToIndex = (idx) => {
            if (!count) return;
            const normalized = ((idx % count) + count) % count;
            const target = slides[normalized];
            if (target && target.dataset.value) {
                setLanguage(target.dataset.value);
            }
        };

        // Buttons navigation
        if (prevBtn) prevBtn.addEventListener('click', () => {
            const idx = Array.from(slides).findIndex(s => s.dataset.value === currentLang);
            navToIndex(idx - 1);
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            const idx = Array.from(slides).findIndex(s => s.dataset.value === currentLang);
            navToIndex(idx + 1);
        });

        // Click on slide to select
        slides.forEach((s, i) => {
            s.addEventListener('click', () => {
                if (s.dataset.value) setLanguage(s.dataset.value);
            });
        });

        // Keyboard arrows on listbox track for WCAG
        if (track) track.addEventListener('keydown', (evt) => {
            if (evt.key === 'ArrowLeft') {
                const idx = Array.from(slides).findIndex(s => s.dataset.value === currentLang);
                navToIndex(idx - 1);
            } else if (evt.key === 'ArrowRight') {
                const idx = Array.from(slides).findIndex(s => s.dataset.value === currentLang);
                navToIndex(idx + 1);
            }
        });

        // Swipe gestures (touch)
        let startX = null;
        langSlider.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                startX = e.touches[0].clientX;
            }
        }, { passive: true });
        langSlider.addEventListener('touchend', (e) => {
            if (startX !== null && e.changedTouches && e.changedTouches.length) {
                const dx = e.changedTouches[0].clientX - startX;
                if (Math.abs(dx) > 30) {
                    const idx = Array.from(slides).findIndex(s => s.dataset.value === currentLang);
                    navToIndex(dx < 0 ? idx + 1 : idx - 1);
                }
                startX = null;
            }
        }, { passive: true });
    }
    // Initialize segmented toggle UI and controls
    if (langToggle) {
        // Build options from i18n keys and sync UI
        buildLangToggle();
        updateLangToggleUI();

        const options = Array.from(langToggle.querySelectorAll('.toggle-option'));
        const count = options.length;
        const navToIndex = (idx) => {
            if (!count) return;
            const normalized = ((idx % count) + count) % count;
            const target = options[normalized];
            if (target && target.dataset.value) setLanguage(target.dataset.value);
        };

        // Mouse/touch click selection
        options.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                if (btn.dataset.value) setLanguage(btn.dataset.value);
            });
        });

        // Keyboard navigation on the radiogroup
        langToggle.addEventListener('keydown', (evt) => {
            const idx = options.findIndex(o => o.getAttribute('aria-checked') === 'true');
            if (evt.key === 'ArrowLeft') {
                evt.preventDefault(); navToIndex(idx - 1);
            } else if (evt.key === 'ArrowRight') {
                evt.preventDefault(); navToIndex(idx + 1);
            } else if (evt.key === 'Home') {
                evt.preventDefault(); navToIndex(0);
            } else if (evt.key === 'End') {
                evt.preventDefault(); navToIndex(options.length - 1);
            }
        });
    }
    applyTranslations();

    // Populate YouTube carousel
    populateYouTubeCarousel();

    // Setup YouTube players and control playback
    setupYouTubePlayers();
    
    // Початкове центрування першого відео
    centerToIframeIndex(0);
    
    // Populate portfolio mosaic
    populatePortfolio();
    
    // Event listeners
    setupEventListeners();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add window resize handler (RAF-throttled to prevent jank on mobile)
    let __resizeScheduled = false;
    function __scheduleResize() {
        if (__resizeScheduled) return;
        __resizeScheduled = true;
        requestAnimationFrame(() => {
            try { onWindowResize(); } catch (_) {}
            try { resizeStarfield(); } catch (_) {}
            try { updateLangToggleUI(); } catch (_) {}
            __resizeScheduled = false;
        });
    }
    window.addEventListener('resize', __scheduleResize);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Відновити футер-анімацію
    initFooterAnimation();

    // Ініціалізація зоряного неба наприкінці, щоб не блокувати інше
    try {
        initStarfield();
    } catch (e) {
        console.warn('Starfield init failed:', e);
    }
});

// Initialize YouTube Carousel
function populateYouTubeCarousel() {
    youtubeVideos.forEach((video, i) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'carousel-item';
        const thumbUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
        videoItem.innerHTML = `
            <img class="video-preview" data-yt-index="${i}" src="${thumbUrl}" alt="${video.title}" title="${video.title}">
            <div class="play-overlay" aria-hidden="true">
                <svg class="play-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <circle cx="50" cy="50" r="47"></circle>
                    <polygon points="40,32 40,68 70,50"></polygon>
                </svg>
            </div>
            <div class="video-caption" aria-hidden="true">${video.title}</div>
        `;
        // Disable native image drag to avoid browser DnD jitter
        const previewImg = videoItem.querySelector('.video-preview');
        if (previewImg) {
            try { previewImg.draggable = false; } catch (_) {}
            previewImg.addEventListener('dragstart', (e) => { e.preventDefault(); });
            // Open modal with video on click (blocked if a drag occurred)
            previewImg.addEventListener('click', (e) => {
                if (window.__carouselDidDrag) {
                    e.preventDefault();
                    return;
                }
                openVideoModal(video);
            });
        }
        carouselTrack.appendChild(videoItem);
    });
}

// YouTube API setup and control
let ytPlayers = [];
let currentPlayingIndex = null;

// Надійно паузити всі інші плеєри, крім активного
function pauseOthers(activeIdx) {
    ytPlayers.forEach((p, i) => {
        if (i !== activeIdx && p) {
            try {
                if (typeof p.pauseVideo === 'function') {
                    p.pauseVideo();
                } else if (typeof p.stopVideo === 'function') {
                    p.stopVideo();
                }
            } catch (e) {
                try {
                    if (typeof p.stopVideo === 'function') {
                        p.stopVideo();
                    }
                } catch (_) {}
            }
        }
    });
}

function setupYouTubePlayers() {
    // Load YouTube IFrame API if not present
    if (!(window.YT && window.YT.Player)) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = initYouTubePlayers;
    } else {
        initYouTubePlayers();
    }
}

function initYouTubePlayers() {
    ytPlayers = [];
    // No inline players in carousel anymore (previews only)
}

function onPlayerStateChange(event, idx) {
    if (event.data === YT.PlayerState.PLAYING) {
        // Inline players removed; keep carousel index updated if needed
        currentCarouselIndex = idx;
    } else if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
        // Скидаємо індикатор активного відтворення, якщо саме поточний зупинився/паузився
        if (currentPlayingIndex === idx) {
            currentPlayingIndex = null;
        }
    }
}

function centerCarouselItemByIndex(idx) {
    const items = carouselTrack.querySelectorAll('.carousel-item');
    const item = items[idx];
    if (!item) return;
    const itemWidth = item.clientWidth;
    const trackWidth = carouselTrack.clientWidth;
    const itemOffsetLeft = item.offsetLeft;
    const targetScrollLeft = itemOffsetLeft - (trackWidth - itemWidth) / 2;
    currentCarouselIndex = idx;
    carouselTrack.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
}


// Initialize 3D Logo
function init3DLogo() {
    const container = document.getElementById('logo3D');
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 7; // Adjusted camera position for better view
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // Обмежуємо піксельне співвідношення для продуктивності на мобільних
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'relative';
    renderer.domElement.style.zIndex = '1';
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increased ambient light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased directional light
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Mouse tracking variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    const maxRotation = THREE.MathUtils.degToRad(30); // 30 degrees max rotation
    
    // Add mouse move listener for lookAt functionality
    container.addEventListener('mousemove', (event) => {
        // Calculate mouse position relative to container
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseY = ((event.clientY - rect.top) / container.clientHeight) * 2 - 1;
        
        // Limit rotation to 30 degrees
        targetRotationX = mouseY * maxRotation;
        targetRotationY = mouseX * maxRotation;
    });

    // One-finger touch rotation for mobile (iOS/Android)
    let touchActive = false;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let velX = 0; // rotation velocity around X axis (radians/frame)
    let velY = 0; // rotation velocity around Y axis (radians/frame)
    const damping = 0.92; // inertia damping factor per frame
    const maxVel = THREE.MathUtils.degToRad(1.5); // cap velocity for control
    const sensitivity = 0.004; // radians per pixel

    const onTouchStart = (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        const t = e.touches[0];
        touchActive = true;
        lastTouchX = t.clientX;
        lastTouchY = t.clientY;
        // Prevent page scroll while interacting with the canvas
        try { e.preventDefault(); } catch (_) {}
    };

    const onTouchMove = (e) => {
        if (!touchActive || !e.touches || e.touches.length !== 1) return;
        const t = e.touches[0];
        const dx = t.clientX - lastTouchX;
        const dy = t.clientY - lastTouchY;
        lastTouchX = t.clientX;
        lastTouchY = t.clientY;
        // Horizontal movement -> Y rotation; Vertical -> X rotation
        velY += dx * sensitivity;
        velX += -dy * sensitivity;
        // Clamp velocities for better control
        velX = THREE.MathUtils.clamp(velX, -maxVel, maxVel);
        velY = THREE.MathUtils.clamp(velY, -maxVel, maxVel);
        try { e.preventDefault(); } catch (_) {}
    };

    const onTouchEnd = () => {
        touchActive = false; // keep inertia running until it decays
    };

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });
    
    // Load 3D model or create placeholder
    try {
        const loader = new THREE.GLTFLoader();
        loader.load('./models/my_logo.glb', (gltf) => {
            model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            // Базовий Y після центрування (щоб не накопичувати зсуви)
            baseModelY = model.position.y;

            // Центрування моделі по вертикалі від базового Y
            model.position.y = baseModelY;
            
            // Scale up the model significantly
            model.scale.set(3.5, 3.5, 3.5);
            // На мобільних збільшуємо розмір ще на 30%
            if (isMobile) {
                model.scale.multiplyScalar(1.3);
            }
            
            scene.add(model);

            // Центрування зберігається: позицію перераховувати не потрібно
            
            // Start animation loop
            animate();
        }, undefined, (error) => {
            console.warn('3D model not found, creating placeholder:', error);
            createPlaceholderLogo();
        });
    } catch (error) {
        console.warn('Error initializing 3D model, creating placeholder:', error);
        createPlaceholderLogo();
    }
    
    function createPlaceholderLogo() {
        // Create a simple placeholder geometry
        const geometry = new THREE.TorusKnotGeometry(2, 0.6, 100, 16); // Increased size
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x4169E1,
            metalness: 0.7,
            roughness: 0.2
        });
        model = new THREE.Mesh(geometry, material);
        // Узгоджуємо масштаб фолбек-об'єкта з мобільним множником
        const isMobileFb = window.matchMedia('(max-width: 768px)').matches;
        const baseScaleFb = 3.5;
        model.scale.setScalar(baseScaleFb * (isMobileFb ? 1.3 : 1));
        scene.add(model);
        
        // Start animation loop
        animate();
    }
    
    // Override the animate function to include lookAt cursor behavior and touch inertia
    animate = function() {
        requestAnimationFrame(animate);
        
        if (model) {
            // Apply touch inertia by updating target rotations with decaying velocities
            if (Math.abs(velX) > 1e-4 || Math.abs(velY) > 1e-4) {
                targetRotationX += velX;
                targetRotationY += velY;
                velX *= damping;
                velY *= damping;
                if (Math.abs(velX) < 1e-4) velX = 0;
                if (Math.abs(velY) < 1e-4) velY = 0;
            }
            // Smoothly interpolate to target rotation
            model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
            model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
            
            // Limit rotation to max values
            model.rotation.x = THREE.MathUtils.clamp(model.rotation.x, -maxRotation, maxRotation);
            model.rotation.y = THREE.MathUtils.clamp(model.rotation.y, -maxRotation, maxRotation);
            // Keep target values within bounds too
            targetRotationX = THREE.MathUtils.clamp(targetRotationX, -maxRotation, maxRotation);
            targetRotationY = THREE.MathUtils.clamp(targetRotationY, -maxRotation, maxRotation);
        }
        
        renderer.render(scene, camera);
    };
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('logo3D');
    if (camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        // Тримаймо піксельне співвідношення під контролем при зміні розміру
        const isMobileResize = window.matchMedia('(max-width: 768px)').matches;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileResize ? 1.5 : 2));
    }
    // Перецентрувати поточний елемент каруселі при зміні розміру
    centerToIframeIndex(currentCarouselIndex);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Populate portfolio mosaic
function populatePortfolio(category = 'all') {
    // Early exit if mosaic DOM is not present
    if (!portfolioMosaic) return;

    // Clear the mosaic
    portfolioMosaic.innerHTML = '';
    
    // Filter items by category
    const filteredItems = category === 'all' 
        ? portfolioItems 
        : portfolioItems.filter(item => item.category === category);
    
    // Add items to mosaic
    filteredItems.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `portfolio-item ${item.size}`;
        portfolioItem.dataset.id = item.id;

        // Add chaotic scroll animation: random direction + random delay
        portfolioItem.classList.add('animate-on-scroll');
        const directions = ['slide-left', 'slide-right', 'slide-up', 'slide-down'];
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        portfolioItem.dataset.animation = randomDir;
        portfolioItem.style.transitionDelay = `${(Math.random() * 0.5).toFixed(2)}s`;
        
        const catLabel = t(`categories.${item.category}`);
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="portfolio-img">
            <div class="portfolio-overlay">
                <h3 class="portfolio-title">${item.title}</h3>
                <p class="portfolio-category">${catLabel}</p>
            </div>
        `;
        
        portfolioMosaic.appendChild(portfolioItem);
        
        // Add click event to open modal
        portfolioItem.addEventListener('click', () => openPortfolioModal(item));
    });

    // Reinitialize scroll animations for new items
    initScrollAnimations();
}

// Open portfolio modal
function openPortfolioModal(item) {
    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="modal-image">
        <h2 class="modal-title">${item.title}</h2>
        <p class="modal-category">${t(`categories.${item.category}`)}</p>
        <p class="modal-description">${t('modal.description')}</p>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Setup event listeners
function setupEventListeners() {
    // Navbar: завжди у стані 'scrolled' (ніколи не зникає)
    if (nav) {
        nav.classList.add('scrolled');
        window.addEventListener('scroll', () => {
            nav.classList.add('scrolled');
        });
    }
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Portfolio filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Filter portfolio items
            const category = btn.dataset.filter;
            populatePortfolio(category);
            // Ensure new items are observed for scroll animations
            initScrollAnimations();
        });
    });
    
    // YouTube carousel navigation
    if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', () => {
            currentCarouselIndex = (currentCarouselIndex - 1 + youtubeVideos.length) % youtubeVideos.length;
            centerToIframeIndex(currentCarouselIndex);
        });
        nextArrow.addEventListener('click', () => {
            currentCarouselIndex = (currentCarouselIndex + 1) % youtubeVideos.length;
            centerToIframeIndex(currentCarouselIndex);
        });
    }
    
    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Clear modal content to stop any playing iframe
        try { modalBody.innerHTML = ''; } catch (_) {}
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            try { modalBody.innerHTML = ''; } catch (_) {}
        }
    });
    
    // Contact form submission (only if form exists)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Pointer-based click-and-drag scrolling for carousel
    if (carouselTrack) {
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let lastX = 0;
        let lastTime = 0;
        let velocity = 0; // px per ms
        let inertiaRaf = null;
        let activePointerId = null;
        // Track whether a significant drag occurred to suppress click
        window.__carouselDidDrag = false;
        const dragThreshold = 4; // px to start capturing/dragging
        let hasCaptured = false;
        // Wheel navigation lock to ensure one slide per wheel gesture
        let wheelLock = false;

        const cancelInertia = () => {
            if (inertiaRaf) {
                try { cancelAnimationFrame(inertiaRaf); } catch (_) {}
                inertiaRaf = null;
            }
        };

        const startInertia = (v0) => {
            let v = v0;
            const decel = 0.0025; // px per ms^2
            let prevTs = performance.now();
            // Keep snap disabled during inertia
            try { carouselTrack.style.scrollSnapType = 'none'; } catch (_) {}
            try { carouselTrack.style.scrollBehavior = 'auto'; } catch (_) {}
            try { carouselTrack.style.willChange = 'scroll-position'; } catch (_) {}

            const step = (ts) => {
                const dt = ts - prevTs;
                prevTs = ts;
                if (dt <= 0) {
                    inertiaRaf = requestAnimationFrame(step);
                    return;
                }
                // Move by current velocity
                const move = v * dt;
                carouselTrack.scrollLeft += move;
                // Apply deceleration towards zero
                const sign = Math.sign(v);
                v = v - sign * decel * dt;
                if (Math.sign(v) !== sign || Math.abs(v) < 0.01) {
                    // Інерція завершена: центруємо найближчий і повертаємо м’який snap
                    try { carouselTrack.style.willChange = ''; } catch (_) {}
                    const nearest = getCenteredCarouselItem();
                    if (!isElementCentered(nearest)) {
                        centerCarouselElement(nearest, 450);
                    }
                    try { carouselTrack.style.scrollSnapType = 'x proximity'; } catch (_) {}
                    try { carouselTrack.style.scrollBehavior = ''; } catch (_) {}
                    const elWithIndex = nearest && nearest.querySelector('[data-yt-index]');
                    if (elWithIndex) {
                        try { currentCarouselIndex = parseInt(elWithIndex.dataset.ytIndex, 10) || currentCarouselIndex; } catch (_) {}
                    }
                    inertiaRaf = null;
                    return;
                }
                inertiaRaf = requestAnimationFrame(step);
            };
            inertiaRaf = requestAnimationFrame(step);
        };

        const onPointerDown = (e) => {
            cancelInertia();
            // Відміняємо керування каруселлю мишею; дозволяємо touch/stylus
            if (e.pointerType === 'mouse') return;
            isDragging = true;
            startX = e.clientX;
            startScrollLeft = carouselTrack.scrollLeft;
            lastX = e.clientX;
            lastTime = performance.now();
            velocity = 0;
            activePointerId = e.pointerId;
            window.__carouselDidDrag = false;
            hasCaptured = true; // capture immediately to follow cursor
            try { carouselTrack.style.scrollSnapType = 'none'; } catch (_) {}
            try { carouselTrack.style.scrollBehavior = 'auto'; } catch (_) {}
            carouselTrack.classList.add('dragging');
            try { carouselTrack.style.willChange = 'scroll-position'; } catch (_) {}
            try { if (typeof carouselTrack.setPointerCapture === 'function') carouselTrack.setPointerCapture(e.pointerId); } catch (_) {}
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            if (activePointerId !== null && e.pointerId !== activePointerId) return;
            // If mouse and left button not pressed anymore, end drag
            if (e.pointerType === 'mouse' && !(e.buttons & 1)) { endDrag(); return; }
            const totalDx = e.clientX - startX;
            e.preventDefault();
            if (!hasCaptured) return;
            carouselTrack.scrollLeft = startScrollLeft - totalDx;
            if (Math.abs(totalDx) > 1) {
                window.__carouselDidDrag = true;
            }
            const now = performance.now();
            const dx = e.clientX - lastX;
            const dt = now - lastTime;
            if (dt > 0) {
                // Negative because scrollLeft increases to the right while dragging left increases clientX delta negatively
                velocity = -(dx / dt);
            }
            lastX = e.clientX;
            lastTime = now;
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            activePointerId = null;
            if (hasCaptured) {
                carouselTrack.classList.remove('dragging');
                try { carouselTrack.style.willChange = ''; } catch (_) {}
                // If velocity significant, start inertia; else restore snap and center
                if (Math.abs(velocity) > 0.02) {
                    startInertia(velocity);
                } else {
                    // Без інерції: центруємо найближчий елемент і повертаємо м’який snap
                    const nearest = getCenteredCarouselItem();
                    if (!isElementCentered(nearest)) {
                        centerCarouselElement(nearest, 420);
                    }
                    try { carouselTrack.style.scrollSnapType = 'x proximity'; } catch (_) {}
                    try { carouselTrack.style.scrollBehavior = ''; } catch (_) {}
                    const elWithIndex = nearest && nearest.querySelector('[data-yt-index]');
                    if (elWithIndex) {
                        try { currentCarouselIndex = parseInt(elWithIndex.dataset.ytIndex, 10) || currentCarouselIndex; } catch (_) {}
                    }
                }
            } else {
                // Без драгу: повертаємо м’який snap без центрування
                try { carouselTrack.style.scrollSnapType = 'x proximity'; } catch (_) {}
                try { carouselTrack.style.scrollBehavior = ''; } catch (_) {}
            }
            hasCaptured = false;
            // Allow click next time only after a fresh pointerdown
            setTimeout(() => { window.__carouselDidDrag = false; }, 0);
        };


        carouselTrack.addEventListener('pointerdown', onPointerDown);
        carouselTrack.addEventListener('pointermove', onPointerMove, { passive: false });
        carouselTrack.addEventListener('pointerup', (e) => { if (activePointerId === null || e.pointerId === activePointerId) endDrag(); });
        carouselTrack.addEventListener('pointerleave', (e) => { if (activePointerId === null || e.pointerId === activePointerId) endDrag(); });
        // Wheel navigation disabled per request
    }
}

// Toggle between lookAt and OrbitControls
document.getElementById('logo3D').addEventListener('click', () => {
    if (controls) {
        controls.enabled = !controls.enabled;
    }
});

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Disconnect previous observer to avoid duplicates on re-init
    if (window.__scrollObserver) {
        try { window.__scrollObserver.disconnect(); } catch (e) {}
        window.__scrollObserver = null;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // On mobile, run once: stop observing after first appearance
                if (isMobile) {
                    observer.unobserve(entry.target);
                }
            } else {
                // Desktop/tablet: allow re-trigger; Mobile: keep visible
                if (!isMobile) {
                    entry.target.classList.remove('animate-in');
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Store observer globally for safe re-initialization
    window.__scrollObserver = observer;
}

// Допоміжні функції для безшовного зациклення каруселі
function getCenteredCarouselItem() {
    const center = carouselTrack.scrollLeft + carouselTrack.clientWidth / 2;
    const items = Array.from(carouselTrack.querySelectorAll('.carousel-item'));
    let best = null, bestDist = Infinity;
    items.forEach(el => {
        const elCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(elCenter - center);
        if (dist < bestDist) { bestDist = dist; best = el; }
    });
    return best;
}

function centerCarouselElement(el, duration = 450) {
    if (!el) return;
    const itemWidth = el.clientWidth;
    const trackWidth = carouselTrack.clientWidth;
    const itemOffsetLeft = el.offsetLeft;
    const targetScrollLeft = itemOffsetLeft - (trackWidth - itemWidth) / 2;
    // Тимчасово вимикаємо snap і вмикаємо оптимізацію прокрутки
    try { carouselTrack.style.scrollSnapType = 'none'; } catch (_) {}
    try { carouselTrack.style.scrollBehavior = 'auto'; } catch (_) {}
    try { carouselTrack.style.willChange = 'scroll-position'; } catch (_) {}
    carouselTrack.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    // Легка мікрокорекція: повернути м’який snap після короткої паузи
    setTimeout(() => {
        try { carouselTrack.style.scrollSnapType = 'x proximity'; } catch (_) {}
        try { carouselTrack.style.scrollBehavior = ''; } catch (_) {}
        try { carouselTrack.style.willChange = ''; } catch (_) {}
    }, 45);
}

// Допоміжні: дельта від центру вьюпорту до центру елемента
function getElementCenterDelta(el) {
    if (!el) return 0;
    const center = carouselTrack.scrollLeft + carouselTrack.clientWidth / 2;
    const elCenter = el.offsetLeft + el.offsetWidth / 2;
    return elCenter - center;
}

function isElementCentered(el, epsilon = 2) {
    return Math.abs(getElementCenterDelta(el)) <= epsilon;
}

function centerToIframeIndex(idx) {
    // Adapted to work with preview images instead of iframes
    const previewEl = carouselTrack.querySelector(`.carousel-item [data-yt-index="${idx}"]`);
    if (previewEl) {
        const el = previewEl.closest('.carousel-item');
        centerCarouselElement(el, 420);
        currentCarouselIndex = idx;
    }
}

// Open video in modal overlay
function openVideoModal(video) {
    const embedSrc = `https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1&autoplay=1`;
    modalBody.innerHTML = `
        <div class="modal-video-wrapper">
            <iframe src="${embedSrc}" title="${video.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; aspect-ratio:16/9; border:0;"></iframe>
        </div>
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function initFooterAnimationFor(svgId) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const viewBox = svg.getAttribute('viewBox');
  let width = 1200, height = 120;
  if (viewBox) {
    const parts = viewBox.split(' ');
    if (parts.length === 4) {
      width = parseFloat(parts[2]);
      height = parseFloat(parts[3]);
    }
  }

  // Clear existing content on re-init
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // Ensure <defs> exists for gradients
  const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(NS, 'defs'), svg.firstChild);

  // Number of moving circles
  const circlesCount = 14;

  for (let i = 0; i < circlesCount; i++) {
    // Random diameter 1px..3px
    const diameter = 1 + Math.random() * 2; // 1..3
    const radius = diameter / 2;

    const trailLen = 60;
    const cy = Math.max(radius, Math.min(height - radius, Math.random() * height));

    // Random direction
    const dir = Math.random() < 0.5 ? 'ltr' : 'rtl';

    // Start cx off-screen depending on direction
    const cx = dir === 'ltr' ? (-trailLen - radius) : (width + trailLen + radius);

    // Color with slight variation
    const base = [106, 139, 232];
    const jitter = Math.floor(Math.random() * 20) - 10;
    const cr = Math.min(255, Math.max(0, base[0] + jitter));
    const cg = Math.min(255, Math.max(0, base[1] + jitter));
    const cb = Math.min(255, Math.max(0, base[2] + jitter));

    // Gradient for trail (near circle 60% transparency -> end 100%)
    const grad = document.createElementNS(NS, 'linearGradient');
    const gradId = `trailGrad-${svgId}-${i}-${Date.now()}`;
    grad.setAttribute('id', gradId);
    grad.setAttribute('gradientUnits', 'objectBoundingBox');
    grad.setAttribute('x1', dir === 'rtl' ? '0%' : '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', dir === 'rtl' ? '100%' : '100%');
    grad.setAttribute('y2', '0%');

    const stopA = document.createElementNS(NS, 'stop');
    stopA.setAttribute('offset', dir === 'rtl' ? '0%' : '0%');
    stopA.setAttribute('stop-color', `rgb(${cr}, ${cg}, ${cb})`);
    stopA.setAttribute('stop-opacity', dir === 'rtl' ? '0.4' : '0'); // 60% transparent near circle for RTL, 100% transparent at far end

    const stopB = document.createElementNS(NS, 'stop');
    stopB.setAttribute('offset', dir === 'rtl' ? '100%' : '100%');
    stopB.setAttribute('stop-color', `rgb(${cr}, ${cg}, ${cb})`);
    stopB.setAttribute('stop-opacity', dir === 'rtl' ? '0' : '0.4');

    grad.appendChild(stopA);
    grad.appendChild(stopB);
    defs.appendChild(grad);

    // Group to animate circle + its trail
    const group = document.createElementNS(NS, 'g');

    // Circle
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', cx.toFixed(2));
    circle.setAttribute('cy', cy.toFixed(2));
    circle.setAttribute('r', radius.toFixed(2));
    circle.setAttribute('fill', `rgba(${cr}, ${cg}, ${cb}, 0.8)`);

    // Trail rectangle 60px long, height equals diameter, positioned behind movement
    const trail = document.createElementNS(NS, 'rect');
    trail.setAttribute('x', (dir === 'ltr' ? (cx - trailLen) : cx).toFixed(2));
    trail.setAttribute('y', (cy - radius).toFixed(2));
    trail.setAttribute('width', trailLen);
    trail.setAttribute('height', diameter.toFixed(2));
    trail.setAttribute('fill', `url(#${gradId})`);

    group.appendChild(trail);
    group.appendChild(circle);

    // Random movement parameters (unique per circle index)
    const minSpeed = 8, maxSpeed = 26;
    const speed = minSpeed + (i / Math.max(1, circlesCount - 1)) * (maxSpeed - minSpeed);
    const delay = -2 + Math.random() * 4; // negative delays for de-sync

    // Start/end: spawn off-screen and die off-screen after trail exits
    const distance = width + 2 * trailLen + 2 * radius; // move across + full trail
    const start = '0px';
    const end   = dir === 'ltr' ? `${distance}px` : `-${distance}px`;

    // Inline animation styles using existing keyframes footer-drift
    group.style.animation = `footer-drift ${speed}s linear infinite`;
    group.style.animationDirection = 'normal';
    group.style.animationDelay = `${delay.toFixed(2)}s`;
    group.style.setProperty('--start', start);
    group.style.setProperty('--end', end);
    group.style.willChange = 'transform';

    svg.appendChild(group);
  }
}


function initFooterAnimation() {
  initFooterAnimationFor('footerSVGTop');
  initFooterAnimationFor('footerSVGBottom');
}

function initStarfield() {
    const container = document.querySelector('.logo-container');
    if (!container) return;
    // Ensure canvas exists and is layered behind
    starCanvas = document.getElementById('starfield');
    if (!starCanvas) {
        starCanvas = document.createElement('canvas');
        starCanvas.id = 'starfield';
        starCanvas.style.position = 'absolute';
        starCanvas.style.inset = '0';
        starCanvas.style.zIndex = '0';
        starCanvas.style.pointerEvents = 'none';
        container.prepend(starCanvas);
    }
    starCanvas.width = container.clientWidth;
    starCanvas.height = container.clientHeight;
    starCtx = starCanvas.getContext('2d');
    createStars();
    nextCometAt = performance.now() + 500;
    lastStarframeTime = performance.now();
    if (!starfieldAnimId) {
        starfieldAnimId = requestAnimationFrame(animateStarfield);
    }
}

function createStars() {
    if (!starCtx || !starCanvas) return;
    const area = starCanvas.width * starCanvas.height;
    const isMobile = window.innerWidth <= 768;
    const divisor = isMobile ? 28000 : 12000;
    const density = Math.floor(area / divisor);
    stars = [];
    for (let i = 0; i < density; i++) {
        const x = Math.random() * starCanvas.width;
        const y = Math.random() * starCanvas.height;
        const r = Math.random() * 1.2 + 0.3; // small star radius
        // subtle twinkle via opacity
        const baseAlpha = 0.08 + Math.random() * 0.07; // 0.08–0.15
        const twinkleAmp = 0.03 + Math.random() * 0.04; // 0.03–0.07
        const twinkleSpeed = 0.2 + Math.random() * 0.4; // slower twinkle
        const phase = Math.random() * Math.PI * 2;
        stars.push({ x, y, r, baseAlpha, twinkleAmp, twinkleSpeed, phase });
    }
}

function spawnComet() {
    if (!starCanvas) return;
    const startX = Math.random() * starCanvas.width; // anywhere on screen
    const startY = Math.random() * starCanvas.height; // anywhere on screen
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15; // ~45° with slight jitter
    const speed = 120 + Math.random() * 140; // px/s
    const life = 7; // seconds (1.5s fade-in, 4s visible, 1.5s fade-out)
    const tailLen = 80 + Math.random() * 80;
    const tailWidth = 1.5 + Math.random() * 1.5;
    const r = 1; // comet head radius fixed to 1px
    const createdAt = performance.now();
    comets.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r,
        life,
        tailLen,
        tailWidth,
        createdAt,
        trail: [],
    });
}

function animateStarfield(ts) {
    starfieldAnimId = requestAnimationFrame(animateStarfield);
    if (!starCtx || !starCanvas) return;
    const now = performance.now();
    const dt = lastStarframeTime ? (now - lastStarframeTime) / 1000 : 0;
    lastStarframeTime = now;

    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    // Draw stars with subtle opacity twinkle
    for (const s of stars) {
        const alpha = s.baseAlpha + Math.sin(ts * 0.001 * s.twinkleSpeed + s.phase) * s.twinkleAmp;
        starCtx.globalAlpha = Math.max(0, Math.min(1, alpha));
        starCtx.fillStyle = '#ffffff';
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fill();
    }
    starCtx.globalAlpha = 1;

    // Spawn comets at random intervals
    if (now >= nextCometAt) {
        spawnComet();
        nextCometAt = now + (1500 + Math.random() * 2500);
    }

    // Update and render comets (new schema: createdAt/life/trail)
    comets = comets.filter(c => (now - c.createdAt) / 1000 < c.life);
    for (const c of comets) {
        // update position
        c.x += c.vx * dt;
        c.y += c.vy * dt;

        // maintain trail
        c.trail.push({ x: c.x, y: c.y });
        if (c.trail.length > Math.floor(c.tailLen / 2)) c.trail.shift();

        // fade: appear 100% transparent -> fly visible -> disappear 100% transparent
        const progress = ((now - c.createdAt) / 1000) / c.life;
        const fadeInSec = 1.5, visibleSec = 4, fadeOutSec = 1.5; // total 7s
        const fadeIn = fadeInSec / c.life; // ~0.2142857
        const fadeOutStart = (fadeInSec + visibleSec) / c.life; // ~0.7857143
        let vis;
        if (progress < fadeIn) {
            vis = progress / fadeIn; // fade in
        } else if (progress > fadeOutStart) {
            vis = (1 - progress) / (1 - fadeOutStart); // fade out
        } else {
            vis = 1; // fully visible during middle 4s
        }
        const opacity = 1 - vis;

        // draw trail with gradient along movement
        if (c.trail.length > 1) {
            const tailStart = c.trail[0];
            const head = c.trail[c.trail.length - 1];
            const grad = starCtx.createLinearGradient(head.x, head.y, tailStart.x, tailStart.y);
            grad.addColorStop(0, `rgba(255,255,255,${(opacity * 0.6).toFixed(3)})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            starCtx.strokeStyle = grad;
            starCtx.lineWidth = c.tailWidth;
            starCtx.beginPath();
            starCtx.moveTo(tailStart.x, tailStart.y);
            for (let j = 1; j < c.trail.length; j++) {
                const p = c.trail[j];
                starCtx.lineTo(p.x, p.y);
            }
            starCtx.stroke();
        }

        // draw comet head
        starCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
        starCtx.fillStyle = '#ffffff';
        starCtx.beginPath();
        starCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        starCtx.fill();
        starCtx.globalAlpha = 1;
    }
}

function resizeStarfield() {
    const container = document.querySelector('.logo-container');
    if (!container || !starCanvas) return;
    starCanvas.width = container.clientWidth;
    starCanvas.height = container.clientHeight;
    createStars();
}
// Update slider position and ARIA state to match currentLang
function updateLangSliderUI() {
    if (!langSlider) return;
    const track = langSlider.querySelector('.lang-track');
    const slides = langSlider.querySelectorAll('.lang-slide');
    const dots = langSlider.querySelectorAll('.lang-indicators .dot');
    const idx = Math.max(0, Array.from(slides).findIndex(s => s.dataset.value === currentLang));
    const width = slides[0] ? slides[0].offsetWidth : 0;
    if (track && width) {
        try { track.style.transform = `translateX(-${idx * width}px)`; } catch (_) {}
    }
    slides.forEach((s, i) => s.setAttribute('aria-selected', s.dataset.value === currentLang ? 'true' : 'false'));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}
// Build slider slides and indicators dynamically from available languages
function buildLangSlider() {
    if (!langSlider) return;
    const langKeys = Object.keys(i18n || {});
    // Fallback to known languages if i18n not enumerable
    const available = Array.isArray(langKeys) && langKeys.length ? langKeys : ['uk','en'];
    const track = langSlider.querySelector('.lang-track');
    const indicators = langSlider.querySelector('.lang-indicators');
    if (!track) return;
    // Clear existing
    try { track.innerHTML = ''; } catch (_) {}
    if (indicators) { try { indicators.innerHTML = ''; } catch (_) {} }
    // Create slides
    available.forEach((code, idx) => {
        const slide = document.createElement('div');
        slide.className = 'lang-slide';
        slide.setAttribute('role','option');
        slide.dataset.value = code;
        slide.textContent = code.toUpperCase();
        slide.setAttribute('aria-selected', code === currentLang ? 'true' : 'false');
        track.appendChild(slide);
        // Indicator dots
        if (indicators) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (code === currentLang ? ' active' : '');
            dot.dataset.index = String(idx);
            indicators.appendChild(dot);
        }
    });
}

// Update segmented toggle thumb position and ARIA state
function updateLangToggleUI() {
    if (!langToggle) return;
    const thumb = langToggle.querySelector('.toggle-thumb');
    const options = Array.from(langToggle.querySelectorAll('.toggle-option'));
    if (!options.length || !thumb) return;
    options.forEach(btn => btn.setAttribute('aria-checked', btn.dataset.value === currentLang ? 'true' : 'false'));
    const selected = options.find(btn => btn.dataset.value === currentLang) || options[0];
    if (!selected) return;
    try {
        // Width and X position based on actual button geometry
        const groupRect = langToggle.getBoundingClientRect();
        const optRect = selected.getBoundingClientRect();
        // Shift both start and end positions 4px to the left (additional -1px)
        const x = Math.max(0, optRect.left - groupRect.left - 4);
        thumb.style.width = `${selected.offsetWidth}px`;
        thumb.style.transform = `translateX(${x}px)`;
        thumb.dataset.color = currentLang === 'uk' ? 'uk' : 'en';
    } catch (_) {}
}

// Build segmented toggle options dynamically from i18n languages
function buildLangToggle() {
    if (!langToggle) return;
    const langKeys = Object.keys(i18n || {});
    const available = Array.isArray(langKeys) && langKeys.length ? langKeys : ['uk','en'];
    // Remove existing options
    langToggle.querySelectorAll('.toggle-option').forEach(el => el.remove());
    // Append options
    available.forEach(code => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toggle-option';
        btn.textContent = code.toUpperCase();
        btn.dataset.value = code;
        btn.setAttribute('role','radio');
        btn.setAttribute('aria-checked', code === currentLang ? 'true' : 'false');
        langToggle.appendChild(btn);
    });
    // After building, sync UI
    updateLangToggleUI();
}
