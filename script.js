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
        this.initSwiper();
        this.loadPortfolioItems();
        this.setupEventListeners();
    }
    
    initSwiper() {
        // Ініціалізація YouTube каруселі
        this.youtubeSwiper = new Swiper('.youtubeSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true // Зупиняє автопрокрутку при наведенні
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
            },
            on: {
                init: () => {
                    this.setupVideoPlayers();
                },
                slideChange: () => {
                    this.pauseAllVideos();
                }
            }
        });
        
        // Додавання ваших відео
        this.addYouTubeVideos();
    }
    
    addYouTubeVideos() {
        const swiperWrapper = document.querySelector('.youtubeSwiper .swiper-wrapper');
        
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
                <div class="video-container" data-video-id="${video.id}">
                    <iframe 
                        src="https://www.youtube.com/embed/${video.id}?enablejsapi=1&origin=${window.location.origin}" 
                        title="${video.title}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy"
                        frameborder="0">
                    </iframe>
                    <div class="video-playing-indicator" style="display: none;">▶ Відтворюється</div>
                    <div class="video-controls">Клікніть для відтворення</div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });
        
        this.youtubeSwiper.update();
    }
    
    setupVideoPlayers() {
        // Ініціалізація YouTube API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        
        window.onYouTubeIframeAPIReady = () => {
            this.initializeYouTubePlayers();
        };
        
        // Якщо API вже завантажено
        if (window.YT && YT.loaded) {
            this.initializeYouTubePlayers();
        }
        
        // Додаємо обробники кліків
        this.setupVideoClickHandlers();
    }
    
    initializeYouTubePlayers() {
        const videoContainers = document.querySelectorAll('.video-container');
        
        videoContainers.forEach((container, index) => {
            const iframe = container.querySelector('iframe');
            const videoId = container.dataset.videoId;
            
            // Створюємо YouTube player
            new YT.Player(iframe, {
                events: {
                    'onStateChange': (event) => this.onPlayerStateChange(event, container)
                }
            });
            
            // Додаємо обробник кліку
            container.addEventListener('click', (e) => {
                if (!e.target.closest('.video-controls')) {
                    this.handleVideoClick(container, videoId);
                }
            });
        });
    }
    
    setupVideoClickHandlers() {
        document.addEventListener('click', (e) => {
            const videoContainer = e.target.closest('.video-container');
            if (videoContainer) {
                const videoId = videoContainer.dataset.videoId;
                this.handleVideoClick(videoContainer, videoId);
            }
        });
    }
    
    handleVideoClick(container, videoId) {
        const iframe = container.querySelector('iframe');
        const slide = container.closest('.swiper-slide');
        const indicator = container.querySelector('.video-playing-indicator');
        
        // Якщо це вже відтворюється відео - пауза
        if (slide.classList.contains('playing-video')) {
            this.pauseVideo(iframe);
            slide.classList.remove('playing-video');
            indicator.style.display = 'none';
            this.currentPlayingVideo = null;
        } else {
            // Зупиняємо поточне відео
            this.pauseAllVideos();
            
            // Запускаємо нове відео
            this.playVideo(iframe);
            slide.classList.add('playing-video');
            indicator.style.display = 'block';
            this.currentPlayingVideo = iframe;
            
            // Збільшуємо слайд
            this.enlargeVideoSlide(slide);
        }
    }
    
    playVideo(iframe) {
        // Відправляємо команду відтворення через postMessage
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
    
    pauseVideo(iframe) {
        // Відправляємо команду паузи через postMessage
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
    
    pauseAllVideos() {
        // Зупиняємо всі відео
        const allIframes = document.querySelectorAll('.video-container iframe');
        const allSlides = document.querySelectorAll('.swiper-slide');
        const allIndicators = document.querySelectorAll('.video-playing-indicator');
        
        allIframes.forEach(iframe => this.pauseVideo(iframe));
        allSlides.forEach(slide => {
            slide.classList.remove('playing-video');
            slide.classList.remove('enlarged');
        });
        allIndicators.forEach(indicator => indicator.style.display = 'none');
        
        this.currentPlayingVideo = null;
    }
    
    enlargeVideoSlide(slide) {
        // Видаляємо попередній збільшений слайд
        const previousEnlarged = document.querySelector('.swiper-slide.enlarged');
        if (previousEnlarged && previousEnlarged !== slide) {
            previousEnlarged.classList.remove('enlarged');
        }
        
        // Додаємо клас збільшення
        slide.classList.add('enlarged');
        
        // Оновлюємо Swiper для коректного відображення
        this.youtubeSwiper.update();
    }
    
    onPlayerStateChange(event, container) {
        const slide = container.closest('.swiper-slide');
        const indicator = container.querySelector('.video-playing-indicator');
        
        switch(event.data) {
            case YT.PlayerState.PLAYING:
                // Автоматично зупиняємо інші відео при запуску нового
                if (this.currentPlayingVideo && this.currentPlayingVideo !== event.target) {
                    this.pauseAllVideos();
                }
                this.currentPlayingVideo = event.target;
                slide.classList.add('playing-video');
                indicator.style.display = 'block';
                this.enlargeVideoSlide(slide);
                break;
                
            case YT.PlayerState.PAUSED:
            case YT.PlayerState.ENDED:
                slide.classList.remove('playing-video');
                indicator.style.display = 'none';
                slide.classList.remove('enlarged');
                if (this.currentPlayingVideo === event.target) {
                    this.currentPlayingVideo = null;
                }
                break;
        }
    }
    
    loadPortfolioItems() {
        // Ваші проекти портфоліо (залишається без змін)
        this.portfolioItems = [
            // ... ваші проекти ...
        ];
        
        this.renderPortfolioItems();
    }
    
    renderPortfolioItems() {
        // ... код рендерингу портфоліо (залишається без змін) ...
    }
    
    // ... інші методи (залишаються без змін) ...
}

// Ініціалізація додатку
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
