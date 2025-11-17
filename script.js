/**
 * FoodWare Landing Page - JavaScript Interactions
 * Funcionalidades: Mobile menu toggle, smooth scroll, form validation
 */

(function() {
    'use strict';

    // =========================================================================
    // MOBILE MENU TOGGLE
    // =========================================================================
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        // Toggle menu al hacer click en hamburguesa
        navToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.toggle('is-active');
            navToggle.classList.toggle('is-active');
            
            // Actualizar aria-expanded para accesibilidad
            navToggle.setAttribute('aria-expanded', isActive);
            
            // Prevenir scroll del body cuando el menú está abierto (móvil)
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Cerrar menú al hacer click en un link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('is-active');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('is-active');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Cerrar menú al presionar Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
                navMenu.classList.remove('is-active');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // =========================================================================
    // SMOOTH SCROLL ADICIONAL (para navegadores antiguos)
    // =========================================================================
    // Los navegadores modernos ya soportan scroll-behavior: smooth en CSS,
    // pero este código añade soporte adicional
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Solo aplicar si es un ID válido (no solo "#")
            if (targetId !== '#' && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Scroll suave con offset para header sticky
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =========================================================================
    // FORM VALIDATION Y MANEJO
    // =========================================================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                company: document.getElementById('company').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validación básica (HTML5 ya hace validación, esto es adicional)
            if (!formData.name || !formData.email || !formData.message) {
                alert('Por favor completa todos los campos requeridos.');
                return;
            }
            
            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Por favor ingresa un email válido.');
                return;
            }
            
            // Simular envío (aquí deberías integrar con tu backend)
            console.log('Formulario enviado:', formData);
            
            // Mostrar mensaje de éxito
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
            
            // Limpiar formulario
            contactForm.reset();
            
            // En producción, aquí harías:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert('¡Mensaje enviado exitosamente!');
                contactForm.reset();
            })
            .catch(error => {
                alert('Hubo un error al enviar el mensaje. Intenta nuevamente.');
                console.error('Error:', error);
            });
            */
        });
    }

    // =========================================================================
    // HEADER SHADOW EN SCROLL
    // =========================================================================
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Añadir sombra más pronunciada al hacer scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });

    // =========================================================================
    // INTERSECTION OBSERVER - Animaciones al entrar en viewport
    // =========================================================================
    // Añadir animaciones sutiles cuando los elementos entran en pantalla
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos que queremos animar
    const animatedElements = document.querySelectorAll(
        '.feature-card, .product-card, .stat, .about__content'
    );
    
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // =========================================================================
    // LAZY LOADING ADICIONAL PARA IMÁGENES
    // =========================================================================
    // Los navegadores modernos soportan loading="lazy", pero esto añade
    // soporte para navegadores antiguos
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        // Observar imágenes con data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // =========================================================================
    // ANALYTICS / TRACKING (Placeholder)
    // =========================================================================
    // Ejemplo de tracking de eventos importantes
    function trackEvent(category, action, label) {
        console.log('Event tracked:', { category, action, label });
        
        // En producción, integrar con Google Analytics, Mixpanel, etc:
        /*
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        */
    }
    
    // Trackear clicks en CTAs
    const ctaButtons = document.querySelectorAll('.btn--primary');
    ctaButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            trackEvent('CTA', 'click', this.textContent.trim());
        });
    });

    // =========================================================================
    // INICIALIZACIÓN COMPLETA
    // =========================================================================
    console.log('FoodWare Landing Page initialized successfully! 🌿');
    
})();