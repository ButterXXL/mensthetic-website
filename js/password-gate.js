/**
 * MENSTHETIC PASSWORD GATE
 * Protects Before/After gallery with password
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================

    const CONFIG = {
        // CHANGE THIS PASSWORD TO YOUR DESIRED PASSWORD
        correctPassword: 'mensthetic2024',

        // Session storage key
        storageKey: 'menst_gallery_unlocked',

        // Session duration in milliseconds (1 hour)
        sessionDuration: 60 * 60 * 1000
    };

    // ========================================
    // DOM ELEMENTS
    // ========================================

    const elements = {
        passwordGate: null,
        passwordForm: null,
        passwordInput: null,
        passwordError: null,
        protectedContent: null
    };

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        // Cache DOM elements
        elements.passwordGate = document.getElementById('password-gate');
        elements.passwordForm = document.getElementById('password-form');
        elements.passwordInput = document.getElementById('password-input');
        elements.passwordError = document.getElementById('password-error');
        elements.protectedContent = document.getElementById('protected-content');

        // Check if elements exist (might not be on every page)
        if (!elements.passwordGate || !elements.passwordForm) {
            return;
        }

        // Check if already unlocked in this session
        if (isUnlocked()) {
            unlockContent(true); // Skip animation
        }

        // Set up event listeners
        elements.passwordForm.addEventListener('submit', handlePasswordSubmit);
        elements.passwordInput.addEventListener('input', clearError);

        // Password gate initialized
    }

    // ========================================
    // PASSWORD VALIDATION
    // ========================================

    function handlePasswordSubmit(event) {
        event.preventDefault();

        const password = elements.passwordInput.value.trim();

        if (validatePassword(password)) {
            // Correct password
            unlockContent();
            saveUnlockState();
            trackEvent('gallery_unlocked', { success: true });
        } else {
            // Wrong password
            showError();
            trackEvent('gallery_unlock_failed', { success: false });
        }
    }

    function validatePassword(password) {
        return password === CONFIG.correctPassword;
    }

    // ========================================
    // UI STATE MANAGEMENT
    // ========================================

    function unlockContent(skipAnimation = false) {
        if (skipAnimation) {
            elements.passwordGate.style.display = 'none';
            elements.protectedContent.style.filter = 'none';
            elements.protectedContent.style.pointerEvents = 'auto';
        } else {
            // Animate unlock
            elements.passwordGate.classList.add('unlocked');
            elements.protectedContent.classList.add('unlocked');

            // Remove gate from DOM after animation
            setTimeout(() => {
                elements.passwordGate.style.display = 'none';
            }, 500);
        }
    }

    function showError() {
        // Show error message
        elements.passwordError.style.display = 'block';

        // Add error class to input
        elements.passwordInput.classList.add('error');

        // Clear input
        elements.passwordInput.value = '';

        // Remove error class after animation
        setTimeout(() => {
            elements.passwordInput.classList.remove('error');
        }, 400);

        // Focus input
        elements.passwordInput.focus();
    }

    function clearError() {
        elements.passwordError.style.display = 'none';
        elements.passwordInput.classList.remove('error');
    }

    // ========================================
    // SESSION MANAGEMENT
    // ========================================

    function saveUnlockState() {
        const unlockData = {
            timestamp: Date.now(),
            expires: Date.now() + CONFIG.sessionDuration
        };

        try {
            sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(unlockData));
        } catch (e) {
            // Could not save session - fail silently
        }
    }

    function isUnlocked() {
        try {
            const data = sessionStorage.getItem(CONFIG.storageKey);

            if (!data) {
                return false;
            }

            const unlockData = JSON.parse(data);
            const now = Date.now();

            // Check if session has expired
            if (now > unlockData.expires) {
                sessionStorage.removeItem(CONFIG.storageKey);
                return false;
            }

            return true;
        } catch (e) {
            // Could not read session - return false
            return false;
        }
    }

    // ========================================
    // ANALYTICS
    // ========================================

    function trackEvent(eventName, properties = {}) {
        // Check if analytics module exists
        if (window.MenstheticAnalytics && typeof window.MenstheticAnalytics.track === 'function') {
            window.MenstheticAnalytics.track(eventName, {
                section: 'before_after_gallery',
                ...properties
            });
        }

        // Analytics event tracked
    }

    // ========================================
    // DEVELOPER CONSOLE HELPER
    // ========================================

    // Make unlock function available in console for testing
    window.unlockGallery = function(password) {
        if (password === CONFIG.correctPassword) {
            unlockContent();
            saveUnlockState();
            return true;
        } else {
            return false;
        }
    };

    // ========================================
    // AUTO-INITIALIZE
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
