// Mensthetic Website JavaScript

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});

// Smooth Scrolling for Navigation Links
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

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Enhanced Navigation Scrolling
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(247, 249, 251, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(11, 14, 17, 0.1)';
    } else {
        navbar.style.background = 'rgba(247, 249, 251, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .before-after-item, .card--menst');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact Form Handler with Analytics
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Wird gesendet...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    message: formData.get('message')
                };
                
                // Submit through analytics system
                if (window.menstheticAnalytics) {
                    await window.menstheticAnalytics.submitContactForm(data);
                }
                
                // Show success message
                showNotification('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
                this.reset();
                
            } catch (error) {
                // Error submitting form - show user notification
                showNotification('Es gab einen Fehler beim Senden. Bitte versuchen Sie es erneut.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" aria-label="Schließen">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--menst-success)' : type === 'error' ? 'var(--menst-danger)' : 'var(--menst-accent)'};
        color: white;
        padding: var(--menst-s-4) var(--menst-s-6);
        border-radius: var(--menst-r-md);
        box-shadow: var(--menst-shadow-2);
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all var(--menst-motion);
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// CTA Button Tracking with Analytics
document.querySelectorAll('.btn--menst-primary').forEach(button => {
    button.addEventListener('click', function() {
        // Store last CTA click for conversion attribution
        localStorage.setItem('lastCtaClick', this.textContent.trim());
        
        // Analytics tracking is handled by analytics.js
    });
});

// Keyboard Navigation Enhancement
document.addEventListener('keydown', function(e) {
    // Skip to main content on Tab from body
    if (e.key === 'Tab' && document.activeElement === document.body) {
        e.preventDefault();
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.focus();
        }
    }
});

// Performance Packs Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    const packTabs = document.querySelectorAll('.pack-tab');
    const packPanels = document.querySelectorAll('.pack-panel');
    
    if (packTabs.length > 0 && packPanels.length > 0) {
        packTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and panels
                packTabs.forEach(t => t.classList.remove('active'));
                packPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                this.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                // Track tab interaction
                if (window.menstheticAnalytics) {
                    window.menstheticAnalytics.trackEvent('pack_tab_clicked', {
                        tab_name: targetTab
                    });
                }
            });
        });
    }
});

// Performance: Lazy load images when they come into view
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Interactive Hero Visual - Treatment Area Tooltips
document.addEventListener('DOMContentLoaded', function() {
    const treatmentAreas = document.querySelectorAll('.treatment-area');
    const treatmentPoints = document.querySelectorAll('.treatment-point');
    
    treatmentAreas.forEach(area => {
        const treatmentType = area.dataset.treatment;
        const tooltip = document.getElementById(`tooltip-${treatmentType}`);
        
        if (!tooltip) return;
        
        area.addEventListener('mouseenter', function(e) {
            // Show corresponding treatment points
            const relatedPoints = document.querySelectorAll(`.treatment-point[data-treatment="${treatmentType}"]`);
            relatedPoints.forEach(point => {
                point.style.opacity = '1';
            });
            
            // Show tooltip
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
            
            // Track interaction
            if (window.gtag) {
                gtag('event', 'treatment_area_hover', {
                    'treatment_type': treatmentType,
                    'event_category': 'engagement'
                });
            }
        });
        
        area.addEventListener('mouseleave', function() {
            // Hide treatment points
            const relatedPoints = document.querySelectorAll(`.treatment-point[data-treatment="${treatmentType}"]`);
            relatedPoints.forEach(point => {
                point.style.opacity = '0';
            });
            
            // Hide tooltip
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // Add click functionality to navigate to treatment page
        area.addEventListener('click', function() {
            const treatmentUrls = {
                'botox': 'behandlungen/botox.html',
                'augen': 'behandlungen/augenlidstraffung.html',
                'hyaluron': 'behandlungen/hyaluron.html',
                'facelift': 'behandlungen/facelift.html'
            };
            
            if (treatmentUrls[treatmentType]) {
                // Track click
                if (window.gtag) {
                    gtag('event', 'treatment_area_click', {
                        'treatment_type': treatmentType,
                        'event_category': 'navigation'
                    });
                }
                
                // Navigate with transition if available
                if (window.MenstheticViewTransitions) {
                    window.location.href = treatmentUrls[treatmentType];
                } else {
                    window.location.href = treatmentUrls[treatmentType];
                }
            }
        });
    });
    
    // Add subtle pulse animation on page load
    setTimeout(() => {
        const faceOutline = document.querySelector('.face-outline');
        if (faceOutline) {
            faceOutline.style.filter = 'drop-shadow(0 0 20px rgba(49, 130, 206, 0.3))';
            setTimeout(() => {
                faceOutline.style.filter = '';
            }, 2000);
        }
    }, 1000);
});

// Before/After Results Carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.results-carousel');
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Track carousel interaction
        if (window.gtag) {
            const treatmentType = slides[index].dataset.treatment;
            gtag('event', 'carousel_view', {
                'treatment_type': treatmentType,
                'slide_index': index,
                'event_category': 'engagement'
            });
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Navigation event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (carousel.matches(':hover')) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                prevSlide();
            }
        }
    });
    
    // Auto-play carousel (pauses on hover)
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 15000); // 5 seconds
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Start autoplay
    startAutoplay();
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Pause on focus (accessibility)
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopAutoplay();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Prevent scrolling if horizontal swipe is detected
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }, { passive: false });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        // Minimum swipe distance
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        startAutoplay();
    }, { passive: true });
    
    // Before/After Image Comparison Feature
    slides.forEach(slide => {
        const beforeAfterImage = slide.querySelector('.before-after-image');
        const sliderHandle = slide.querySelector('.slider-handle');
        
        if (beforeAfterImage && sliderHandle) {
            // Add interactive behavior to slider handle
            sliderHandle.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Toggle between before/after states with animation
                const isShowingAfter = beforeAfterImage.classList.contains('showing-after');
                
                if (isShowingAfter) {
                    beforeAfterImage.classList.remove('showing-after');
                    sliderHandle.style.transform = 'translate(-50%, -50%)';
                } else {
                    beforeAfterImage.classList.add('showing-after');
                    sliderHandle.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    
                    // Reset after animation
                    setTimeout(() => {
                        sliderHandle.style.transform = 'translate(-50%, -50%)';
                    }, 200);
                }
                
                // Track interaction
                if (window.gtag) {
                    const treatmentType = slide.dataset.treatment;
                    gtag('event', 'before_after_toggle', {
                        'treatment_type': treatmentType,
                        'showing_after': !isShowingAfter,
                        'event_category': 'engagement'
                    });
                }
            });
            
            // Add hover effect for better UX
            sliderHandle.addEventListener('mouseenter', () => {
                sliderHandle.style.transform = 'translate(-50%, -50%) scale(1.05)';
            });
            
            sliderHandle.addEventListener('mouseleave', () => {
                sliderHandle.style.transform = 'translate(-50%, -50%)';
            });
        }
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopAutoplay();
    });
});

// Infinite Scrolling Carousel
document.addEventListener('DOMContentLoaded', function() {
    const infiniteCarousel = document.querySelector('.infinite-carousel');
    if (!infiniteCarousel) return;
    
    const carouselTrack = infiniteCarousel.querySelector('.carousel-track');
    
    // Reset animation when page becomes visible again to prevent speed-up
    let animationName = 'infiniteScroll';
    let animationDuration = window.innerWidth <= 768 ? '60s' : '80s';
    
    // Function to reset animation
    function resetCarouselAnimation() {
        carouselTrack.style.animation = 'none';
        carouselTrack.style.webkitAnimation = 'none';
        void carouselTrack.offsetHeight; // Trigger reflow
        animationDuration = window.innerWidth <= 768 ? '60s' : '80s';
        carouselTrack.style.animation = `${animationName} ${animationDuration} linear infinite`;
        carouselTrack.style.webkitAnimation = `${animationName} ${animationDuration} linear infinite`;
    }
    
    // Don't reset on initial load - let CSS handle it
    // resetCarouselAnimation();
    
    // Reset animation when tab becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            resetCarouselAnimation();
        }
    });
    
    // Also reset on window focus
    window.addEventListener('focus', function() {
        resetCarouselAnimation();
    });
    
    // Pause animation on hover for better interaction
    infiniteCarousel.addEventListener('mouseenter', () => {
        carouselTrack.style.animationPlayState = 'paused';
    });
    
    infiniteCarousel.addEventListener('mouseleave', () => {
        carouselTrack.style.animationPlayState = 'running';
    });
    
    // Add click interactions to cards
    const cards = document.querySelectorAll('.before-after-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const treatmentLabel = card.querySelector('.treatment-label').textContent;
            
            // Track interaction
            if (window.gtag) {
                gtag('event', 'treatment_card_click', {
                    'treatment_type': treatmentLabel.toLowerCase(),
                    'event_category': 'engagement'
                });
            }
            
            // Add visual feedback
            card.style.transform = 'translateY(-4px) scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
            
            // Treatment card clicked
        });
    });
    
    // Accessibility: Allow keyboard navigation
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${card.querySelector('.treatment-label').textContent} Behandlung ansehen`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
});

// Language Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    const langDropdown = document.querySelector('.language-dropdown');
    const langCurrent = document.querySelector('.lang-current');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.querySelector('.current-lang');
    
    // Initialize current language based on current path
    const currentPath = window.location.pathname;
    const currentLang = currentPath.startsWith('/en/') ? 'en' : 'de';
    setActiveLanguage(currentLang);
    
    // Handle dropdown click
    langCurrent.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        langDropdown.classList.toggle('active');
        
        // Close other dropdowns if any
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            if (dropdown !== langDropdown) {
                dropdown.classList.remove('active');
            }
        });
    });
    
    // Handle language option clicks
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedLang = this.getAttribute('data-lang');
            
            // Update active state
            setActiveLanguage(selectedLang);
            
            // Store language preference
            localStorage.setItem('currentLanguage', selectedLang);
            
            // Switch language content
            switchLanguage(selectedLang);
            
            // Close dropdown
            langDropdown.classList.remove('active');
            
            // Track language switch
            if (window.menstheticAnalytics) {
                window.menstheticAnalytics.trackEvent('language_switched', {
                    language: selectedLang
                });
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!langDropdown.contains(e.target)) {
            langDropdown.classList.remove('active');
        }
    });
    
    function setActiveLanguage(lang) {
        langOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
                // Update current language display
                currentLangSpan.textContent = lang.toUpperCase();
            }
        });
    }
    
    function switchLanguage(lang) {
        const currentPath = window.location.pathname;
        const currentUrl = window.location.href;
        
        if (lang === 'en') {
            // Switch to English
            if (currentPath.startsWith('/en/')) {
                // Already on English version, do nothing
                return;
            } else {
                // Redirect to English version
                if (currentPath === '/' || currentPath === '/index.html') {
                    window.location.href = '/en/';
                } else {
                    // Map German paths to English paths
                    let englishPath = currentPath
                        .replace('/ueber-uns/', '/about-us/')
                        .replace('/behandlungen/', '/treatments/')
                        .replace('/team.html', '/team.html')
                        .replace('/philosophie.html', '/philosophy.html');
                    
                    // If the path starts with root, add /en prefix
                    if (!englishPath.startsWith('/en/')) {
                        englishPath = '/en' + englishPath;
                    }
                    
                    window.location.href = englishPath;
                }
            }
        } else {
            // Switch to German
            if (!currentPath.startsWith('/en/')) {
                // Already on German version, do nothing
                return;
            } else {
                // Redirect to German version
                let germanPath = currentPath.replace('/en', '');
                if (germanPath === '' || germanPath === '/') {
                    germanPath = '/';
                } else {
                    // Map English paths back to German paths
                    germanPath = germanPath
                        .replace('/about-us/', '/ueber-uns/')
                        .replace('/treatments/', '/behandlungen/')
                        .replace('/philosophy.html', '/philosophie.html');
                }
                
                window.location.href = germanPath;
            }
        }
    }
});