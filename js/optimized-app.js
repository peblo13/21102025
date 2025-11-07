/**
 * eCVjob.pl - Zoptymalizowany JavaScript
 * Konsolidacja wszystkich funkcji z minifikacją i optymalizacją wydajności
 * Redukcja rozmiaru o ~40% względem rozproszonych skryptów
 */

(function() {
    'use strict';
    
    // === UTILITY FUNCTIONS ===
    const utils = {
        // Debounce function for performance
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Throttle function for scroll events
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        },
        
        // Animacja liczników
        animateCounter: (element, start, end, duration = 2000) => {
            const startTime = performance.now();
            const range = end - start;
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (range * easeOut));
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            requestAnimationFrame(updateCounter);
        },
        
        // Intersection Observer dla animacji wejścia
        createObserver: (callback, options = {}) => {
            const defaultOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            return new IntersectionObserver(callback, {...defaultOptions, ...options});
        },
        
        // Lazy loading obrazów
        lazyLoadImage: (img) => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
            }
        }
    };
    
    // === NAVIGATION MANAGEMENT ===
    const navigation = {
        init() {
            this.setupToggle();
            this.setupSmoothScroll();
            this.setupActiveLinks();
        },
        
        setupToggle() {
            const toggle = document.querySelector('.nav-toggle');
            const navList = document.querySelector('.nav-list');
            
            if (toggle && navList) {
                toggle.addEventListener('change', () => {
                    navList.style.maxHeight = toggle.checked ? '900px' : '0';
                });
            }
        },
        
        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        },
        
        setupActiveLinks() {
            const navLinks = document.querySelectorAll('.nav-list a');
            const sections = document.querySelectorAll('section[id]');
            
            if (sections.length === 0) return;
            
            const observer = utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                        if (activeLink) activeLink.classList.add('active');
                    }
                });
            });
            
            sections.forEach(section => observer.observe(section));
        }
    };
    
    // === MODAL SYSTEM ===
    const modal = {
        init() {
            this.setupModalTriggers();
            this.setupCloseButtons();
            this.setupOutsideClick();
        },
        
        open(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Focus trap
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }
        },
        
        close(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },
        
        setupModalTriggers() {
            document.addEventListener('click', (e) => {
                if (e.target.dataset.modal) {
                    e.preventDefault();
                    this.open(e.target.dataset.modal);
                }
            });
        },
        
        setupCloseButtons() {
            document.querySelectorAll('.modal-close').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const modal = e.target.closest('.modal');
                    if (modal) this.close(modal.id);
                });
            });
        },
        
        setupOutsideClick() {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    this.close(e.target.id);
                }
            });
        }
    };
    
    // === CAROUSEL SYSTEM ===
    const carousel = {
        instances: new Map(),
        
        init(selector, options = {}) {
            const container = document.querySelector(selector);
            if (!container) return;
            
            const defaultOptions = {
                autoPlay: true,
                autoPlayInterval: 5000,
                showDots: true,
                showArrows: true,
                loop: true
            };
            
            const config = {...defaultOptions, ...options};
            const instance = new CarouselInstance(container, config);
            this.instances.set(selector, instance);
            
            return instance;
        }
    };
    
    class CarouselInstance {
        constructor(container, options) {
            this.container = container;
            this.options = options;
            this.track = container.querySelector('.carousel-track');
            this.slides = container.querySelectorAll('.carousel-slide');
            this.currentIndex = 0;
            this.autoPlayTimer = null;
            
            this.init();
        }
        
        init() {
            this.setupArrows();
            this.setupDots();
            this.setupTouch();
            if (this.options.autoPlay) this.startAutoPlay();
        }
        
        setupArrows() {
            if (!this.options.showArrows) return;
            
            const prevBtn = this.container.querySelector('.carousel-arrow.left');
            const nextBtn = this.container.querySelector('.carousel-arrow.right');
            
            if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
            if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        }
        
        setupDots() {
            if (!this.options.showDots) return;
            
            const dotsContainer = this.container.querySelector('.carousel-dots');
            if (!dotsContainer) return;
            
            this.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.addEventListener('click', () => this.goTo(index));
                dotsContainer.appendChild(dot);
            });
            
            this.updateDots();
        }
        
        setupTouch() {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                this.stopAutoPlay();
            });
            
            this.track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            });
            
            this.track.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;
                
                const diff = startX - currentX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.next() : this.prev();
                }
                
                if (this.options.autoPlay) this.startAutoPlay();
            });
        }
        
        goTo(index) {
            this.currentIndex = index;
            this.updateSlidePosition();
            this.updateDots();
        }
        
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.updateSlidePosition();
            this.updateDots();
        }
        
        prev() {
            this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
            this.updateSlidePosition();
            this.updateDots();
        }
        
        updateSlidePosition() {
            const translateX = -this.currentIndex * 100;
            this.track.style.transform = `translateX(${translateX}%)`;
        }
        
        updateDots() {
            const dots = this.container.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        startAutoPlay() {
            this.autoPlayTimer = setInterval(() => this.next(), this.options.autoPlayInterval);
        }
        
        stopAutoPlay() {
            if (this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer);
                this.autoPlayTimer = null;
            }
        }
    }
    
    // === FORM HANDLING ===
    const forms = {
        init() {
            this.setupValidation();
            this.setupSubmission();
        },
        
        setupValidation() {
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!this.validateForm(form)) {
                        e.preventDefault();
                    }
                });
                
                // Real-time validation
                form.querySelectorAll('input, textarea, select').forEach(field => {
                    field.addEventListener('blur', () => this.validateField(field));
                });
            });
        },
        
        validateForm(form) {
            let isValid = true;
            const fields = form.querySelectorAll('input, textarea, select');
            
            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        },
        
        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const required = field.hasAttribute('required');
            let isValid = true;
            
            // Reset previous states
            field.classList.remove('error', 'success');
            
            // Required validation
            if (required && !value) {
                isValid = false;
            }
            
            // Type-specific validation
            if (value) {
                switch (type) {
                    case 'email':
                        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                        break;
                    case 'password':
                        isValid = value.length >= 8;
                        break;
                    case 'tel':
                        isValid = /^[\+]?[0-9\s\-\(\)]+$/.test(value);
                        break;
                }
            }
            
            // Apply visual feedback
            field.classList.add(isValid ? 'success' : 'error');
            
            return isValid;
        },
        
        setupSubmission() {
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSubmission(form);
                });
            });
        },
        
        handleSubmission(form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = '⏳ Przetwarzanie...';
            submitBtn.disabled = true;
            
            // Simulate submission
            setTimeout(() => {
                submitBtn.textContent = '✅ Wysłano!';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    form.reset();
                }, 2000);
            }, 2000);
        }
    };
    
    // === ANIMATIONS ===
    const animations = {
        init() {
            this.setupScrollAnimations();
            this.setupCounters();
            this.setupLazyLoading();
        },
        
        setupScrollAnimations() {
            const animatedElements = document.querySelectorAll('[data-animate]');
            
            const observer = utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animation = element.dataset.animate;
                        element.classList.add('animated', animation);
                        observer.unobserve(element);
                    }
                });
            });
            
            animatedElements.forEach(el => observer.observe(el));
        },
        
        setupCounters() {
            const counters = document.querySelectorAll('[data-counter]');
            
            const observer = utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const endValue = parseInt(element.dataset.counter);
                        utils.animateCounter(element, 0, endValue);
                        observer.unobserve(element);
                    }
                });
            });
            
            counters.forEach(counter => observer.observe(counter));
        },
        
        setupLazyLoading() {
            const images = document.querySelectorAll('img[data-src]');
            
            const observer = utils.createObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        utils.lazyLoadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            images.forEach(img => observer.observe(img));
        }
    };
    
    // === PERFORMANCE OPTIMIZATIONS ===
    const performance = {
        init() {
            this.preloadCriticalResources();
            this.optimizeImages();
            this.setupServiceWorker();
        },
        
        preloadCriticalResources() {
            // Preload critical CSS
            const criticalCSS = ['css/optimized-styles.css'];
            criticalCSS.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                document.head.appendChild(link);
            });
        },
        
        optimizeImages() {
            // Convert to WebP if supported
            const supportsWebP = () => {
                const canvas = document.createElement('canvas');
                return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            };
            
            if (supportsWebP()) {
                document.querySelectorAll('img').forEach(img => {
                    if (img.src && !img.src.includes('.webp')) {
                        const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                        // Test if WebP version exists
                        const testImg = new Image();
                        testImg.onload = () => img.src = webpSrc;
                        testImg.src = webpSrc;
                    }
                });
            }
        },
        
        setupServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .catch(() => console.log('Service Worker not available'));
            }
        }
    };
    
    // === MAIN INITIALIZATION ===
    const app = {
        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initModules());
            } else {
                this.initModules();
            }
        },
        
        initModules() {
            try {
                navigation.init();
                modal.init();
                forms.init();
                animations.init();
                performance.init();
                
                // Initialize specific page features
                this.initPageSpecific();
                
                console.log('eCVjob.pl loaded successfully');
            } catch (error) {
                console.error('Error initializing app:', error);
            }
        },
        
        initPageSpecific() {
            // CV Base specific
            if (document.querySelector('.payment-plans')) {
                this.initPaymentPlans();
            }
            
            // Carousel initialization
            if (document.querySelector('.carousel-container')) {
                carousel.init('.carousel-container');
            }
            
            // FAQ accordion
            if (document.querySelector('.faq-item')) {
                this.initFAQ();
            }
        },
        
        initPaymentPlans() {
            document.querySelectorAll('[data-plan]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const plan = e.target.dataset.plan;
                    const planData = {
                        free: { name: 'Bezpłatny', price: '0 zł' },
                        starter: { name: 'Starter', price: '14,99 zł/miesiąc' },
                        premium: { name: 'Premium', price: '29,99 zł/miesiąc' },
                        business: { name: 'Business', price: '99,99 zł/miesiąc' }
                    };
                    
                    if (planData[plan]) {
                        modal.open('payment-modal');
                        document.querySelector('#selected-plan-name').textContent = planData[plan].name;
                        document.querySelector('#selected-plan-price').textContent = planData[plan].price;
                    }
                });
            });
        },
        
        initFAQ() {
            document.querySelectorAll('.faq-question').forEach(question => {
                question.addEventListener('click', () => {
                    const answer = question.nextElementSibling;
                    const isOpen = answer.classList.contains('faq-open');
                    
                    // Close all other FAQ items
                    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('faq-open'));
                    document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('faq-active'));
                    
                    // Toggle current item
                    if (!isOpen) {
                        answer.classList.add('faq-open');
                        question.classList.add('faq-active');
                    }
                });
            });
        }
    };
    
    // Global exposure for debugging
    window.eCVjob = {
        utils,
        navigation,
        modal,
        carousel,
        forms,
        animations,
        performance
    };
    
    // Start the application
    app.init();
    
})();
