/**
 * Mensthetic Animation Enhancement System
 * Clinical, professional animations with performance optimization
 */

class MenstheticAnimations {
  constructor() {
    this.init();
    this.setupIntersectionObserver();
    this.setupFormValidation();
    this.setupAdvancedInteractions();
    this.initPerformanceMonitoring();
  }

  init() {
    // Respect user's motion preferences
    this.respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Feature detection
    this.supportsViewTransitions = 'startViewTransition' in document;
    this.supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');
    
    // Initialize animations
    this.initProgressiveReveal();
    this.initNavigationEnhancements();
    
    // Mensthetic Animations initialized
  }

  // Progressive content reveal for hero section
  initProgressiveReveal() {
    if (this.respectsReducedMotion) return;

    // Add stagger classes to hero elements
    const heroElements = document.querySelectorAll('.hero-text h1, .hero-text p, .hero-actions, .hero-image');
    heroElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 100}ms`;
    });
  }

  // Enhanced navigation interactions
  initNavigationEnhancements() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const menu = dropdown.querySelector('.dropdown-menu');
      const links = dropdown.querySelectorAll('.dropdown-content a');
      
      let enterTimeout;
      let leaveTimeout;

      // Mouse enter dropdown trigger
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(leaveTimeout);
        
        if (!this.respectsReducedMotion) {
          enterTimeout = setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0) scale(1)';
            menu.style.pointerEvents = 'auto';
            
            // Stagger link animations
            links.forEach((link, index) => {
              link.style.transitionDelay = `${index * 50}ms`;
              link.style.opacity = '1';
              link.style.transform = 'translateX(0)';
            });
          }, 100); // Small delay for better UX
        }
      });

      // Mouse leave dropdown trigger
      dropdown.addEventListener('mouseleave', (e) => {
        // Check if mouse is moving to the dropdown menu
        const rect = menu.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // If mouse is heading towards dropdown, don't close immediately
        const isMovingToDropdown = mouseY > rect.top - 20 && 
                                 mouseX >= rect.left - 20 && 
                                 mouseX <= rect.right + 20;
        
        const delay = isMovingToDropdown ? 300 : 150;
        
        clearTimeout(enterTimeout);
        leaveTimeout = setTimeout(() => {
          menu.style.opacity = '0';
          menu.style.transform = 'translateY(-8px) scale(0.95)';
          menu.style.pointerEvents = 'none';
          
          // Reset link animations
          links.forEach((link) => {
            link.style.transitionDelay = '0ms';
            link.style.opacity = '0';
            link.style.transform = 'translateX(-8px)';
          });
        }, delay);
      });

      // Keep dropdown open when hovering over menu itself
      menu.addEventListener('mouseenter', () => {
        clearTimeout(leaveTimeout);
      });

      // Close when leaving menu
      menu.addEventListener('mouseleave', () => {
        leaveTimeout = setTimeout(() => {
          menu.style.opacity = '0';
          menu.style.transform = 'translateY(-8px) scale(0.95)';
          menu.style.pointerEvents = 'none';
          
          links.forEach((link) => {
            link.style.transitionDelay = '0ms';
            link.style.opacity = '0';
            link.style.transform = 'translateX(-8px)';
          });
        }, 150);
      });
    });
  }

  // Intersection Observer for scroll-triggered animations
  setupIntersectionObserver() {
    if (this.respectsReducedMotion) return;

    // Fallback for browsers without scroll timeline support
    if (!this.supportsScrollTimeline) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '-10% 0px -10% 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);

      // Observe service cards
      const serviceCards = document.querySelectorAll('.service-card');
      serviceCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll', `stagger-${Math.min(index + 1, 4)}`);
        observer.observe(card);
      });

      // Observe before/after items
      const beforeAfterItems = document.querySelectorAll('.before-after-item');
      beforeAfterItems.forEach((item, index) => {
        item.classList.add('animate-on-scroll', `stagger-${Math.min(index + 1, 4)}`);
        observer.observe(item);
      });

      // Observe section headers
      const sectionHeaders = document.querySelectorAll('.section-header');
      sectionHeaders.forEach(header => {
        header.classList.add('animate-on-scroll');
        observer.observe(header);
      });
    } else {
      // Use scroll timeline for modern browsers
      this.initScrollTimeline();
    }
  }

  // Modern scroll timeline animations
  initScrollTimeline() {
    const scrollElements = document.querySelectorAll('.service-card, .before-after-item, .section-header');
    scrollElements.forEach(element => {
      element.classList.add('scroll-fade');
    });
  }

  // Form validation micro-interactions
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        // Enhanced focus states
        input.addEventListener('focus', () => {
          if (!this.respectsReducedMotion) {
            input.style.willChange = 'transform, box-shadow';
          }
        });

        input.addEventListener('blur', () => {
          input.style.willChange = 'auto';
        });

        // Validation feedback
        input.addEventListener('input', () => {
          this.validateField(input);
        });
      });

      // Form submission enhancement
      form.addEventListener('submit', (e) => {
        this.handleFormSubmission(e, form);
      });
    });
  }

  // Field validation with micro-interactions
  validateField(field) {
    const isValid = field.checkValidity();
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    if (!this.respectsReducedMotion) {
      if (isValid && field.value.length > 0) {
        field.classList.add('valid');
        this.showValidationFeedback(field, 'valid');
      } else if (!isValid && field.value.length > 0) {
        field.classList.add('invalid');
        this.showValidationFeedback(field, 'invalid');
        this.shakeField(field);
      }
    }
  }

  // Validation feedback animation
  showValidationFeedback(field, type) {
    const feedback = document.createElement('div');
    feedback.className = `validation-feedback ${type}`;
    feedback.style.cssText = `
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 18px;
    `;
    
    feedback.textContent = type === 'valid' ? '✓' : '⚠';
    feedback.style.color = type === 'valid' ? 'var(--menst-success)' : 'var(--menst-danger)';
    
    // Position relative to field
    const fieldRect = field.getBoundingClientRect();
    const parent = field.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(feedback);
    
    // Animate in
    requestAnimationFrame(() => {
      feedback.style.transform = 'translateY(-50%) scale(1)';
    });
    
    // Remove after delay
    setTimeout(() => {
      feedback.style.transform = 'translateY(-50%) scale(0)';
      setTimeout(() => feedback.remove(), 200);
    }, 2000);
  }

  // Shake animation for invalid fields
  shakeField(field) {
    field.style.animation = 'none';
    field.offsetHeight; // Trigger reflow
    field.style.animation = 'shake 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Add shake keyframes if not exists
    if (!document.querySelector('#shake-keyframes')) {
      const style = document.createElement('style');
      style.id = 'shake-keyframes';
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Enhanced form submission
  handleFormSubmission(e, form) {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    // Loading state
    this.setButtonLoadingState(submitButton, true);
    
    // Simulate form processing
    setTimeout(() => {
      this.setButtonLoadingState(submitButton, false);
      this.showSuccessMessage(form);
    }, 2000);
  }

  // Button loading state animation
  setButtonLoadingState(button, loading) {
    if (loading) {
      button.style.pointerEvents = 'none';
      button.style.position = 'relative';
      button.style.color = 'transparent';
      
      // Add loading spinner
      const spinner = document.createElement('div');
      spinner.className = 'button-spinner';
      spinner.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      `;
      
      button.appendChild(spinner);
      
      // Add spinner animation
      if (!document.querySelector('#spinner-keyframes')) {
        const style = document.createElement('style');
        style.id = 'spinner-keyframes';
        style.textContent = `
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      button.style.pointerEvents = 'auto';
      button.style.color = '';
      const spinner = button.querySelector('.button-spinner');
      if (spinner) spinner.remove();
    }
  }

  // Success message animation
  showSuccessMessage(form) {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'Nachricht erfolgreich gesendet!';
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--menst-success);
      color: white;
      padding: 16px 24px;
      border-radius: var(--menst-r-lg);
      box-shadow: 0 8px 24px rgba(22, 163, 74, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
    `;
    
    document.body.appendChild(message);
    
    // Animate in
    requestAnimationFrame(() => {
      message.style.transform = 'translateX(0)';
    });
    
    // Animate out after delay
    setTimeout(() => {
      message.style.transform = 'translateX(100%)';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  // Advanced hover interactions
  setupAdvancedInteractions() {
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn--menst-primary, .btn--menst-quiet');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        if (!this.respectsReducedMotion) {
          button.style.willChange = 'transform, box-shadow';
        }
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.willChange = 'auto';
      });
    });

    // Service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!this.respectsReducedMotion) {
          card.style.willChange = 'transform, box-shadow';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.willChange = 'auto';
      });
    });
  }

  // Performance monitoring
  initPerformanceMonitoring() {
    if (typeof window.performance === 'undefined') return;
    
    // Monitor frame rate during animations
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
        
        if (fps < 45) {
          // Low FPS detected - degrading animations
          // Optionally disable complex animations
          this.degradeAnimations();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measurePerformance);
    };
    
    measurePerformance();
  }

  // Degrade animations for low-performance devices
  degradeAnimations() {
    document.body.classList.add('reduced-performance');
    
    // Add degraded animation styles
    if (!document.querySelector('#degraded-animations')) {
      const style = document.createElement('style');
      style.id = 'degraded-animations';
      style.textContent = `
        .reduced-performance * {
          animation-duration: 0.4s !important;
          transition-duration: 0.4s !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MenstheticAnimations();
  });
} else {
  new MenstheticAnimations();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MenstheticAnimations;
}