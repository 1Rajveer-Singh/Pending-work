/**
 * 📊 Smart Performance Analytics Dashboard
 * Real-time insights into user behavior and portfolio performance
 * The ultimate analytics solution for revolutionary portfolios
 */

class PerformanceAnalytics {
    constructor() {
        this.isActive = false;
        this.metrics = {
            pageViews: 0,
            timeSpent: 0,
            interactions: 0,
            sectionsVisited: new Set(),
            featuresUsed: new Set(),
            clickHeatmap: [],
            scrollDepth: 0,
            deviceInfo: this.getDeviceInfo(),
            sessionStart: Date.now()
        };
        this.activities = [];
        this.performanceData = [];
        this.journeySteps = ['🏠', '👋', '🎯', '💼', '🏆', '📧'];
        this.currentStep = 0;
        
        this.init();
        this.startTracking();
    }

    init() {
        this.createAnalyticsUI();
        this.bindEvents();
        this.startPerformanceMonitoring();
        this.trackInitialLoad();
        
        // Auto-show after 10 seconds
        setTimeout(() => {
            if (!this.isActive) {
                this.showTip();
            }
        }, 10000);
    }

    createAnalyticsUI() {
        // Create trigger button
        const trigger = document.createElement('button');
        trigger.className = 'analytics-trigger';
        trigger.innerHTML = '<i class="fas fa-chart-line"></i>';
        trigger.title = 'Performance Analytics (Alt+A)';
        document.body.appendChild(trigger);

        // Create analytics panel
        const panel = document.createElement('div');
        panel.className = 'performance-analytics';
        panel.innerHTML = `
            <div class="analytics-header">
                <div class="analytics-title">
                    <i class="fas fa-analytics"></i>
                    Performance Insights
                </div>
                <div>
                    <button class="analytics-toggle" title="Refresh Data">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="analytics-close" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value" id="total-interactions">0</div>
                    <div class="metric-label">Interactions</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="time-spent">0s</div>
                    <div class="metric-label">Time Spent</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="sections-visited">0</div>
                    <div class="metric-label">Sections</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="features-used">0</div>
                    <div class="metric-label">Features</div>
                </div>
            </div>

            <div class="activity-feed">
                <div class="activity-header">
                    <i class="fas fa-stream"></i>
                    Live Activity Feed
                </div>
                <div class="activity-list" id="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon visit"><i class="fas fa-eye"></i></div>
                        <span>Portfolio loaded successfully</span>
                        <span class="activity-time">now</span>
                    </div>
                </div>
            </div>

            <div class="performance-chart">
                <div class="chart-header">
                    <span><i class="fas fa-chart-area"></i> Performance Trend</span>
                    <span id="avg-performance">Score: 100</span>
                </div>
                <canvas class="chart-canvas" id="performance-canvas" width="360" height="100"></canvas>
            </div>

            <div class="journey-map">
                <div class="journey-header">
                    <i class="fas fa-route"></i> User Journey
                </div>
                <div class="journey-steps" id="journey-steps"></div>
            </div>

            <div class="quick-insights">
                <div class="insight-item">
                    Most engaged section: <span class="insight-highlight" id="top-section">Home</span>
                </div>
                <div class="insight-item">
                    Device: <span class="insight-highlight" id="device-info">${this.metrics.deviceInfo}</span>
                </div>
                <div class="insight-item">
                    Engagement score: <span class="insight-highlight" id="engagement-score">Excellent</span>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        
        this.trigger = trigger;
        this.panel = panel;
        this.updateJourneySteps();
    }

    bindEvents() {
        // Trigger button
        this.trigger.addEventListener('click', () => this.toggle());
        
        // Panel controls
        this.panel.querySelector('.analytics-close').addEventListener('click', () => this.hide());
        this.panel.querySelector('.analytics-toggle').addEventListener('click', () => this.refreshData());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Track interactions
        document.addEventListener('click', (e) => this.trackInteraction('click', e));
        document.addEventListener('scroll', () => this.trackScroll());
        
        // Track section visits
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section, .section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id || entry.target.className;
                    this.trackSectionVisit(sectionName);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    startTracking() {
        // Update metrics every second
        setInterval(() => {
            this.updateMetrics();
            this.updatePerformanceChart();
        }, 1000);

        // Track mouse movements for heatmap
        document.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.01) { // Sample 1% of movements
                this.metrics.clickHeatmap.push({
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now()
                });
            }
        });
    }

    trackInteraction(type, event) {
        this.metrics.interactions++;
        
        const target = event.target;
        const elementInfo = this.getElementInfo(target);
        
        this.addActivity('interaction', `${type.toUpperCase()} on ${elementInfo}`);
        
        // Track specific features
        if (target.closest('.voice-commands')) {
            this.metrics.featuresUsed.add('Voice Commands');
        } else if (target.closest('.ai-chat')) {
            this.metrics.featuresUsed.add('AI Chat');
        } else if (target.closest('.code-playground')) {
            this.metrics.featuresUsed.add('Code Playground');
        } else if (target.closest('.search-container')) {
            this.metrics.featuresUsed.add('Advanced Search');
        }
    }

    trackSectionVisit(sectionName) {
        if (!this.metrics.sectionsVisited.has(sectionName)) {
            this.metrics.sectionsVisited.add(sectionName);
            this.addActivity('visit', `Visited ${sectionName} section`);
            this.updateJourneyProgress(sectionName);
        }
    }

    trackScroll() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        this.metrics.scrollDepth = Math.max(this.metrics.scrollDepth, scrollPercent);
    }

    trackFeatureUsage(featureName) {
        this.metrics.featuresUsed.add(featureName);
        this.addActivity('feature', `Used ${featureName}`);
    }

    getElementInfo(element) {
        if (element.tagName === 'BUTTON') return 'Button';
        if (element.tagName === 'A') return 'Link';
        if (element.classList.contains('nav-link')) return 'Navigation';
        if (element.classList.contains('project-card')) return 'Project Card';
        return element.tagName.toLowerCase();
    }

    getDeviceInfo() {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'Mobile';
        return 'Desktop';
    }

    addActivity(type, message) {
        const activity = {
            type,
            message,
            timestamp: Date.now()
        };
        
        this.activities.unshift(activity);
        if (this.activities.length > 50) {
            this.activities.pop();
        }
        
        this.updateActivityFeed();
    }

    updateActivityFeed() {
        const container = document.getElementById('activity-list');
        if (!container) return;

        container.innerHTML = this.activities.slice(0, 10).map(activity => {
            const timeAgo = this.getTimeAgo(activity.timestamp);
            return `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                    </div>
                    <span>${activity.message}</span>
                    <span class="activity-time">${timeAgo}</span>
                </div>
            `;
        }).join('');
    }

    getActivityIcon(type) {
        const icons = {
            visit: 'eye',
            interaction: 'hand-pointer',
            feature: 'star',
            achievement: 'trophy'
        };
        return icons[type] || 'circle';
    }

    getTimeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const seconds = Math.floor(diff / 1000);
        
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    }

    updateMetrics() {
        this.metrics.timeSpent = Math.floor((Date.now() - this.metrics.sessionStart) / 1000);
        
        // Update display
        document.getElementById('total-interactions').textContent = this.metrics.interactions;
        document.getElementById('time-spent').textContent = this.formatTime(this.metrics.timeSpent);
        document.getElementById('sections-visited').textContent = this.metrics.sectionsVisited.size;
        document.getElementById('features-used').textContent = this.metrics.featuresUsed.size;
        
        // Update insights
        this.updateInsights();
    }

    updateInsights() {
        const topSection = Array.from(this.metrics.sectionsVisited)[0] || 'Home';
        const engagementScore = this.calculateEngagementScore();
        
        document.getElementById('top-section').textContent = topSection;
        document.getElementById('engagement-score').textContent = engagementScore;
    }

    calculateEngagementScore() {
        const score = (this.metrics.interactions * 10) + 
                     (this.metrics.sectionsVisited.size * 20) + 
                     (this.metrics.featuresUsed.size * 30) + 
                     (Math.min(this.metrics.timeSpent / 60, 10) * 5);
        
        if (score > 200) return 'Legendary';
        if (score > 150) return 'Excellent';
        if (score > 100) return 'Great';
        if (score > 50) return 'Good';
        return 'Getting Started';
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }

    startPerformanceMonitoring() {
        setInterval(() => {
            const performance = this.calculatePerformanceScore();
            this.performanceData.push(performance);
            if (this.performanceData.length > 60) {
                this.performanceData.shift();
            }
        }, 1000);
    }

    calculatePerformanceScore() {
        const perfData = performance.now();
        const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        // Simulate performance score (0-100)
        let score = 100;
        score -= Math.min(perfData / 1000, 20); // Loading time impact
        score -= Math.min(memoryUsage / 1000000, 10); // Memory impact
        score += Math.min(this.metrics.interactions / 10, 10); // Interaction bonus
        
        return Math.max(20, Math.min(100, Math.round(score)));
    }

    updatePerformanceChart() {
        const canvas = document.getElementById('performance-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.performanceData.slice(-30); // Last 30 data points
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (data.length < 2) return;
        
        // Draw performance line
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * canvas.width;
            const y = canvas.height - (value / 100) * canvas.height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Update average score
        const avgScore = Math.round(data.reduce((sum, val) => sum + val, 0) / data.length);
        document.getElementById('avg-performance').textContent = `Score: ${avgScore}`;
    }

    updateJourneySteps() {
        const container = document.getElementById('journey-steps');
        if (!container) return;

        container.innerHTML = this.journeySteps.map((step, index) => {
            let className = 'journey-step ';
            if (index < this.currentStep) className += 'visited';
            else if (index === this.currentStep) className += 'current';
            else className += 'unvisited';
            
            return `<div class="${className}" title="Step ${index + 1}">${step}</div>`;
        }).join('');
    }

    updateJourneyProgress(sectionName) {
        const sectionMap = {
            'hero': 1,
            'about': 2,
            'skills': 3,
            'projects': 4,
            'achievements': 5,
            'contact': 6
        };
        
        const step = sectionMap[sectionName.toLowerCase()];
        if (step && step > this.currentStep) {
            this.currentStep = step;
            this.updateJourneySteps();
            this.addActivity('achievement', `Reached journey step ${step}`);
        }
    }

    trackInitialLoad() {
        this.addActivity('visit', 'Portfolio loaded successfully');
        this.metrics.pageViews++;
    }

    refreshData() {
        const button = this.panel.querySelector('.analytics-toggle i');
        button.style.animation = 'spin 1s linear infinite';
        
        setTimeout(() => {
            button.style.animation = '';
            this.updateMetrics();
            this.updateActivityFeed();
            this.addActivity('feature', 'Analytics data refreshed');
        }, 1000);
    }

    show() {
        this.isActive = true;
        this.panel.classList.add('active');
        this.trigger.classList.add('active');
        this.addActivity('feature', 'Opened Performance Analytics');
    }

    hide() {
        this.isActive = false;
        this.panel.classList.remove('active');
        this.trigger.classList.remove('active');
    }

    toggle() {
        if (this.isActive) {
            this.hide();
        } else {
            this.show();
        }
    }

    showTip() {
        // Show a subtle notification about analytics
        const tip = document.createElement('div');
        tip.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(100, 255, 218, 0.9);
            color: #1a202c;
            padding: 15px;
            border-radius: 12px;
            font-size: 14px;
            z-index: 10002;
            animation: slideInRight 0.4s ease-out;
            max-width: 280px;
            box-shadow: 0 10px 30px rgba(100, 255, 218, 0.3);
        `;
        tip.innerHTML = `
            <strong>💡 Performance Insights Available!</strong><br>
            Click the analytics button or press <kbd>Alt+A</kbd> to view detailed portfolio insights.
        `;
        
        document.body.appendChild(tip);
        
        setTimeout(() => {
            tip.style.animation = 'fadeOut 0.4s ease-out forwards';
            setTimeout(() => tip.remove(), 400);
        }, 5000);
    }

    // Export analytics data
    exportData() {
        const exportData = {
            metrics: this.metrics,
            activities: this.activities,
            performanceData: this.performanceData,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-analytics-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.addActivity('feature', 'Analytics data exported');
    }

    // Public method to track custom events
    trackEvent(category, action, label) {
        this.addActivity(category, `${action}: ${label}`);
        this.metrics.interactions++;
    }

    // Get current analytics summary
    getSummary() {
        return {
            timeSpent: this.metrics.timeSpent,
            interactions: this.metrics.interactions,
            sectionsVisited: this.metrics.sectionsVisited.size,
            featuresUsed: this.metrics.featuresUsed.size,
            engagementScore: this.calculateEngagementScore(),
            scrollDepth: this.metrics.scrollDepth,
            deviceInfo: this.metrics.deviceInfo
        };
    }
}

// Initialize Performance Analytics
document.addEventListener('DOMContentLoaded', () => {
    window.performanceAnalytics = new PerformanceAnalytics();
    
    console.log('📊 Performance Analytics Dashboard initialized!');
    console.log('💡 Use Alt+A to open analytics panel');
});

// Add CSS animation for fade out
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    kbd {
        background: rgba(0, 0, 0, 0.2);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
    }
`;
document.head.appendChild(style);