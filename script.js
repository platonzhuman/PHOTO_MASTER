class PortfolioSite {
    constructor() {
        this.portfolioItems = [
            { 
                image: 'https://via.placeholder.com/1200x675/7F0F1C/FFFFFF?text=Роспись+детской+комнаты',
                caption: 'Роспись детской комнаты',
                description: 'Сказочный мир для вашего ребенка'
            },
            { 
                image: 'https://via.placeholder.com/1200x675/510D0B/FFFFFF?text=Аэрография+на+стене',
                caption: 'Аэрография на стене',
                description: 'Современная техника с плавными переходами'
            },
            { 
                image: 'https://via.placeholder.com/1200x675/260505/FFFFFF?text=Граффити+на+фасаде',
                caption: 'Граффити на фасаде',
                description: 'Уличное искусство в городской среде'
            },
            { 
                image: 'https://via.placeholder.com/1200x675/7F0F1C/FFFFFF?text=Офисная+роспись',
                caption: 'Офисная роспись',
                description: 'Корпоративный стиль и мотивация'
            },
            { 
                image: 'https://via.placeholder.com/1200x675/510D0B/FFFFFF?text=Художественная+роспись',
                caption: 'Художественная роспись',
                description: 'Классическая техника в интерьере'
            },
            { 
                image: 'https://via.placeholder.com/1200x675/260505/FFFFFF?text=Картина+на+заказ',
                caption: 'Картина на заказ',
                description: 'Индивидуальная работа маслом'
            }
        ];
        
        this.currentSlide = 0;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000; // 5 секунд
        this.isAutoPlaying = true;
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initPortfolioCarousel();
        this.initScroll();
        this.initLoader();
        this.startAutoSlide();
    }

    initLoader() {
        const name = "Фахартымова Диана";
        const subtitle = "INFOMARKET";
        const nameElement = document.getElementById('loaderName');
        const subtitleElement = document.getElementById('loaderSubtitle');
        
        nameElement.innerHTML = '';
        subtitleElement.innerHTML = '';
        
        let nameIndex = 0;
        let subtitleIndex = 0;
        const nameSpeed = 80;
        const subtitleSpeed = 40;
        
        const typeNameLetter = () => {
            if (nameIndex < name.length) {
                const letter = name.charAt(nameIndex);
                
                if (letter === ' ') {
                    const space = document.createElement('span');
                    space.className = 'letter space';
                    space.innerHTML = '&nbsp;';
                    nameElement.appendChild(space);
                    space.classList.add('visible');
                } else {
                    const span = document.createElement('span');
                    span.className = 'letter';
                    span.textContent = letter;
                    nameElement.appendChild(span);
                    
                    setTimeout(() => {
                        span.classList.add('visible');
                    }, 10);
                }
                
                nameIndex++;
                const delay = nameSpeed + (Math.random() * 30 - 15);
                setTimeout(typeNameLetter, delay);
            } else {
                setTimeout(() => {
                    document.querySelector('.loader-cursor')?.style.setProperty('opacity', '0');
                    setTimeout(typeSubtitleLetter, 200);
                }, 200);
            }
        };
        
        const typeSubtitleLetter = () => {
            if (subtitleIndex < subtitle.length) {
                const letter = subtitle.charAt(subtitleIndex);
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = letter;
                
                subtitleElement.appendChild(span);
                
                setTimeout(() => {
                    span.classList.add('visible');
                }, 10);
                
                subtitleIndex++;
                const delay = subtitleSpeed + (Math.random() * 20 - 10);
                setTimeout(typeSubtitleLetter, delay);
            } else {
                setTimeout(() => {
                    this.finishLoader();
                }, 800);
            }
        };
        
        setTimeout(() => {
            typeNameLetter();
        }, 300);
    }
    
    finishLoader() {
        this.loader.classList.add('hidden');
        
        setTimeout(() => {
            if (this.loader?.parentNode) {
                this.loader.parentNode.removeChild(this.loader);
            }
        }, 500);
    }
    
    cacheElements() {
        this.loader = document.querySelector('.loader');
        this.bookingBtn = document.getElementById('bookingBtn');
        this.modal = document.getElementById('bookingModal');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalClose = document.getElementById('modalClose');
        this.bookingForm = document.getElementById('bookingForm');
        this.serviceSelect = document.getElementById('serviceType');
        this.selectedServiceField = document.getElementById('selectedService');
        this.bookButtons = document.querySelectorAll('.btn-book');
        this.portfolioCarousel = document.getElementById('portfolioCarousel');
        this.carouselDots = document.getElementById('carouselDots');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxCaption = document.getElementById('lightboxCaption');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
    }
    
    bindEvents() {
        this.bookingBtn?.addEventListener('click', () => this.openModal());
        this.modalOverlay?.addEventListener('click', () => this.closeModal());
        this.modalClose?.addEventListener('click', () => this.closeModal());
        this.bookingForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
        this.lightboxPrev?.addEventListener('click', () => this.showPrevImage());
        this.lightboxNext?.addEventListener('click', () => this.showNextImage());
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        this.bookButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.dataset.service;
                this.openModal(service);
            });
        });
        
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    initPortfolioCarousel() {
        if (!this.portfolioCarousel) return;
        
        // Очищаем карусель
        this.portfolioCarousel.innerHTML = '';
        this.carouselDots.innerHTML = '';
        
        // Создаем слайды
        this.portfolioItems.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.dataset.index = index;
            
            slide.innerHTML = `
                <img src="${item.image}" alt="${item.caption}" loading="lazy">
                <div class="carousel-caption">
                    <h3>${item.caption}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            slide.addEventListener('click', () => this.openLightbox(index));
            this.portfolioCarousel.appendChild(slide);
            
            // Создаем точки навигации
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.dataset.index = index;
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.carouselDots.appendChild(dot);
        });
        
        // Обновляем позицию карусели
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.portfolioCarousel) return;
        
        const slideWidth = 100; // 100% на слайд
        this.portfolioCarousel.style.transform = `translateX(-${this.currentSlide * slideWidth}%)`;
        
        // Обновляем активную точку
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.portfolioItems.length;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.portfolioItems.length) % this.portfolioItems.length;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    startAutoSlide() {
        if (this.isAutoPlaying) {
            this.autoSlideInterval = setInterval(() => this.nextSlide(), this.autoSlideDelay);
        }
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
    
    initScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    handleScroll() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            
            if (scrollPosition > windowHeight * 0.3) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.visibility = 'hidden';
            } else {
                scrollIndicator.style.opacity = '0.7';
                scrollIndicator.style.visibility = 'visible';
            }
        }
    }
    
    openModal(service = '') {
        if (service) {
            this.selectedServiceField.value = service;
            
            if (service.includes('Роспись')) this.serviceSelect.value = 'painting';
            else if (service.includes('Аэрография')) this.serviceSelect.value = 'airbrush';
            else if (service.includes('Граффити')) this.serviceSelect.value = 'graffiti';
            else if (service.includes('Картины')) this.serviceSelect.value = 'canvas';
        }
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => this.bookingForm?.reset(), 300);
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        const formData = new FormData(this.bookingForm);
        const data = Object.fromEntries(formData);
        
        setTimeout(() => {
            alert('Спасибо! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время.');
            this.closeModal();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            fetch('https://formspree.io/f/mwvnebqr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            }).catch(error => {
                console.error('Ошибка отправки формы:', error);
            });
        }, 1000);
    }
    
    openLightbox(index) {
        this.stopAutoSlide(); // Останавливаем автопрокрутку при открытии лайтбокса
        this.currentImageIndex = index;
        const image = this.portfolioItems[this.currentImageIndex];
        
        this.lightboxImage.src = image.image;
        this.lightboxImage.alt = image.caption;
        this.lightboxCaption.textContent = image.caption;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.startAutoSlide(); // Возобновляем автопрокрутку
    }
    
    showPrevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.portfolioItems.length) % this.portfolioItems.length;
        const image = this.portfolioItems[this.currentImageIndex];
        this.lightboxImage.src = image.image;
        this.lightboxImage.alt = image.caption;
        this.lightboxCaption.textContent = image.caption;
    }
    
    showNextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.portfolioItems.length;
        const image = this.portfolioItems[this.currentImageIndex];
        this.lightboxImage.src = image.image;
        this.lightboxImage.alt = image.caption;
        this.lightboxCaption.textContent = image.caption;
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape') {
            if (this.modal?.classList.contains('active')) this.closeModal();
            if (this.lightbox?.classList.contains('active')) this.closeLightbox();
        }
        
        if (this.lightbox?.classList.contains('active')) {
            if (e.key === 'ArrowLeft') this.showPrevImage();
            if (e.key === 'ArrowRight') this.showNextImage();
        }
        
        // Управление каруселью с клавиатуры
        if (!this.modal?.classList.contains('active') && !this.lightbox?.classList.contains('active')) {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSite();
});