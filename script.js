class PortfolioSite {
    constructor() {
        // Данные портфолио
        this.portfolioItems = [
            'IMG_0296', 'IMG_0745', 'IMG_1311', 'IMG_0818', 'IMG_2182', 'IMG_1310', 
            'IMG_1633', 'IMG_1899', 'IMG_1933', 'IMG_2032', 'IMG_2118', 'IMG_2373', 
            'IMG_2400', 'IMG_2473', 'IMG_2869', 'IMG_2952', 'IMG_3004', 'IMG_3234',
            'IMG_3239', 'IMG_2815', 'IMG_3333', 'IMG_3448', 'IMG_3449', 'IMG_3645',
            'IMG_3652', 'IMG_3673', 'IMG_3676', 'IMG_3683', 'IMG_3701', 'IMG_3721',
            'IMG_3777', 'IMG_4042', 'IMG_4048', 'IMG_4119', 'IMG_4198', 'IMG_5045',
            'IMG_5641', 'IMG_5756', 'IMG_5758', 'IMG_7040', 'IMG_7430', 'IMG_7449'
        ].map(name => ({
            image: `./images/portfolio/${name}.jpg`,
            caption: '',
            description: ''
        }));
        
        // Переменные для галереи
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = null;
        this.velocity = 0;
        this.lastTime = 0;
        this.lastPosition = 0;
        this.galleryWidth = 0;
        this.gridWidth = 0;
        this.maxScroll = 0;
        
        // Переменные для лайтбокса
        this.currentLightboxIndex = 0;
        this.isLightboxOpen = false;
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initLoader();
        this.initPortfolioGallery();
        this.initScroll();
    }

    cacheElements() {
        // Основные элементы
        this.loader = document.querySelector('.loader');
        this.mainContent = document.querySelector('.main-content');
        
        // Галерея портфолио
        this.portfolioGrid = document.getElementById('portfolioGrid');
        this.portfolioScrollContainer = document.getElementById('portfolioScrollContainer');
        
        // Модальное окно
        this.bookingBtn = document.getElementById('bookingBtn');
        this.modal = document.getElementById('bookingModal');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalClose = document.getElementById('modalClose');
        this.bookingForm = document.getElementById('bookingForm');
        this.serviceSelect = document.getElementById('serviceType');
        this.selectedServiceField = document.getElementById('selectedService');
        this.bookButtons = document.querySelectorAll('.btn-book');
        
        // Лайтбокс
        this.lightbox = document.getElementById('lightbox');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxCaption = document.getElementById('lightboxCaption');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
        
        // Элементы для прокрутки по якорям
        this.scrollLinks = document.querySelectorAll('a[href^="#"]');
    }
    
    bindEvents() {
        // События галереи
        this.portfolioScrollContainer?.addEventListener('mousedown', (e) => this.startDrag(e));
        this.portfolioScrollContainer?.addEventListener('mousemove', (e) => this.drag(e));
        this.portfolioScrollContainer?.addEventListener('mouseup', () => this.endDrag());
        this.portfolioScrollContainer?.addEventListener('mouseleave', () => this.endDrag());
        
        // Для сенсорных устройств
        this.portfolioScrollContainer?.addEventListener('touchstart', (e) => this.startDrag(e));
        this.portfolioScrollContainer?.addEventListener('touchmove', (e) => this.drag(e));
        this.portfolioScrollContainer?.addEventListener('touchend', () => this.endDrag());
        
        // События модального окна
        this.bookingBtn?.addEventListener('click', () => this.openModal());
        this.modalOverlay?.addEventListener('click', () => this.closeModal());
        this.modalClose?.addEventListener('click', () => this.closeModal());
        this.bookingForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // События кнопок заказа в карточках услуг
        this.bookButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.dataset.service;
                this.openModal(service);
            });
        });
        
        // События лайтбокса
        this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
        this.lightboxPrev?.addEventListener('click', () => this.showPrevImage());
        this.lightboxNext?.addEventListener('click', () => this.showNextImage());
        
        // Глобальные события клавиатуры
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Предотвращение стандартного поведения для ссылок якорей
        this.scrollLinks.forEach(link => {
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
    
    // ===== ЛОАДЕР С ОПТИМИЗИРОВАННОЙ АНИМАЦИЕЙ =====
    initLoader() {
        const name = "Фахартымова Диана";
        const subtitle = "Профессиональный художник";
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
                
                if (letter === ' ') {
                    const space = document.createElement('span');
                    space.className = 'letter space';
                    space.innerHTML = '&nbsp;';
                    subtitleElement.appendChild(space);
                    setTimeout(() => space.classList.add('visible'), 10);
                } else {
                    const span = document.createElement('span');
                    span.className = 'letter';
                    span.textContent = letter;
                    subtitleElement.appendChild(span);
                    
                    setTimeout(() => {
                        span.classList.add('visible');
                    }, 10);
                }
                
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
            document.body.style.overflow = 'auto';
        }, 500);
    }
    
    // ===== ГАЛЕРЕЯ ПОРТФОЛИО =====
    initPortfolioGallery() {
        if (!this.portfolioGrid) return;
        
        this.portfolioGrid.innerHTML = '';
        
        // Создаем элементы галереи
        this.portfolioItems.forEach((item, index) => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.dataset.index = index;
            portfolioItem.style.setProperty('--item-index', index);
            
            portfolioItem.innerHTML = `
                <img src="${item.image}" 
                     alt="Работа ${index + 1}" 
                     loading="lazy"
                     draggable="false"
                     width="300"
                     height="400">
            `;
            
            portfolioItem.addEventListener('click', (e) => {
                if (!this.isDragging) {
                    this.openLightbox(index);
                }
            });
            
            this.portfolioGrid.appendChild(portfolioItem);
        });
        
        // Инициализируем галерею после загрузки DOM
        setTimeout(() => {
            this.initGallerySizes();
        }, 100);
    }
    
    initGallerySizes() {
        if (!this.portfolioGrid || !this.portfolioScrollContainer) return;
        
        // Получаем размеры элементов
        const item = this.portfolioGrid.querySelector('.portfolio-item');
        if (!item) return;
        
        const itemWidth = item.offsetWidth;
        const gap = 20;
        
        // Вычисляем общую ширину сетки
        this.gridWidth = (itemWidth + gap) * this.portfolioItems.length;
        this.portfolioGrid.style.width = `${this.gridWidth}px`;
        
        // Вычисляем максимальный скролл
        this.galleryWidth = this.portfolioScrollContainer.offsetWidth;
        this.maxScroll = Math.max(0, this.gridWidth - this.galleryWidth);
    }
    
    // Функции для плавного перетаскивания (ИСПРАВЛЕННЫЕ)
    startDrag(e) {
        this.isDragging = true;
        this.portfolioScrollContainer.classList.add('dragging');
        
        if (this.animationID) {
            cancelAnimationFrame(this.animationID);
        }
        
        this.startX = this.getPositionX(e);
        this.prevTranslate = this.currentTranslate;
        this.lastTime = performance.now();
        this.lastPosition = this.currentTranslate;
        
        this.portfolioGrid.style.transition = 'none';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const currentX = this.getPositionX(e);
        const deltaX = currentX - this.startX;
        const newTranslate = this.prevTranslate + deltaX;
        
        this.currentTranslate = Math.max(Math.min(newTranslate, 0), -this.maxScroll);
        
        this.portfolioGrid.style.transform = `translateX(${this.currentTranslate}px)`;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime > 0) {
            this.velocity = (this.currentTranslate - this.lastPosition) / deltaTime;
            this.lastPosition = this.currentTranslate;
            this.lastTime = currentTime;
        }
    }
    
    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.portfolioScrollContainer.classList.remove('dragging');
        
        this.portfolioGrid.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        if (Math.abs(this.velocity) > 0.1) {
            this.applyInertia();
        } else {
            this.snapToNearest();
        }
    }
    
    applyInertia() {
        const friction = 0.95;
        const minVelocity = 0.5;
        
        const animateInertia = () => {
            this.velocity *= friction;
            this.currentTranslate += this.velocity * 16;
            
            this.currentTranslate = Math.max(Math.min(this.currentTranslate, 0), -this.maxScroll);
            
            this.portfolioGrid.style.transform = `translateX(${this.currentTranslate}px)`;
            
            if (Math.abs(this.velocity) > minVelocity) {
                this.animationID = requestAnimationFrame(animateInertia);
            } else {
                this.snapToNearest();
            }
        };
        
        this.animationID = requestAnimationFrame(animateInertia);
    }
    
    snapToNearest() {
        const itemWidth = 300 + 20;
        const currentPosition = Math.abs(this.currentTranslate);
        const nearestIndex = Math.round(currentPosition / itemWidth);
        const snapPosition = -nearestIndex * itemWidth;
        
        this.currentTranslate = snapPosition;
        this.portfolioGrid.style.transform = `translateX(${this.currentTranslate}px)`;
    }
    
    // Вспомогательная функция для получения позиции X (ИСПРАВЛЕННАЯ)
    getPositionX(e) {
        if (!e) return 0;
        
        // Для мышиных событий
        if (e.clientX !== undefined) {
            return e.clientX;
        }
        
        // Для touch событий
        if (e.touches && e.touches[0]) {
            return e.touches[0].clientX;
        }
        
        // Для старых событий mouse
        if (e.pageX !== undefined) {
            return e.pageX;
        }
        
        return 0;
    }
    
    // ===== ЛАЙТБОКС =====
    openLightbox(index) {
        this.currentLightboxIndex = index;
        const image = this.portfolioItems[this.currentLightboxIndex];
        
        this.lightboxImage.src = image.image;
        this.lightboxImage.alt = `Работа ${index + 1}`;
        this.lightboxCaption.textContent = image.caption || '';
        
        this.lightbox.classList.add('active');
        this.isLightboxOpen = true;
        document.body.style.overflow = 'hidden';
        
        if (this.portfolioScrollContainer) {
            this.portfolioScrollContainer.style.overflow = 'hidden';
        }
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        this.isLightboxOpen = false;
        document.body.style.overflow = 'auto';
        
        if (this.portfolioScrollContainer) {
            this.portfolioScrollContainer.style.overflow = 'auto';
        }
    }
    
    showPrevImage() {
        this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.portfolioItems.length) % this.portfolioItems.length;
        const image = this.portfolioItems[this.currentLightboxIndex];
        
        this.lightboxImage.src = image.image;
        this.lightboxImage.alt = `Работа ${this.currentLightboxIndex + 1}`;
        this.lightboxCaption.textContent = image.caption || '';
    }
    
    showNextImage() {
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.portfolioItems.length;
        const image = this.portfolioItems[this.currentLightboxIndex];
        
        this.lightboxImage.src = image.image;
        this.lightboxImage.alt = `Работа ${this.currentLightboxIndex + 1}`;
        this.lightboxCaption.textContent = image.caption || '';
    }
    
    // ===== МОДАЛЬНОЕ ОКНО =====
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
        
        setTimeout(() => {
            if (this.bookingForm) {
                this.bookingForm.reset();
                this.selectedServiceField.value = '';
            }
        }, 300);
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        const formData = new FormData(this.bookingForm);
        const data = Object.fromEntries(formData);
        
        // Добавляем тему письма
        data._subject = `Новая заявка: ${data.service || data.serviceType || 'Услуга'}`;
        
        try {
            // Отправка формы на Formspree
            const response = await fetch('https://formspree.io/f/maqdnbyn', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert('Спасибо! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время.');
                this.closeModal();
            } else {
                // Попробуем получить текст ошибки от Formspree
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при отправке формы');
            }
            
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            
            // Показываем более информативное сообщение об ошибке
            if (error.message.includes('Failed to fetch')) {
                alert('Проблема с соединением. Проверьте интернет и попробуйте еще раз.');
            } else {
                alert(`Произошла ошибка при отправке: ${error.message}. Пожалуйста, попробуйте еще раз или свяжитесь со мной через Telegram.`);
            }
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    // ===== ОБРАБОТКА КЛАВИАТУРЫ =====
    handleKeydown(e) {
        if (e.key === 'Escape') {
            if (this.modal?.classList.contains('active')) this.closeModal();
            if (this.lightbox?.classList.contains('active')) this.closeLightbox();
        }
        
        if (this.lightbox?.classList.contains('active')) {
            if (e.key === 'ArrowLeft') this.showPrevImage();
            if (e.key === 'ArrowRight') this.showNextImage();
        }
        
        if (!this.modal?.classList.contains('active') && !this.lightbox?.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                this.currentTranslate = Math.min(this.currentTranslate + 400, 0);
                this.portfolioGrid.style.transform = `translateX(${this.currentTranslate}px)`;
            }
            if (e.key === 'ArrowRight') {
                this.currentTranslate = Math.max(this.currentTranslate - 400, -this.maxScroll);
                this.portfolioGrid.style.transform = `translateX(${this.currentTranslate}px)`;
            }
        }
    }
    
    // ===== ИНИЦИАЛИЗАЦИЯ СКРОЛЛА =====
    initScroll() {
        // Оптимизация: предзагрузка изображений при простое
        let idleCallbackId = null;
        
        const preloadVisibleImages = () => {
            if (idleCallbackId) {
                cancelIdleCallback(idleCallbackId);
            }
            
            if ('requestIdleCallback' in window) {
                idleCallbackId = requestIdleCallback(() => {
                    // Предзагружаем изображения в viewport
                    const viewportImages = this.portfolioGrid?.querySelectorAll('img');
                    if (viewportImages) {
                        viewportImages.forEach(img => {
                            if (img.getBoundingClientRect().top < window.innerHeight * 2) {
                                const src = img.getAttribute('data-src') || img.src;
                                if (src && !img.complete) {
                                    const preloadImg = new Image();
                                    preloadImg.src = src;
                                }
                            }
                        });
                    }
                }, { timeout: 2000 });
            }
        };
        
        // Запускаем предзагрузку при скролле
        window.addEventListener('scroll', preloadVisibleImages, { passive: true });
        
        // И при загрузке страницы
        window.addEventListener('load', preloadVisibleImages);
    }
    
    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    preloadImages() {
        // Предзагружаем только первые 5 изображений
        for (let i = 0; i < Math.min(5, this.portfolioItems.length); i++) {
            const img = new Image();
            img.src = this.portfolioItems[i].image;
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    
    const site = new PortfolioSite();
    
    // Предзагрузка критических изображений
    setTimeout(() => {
        site.preloadImages();
    }, 1000);
    
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.portfolio-item')) {
            e.preventDefault();
        }
    });
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});