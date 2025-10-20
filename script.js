// Основний JavaScript для сайту
class PortfolioApp {
    constructor() {
        this.youtubeVideos = [];
        this.portfolioItems = [];
        this.currentFilter = 'all';
        
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
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
        
        // Додавання демо відео (замінити на ваші)
        this.addDemoVideos();
    }
    
    addDemoVideos() {
        const swiperWrapper = document.querySelector('.youtubeSwiper .swiper-wrapper');
        
        // Демо дані - замінити на ваші YouTube ID
        const demoVideos = [
            { id: 'dQw4w9WgXcQ', title: 'Character Animation' },
            { id: 'dQw4w9WgXcQ', title: 'Environment Design' },
            { id: 'dQw4w9WgXcQ', title: 'Object Modeling' },
            { id: 'dQw4w9WgXcQ', title: 'Spline Interactive' }
        ];
        
        demoVideos.forEach(video => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${video.id}" 
                        title="${video.title}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });
        
        this.youtubeSwiper.update();
    }
    
    loadPortfolioItems() {
        // Демо дані портфоліо - замінити на ваші
        this.portfolioItems = [
            {
                id: 1,
                image: 'https://via.placeholder.com/600x400/5072A7/FFFFFF?text=Character+Model',
                title: 'Fantasy Character',
                category: 'characters',
                link: '#'
            },
            {
                id: 2,
                image: 'https://via.placeholder.com/600x400/00308F/FFFFFF?text=Weapon+Design',
                title: 'Sci-fi Weapon',
                category: 'objects',
                link: '#'
            },
            {
                id: 3,
                image: 'https://via.placeholder.com/600x400/002366/FFFFFF?text=Medieval+Room',
                title: 'Medieval Chamber',
                category: 'environments',
                link: '#'
            },
            {
                id: 4,
                image: 'https://via.placeholder.com/600x400/5072A7/FFFFFF?text=Creature+Design',
                title: 'Mythical Creature',
                category: 'characters',
                link: '#'
            },
            {
                id: 5,
                image: 'https://via.placeholder.com/600x400/00308F/FFFFFF?text=Furniture+Set',
                title: 'Modern Furniture',
                category: 'objects',
                link: '#'
            },
            {
                id: 6,
                image: 'https://via.placeholder.com/600x400/002366/FFFFFF?text=Forest+Scene',
                title: 'Enchanted Forest',
                category: 'environments',
                link: '#'
            }
        ];
        
        this.renderPortfolioItems();
    }
    
    renderPortfolioItems() {
        const grid = document.querySelector('.portfolio-grid');
        grid.innerHTML = '';
        
        const filteredItems = this.currentFilter === 'all' 
            ? this.portfolioItems 
            : this.portfolioItems.filter(item => item.category === this.currentFilter);
        
        filteredItems.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = `portfolio-item ${item.category}`;
            portfolioItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="portfolio-item-overlay">
                    <h3>${item.title}</h3>
                    <p>${this.getCategoryName(item.category)}</p>
                </div>
            `;
            
            portfolioItem.addEventListener('click', () => {
                // Тут можна додати lightbox або посилання на детальну сторінку
                console.log('Clicked:', item.title);
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
    
    setupEventListeners() {
        // Фільтрація портфоліо
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Оновлення активних кнопок
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Застосування фільтра
                this.currentFilter = e.target.dataset.filter;
                this.renderPortfolioItems();
            });
        });
        
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
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Ініціалізація додатку
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Обробка помилок завантаження зображень
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/600x400/002366/FFFFFF?text=Image+Not+Found';
        });
    });
});