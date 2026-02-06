class PortfolioSite {
    constructor() {
        this.portfolioItems = [
            'IMG_0296', 'IMG_0745', 'IMG_0818', 'IMG_1310', 'IMG_1311', 'IMG_1633', 'IMG_1899',
            'IMG_1933', 'IMG_2032', 'IMG_2118', 'IMG_2182', 'IMG_2256', 'IMG_2373', 'IMG_2400',
            'IMG_2473', 'IMG_2815', 'IMG_2869', 'IMG_2952', 'IMG_3004', 'IMG_3234', 'IMG_3239',
            'IMG_3333', 'IMG_3334', 'IMG_3348', 'IMG_3448', 'IMG_3449', 'IMG_3645', 'IMG_3652',
            'IMG_3673', 'IMG_3676', 'IMG_3683', 'IMG_3701', 'IMG_3721', 'IMG_3777', 'IMG_4042',
            'IMG_4048', 'IMG_4119', 'IMG_4198', 'IMG_5045', 'IMG_5641', 'IMG_5742', 'IMG_5744',
            'IMG_5749', 'IMG_5756', 'IMG_5758', 'IMG_5759', 'IMG_5762', 'IMG_5765', 'IMG_7040',
            'IMG_7430', 'IMG_7449'
        ].map(name => ({
            image: `./images/portfolio/${name}.jpg`,
            caption: '',
            description: ''
        }));
        
        this.currentSlide = 0;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000;
        this.isAutoPlaying = true;
        this.visibleDots = 6; // Всегда показываем 6 точек
        this.totalSlides = this.portfolioItems.length;
        this.dotIndices = []; // Индексы, которые представляют текущие 6 точек
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initPortfolioCarousel();
        this.initScroll();
        this.initLoader();
        this.updateDotIndices();
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
    
    // Обновляем индексы для 6 точек
    updateDotIndices() {
        this.dotIndices = [];
        
        if (this.totalSlides <= this.visibleDots) {
            // Если слайдов меньше или равно 6, показываем все
            for (let i = 0; i < this.totalSlides; i++) {
                this.dotIndices.push(i);
            }
        } else {
            // Если слайдов больше 6, показываем текущую позицию в центре
            let startIndex = this.currentSlide - Math.floor(this.visibleDots / 2);
            if (startIndex < 0) {
                startIndex = 0;
            } else if (startIndex + this.visibleDots > this.totalSlides) {
                startIndex = this.totalSlides - this.visibleDots;
            }
            
            for (let i = 0; i < this.visibleDots; i++) {
                this.dotIndices.push((startIndex + i) % this.totalSlides);
            }
        }
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
                <img src="${item.image}" alt="" loading="lazy">
            `;
            
            slide.addEventListener('click', () => this.openLightbox(index));
            this.portfolioCarousel.appendChild(slide);
        });
        
        // Создаем 6 точек навигации
        this.updateDotIndices();
        this.dotIndices.forEach((slideIndex, dotIndex) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.dataset.slideIndex = slideIndex;
            dot.dataset.dotIndex = dotIndex;
            if (slideIndex === this.currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(slideIndex));
            this.carouselDots.appendChild(dot);
        });
        
        // Обновляем позицию карусели
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.portfolioCarousel) return;
        
        const slideWidth = 100; // 100% на слайд
        this.portfolioCarousel.style.transform = `translateX(-${this.currentSlide * slideWidth}%)`;
        
        // Обновляем индексы точек и активную точку
        this.updateDotIndices();
        
        // Обновляем точки в DOM
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, dotIndex) => {
            const slideIndex = this.dotIndices[dotIndex];
            dot.dataset.slideIndex = slideIndex;
            dot.classList.toggle('active', slideIndex === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
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
        this.lightboxImage.alt = '';
        this.lightboxCaption.textContent = '';
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.startAutoSlide(); // Возобновляем автопрокрутку
    }
    
    showPrevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.totalSlides) % this.totalSlides;
        const image = this.portfolioItems[this.currentImageIndex];
        this.lightboxImage.src = image.image;
        this.lightboxImage.alt = '';
        this.lightboxCaption.textContent = '';
    }
    
    showNextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.totalSlides;
        const image = this.portfolioItems[this.currentImageIndex];
        this.lightboxImage.src = image.image;
        this.lightboxImage.alt = '';
        this.lightboxCaption.textContent = '';
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