// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentImageIndex = 0;
const portfolioImages = [
    { src: 'images/portfolio-1.jpg', caption: 'Fashion портрет' },
    { src: 'images/portfolio-2.jpg', caption: 'Свадебная фотосъёмка' },
    { src: 'images/portfolio-3.jpg', caption: 'Индивидуальная съёмка' },
    { src: 'images/portfolio-4.jpg', caption: 'Парная фотосессия' },
    { src: 'images/portfolio-5.jpg', caption: 'Fashion editorial' },
    { src: 'images/portfolio-6.jpg', caption: 'Портрет на плёнку' }
];

// ===== DOM ЭЛЕМЕНТЫ =====
const loader = document.querySelector('.loader');
const mainContent = document.querySelector('.main-content');
const bookingBtn = document.getElementById('bookingBtn');
const modal = document.getElementById('bookingModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const serviceSelect = document.getElementById('serviceType');
const selectedServiceField = document.getElementById('selectedService');
const bookButtons = document.querySelectorAll('.btn-book');
const faqItems = document.querySelectorAll('.faq-item');
const portfolioGrid = document.getElementById('portfolioGrid');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Симуляция загрузки
    setTimeout(() => {
        loader.classList.add('hidden');
        mainContent.style.opacity = '1';
    }, 1000);
    
    // Инициализация портфолио
    initPortfolio();
    
    // Инициализация FAQ
    initFAQ();
    
    // Инициализация модального окна
    initModal();
    
    // Инициализация lightbox
    initLightbox();
    
    // Инициализация формы
    initForm();
});

// ===== ПОРТФОЛИО =====
function initPortfolio() {
    // Очищаем placeholder-элементы
    portfolioGrid.innerHTML = '';
    
    // Создаем элементы портфолио
    portfolioImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'portfolio-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="portfolio-image">
                <div class="image-placeholder">
                    <span>${image.caption}</span>
                    <small>Нажмите для просмотра</small>
                </div>
            </div>
        `;
        
        item.addEventListener('click', () => openLightbox(index));
        portfolioGrid.appendChild(item);
    });
}

// ===== LIGHTBOX =====
function initLightbox() {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Навигация клавиатурой
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const image = portfolioImages[currentImageIndex];
    
    // В реальном проекте здесь будет загрузка реального изображения
    lightboxImage.src = ''; // Очищаем src, так как у нас нет реальных изображений
    lightboxImage.alt = image.caption;
    lightboxCaption.textContent = image.caption;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + portfolioImages.length) % portfolioImages.length;
    const image = portfolioImages[currentImageIndex];
    lightboxImage.src = ''; // Очищаем src
    lightboxImage.alt = image.caption;
    lightboxCaption.textContent = image.caption;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
    const image = portfolioImages[currentImageIndex];
    lightboxImage.src = ''; // Очищаем src
    lightboxImage.alt = image.caption;
    lightboxCaption.textContent = image.caption;
}

// ===== FAQ =====
function initFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Закрываем все остальные
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий
            item.classList.toggle('active');
        });
    });
}

// ===== МОДАЛЬНОЕ ОКНО =====
function initModal() {
    // Открытие модального окна
    bookingBtn.addEventListener('click', () => openModal());
    
    bookButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const service = btn.dataset.service;
            openModal(service);
        });
    });
    
    // Закрытие модального окна
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(service = '') {
    if (service) {
        selectedServiceField.value = service;
        
        // Устанавливаем значение в select
        let optionValue = '';
        if (service.includes('Индивидуальная')) optionValue = 'individual';
        else if (service.includes('Парная')) optionValue = 'couple';
        else if (service.includes('Свадебная')) optionValue = 'wedding';
        else if (service.includes('Fashion')) optionValue = 'fashion';
        
        if (optionValue) {
            serviceSelect.value = optionValue;
        }
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== ФОРМА =====
function initForm() {
    bookingForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        date: document.getElementById('date').value,
        service: document.getElementById('serviceType').value,
        selectedService: selectedServiceField.value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // В реальном проекте здесь будет отправка на сервер
    // Для этого примера используем Formspree
    const form = e.target;
    const formAction = 'https://formspree.io/f/mwvnebqr'; // Замените на свой Formspree ID
    
    // Создаем временную форму для отправки
    const tempForm = document.createElement('form');
    tempForm.style.display = 'none';
    tempForm.method = 'POST';
    tempForm.action = formAction;
    
    // Добавляем скрытые поля
    Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        tempForm.appendChild(input);
    });
    
    // Добавляем поле для ответа
    const replyTo = document.createElement('input');
    replyTo.type = 'hidden';
    replyTo.name = '_replyto';
    replyTo.value = formData.email;
    tempForm.appendChild(replyTo);
    
    // Поле для перенаправления после отправки
    const next = document.createElement('input');
    next.type = 'hidden';
    next.name = '_next';
    next.value = window.location.href + '?success=true';
    tempForm.appendChild(next);
    
    document.body.appendChild(tempForm);
    tempForm.submit();
    
    // Показываем сообщение об успехе
    alert('Спасибо! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время.');
    closeModal();
    bookingForm.reset();
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});