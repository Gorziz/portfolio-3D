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

// Базове значення положення моделі по вертикалі (після центрування)
let baseModelY = 0;
// Поточний індекс каруселі
let currentCarouselIndex = 0;

// YouTube videos from user-provided links
const youtubeVideos = [
    {
        id: 1,
        title: '3D Animation Demo 1',
        videoId: 'nju54URHj1o',
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
        id: 7,
        title: '3D Animation Demo 7',
        videoId: 'e7vSVe7NVOg',
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
    { id: 1,  title: 'Bad',                 category: 'characters',   image: 'img/portfolio/Bad.jpg',                 description: 'Portfolio work', size: 'normal' },
    { id: 2,  title: 'Budda 1',            category: 'environments', image: 'img/portfolio/Budda_Character_1.jpg',    description: 'Portfolio work', size: 'normal' },
    { id: 3,  title: 'Budda 2',            category: 'environments', image: 'img/portfolio/Budda_Character_2.jpg',    description: 'Portfolio work', size: 'normal' },
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

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Logo
    init3DLogo();
    
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
    
    // Add window resize handler
    window.addEventListener('resize', onWindowResize);
    
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
});

// Initialize YouTube Carousel
function populateYouTubeCarousel() {
    youtubeVideos.forEach((video, i) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'carousel-item';
        const iframeId = `yt-player-${video.id}`;
        videoItem.innerHTML = `
            <iframe id="${iframeId}" data-yt-index="${i}" src="https://www.youtube.com/embed/${video.videoId}?enablejsapi=1&rel=0&modestbranding=1" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
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
    const iframes = carouselTrack.querySelectorAll('iframe[id^="yt-player-"]');
    iframes.forEach((iframe, idx) => {
        ytPlayers[idx] = new YT.Player(iframe.id, {
            events: {
                onStateChange: (event) => onPlayerStateChange(event, idx)
            }
        });
    });
}

function onPlayerStateChange(event, idx) {
    if (event.data === YT.PlayerState.PLAYING) {
        // Поставити на паузу всі інші відео
        pauseOthers(idx);
        currentPlayingIndex = idx;
        currentCarouselIndex = idx;
        centerToIframeIndex(idx);
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
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
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
        scene.add(model);
        
        // Start animation loop
        animate();
    }
    
    // Override the animate function to include lookAt cursor behavior
    animate = function() {
        requestAnimationFrame(animate);
        
        if (model) {
            // Smoothly interpolate to target rotation
            model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
            model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
            
            // Limit rotation to max values
            model.rotation.x = THREE.MathUtils.clamp(model.rotation.x, -maxRotation, maxRotation);
            model.rotation.y = THREE.MathUtils.clamp(model.rotation.y, -maxRotation, maxRotation);
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
        
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="portfolio-img">
            <div class="portfolio-overlay">
                <h3 class="portfolio-title">${item.title}</h3>
                <p class="portfolio-category">${item.category}</p>
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
        <p class="modal-category">${item.category}</p>
        <p class="modal-description">${item.description}</p>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Setup event listeners
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
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
            // Примусова пауза активного відео при навігації
            if (currentPlayingIndex !== null && ytPlayers[currentPlayingIndex]) {
                try {
                    if (typeof ytPlayers[currentPlayingIndex].pauseVideo === 'function') {
                        ytPlayers[currentPlayingIndex].pauseVideo();
                    } else if (typeof ytPlayers[currentPlayingIndex].stopVideo === 'function') {
                        ytPlayers[currentPlayingIndex].stopVideo();
                    }
                } catch (_) {}
                currentPlayingIndex = null;
            }

            // Безшовне зациклення назад
            const items = carouselTrack.querySelectorAll('.carousel-item');
            if (!items.length) return;
            let centered = getCenteredCarouselItem() || items[0];
            let prev = centered.previousElementSibling;
            if (!prev) {
                const last = carouselTrack.lastElementChild;
                if (last) {
                    carouselTrack.insertBefore(last, carouselTrack.firstElementChild);
                    prev = centered.previousElementSibling || carouselTrack.firstElementChild;
                }
            }
            centerCarouselElement(prev);
            const iframe = prev.querySelector('iframe[data-yt-index]');
            if (iframe) currentCarouselIndex = parseInt(iframe.dataset.ytIndex, 10) || 0;
        });

        nextArrow.addEventListener('click', () => {
            // Примусова пауза активного відео при навігації
            if (currentPlayingIndex !== null && ytPlayers[currentPlayingIndex]) {
                try {
                    if (typeof ytPlayers[currentPlayingIndex].pauseVideo === 'function') {
                        ytPlayers[currentPlayingIndex].pauseVideo();
                    } else if (typeof ytPlayers[currentPlayingIndex].stopVideo === 'function') {
                        ytPlayers[currentPlayingIndex].stopVideo();
                    }
                } catch (_) {}
                currentPlayingIndex = null;
            }

            // Безшовне зациклення вперед
            const items = carouselTrack.querySelectorAll('.carousel-item');
            if (!items.length) return;
            let centered = getCenteredCarouselItem() || items[0];
            let next = centered.nextElementSibling;
            if (!next) {
                const first = carouselTrack.firstElementChild;
                if (first) {
                    carouselTrack.appendChild(first);
                    next = centered.nextElementSibling || carouselTrack.lastElementChild;
                }
            }
            centerCarouselElement(next);
            const iframe = next.querySelector('iframe[data-yt-index]');
            if (iframe) currentCarouselIndex = parseInt(iframe.dataset.ytIndex, 10) || 0;
        });
    }
    
    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
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

function centerCarouselElement(el) {
    if (!el) return;
    const itemWidth = el.clientWidth;
    const trackWidth = carouselTrack.clientWidth;
    const itemOffsetLeft = el.offsetLeft;
    const targetScrollLeft = itemOffsetLeft - (trackWidth - itemWidth) / 2;
    carouselTrack.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
}

function centerToIframeIndex(idx) {
    const iframe = carouselTrack.querySelector(`.carousel-item iframe[data-yt-index="${idx}"]`);
    if (iframe) {
        const el = iframe.closest('.carousel-item');
        centerCarouselElement(el);
        currentCarouselIndex = idx;
    }
}

function initFooterAnimationFor(svgId) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const viewBox = svg.getAttribute('viewBox');
  let width = 1200, height = 120;
  if (viewBox) {
    const parts = viewBox.split(' ');
    if (parts.length === 4) {
      width = parseFloat(parts[2]);
      height = parseFloat(parts[3]);
    }
  }

  // Clear existing lines on re-init
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const linesCount = 20;
  for (let i = 0; i < linesCount; i++) {
    const y = Math.random() * height;
    const len = 80 + Math.random() * 600; // довжина лінії
    const x = Math.random() * (width - len);
    const strokeW = (1 + Math.random() * 4).toFixed(1);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', y);
    line.setAttribute('x2', x + len);
    line.setAttribute('y2', y);
    line.setAttribute('class', 'footer-line');

    // Колір з невеликою варіацією насиченості
    const base = [106, 139, 232];
    const jitter = Math.floor(Math.random() * 20) - 10;
    const r = Math.min(255, Math.max(0, base[0] + jitter));
    const g = Math.min(255, Math.max(0, base[1] + jitter));
    const b = Math.min(255, Math.max(0, base[2] + jitter));
    const alpha = 0.45 + Math.random() * 0.25;
    line.setAttribute('stroke', `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`);
    line.setAttribute('stroke-width', strokeW);

    // Випадкові параметри руху
    const speed = 8 + Math.random() * 18; // 8s ... 26s
    const delay = -2 + Math.random() * 4; // негативні затримки для розсинхрону
    const start = `${-20 - Math.random() * 60}%`; // -20% ... -80%
    const end = `${20 + Math.random() * 60}%`;   // 20% ... 80%

    line.style.setProperty('--speed', `${speed}s`);
    line.style.setProperty('--delay', `${delay.toFixed(2)}s`);
    line.style.setProperty('--start', start);
    line.style.setProperty('--end', end);

    svg.appendChild(line);
  }
}

function initFooterAnimation() {
  initFooterAnimationFor('footerSVGTop');
  initFooterAnimationFor('footerSVGBottom');
}

document.addEventListener('DOMContentLoaded', () => {
    initFooterAnimation();
});
