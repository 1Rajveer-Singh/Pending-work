/**
 * Advanced Analytics and User Behavior Tracking System
 */

class AdvancedAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.interactions = [];
        this.pageViews = [];
        this.scrollDepth = 0;
        this.timeOnSections = {};
        this.clickHeatmap = [];
        this.userAgent = navigator.userAgent;
        this.screenResolution = `${screen.width}x${screen.height}`;
        this.viewport = `${window.innerWidth}x${window.innerHeight}`;
        
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupEventTracking();
        this.setupScrollTracking();
        this.setupHeatmapTracking();
        this.setupFormTracking();
        this.setupPerformanceTracking();
        this.setupBeforeUnload();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackPageView() {
        const pageView = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            userAgent: this.userAgent,
            screenResolution: this.screenResolution,
            viewport: this.viewport,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        this.pageViews.push(pageView);
        this.logEvent('page_view', pageView);
    }

    setupEventTracking() {
        // Track all clicks
        document.addEventListener('click', (e) => {
            const element = e.target.closest('a, button, [data-track]');
            if (element) {
                this.trackInteraction('click', {
                    element: this.getElementSelector(element),
                    text: element.textContent?.trim().substring(0, 50),
                    href: element.href || null,
                    x: e.clientX,
                    y: e.clientY
                });
            }
        });

        // Track theme changes
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const theme = document.documentElement.getAttribute('data-theme');
                this.trackInteraction('theme_change', { theme: theme === 'dark' ? 'light' : 'dark' });
            });
        }

        // Track navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link, .scroll-dot')) {
                const target = e.target.closest('.nav-link, .scroll-dot');
                this.trackInteraction('navigation', {
                    type: target.classList.contains('nav-link') ? 'navbar' : 'scroll_indicator',
                    destination: target.getAttribute('href') || target.dataset.section
                });
            }
        });
    }

    setupScrollTracking() {
        let maxScrollDepth = 0;
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollTop / documentHeight) * 100;
            
            if (scrollPercentage > maxScrollDepth) {
                maxScrollDepth = scrollPercentage;
                this.scrollDepth = Math.round(scrollPercentage);
                
                // Track scroll milestones
                const milestones = [25, 50, 75, 90, 100];
                milestones.forEach(milestone => {
                    if (this.scrollDepth >= milestone && !this[`scroll_${milestone}`]) {
                        this[`scroll_${milestone}`] = true;
                        this.trackInteraction('scroll_milestone', { percentage: milestone });
                    }
                });
            }
            
            // Track time spent in sections
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackSectionTime();
            }, 1000);
        });
    }

    setupHeatmapTracking() {
        document.addEventListener('click', (e) => {
            this.clickHeatmap.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                element: this.getElementSelector(e.target),
                viewport: `${window.innerWidth}x${window.innerHeight}`
            });
        });

        // Track mouse movement (sampled)
        let mouseMoveCount = 0;
        document.addEventListener('mousemove', (e) => {
            mouseMoveCount++;
            if (mouseMoveCount % 50 === 0) { // Sample every 50th movement
                this.trackInteraction('mouse_activity', {
                    x: e.clientX,
                    y: e.clientY,
                    viewport: this.viewport
                });
            }
        });
    }

    setupFormTracking() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const formName = form.className || form.id || 'unnamed_form';
            
            // Track form start
            form.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    this.trackInteraction('form_start', { form: formName, field: e.target.name });
                }
            }, { once: true });
            
            // Track form submission
            form.addEventListener('submit', () => {
                this.trackInteraction('form_submit', { form: formName });
            });
            
            // Track field interactions
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => {
                    if (field.value) {
                        this.trackInteraction('form_field_complete', {
                            form: formName,
                            field: field.name,
                            valueLength: field.value.length
                        });
                    }
                });
            });
        });
    }

    setupPerformanceTracking() {
        // Track Core Web Vitals
        this.observeWebVitals();
        
        // Track resource loading
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                this.trackInteraction('performance', {
                    loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                    domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                    firstByte: Math.round(perfData.responseStart - perfData.requestStart)
                });
            }
        });
    }

    observeWebVitals() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.trackInteraction('web_vital', {
                            metric: 'FCP',
                            value: Math.round(entry.startTime)
                        });
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    trackSectionTime() {
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                const sectionId = section.id;
                if (!this.timeOnSections[sectionId]) {
                    this.timeOnSections[sectionId] = { startTime: Date.now(), totalTime: 0 };
                }
            }
        });
    }

    trackInteraction(type, data) {
        const interaction = {
            type,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            timeOnPage: Date.now() - this.startTime,
            ...data
        };
        
        this.interactions.push(interaction);
        this.logEvent(type, interaction);
        
        // Keep only last 100 interactions for memory management
        if (this.interactions.length > 100) {
            this.interactions = this.interactions.slice(-100);
        }
    }

    getElementSelector(element) {
        if (!element) return null;
        
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }

    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            this.generateReport();
        });
        
        // Also generate report every 30 seconds
        setInterval(() => {
            this.generateReport();
        }, 30000);
    }

    generateReport() {
        const report = {
            sessionId: this.sessionId,
            startTime: new Date(this.startTime).toISOString(),
            endTime: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            pageViews: this.pageViews,
            interactions: this.interactions,
            scrollDepth: this.scrollDepth,
            timeOnSections: this.timeOnSections,
            clickHeatmap: this.clickHeatmap,
            userAgent: this.userAgent,
            screenResolution: this.screenResolution,
            viewport: this.viewport
        };
        
        // Store in localStorage for demonstration
        this.storeReport(report);
        
        return report;
    }

    storeReport(report) {
        try {
            const existingReports = JSON.parse(localStorage.getItem('portfolio_analytics') || '[]');
            existingReports.push(report);
            
            // Keep only last 5 sessions
            const recentReports = existingReports.slice(-5);
            localStorage.setItem('portfolio_analytics', JSON.stringify(recentReports));
        } catch (error) {
            console.error('Failed to store analytics report:', error);
        }
    }

    logEvent(eventType, eventData) {
        // In a real application, this would send to an analytics service
        if (window.location.search.includes('debug=true')) {
            console.log(`📊 Analytics Event: ${eventType}`, eventData);
        }
    }

    // Public method to get current analytics data
    getAnalyticsData() {
        return {
            sessionId: this.sessionId,
            timeOnPage: Date.now() - this.startTime,
            interactions: this.interactions.length,
            scrollDepth: this.scrollDepth,
            clickHeatmap: this.clickHeatmap.length
        };
    }

    // Export analytics data
    exportData() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-analytics-${this.sessionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioAnalytics = new AdvancedAnalytics();
    
    // Add analytics export function to global scope for debugging
    window.exportAnalytics = () => {
        window.portfolioAnalytics.exportData();
    };
});

// Add analytics dashboard toggle for debug mode
if (window.location.search.includes('debug=true')) {
    const analyticsToggle = document.createElement('button');
    analyticsToggle.innerHTML = '📊';
    analyticsToggle.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        z-index: 10001;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: #28a745;
        color: white;
        cursor: pointer;
        font-size: 1.4rem;
    `;
    analyticsToggle.title = 'Export Analytics Data';
    analyticsToggle.addEventListener('click', () => {
        window.portfolioAnalytics.exportData();
    });
    document.body.appendChild(analyticsToggle);
}