class PortfolioSite {
    constructor() {
        this.portfolioImages = [
            { caption: 'Fashion портрет' },
            { caption: 'Свадебная фотосъёмка' },
            { caption: 'Индивидуальная съёмка' },
            { caption: 'Парная фотосессия' },
            { caption: 'Fashion editorial' },
            { caption: 'Портрет на плёнку' }
        ];
        
        this.currentImageIndex = 0;
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initPortfolio();
        this.initScroll();
        setTimeout(() => this.loader.classList.add('hidden'), 800);
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
        this.faqItems = document.querySelectorAll('.faq-item');
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
        
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleFAQ(item));
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
    
    toggleFAQ(item) {
        this.faqItems.forEach(other => {
            if (other !== item && other.classList.contains('active')) {
                other.classList.remove('active');
            }
        });
        item.classList.toggle('active');
    }
    
    openModal(service = '') {
        if (service) {
            this.selectedServiceField.value = service;
            
            if (service.includes('Индивидуальная')) this.serviceSelect.value = 'individual';
            else if (service.includes('Парная')) this.serviceSelect.value = 'couple';
            else if (service.includes('Свадебная')) this.serviceSelect.value = 'wedding';
            else if (service.includes('Fashion')) this.serviceSelect.value = 'fashion';
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