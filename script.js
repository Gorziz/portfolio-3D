// Основний JavaScript для сайту
class PortfolioApp {
    constructor() {
        this.youtubeVideos = [];
        this.portfolioItems = [];
        this.currentFilter = 'all';
        this.currentPlayingVideo = null;
        
        this.init();
    }
    
    init() {
        this.loadPortfolioItems();
        this.initSwiper();
        this.setupEventListeners();
    }
    
    initSwiper() {
        // Ініціалізація YouTube каруселі
        this.youtubeSwiper = new Swiper('.youtubeSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: false,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
        
        // Додавання ваших відео
        this.addYouTubeVideos();
    }
    
    addYouTubeVideos() {
        const swiperWrapper = document.querySelector('.youtubeSwiper .swiper-wrapper');
        if (!swiperWrapper) return;
        
        // Ваші YouTube відео
        const youtubeVideos = [
            { id: 'nju54URHj1o', title: '3D Character Animation' },
            { id: 'P6txqQepIAo', title: 'Environment Design' },
            { id: '17iTKiINxeI', title: 'Product Modeling' },
            { id: 'qTsKHPwVHTE', title: 'Character Rigging' },
            { id: '_CAfOHE8CNk', title: 'Architectural Visualization' },
            { id: 'CB-NdCaasvY', title: 'Animation Showcase' },
            { id: 'e7vSVe7NVOg', title: '3D Sculpting' },
            { id: '8fhFvZ2CpD4', title: 'Real-time Rendering' },
            { id: 'BPol_uyzz9E', title: 'Character Design' },
            { id: 'TAkGXAFx0bo', title: 'Interactive Animation' },
            { id: '86g436oyWR0', title: '3D Modeling Process' },
            { id: 'IY_g_TP-D-s', title: 'Texturing Workflow' },
            { id: 'fMYJDM-90J4', title: 'Lighting Setup' },
            { id: 'H81BJ8wbVec', title: 'Animation Breakdown' },
            { id: 'UKv7AuvLSRk', title: 'Character Creation' },
            { id: 'gC0dEPs26PQ', title: 'Environment Lighting' },
            { id: 'C3hkMcEh0ng', title: 'Product Design' },
            { id: 'NZ5izvyyDyA', title: '3D Animation' },
            { id: 'DAfdNaCM048', title: 'Modeling Tutorial' },
            { id: 'cF0xEL5GSW0', title: 'Rendering Techniques' },
            { id: 'eADFJMA_tYw', title: 'Spline Integration' },
            { id: 'aFrGm6SgtfI', title: 'UE5 Showcase' },
            { id: 'jZWjJB8dZnU', title: 'Blender Workflow' }
        ];
        
        youtubeVideos.forEach((video, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="video-container" data-video-id="${video.id}" tabindex="0" role="button" aria-label="Відтворити відео: ${video.title}">
                    <iframe 
                        src="https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1&enablejsapi=0" 
                        title="${video.title}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy"
                        frameborder="0"
                        aria-hidden="true"
                        tabindex="-1">
                    </iframe>
                    <div class="video-thumbnail-overlay">
                        <div class="play-button" aria-hidden="true">▶</div>
                    </div>
                    <div class="video-playing-indicator" aria-hidden="true">▶ Відтворюється</div>
                    <div class="video-controls" aria-hidden="true">Клікніть для відтворення</div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });
        
        this.youtubeSwiper.update();
        
        // Налаштування кліків для відео
        this.setupVideoClickHandlers();
    }
    
    setupVideoClickHandlers() {
        document.addEventListener('click', (e) => {
            const videoContainer = e.target.closest('.video-container');
            if (videoContainer && !e.target.closest('.ytp-button')) {
                this.handleVideoClick(videoContainer);
            }
        });
        
        // Додаємо обробники клавіатури для доступності
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const videoContainer = e.target.closest('.video-container');
                if (videoContainer) {
                    e.preventDefault();
                    this.handleVideoClick(videoContainer);
                }
            }
        });
    }
    
    handleVideoClick(container) {
        const iframe = container.querySelector('iframe');
        const slide = container.closest('.swiper-slide');
        
        if (!iframe) return;
        
        // Отримуємо поточний src
        const currentSrc = iframe.src;
        
        // Якщо відео вже відтворюється, зупиняємо його
        if (slide.classList.contains('playing-video')) {
            // Зупиняємо відео шляхом перезавантаження iframe
            iframe.src = iframe.src.replace('&autoplay=1', '');
            slide.classList.remove('playing-video');
            slide.classList.remove('enlarged');
            this.currentPlayingVideo = null;
        } else {
            // Зупиняємо поточне відео
            this.pauseAllVideos();
            
            // Запускаємо нове відео
            iframe.src = currentSrc.includes('autoplay=1') 
                ? currentSrc 
                : currentSrc + '&autoplay=1';
            
            slide.classList.add('playing-video');
            this.currentPlayingVideo = iframe;
            
            // Збільшуємо слайд
            this.enlargeVideoSlide(slide);
        }
    }
    
    pauseAllVideos() {
        // Зупиняємо всі відео шляхом перезавантаження iframe
        const allIframes = document.querySelectorAll('.video-container iframe');
        allIframes.forEach(iframe => {
            iframe.src = iframe.src.replace('&autoplay=1', '');
        });
        
        // Видаляємо класи відтворення
        const allSlides = document.querySelectorAll('.swiper-slide');
        allSlides.forEach(slide => {
            slide.classList.remove('playing-video');
            slide.classList.remove('enlarged');
        });
        
        this.currentPlayingVideo = null;
    }
    
    enlargeVideoSlide(slide) {
        // Видаляємо попередній збільшений слайд
        const previousEnlarged = document.querySelector('.swiper-slide.enlarged');
        if (previousEnlarged && previousEnlarged !== slide) {
            previousEnlarged.classList.remove('enlarged');
            previousEnlarged.classList.remove('playing-video');
        }
        
        // Додаємо клас збільшення
        slide.classList.add('enlarged');
        
        // Оновлюємо Swiper для коректного відображення
        this.youtubeSwiper.update();
    }
    
    loadPortfolioItems() {
        // Ваші проекти портфоліо
        this.portfolioItems = [
            {
                id: 1,
                image: './assets/images/Bad.png',
                title: 'Bed Design',
                category: 'objects',
                description: 'Modern bed design with detailed textures'
            },
            {
                id: 2,
                image: './assets/images/bodybuilder.png',
                title: 'Bodybuilder Character',
                category: 'characters',
                description: 'Muscular character modeling and rigging'
            },
            {
                id: 3,
                image: './assets/images/Cafe1.png',
                title: 'Cafe Interior 1',
                category: 'environments',
                description: 'Cozy cafe interior design'
            },
            {
                id: 4,
                image: './assets/images/Cafe2.png',
                title: 'Cafe Interior 2',
                category: 'environments',
                description: 'Modern cafe environment'
            },
            {
                id: 5,
                image: './assets/images/Coin_C4.png',
                title: 'Coin Design',
                category: 'objects',
                description: 'Detailed coin modeling'
            },
            {
                id: 6,
                image: './assets/images/cottage.png',
                title: 'Cottage House',
                category: 'environments',
                description: 'Rustic cottage exterior'
            },
            {
                id: 7,
                image: './assets/images/equipment_for_park_areas.png',
                title: 'Park Equipment',
                category: 'objects',
                description: 'Outdoor park furniture set'
            },
            {
                id: 8,
                image: './assets/images/Farmer.png',
                title: 'Farmer Character',
                category: 'characters',
                description: 'Rural character design'
            },
            {
                id: 9,
                image: './assets/images/Girls2.png',
                title: 'Female Character',
                category: 'characters',
                description: 'Stylized female character'
            },
            {
                id: 10,
                image: './assets/images/mattresses.png',
                title: 'Mattress Collection',
                category: 'objects',
                description: 'Product design series'
            },
            {
                id: 11,
                image: './assets/images/miro_chair.png',
                title: 'Miro Chair',
                category: 'objects',
                description: 'Modern chair design'
            },
            {
                id: 12,
                image: './assets/images/Rabbit.png',
                title: 'Rabbit Character',
                category: 'characters',
                description: 'Cartoon animal character'
            },
            {
                id: 13,
                image: './assets/images/SB1.png',
                title: 'Sofa Design 1',
                category: 'objects',
                description: 'Contemporary sofa'
            },
            {
                id: 14,
                image: './assets/images/SB2.png',
                title: 'Sofa Design 2',
                category: 'objects',
                description: 'Modern sofa variation'
            },
            {
                id: 15,
                image: './assets/images/Sofa_2.png',
                title: 'Luxury Sofa',
                category: 'objects',
                description: 'High-end furniture design'
            },
            {
                id: 16,
                image: './assets/images/Sofa_Blue.png',
                title: 'Blue Sofa',
                category: 'objects',
                description: 'Colored furniture piece'
            },
            {
                id: 17,
                image: './assets/images/Vent.png',
                title: 'Ventilation System',
                category: 'objects',
                description: 'Industrial design'
            }
        ];
        
        this.renderPortfolioItems();
    }
    
    renderPortfolioItems() {
        const grid = document.querySelector('.portfolio-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const filteredItems = this.currentFilter === 'all' 
            ? this.portfolioItems 
            : this.portfolioItems.filter(item => item.category === this.currentFilter);
        
        filteredItems.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = `portfolio-item ${item.category}`;
            portfolioItem.setAttribute('data-category', item.category);
            portfolioItem.setAttribute('tabindex', '0');
            portfolioItem.setAttribute('role', 'button');
            portfolioItem.setAttribute('aria-label', `Переглянути проект: ${item.title}`);
            portfolioItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" loading="eager" onerror="this.src='https://via.placeholder.com/600x400/002366/FFFFFF?text=Image+Loading'">
                <div class="portfolio-item-overlay">
                    <h3>${item.title}</h3>
                    <p>${this.getCategoryName(item.category)}</p>
                    <p class="item-description">${item.description}</p>
                </div>
            `;
            
            portfolioItem.addEventListener('click', () => {
                this.openLightbox(item);
            });
            
            portfolioItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLightbox(item);
                }
            });
            
            grid.appendChild(portfolioItem);
        });
    }
    
    getCategoryName(category) {
        const categories = {
            'characters': 'Character Design',
            'objects': 'Object Modeling', 
            'environments': 'Environment Design'
        };
        return categories[category] || category;
    }
    
    openLightbox(item) {
        // Створення lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', `Деталі проекту: ${item.title}`);
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close" tabindex="0" role="button" aria-label="Закрити">&times;</span>
                <img src="${item.image}" alt="${item.title}">
                <div class="lightbox-info">
                    <h3>${item.title}</h3>
                    <p class="lightbox-category">${this.getCategoryName(item.category)}</p>
                    <p class="lightbox-description">${item.description}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Запобігаємо скролінгу body
        document.body.style.overflow = 'hidden';
        
        // Фокус на кнопку закриття
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.focus();
        }
        
        // Закриття lightbox
        const closeLightbox = () => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeydown);
        };
        
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
            if (e.key === 'Tab') {
                // Утримуємо фокус всередині lightbox
                const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
        });
        
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', handleKeydown);
    }
    
    setupEventListeners() {
        // Фільтрація портфоліо
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Оновлення активних кнопок
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Застосування фільтра
                    this.currentFilter = e.target.dataset.filter;
                    this.renderPortfolioItems();
                });
                
                // Додаємо підтримку клавіатури
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        btn.click();
                    }
                });
            });
        }
        
        // Плавна прокрутка для навігації
        this.setupSmoothScroll();
        
        // Анімації при скролі
        this.setupScrollAnimations();
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Фокус на цільовий елемент для доступності
                    if (target.hasAttribute('tabindex')) {
                        target.focus();
                    }
                }
            });
        });
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Спостереження за елементами для анімації
        document.querySelectorAll('.skill-item, .portfolio-item').forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            }
        });
    }
}

// Ініціалізація додатку
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
