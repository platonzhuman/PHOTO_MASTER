class PortfolioSite {
    constructor() {
        this.portfolioImages = [
            { caption: 'Роспись детской комнаты' },
            { caption: 'Аэрография на стене' },
            { caption: 'Граффити на фасаде' },
            { caption: 'Офисная роспись' },
            { caption: 'Художественная роспись' },
            { caption: 'Картина на заказ' }
        ];
        
        this.currentImageIndex = 0;
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initPortfolio();
        this.initScroll();
        this.initLoader();
    }

    initLoader() {
        const name = "Фахартымова Диана";
        const nameElement = document.getElementById('loaderName');
        nameElement.innerHTML = '';
        
        // Набираем текст по буквам
        let i = 0;
        const typingSpeed = 100; // 100ms на букву
        const pauseAfterTyping = 1000; // 1 секунда паузы
        
        const typeLetter = () => {
            if (i < name.length) {
                nameElement.innerHTML += name.charAt(i);
                i++;
                setTimeout(typeLetter, typingSpeed);
            } else {
                // После завершения набора текста ждем и скрываем прелоадер
                setTimeout(() => {
                    this.loader.classList.add('hidden');
                    // После скрытия прелоадера убираем его из DOM
                    setTimeout(() => {
                        if (this.loader.parentNode) {
                            this.loader.parentNode.removeChild(this.loader);
                        }
                    }, 500);
                }, pauseAfterTyping);
            }
        };
        
        // Начинаем анимацию с небольшой задержкой
        setTimeout(typeLetter, 500);
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
        this.portfolioGrid = document.getElementById('portfolioGrid');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxCaption = document.getElementById('lightboxCaption');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
    }
    
    bindEvents() {
        this.bookingBtn.addEventListener('click', () => this.openModal());
        this.modalOverlay.addEventListener('click', () => this.closeModal());
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.bookingForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        this.lightboxPrev.addEventListener('click', () => this.showPrevImage());
        this.lightboxNext.addEventListener('click', () => this.showNextImage());
        
        this.bookButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.dataset.service;
                this.openModal(service);
            });
        });
        
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    initPortfolio() {
        this.portfolioGrid.innerHTML = '';
        
        this.portfolioImages.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            
            item.innerHTML = `
                <div class="portfolio-image">
                    <span>${image.caption}</span>
                </div>
            `;
            
            item.addEventListener('click', () => this.openLightbox(index));
            this.portfolioGrid.appendChild(item);
        });
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
        setTimeout(() => this.bookingForm.reset(), 300);
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
            });
        }, 1000);
    }
    
    openLightbox(index) {
        this.currentImageIndex = index;
        const image = this.portfolioImages[this.currentImageIndex];
        
        this.lightboxImage.alt = image.caption;
        this.lightboxCaption.textContent = image.caption;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    showPrevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.portfolioImages.length) % this.portfolioImages.length;
        const image = this.portfolioImages[this.currentImageIndex];
        this.lightboxImage.alt = image.caption;
        this.lightboxCaption.textContent = image.caption;
    }
    
    showNextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.portfolioImages.length;
        const image = this.portfolioImages[this.currentImageIndex];
        this.lightboxImage.alt = image.caption;
        this.lightboxCaption.textContent = image.caption;
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape') {
            if (this.modal.classList.contains('active')) this.closeModal();
            if (this.lightbox.classList.contains('active')) this.closeLightbox();
        }
        
        if (this.lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') this.showPrevImage();
            if (e.key === 'ArrowRight') this.showNextImage();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSite();
});