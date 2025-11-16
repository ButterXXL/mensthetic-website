// Mensthetic Analytics & Iteration System
import { supabase } from './supabase-client.js';

class MenstheticAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.currentPage = window.location.pathname;
        this.abTestVariants = {};
        
        this.initSession();
        this.setupEventListeners();
        this.trackPageView();
        this.startHeartbeat();
    }

    generateSessionId() {
        return 'menst_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async initSession() {
        const sessionData = {
            session_id: this.sessionId,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
            landing_page: window.location.pathname,
            created_at: new Date().toISOString()
        };

        try {
            await supabase.from('user_sessions').insert([sessionData]);
            // Analytics session started
        } catch (error) {
            // Analytics session error - fail silently
        }
    }

    async trackPageView() {
        const pageData = {
            session_id: this.sessionId,
            page_path: window.location.pathname,
            page_title: document.title,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            device_type: this.getDeviceType(),
            created_at: new Date().toISOString()
        };

        try {
            await supabase.from('page_views').insert([pageData]);
        } catch (error) {
            // Page view tracking error - fail silently
        }
    }

    async trackEvent(eventType, element, additionalData = {}) {
        const eventData = {
            session_id: this.sessionId,
            event_type: eventType,
            element_id: element?.id || null,
            element_class: element?.className || null,
            element_text: element?.textContent?.trim().substring(0, 100) || null,
            section_name: this.getSectionName(element),
            event_data: additionalData,
            created_at: new Date().toISOString()
        };

        try {
            await supabase.from('user_events').insert([eventData]);
        } catch (error) {
            // Event tracking error - fail silently
        }
    }

    async trackConversion(conversionType, value = null, funnelStep = 1) {
        const conversionData = {
            session_id: this.sessionId,
            conversion_type: conversionType,
            conversion_value: value,
            ab_test_variant: JSON.stringify(this.abTestVariants),
            funnel_step: funnelStep,
            created_at: new Date().toISOString()
        };

        try {
            await supabase.from('conversions').insert([conversionData]);
            // Conversion tracked
        } catch (error) {
            // Conversion tracking error - fail silently
        }
    }

    async submitContactForm(formData) {
        const submissionData = {
            session_id: this.sessionId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message,
            form_variant: this.abTestVariants.contact_form || 'default',
            conversion_source: this.getConversionSource(),
            created_at: new Date().toISOString()
        };

        try {
            const { data, error } = await supabase
                .from('contact_submissions')
                .insert([submissionData])
                .select();

            if (error) throw error;

            // Track as conversion
            await this.trackConversion('contact_form', null, 3);
            
            return data[0];
        } catch (error) {
            // Contact form submission error - propagate to caller
            throw error;
        }
    }

    async collectFeedback(feedbackData) {
        const feedback = {
            session_id: this.sessionId,
            feedback_type: feedbackData.type,
            section_name: feedbackData.section,
            rating: feedbackData.rating || null,
            feedback_text: feedbackData.text,
            user_email: feedbackData.email || null,
            is_anonymous: !feedbackData.email,
            created_at: new Date().toISOString()
        };

        try {
            await supabase.from('user_feedback').insert([feedback]);
            // Feedback collected
        } catch (error) {
            // Feedback collection error - fail silently
        }
    }

    // A/B Testing System
    async assignABTestVariant(testName, variants) {
        try {
            // Check if already assigned
            const { data: existing } = await supabase
                .from('ab_test_assignments')
                .select('variant_name')
                .eq('session_id', this.sessionId)
                .eq('test_name', testName)
                .single();

            if (existing) {
                this.abTestVariants[testName] = existing.variant_name;
                return existing.variant_name;
            }

            // Assign new variant
            const variantNames = Object.keys(variants);
            const randomVariant = variantNames[Math.floor(Math.random() * variantNames.length)];

            await supabase.from('ab_test_assignments').insert([{
                session_id: this.sessionId,
                test_name: testName,
                variant_name: randomVariant,
                assigned_at: new Date().toISOString()
            }]);

            this.abTestVariants[testName] = randomVariant;
            return randomVariant;

        } catch (error) {
            // A/B test assignment error - fallback to first variant
            return Object.keys(variants)[0]; // fallback to first variant
        }
    }

    async trackPerformanceMetrics() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const metrics = {
                ttfb: navigation.responseStart - navigation.requestStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart
            };

            // Track Core Web Vitals if available
            if ('web-vitals' in window) {
                // Implementation would use web-vitals library
            }

            for (const [metricName, value] of Object.entries(metrics)) {
                if (value > 0) {
                    try {
                        await supabase.from('performance_metrics').insert([{
                            session_id: this.sessionId,
                            metric_name: metricName,
                            metric_value: value,
                            page_path: window.location.pathname,
                            device_type: this.getDeviceType(),
                            created_at: new Date().toISOString()
                        }]);
                    } catch (error) {
                        // Performance metric tracking error
                    }
                }
            }
        }
    }

    setupEventListeners() {
        // Track CTA clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn--menst-primary, .btn--menst-quiet')) {
                this.trackEvent('cta_click', e.target, {
                    button_type: e.target.className.includes('primary') ? 'primary' : 'secondary',
                    button_text: e.target.textContent.trim()
                });

                // Track micro-conversion
                this.trackConversion('cta_click', null, 2);
            }

            // Track any click for heatmap
            this.trackHeatmapEvent('click', e);
        });

        // Track form interactions
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackEvent('form_focus', e.target, {
                    field_type: e.target.type,
                    field_name: e.target.name
                });
            }
        }, true);

        // Track scroll depth
        let maxScroll = 0;
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    if (scrollPercent % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                        this.trackEvent('scroll_depth', null, { depth: scrollPercent });
                    }
                }
            }, 100);
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.updateSessionDuration();
            }
        });

        // Track before unload
        window.addEventListener('beforeunload', () => {
            this.updateSessionDuration();
        });
    }

    async trackHeatmapEvent(eventType, event) {
        const heatmapData = {
            session_id: this.sessionId,
            page_path: window.location.pathname,
            x_coordinate: Math.round(event.clientX),
            y_coordinate: Math.round(event.clientY),
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            event_type: eventType,
            element_selector: this.getElementSelector(event.target),
            created_at: new Date().toISOString()
        };

        try {
            await supabase.from('heatmap_data').insert([heatmapData]);
        } catch (error) {
            // Heatmap tracking error - fail silently
        }
    }

    async updateSessionDuration() {
        const duration = Math.round((Date.now() - this.startTime) / 1000);
        try {
            await supabase
                .from('user_sessions')
                .update({ 
                    duration_seconds: duration,
                    last_activity: new Date().toISOString()
                })
                .eq('session_id', this.sessionId);
        } catch (error) {
            // Session duration update error - fail silently
        }
    }

    startHeartbeat() {
        // Update session every 30 seconds
        setInterval(() => {
            this.updateSessionDuration();
        }, 30000);
    }

    // Utility functions
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }

    getSectionName(element) {
        const section = element?.closest('section');
        if (section?.id) {
            return section.id.replace('sec.menst-', '');
        }
        return null;
    }

    getConversionSource() {
        // Track which CTA was clicked before form submission
        const lastCtaClick = localStorage.getItem('lastCtaClick');
        return lastCtaClick || 'direct';
    }

    getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }

    // Public API for manual tracking
    static getInstance() {
        if (!window.menstheticAnalytics) {
            window.menstheticAnalytics = new MenstheticAnalytics();
        }
        return window.menstheticAnalytics;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        MenstheticAnalytics.getInstance();
    });
} else {
    MenstheticAnalytics.getInstance();
}

export default MenstheticAnalytics;