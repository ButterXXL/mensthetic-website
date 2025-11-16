/**
 * Mensthetic View Transitions Enhancement
 * Modern page transitions with fallbacks for older browsers
 */

class MenstheticViewTransitions {
  constructor() {
    this.supportsViewTransitions = 'startViewTransition' in document;
    this.init();
  }

  init() {
    // Always use fallback for now to ensure it works
    this.setupFallbackTransitions();
    
    // Mensthetic View Transitions initialized
  }

  // Modern View Transition API implementation
  setupModernTransitions() {
    // Add view-transition-name to key elements
    this.setupViewTransitionNames();
    
    // Intercept navigation for SPA-like transitions
    this.interceptNavigation();
  }

  setupViewTransitionNames() {
    // Hero section elements
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      heroImage.style.viewTransitionName = 'hero-image';
    }

    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
      heroTitle.style.viewTransitionName = 'hero-title';
    }

    // Service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
      card.style.viewTransitionName = `service-card-${index}`;
    });

    // Navigation
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.viewTransitionName = 'navbar';
    }
  }

  interceptNavigation() {
    // Intercept internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      
      // Check if internal link (allow relative paths)
      if (href.startsWith('http') || href.startsWith('//')) {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
      }
      
      e.preventDefault();
      this.navigateWithTransition(href);
    });
  }

  async navigateWithTransition(href) {
    if (!this.supportsViewTransitions) {
      window.location.href = href;
      return;
    }

    try {
      // Start view transition
      const transition = document.startViewTransition(async () => {
        // Fetch new content
        const response = await fetch(href);
        if (!response.ok) throw new Error(`Failed to load ${href}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        
        // Update document
        this.updateDocument(newDoc);
        
        // Update URL
        history.pushState(null, '', href);
        
        // Re-initialize animations for new content
        if (window.MenstheticAnimations) {
          new window.MenstheticAnimations();
        }
      });

      // Handle transition events
      await transition.ready;
      this.customizeTransition(transition);
      
    } catch (error) {
      // View transition failed - fallback to regular navigation
      // Fallback to regular navigation
      window.location.href = href;
    }
  }

  updateDocument(newDoc) {
    // Update title
    document.title = newDoc.title;
    
    // Update meta description
    const metaDesc = newDoc.querySelector('meta[name="description"]');
    const currentMetaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && currentMetaDesc) {
      currentMetaDesc.setAttribute('content', metaDesc.getAttribute('content'));
    }
    
    // Update main content
    const newMain = newDoc.querySelector('main');
    const currentMain = document.querySelector('main');
    if (newMain && currentMain) {
      currentMain.innerHTML = newMain.innerHTML;
    }
    
    // Update navigation active states
    this.updateNavigationState(newDoc);
  }

  updateNavigationState(newDoc) {
    // Remove current active states
    document.querySelectorAll('.nav-link.active').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add new active states based on new document
    const newActiveLinks = newDoc.querySelectorAll('.nav-link.active');
    newActiveLinks.forEach(newActiveLink => {
      const href = newActiveLink.getAttribute('href');
      const currentLink = document.querySelector(`.nav-link[href="${href}"]`);
      if (currentLink) {
        currentLink.classList.add('active');
      }
    });
  }

  customizeTransition(transition) {
    // Add custom CSS for transition
    if (!document.querySelector('#view-transition-styles')) {
      const style = document.createElement('style');
      style.id = 'view-transition-styles';
      style.textContent = `
        /* Root transition */
        ::view-transition-old(root) {
          animation: slide-out-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        ::view-transition-new(root) {
          animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Hero image transition */
        ::view-transition-old(hero-image) {
          animation: scale-down 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        ::view-transition-new(hero-image) {
          animation: scale-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }
        
        /* Service card transitions */
        ::view-transition-old(service-card-0),
        ::view-transition-old(service-card-1),
        ::view-transition-old(service-card-2) {
          animation: fade-out 0.3s ease-out;
        }
        
        ::view-transition-new(service-card-0) {
          animation: fade-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }
        
        ::view-transition-new(service-card-1) {
          animation: fade-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }
        
        ::view-transition-new(service-card-2) {
          animation: fade-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
        }
        
        /* Navbar stays in place */
        ::view-transition-old(navbar),
        ::view-transition-new(navbar) {
          animation: none;
        }
        
        /* Keyframes */
        @keyframes slide-out-left {
          to { transform: translateX(-100%); }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes scale-down {
          to { transform: scale(0.8); opacity: 0; }
        }
        
        @keyframes scale-up {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-out {
          to { opacity: 0; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Fallback transitions for older browsers
  setupFallbackTransitions() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      
      // Check if internal link (allow relative paths)
      if (href.startsWith('http') || href.startsWith('//')) {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
      }
      
      e.preventDefault();
      
      // Determine slide direction based on link type
      const isHomeNavigation = this.isHomeNavigation(link, href);
      // Triggering slide transition
      
      this.fallbackTransition(href, isHomeNavigation);
    });
  }

  isHomeNavigation(link, href) {
    // Check if it's the logo/brand link
    if (link.classList.contains('logo')) return true;
    
    // Check if link text indicates home navigation
    const linkText = link.textContent.trim().toLowerCase();
    if (linkText === 'home' || linkText === 'mensthetic') return true;
    
    // Check if href points to index.html or root
    if (href === 'index.html' || href === '../index.html' || href === '/' || href === './') return true;
    
    // Check if we're navigating from a subpage back to main
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/behandlungen/') || currentPath.includes('/ueber-uns/');
    const isGoingToRoot = href.includes('index.html') || href === '../';
    
    return isInSubfolder && isGoingToRoot;
  }

  fallbackTransition(href, slideFromLeft = false) {
    // Create elegant slide transition
    const overlay = document.createElement('div');
    
    if (slideFromLeft) {
      // Slide from left for home navigation
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(247, 249, 251, 0.95) 0%, rgba(230, 235, 240, 0.95) 100%);
        backdrop-filter: blur(10px);
        z-index: 10000;
        transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      
      document.body.appendChild(overlay);
      
      // Trigger animation
      requestAnimationFrame(() => {
        overlay.style.left = '0';
      });
    } else {
      // Slide from right for forward navigation
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        right: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(247, 249, 251, 0.95) 0%, rgba(230, 235, 240, 0.95) 100%);
        backdrop-filter: blur(10px);
        z-index: 10000;
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      
      document.body.appendChild(overlay);
      
      // Trigger animation
      requestAnimationFrame(() => {
        overlay.style.right = '0';
      });
    }
    
    // Navigate after animation
    setTimeout(() => {
      window.location.href = href;
    }, 400);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MenstheticViewTransitions();
  });
} else {
  new MenstheticViewTransitions();
}